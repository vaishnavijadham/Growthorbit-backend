'use strict';

const fetch = global.fetch;

const COURSES = require('../../data/courses');
const Roadmap = require('../models/Roadmap.model');

const { ROADMAP_STATUS } = require('../constants');
const AppError = require('../utils/AppError');


// ================= NORMALIZE =================
function normalize(str = "") {
  return String(str)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}


// ================= FIXED CATEGORY MAPPING =================
const ROADMAP_MAP = {
  html: ["html"],
  css: ["css"],
  javascript: ["javascript"],
  react: ["react"],
  node: ["node"],
  express: ["express"],
  mongodb: ["mongodb"],
  mysql: ["mysql"],
  git: ["git"],
  dsa: ["data structures", "dsa"]
};


// ================= STRICT RESOURCE PICKER =================
function pickResourcesForPhase(phaseTitle = "") {
  const text = normalize(phaseTitle);

  for (const key in ROADMAP_MAP) {
    const keywords = ROADMAP_MAP[key];
    if (keywords.some(k => text.includes(normalize(k)))) {
      const entry = COURSES[key];
      if (entry?.resources?.length) {
        return entry.resources;
      }
    }
  }

  return COURSES.html?.resources || [];
}


// ================= ATTACH CLEAN RESOURCES =================
function attachResources(phases = []) {
  return phases.map(phase => ({
    ...phase,
    resources: pickResourcesForPhase(phase.title)
  }));
}


// ================= CLEAN FALLBACK ROADMAP =================
function fallbackRoadmap(goal = "Career", course = "", subcourse = "") {
  const phases = [
    {
      phaseNumber: 1,
      title: "Learn HTML & CSS Basics",
      description: "Start with structure (HTML) and styling (CSS). Build static websites.",
      durationWeeks: 3,
      skills: ["HTML", "CSS"],
      milestones: ["Build 3 static pages"]
    },
    {
      phaseNumber: 2,
      title: "Master JavaScript Fundamentals",
      description: "Learn variables, functions, DOM, ES6+, and logic building.",
      durationWeeks: 6,
      skills: ["JavaScript", "DOM"],
      milestones: ["Mini JS projects"]
    },
    {
      phaseNumber: 3,
      title: "Responsive Design & UI Frameworks",
      description: "Flexbox, Grid, Bootstrap, Tailwind for responsive design.",
      durationWeeks: 3,
      skills: ["CSS Frameworks"],
      milestones: ["Responsive website"]
    },
    {
      phaseNumber: 4,
      title: "React.js Development",
      description: "Learn components, hooks, props, and state management.",
      durationWeeks: 5,
      skills: ["React"],
      milestones: ["Build React app"]
    },
    {
      phaseNumber: 5,
      title: "Backend with Node & Express",
      description: "Create APIs and backend logic using Node.js and Express.",
      durationWeeks: 4,
      skills: ["Node", "Express"],
      milestones: ["REST API project"]
    },
    {
      phaseNumber: 6,
      title: "Databases (MongoDB / MySQL)",
      description: "Learn database design, queries, and CRUD operations.",
      durationWeeks: 3,
      skills: ["MongoDB", "SQL"],
      milestones: ["Database connected app"]
    },
    {
      phaseNumber: 7,
      title: "Git, GitHub & Deployment",
      description: "Version control + hosting projects online.",
      durationWeeks: 2,
      skills: ["Git", "GitHub"],
      milestones: ["Deployed project"]
    },
    {
      phaseNumber: 8,
      title: "Projects & Portfolio",
      description: "Build real-world full-stack projects.",
      durationWeeks: 4,
      skills: ["Full Stack"],
      milestones: ["Portfolio ready"]
    },
    {
      phaseNumber: 9,
      title: "DSA & Job Preparation",
      description: "Practice DSA, interviews, and apply for jobs.",
      durationWeeks: 6,
      skills: ["DSA"],
      milestones: ["Interview ready"]
    }
  ];

  return {
    phases: attachResources(phases),
    generatedAt: new Date(),
    status: "generated",
    isFallback: true
  };
}


// ================= AI GENERATION =================
async function generateAIRoadmap(course, subcourse, goal) {
  try {
    if (!process.env.OPENROUTER_API_KEY) {
      return fallbackRoadmap(goal, course, subcourse);
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "anthropic/claude-sonnet-4",
        messages: [
          {
            role: "system",
            content: "Return ONLY JSON array of phases in correct learning order."
          },
          {
            role: "user",
            content: `Create roadmap for:\nCourse: ${course}\nSubcourse: ${subcourse}\nGoal: ${goal}\n\nORDER MUST BE:\nHTML → CSS → JS → React → Node → DB → Git → Projects → DSA`
          }
        ]
      })
    });

    const data = await response.json();
    let raw = data?.choices?.[0]?.message?.content;

    if (!raw) return fallbackRoadmap(goal, course, subcourse);

    raw = raw.replace(/```json|```/g, "").trim();

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed) && !Array.isArray(parsed.phases)) {
      return fallbackRoadmap(goal, course, subcourse);
    }

    const phases = parsed.phases || parsed;

    return {
      phases: attachResources(phases),
      generatedAt: new Date(),
      status: "generated"
    };

  } catch (err) {
    return fallbackRoadmap(goal, course, subcourse);
  }
}


// ================= CREATE =================
const createRoadmapService = async (userId, body) => {
  const { course, subcourse, goal, role, field, title } = body;

  if (!course || !subcourse || !goal) {
    throw new AppError("Missing required fields", 422);
  }

  // Deactivate any existing active roadmap first
  await Roadmap.updateMany(
    { user: userId, status: ROADMAP_STATUS.ACTIVE },
    { status: ROADMAP_STATUS.ARCHIVED }
  );

  const aiGeneratedContent = await generateAIRoadmap(course, subcourse, goal || role);

  return await Roadmap.create({
    user: userId,
    field: field || subcourse,
    course,
    subcourse,
    goal,
    role,
    title: title || `${goal} Roadmap`,
    aiGeneratedContent,
    status: ROADMAP_STATUS.ACTIVE, // ✅ FIX: Set ACTIVE so dashboard can find it
    startedAt: new Date()
  });
};


// ================= GET ALL =================
const getRoadmapsService = async (userId, query = {}) => {
  const page = Math.max(parseInt(query.page) || 1, 1);
  const limit = Math.min(parseInt(query.limit) || 10, 50);
  const skip = (page - 1) * limit;

  const filter = { user: userId };
  if (query.status) filter.status = query.status;

  const [roadmaps, total] = await Promise.all([
    Roadmap.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Roadmap.countDocuments(filter)
  ]);

  return {
    roadmaps,
    pagination: { total, page, limit, pages: Math.ceil(total / limit) }
  };
};


// ================= GET ONE =================
const getRoadmapService = async (userId, roadmapId) => {
  const roadmap = await Roadmap.findOne({ _id: roadmapId, user: userId });
  if (!roadmap) throw new AppError('Roadmap not found.', 404);
  return roadmap;
};


// ================= UPDATE =================
const updateRoadmapService = async (userId, roadmapId, body) => {
  const roadmap = await Roadmap.findOne({ _id: roadmapId, user: userId });
  if (!roadmap) throw new AppError('Roadmap not found.', 404);

  const allowed = ['title', 'goal', 'status', 'field', 'course', 'subcourse'];
  allowed.forEach(key => {
    if (body[key] !== undefined) roadmap[key] = body[key];
  });

  // If activating this roadmap, archive others
  if (body.status === ROADMAP_STATUS.ACTIVE) {
    await Roadmap.updateMany(
      { user: userId, status: ROADMAP_STATUS.ACTIVE, _id: { $ne: roadmapId } },
      { status: ROADMAP_STATUS.ARCHIVED }
    );
  }

  await roadmap.save();
  return roadmap;
};


// ================= COMPLETE PHASE =================
const completePhaseService = async (userId, roadmapId, phaseNumber) => {
  const roadmap = await Roadmap.findOne({ _id: roadmapId, user: userId });
  if (!roadmap) throw new AppError('Roadmap not found.', 404);

  const phase = roadmap.aiGeneratedContent?.phases?.find(
    p => p.phaseNumber === phaseNumber
  );

  if (!phase) throw new AppError('Phase not found.', 404);

  phase.isCompleted = true;
  phase.completedAt = new Date();

  // Recalculate overall progress
  const phases = roadmap.aiGeneratedContent.phases;
  const completedCount = phases.filter(p => p.isCompleted).length;
  roadmap.overallProgress = Math.round((completedCount / phases.length) * 100);

  if (roadmap.overallProgress === 100) {
    roadmap.status = ROADMAP_STATUS.COMPLETED;
    roadmap.completedAt = new Date();
  }

  await roadmap.save();
  return roadmap;
};


// ================= DELETE =================
const deleteRoadmapService = async (userId, roadmapId) => {
  const roadmap = await Roadmap.findOneAndDelete({ _id: roadmapId, user: userId });
  if (!roadmap) throw new AppError('Roadmap not found.', 404);
  return roadmap;
};


// ================= EXPORT =================
module.exports = {
  createRoadmapService,
  getRoadmapsService,
  getRoadmapService,
  updateRoadmapService,
  completePhaseService,
  deleteRoadmapService
};
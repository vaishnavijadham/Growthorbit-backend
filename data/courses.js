'use strict';

const COURSES = {

  // ================= FRONTEND =================
  html: {
    keywords: ["html", "markup", "web basics", "structure"],
    resources: [
      { title: "IBM SkillsBuild HTML", url: "https://skillsbuild.org/adult-learners/explore-learning/web-developer" },
      { title: "Microsoft Learn HTML", url: "https://learn.microsoft.com/en-us/training/paths/web-development-101/" },
      { title: "freeCodeCamp HTML", url: "https://www.freecodecamp.org/learn/responsive-web-design-v9/" },
      { title: "Cisco NetAcad Web Design", url: "https://www.netacad.com/courses/web-design" }
    ]
  },

  css: {
    keywords: ["css", "style", "design", "layout"],
    resources: [
      { title: "IBM SkillsBuild CSS", url: "https://skillsbuild.org/adult-learners/explore-learning/web-developer" },
      { title: "Microsoft Learn CSS", url: "https://learn.microsoft.com/en-us/training/paths/web-development-101/" },
      { title: "freeCodeCamp CSS", url: "https://www.freecodecamp.org/learn/responsive-web-design-v9/" },
      { title: "W3C / edX CSS", url: "https://www.edx.org/learn/css/world-wide-web-consortium-w3c-css-basics" }
    ]
  },

  javascript: {
    keywords: ["javascript", "js", "logic", "frontend", "programming"],
    resources: [
      { title: "IBM SkillsBuild JS", url: "https://skillsbuild.org/adult-learners/explore-learning/web-developer" },
      { title: "Microsoft Learn JS", url: "https://learn.microsoft.com/en-us/training/paths/web-development-101/" },
      { title: "freeCodeCamp JS", url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8/" },
      { title: "Cisco JS Essentials", url: "https://www.netacad.com/courses/javascript-essentials-1" }
    ]
  },

  responsive: {
    keywords: ["responsive", "mobile", "flexbox", "grid"],
    resources: [
      { title: "freeCodeCamp Responsive Design", url: "https://www.freecodecamp.org/learn/responsive-web-design-v9/" },
      { title: "Microsoft Learn", url: "https://learn.microsoft.com/en-us/training/paths/web-development-101/" },
      { title: "W3C HTML/CSS Guide", url: "https://www.edx.org/learn/html5/world-wide-web-consortium-w3c-html5-coding-essentials-and-best-practices" }
    ]
  },

  bootstrap: {
    keywords: ["bootstrap", "css framework"],
    resources: [
      { title: "freeCodeCamp Bootstrap", url: "https://www.freecodecamp.org/learn/front-end-development-libraries/" },
      { title: "Scrimba Bootstrap", url: "https://scrimba.com/learn/bootstrap4" }
    ]
  },

  tailwind: {
    keywords: ["tailwind", "utility css"],
    resources: [
      { title: "freeCodeCamp Tailwind", url: "https://www.freecodecamp.org/news/learn-tailwind-css/" },
      { title: "Scrimba Tailwind", url: "https://scrimba.com/learn/tailwind" }
    ]
  },

  react: {
    keywords: ["react", "spa", "frontend framework"],
    resources: [
      { title: "React Official Docs", url: "https://react.dev/learn" },
      { title: "Microsoft React Learn", url: "https://learn.microsoft.com/en-us/training/paths/react/" },
      { title: "freeCodeCamp React", url: "https://www.freecodecamp.org/learn/front-end-development-libraries/" },
      { title: "Scrimba React", url: "https://scrimba.com/learn/learnreact" }
    ]
  },

  api: {
    keywords: ["api", "integration", "fetch", "rest"],
    resources: [
      { title: "Postman Academy", url: "https://academy.postman.com/page/postman-api-fundamentals-student-expert-certification-1" },
      { title: "Microsoft APIs", url: "https://learn.microsoft.com/en-us/training/modules/use-apis-discover-museum-art/" },
      { title: "freeCodeCamp APIs", url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8/" }
    ]
  },

  // ================= BACKEND =================
  node: {
    keywords: ["node", "backend", "server"],
    resources: [
      { title: "IBM Node Badge", url: "https://www.ibm.com/training/badge/node-and-express-essentials" },
      { title: "Microsoft Node.js", url: "https://learn.microsoft.com/en-us/training/paths/build-javascript-applications-nodejs/" },
      { title: "freeCodeCamp Backend", url: "https://www.freecodecamp.org/learn/back-end-development-and-apis/" },
      { title: "Cisco JS Essentials", url: "https://www.netacad.com/courses/javascript-essentials-1" }
    ]
  },

  express: {
    keywords: ["express", "api backend"],
    resources: [
      { title: "Express Docs", url: "https://expressjs.com/" },
      { title: "IBM Express Badge", url: "https://www.credly.com/org/ibm/badge/node-and-express-essentials" }
    ]
  },

  rest: {
    keywords: ["rest", "api", "http"],
    resources: [
      { title: "Postman API Basics", url: "https://academy.postman.com/page/postman-api-fundamentals-student-expert-certification-1" },
      { title: "Microsoft REST APIs", url: "https://learn.microsoft.com/en-us/training/modules/use-apis-discover-museum-art/" }
    ]
  },

  auth: {
    keywords: ["auth", "authentication", "jwt", "security"],
    resources: [
      { title: "Microsoft Auth Learn", url: "https://learn.microsoft.com/en-us/training/paths/implement-authentication-authorization-using-azure-ad/" },
      { title: "freeCodeCamp Backend", url: "https://www.freecodecamp.org/learn/back-end-development-and-apis/" }
    ]
  },

  // ================= DATABASE =================
  mongodb: {
    keywords: ["mongodb", "mongo", "database"],
    resources: [
      { title: "MongoDB University", url: "https://learn.mongodb.com/" },
      { title: "Microsoft MongoDB", url: "https://learn.microsoft.com/en-us/training/modules/introduction-to-mongodb/" }
    ]
  },

  mysql: {
    keywords: ["mysql", "sql", "database"],
    resources: [
      { title: "Oracle MySQL", url: "https://learn.oracle.com/ols/learning-path/mysql-explorer/132718/79674" },
      { title: "freeCodeCamp SQL", url: "https://www.freecodecamp.org/learn/relational-database/" }
    ]
  },

  // ================= TOOLS =================
  git: {
    keywords: ["git", "github", "version control"],
    resources: [
      { title: "GitHub Skills", url: "https://skills.github.com/" },
      { title: "Microsoft Git", url: "https://learn.microsoft.com/en-us/training/paths/intro-to-vc-git/" }
    ]
  },

  devtools: {
    keywords: ["debug", "browser", "devtools"],
    resources: [
      { title: "Google DevTools", url: "https://web.dev/learn/" },
      { title: "freeCodeCamp DevTools", url: "https://www.freecodecamp.org/news/learn-how-to-use-browser-developer-tools/" }
    ]
  },

  // ================= DEVOPS =================
  vercel: {
    keywords: ["vercel", "deploy"],
    resources: [
      { title: "Vercel Docs", url: "https://vercel.com/docs" }
    ]
  },

  render: {
    keywords: ["render", "hosting"],
    resources: [
      { title: "Render Docs", url: "https://render.com/docs" }
    ]
  },

  docker: {
    keywords: ["docker", "containers"],
    resources: [
      { title: "Docker Guide", url: "https://learn.microsoft.com/en-us/training/paths/intro-to-docker-containers/" }
    ]
  },

  // ================= EXTRA =================
  dsa: {
    keywords: ["dsa", "data structures", "algorithms"],
    resources: [
      { title: "freeCodeCamp DSA", url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8/" },
      { title: "Microsoft DSA", url: "https://learn.microsoft.com/en-us/training/paths/data-structures-algorithms/" }
    ]
  },

  uiux: {
    keywords: ["ui", "ux", "design"],
    resources: [
      { title: "Google UX Design", url: "https://www.coursera.org/professional-certificates/google-ux-design" },
      { title: "Adobe UX Tutorials", url: "https://helpx.adobe.com/xd/tutorials.html" }
    ]
  }
};

module.exports = COURSES;
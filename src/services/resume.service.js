
'use strict';

const Resume = require('../models/Resume.model');
const Profile = require('../models/Profile.model');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');
const aiService = require('./ai.service');


// ================= HELPERS =================

const sanitizeSummary = (text = '') => {
return String(text)
.replace(/\*\*/g, '')
.replace(/^#+\s*/gm, '')
.replace(/Professional Summary[:\-]?\s*/i, '')
.trim();
};


const buildATSHtml = (resume) => {

const summary =
sanitizeSummary(
resume?.aiGeneratedContent?.summary
) ||
'Computer Science student with practical skills.';

return `
<div style="font-family:Arial;padding:40px;line-height:1.7">

<h1 style="text-align:center">
${resume.personalInfo?.fullName || ''}
</h1>

<div style="text-align:center">
${resume.personalInfo?.email || ''}
|
${resume.personalInfo?.phone || ''}
</div>

<hr>

<h2>Professional Summary</h2>

<p>${summary}</p>

<h2>Education</h2>

<p>
${resume.education?.current?.courseName || ''}
</p>

<p>
${resume.education?.current?.branchName || ''}
</p>

<h2>Skills</h2>

<ul>

${(resume.skills || [])
.map(
s => `
<li>
${s.skillName}
${s.proficiency ? ` — ${s.proficiency}` : ''}
</li>
`
)
.join('')}

</ul>

<h2>Achievements</h2>

<ul>

${(resume.achievements || [])
.map(
a => `<li>${a.title || ''}</li>`
)
.join('')}

</ul>

<h2>Certifications</h2>

<ul>

${(resume.certifications || [])
.map(
c => `<li>${c.name || c.title || ''}</li>`
)
.join('')}

</ul>

</div>
`;

};


// ================= CREATE =================

const createResume =
async (
userId,
resumeData
)=>{

await Resume.updateMany(
{
user:userId,
isActive:true
},
{
isActive:false
}
);

delete resumeData.projects;

const resume =
await Resume.create({

user:userId,

personalInfo:
resumeData.personalInfo || {},

education:
resumeData.education || {},

skills:
resumeData.skills || [],

achievements:
resumeData.achievements || [],

certifications:
resumeData.certifications || [],

hobbies:
resumeData.hobbies || [],

declaration:
resumeData.declaration || {},

resumeVersions:[
{
type:'original',
generatedAt:new Date()
}
],

isActive:true,

aiGeneratedContent:{
summary:'Resume created',
generatedAt:new Date(),
status:'generated'
}

});

await Profile.findOneAndUpdate(
{
user:userId
},
{
resume:resume._id
}
);

return resume;

};


// ================= GET =================

const getResume =
async (userId)=>{

const resume =
await Resume.findOne({

user:userId,

isActive:true

});

if(!resume){

throw new AppError(
'Resume not found',
404
);

}

return resume;

};


// ================= ATS =================

const generateATSResume =
async (
userId
)=>{

const resume =
await getResume(
userId
);

try{

const summary =
await aiService
.generateResumeAI(
resume
);

if(summary){

resume.aiGeneratedContent={

summary:
sanitizeSummary(
summary
),

generatedAt:
new Date(),

status:
'generated'

};

}

}catch(err){

logger.error(
'ATS AI failed',
err.message
);

}

resume.resumeVersions=
(
resume.resumeVersions
||
[]
)
.filter(
v=>
v.type!=='ats'
);

resume.resumeVersions.push({

type:'ats',

html:
buildATSHtml(
resume
),

generatedAt:
new Date(),

skillsSnapshot:
(resume.skills||[])

});

await resume.save();

return resume;

};


// ================= UPDATE =================

const updateResume =
async (
userId,
data={}
)=>{

delete data.projects;

const resume =
await getResume(
userId
);


// SAFE ASSIGN

Object.keys(data)
.forEach(
k=>{

if(
k!=='taskResult'
){

resume[k]=data[k];

}

}
);


// AUTO TASK SKILLS

const taskResult =
data.taskResult;

if(

taskResult

&&

taskResult.score>=85

&&

Array.isArray(
taskResult.skills
)

){

resume.skills=
resume.skills||[];


taskResult.skills
.forEach(

(skill)=>{

const exists =

resume.skills.some(

s=>

String(
s.skillName
)
.toLowerCase()

===

String(
skill
)
.toLowerCase()

);

if(
!exists
){

resume.skills.push({

skillName:
String(skill),

category:
'Auto Added',

proficiency:
'Beginner',

autoAdded:
true,

addedAt:
new Date()

});

}

}

);

}


// REBUILD ATS

resume.resumeVersions=
(
resume.resumeVersions
||
[]
)
.filter(
v=>
v.type!=='ats'
);

resume.resumeVersions.push({

type:'ats',

html:
buildATSHtml(
resume
),

generatedAt:
new Date(),

skillsSnapshot:
(resume.skills||[])

});


resume.lastUpdated=
new Date();

await resume.save();

return resume;

};


// ================= GET ATS =================

const getATSResume =
async (
userId
)=>{

const resume =
await getResume(
userId
);

return (
resume
.resumeVersions
||
[]
)
.find(
v=>
v.type==='ats'
)
||
null;

};


// ================= HISTORY =================

const getResumeHistory =
async (
userId
)=>

Resume.find({
user:userId
});


// ================= DELETE =================

const deleteResume =
async (
id,
userId
)=>

Resume.deleteOne({

_id:id,

user:userId

});


module.exports={

createResume,

getResume,

generateATSResume,

getATSResume,

updateResume,

getResumeHistory,

deleteResume,

buildATSHtml,

sanitizeSummary

};


'use strict';

const fetch = global.fetch;

const Task = require('../models/Task.model');
const User = require('../models/User.model');
const Progress = require('../models/Progress.model');
const Resume = require('../models/Resume.model');

const {
TASK_STATUS
} = require('../constants');

const {
buildATSHtml
} = require('./resume.service');


// ================= UPLOAD CERTIFICATE =================

const uploadCertificateService = async (
userId,
fileUrl,
skill
)=>{

let task =
await Task.findOne({
user:userId,
skill
});

if(!task){

task =
await Task.create({
user:userId,
skill,
certificateUrl:fileUrl,
unlocked:true
});

}else{

task.certificateUrl=fileUrl;

task.unlocked=true;

await task.save();

}

return task;

};


// ================= AI TEST GENERATION =================

const generateTestService =
async (skill)=>{

const prompt=`
Generate 50 MCQs for skill: ${skill}

Return JSON:

{
"questions":[
{
"question":"",
"options":[
"A",
"B",
"C",
"D"
],
"answer":""
}
]
}
`;

const res=
await fetch(
"https://openrouter.ai/api/v1/chat/completions",
{
method:"POST",

headers:{
Authorization:
`Bearer ${process.env.OPENROUTER_API_KEY}`,

"Content-Type":
"application/json"
},

body:JSON.stringify({

model:
"anthropic/claude-sonnet-4",

messages:[
{
role:"user",
content:prompt
}
],

temperature:0.3

})
}
);

const data=
await res.json();

let raw=
data?.choices?.[0]
?.message?.content;

raw=
raw.replace(
/```json|```/g,
''
);

return JSON.parse(raw);

};


// ================= AUTO RESUME UPDATE =================

const updateResumeService =
async (
userId,
skill
)=>{

const resume=
await Resume.findOne({
user:userId,
isActive:true
});

if(!resume){
return null;
}

if(
!Array.isArray(
resume.skills
)
){
resume.skills=[];
}

const exists=
resume.skills.some(
s=>
s.skillName===skill
);

if(!exists){

resume.skills.push({
skillName:skill,
proficiency:"Verified"
});

}

resume.resumeVersions=
(
resume.resumeVersions||[]
).filter(
v=>
v.type!=="ats"
);

resume.resumeVersions.push({

type:"ats",

html:
buildATSHtml(
resume
),

generatedAt:
new Date()

});

await resume.save();

return resume;

};


// ================= PROGRESS UPDATE =================

const updateProgress =
async (
userId
)=>{

const completed=
await Task.countDocuments({

user:userId,

status:
TASK_STATUS.COMPLETED

});

await Progress
.findOneAndUpdate(

{
user:userId
},

{

$set:{

"tasks.completed":
completed

}

},

{

upsert:true,

new:true

}

);

return completed;

};


// ================= SUBMIT TEST =================

const submitTestService =
async (

userId,

score,

skill

)=>{

let task=
await Task.findOne({

user:userId,

skill

});

if(!task){

throw new Error(
"Task not found"
);

}

task.testScore=
score;


// PASS

if(score>=85){

task.passed=true;

task.status=
TASK_STATUS.COMPLETED;

}else{

task.passed=false;

task.status=
TASK_STATUS.IN_PROGRESS;

}


// SAVE FIRST

await task.save();


// UPDATE DASHBOARD

await updateProgress(
userId
);


// UPDATE RESUME

if(score>=85){

await updateResumeService(

userId,

skill

);

}


return task;

};


module.exports={

uploadCertificateService,

generateTestService,

submitTestService,

updateResumeService

};


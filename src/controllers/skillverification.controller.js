'use strict';

const SkillVerification =
require('../models/skillVerification.model');

const Resume =
require('../models/Resume.model');

const resumeService =
require('../services/resume.service');

const asyncHandler =
require('../utils/asyncHandler');

const AppError =
require('../utils/AppError');

const { sendSuccess } =
require('../utils/response');

const { HTTP_STATUS } =
require('../constants');

const testService =
require('../services/test.service');

const normalize = (s='') =>
String(s)
.toLowerCase()
.trim();


// ================= INIT =================

const initSkillVerification =
asyncHandler(async(req,res)=>{

const skill =
normalize(req.body.skill);

const existing =
await SkillVerification.findOne({
user:req.user._id,
skill
});

if(existing){

return sendSuccess(
res,
HTTP_STATUS.OK,
"Skill already exists",
existing
);

}

const created =
await SkillVerification.create({
user:req.user._id,
skill
});

return sendSuccess(
res,
HTTP_STATUS.CREATED,
"Skill created",
created
);

});


// ================= CERTIFICATE =================

const uploadCertificate =
asyncHandler(async(req,res)=>{

const skill =
normalize(req.body.skill);

const certificateUrl =
req.body.certificateUrl
||
req.body.url;

if(!certificateUrl){

throw new AppError(
"Certificate URL required",
400
);

}

const record =
await SkillVerification.findOne({
user:req.user._id,
skill
});

if(!record){

throw new AppError(
"Skill not found",
404
);

}

record.certificateUploaded =
true;

record.certificateUrl =
certificateUrl;

await record.save();

return sendSuccess(
res,
HTTP_STATUS.OK,
"Certificate uploaded",
record
);

});


// ================= GET TEST =================

const getTestQuestions =
asyncHandler(async(req,res)=>{

const skill =
normalize(req.params.skill);

const record =
await SkillVerification.findOne({
user:req.user._id,
skill
});

if(!record){

throw new AppError(
"Skill not found",
404
);

}

if(!record.certificateUploaded){

throw new AppError(
"Upload certificate first",
403
);

}

const questions =
await testService.generateMCQs(skill);

return sendSuccess(
res,
HTTP_STATUS.OK,
"Test ready",
{
questions
}
);

});


// ================= SUBMIT TEST =================

const submitTest =
asyncHandler(async(req,res)=>{

const skill =
normalize(req.params.skill);

const {
answers,
questions
} = req.body;

if(
!Array.isArray(answers)
||
!Array.isArray(questions)
){

throw new AppError(
"Invalid test data",
400
);

}

let correct = 0;

questions.forEach(
(q,index)=>{

if(
Number(q.answer)
===
Number(answers[index])
){
correct++;
}

}
);

const total =
questions.length;

const score =
Math.round(
(correct/total)*100
);

const passed =
score>=70;


// SAVE TEST

const verification =
await SkillVerification.findOne({
user:req.user._id,
skill
});

if(verification){

verification.testScore =
score;

verification.passed =
passed;

await verification.save();

}


// ================= AUTO RESUME UPDATE =================

if(passed){

try{

let resume =
await Resume.findOne({
user:req.user._id
});

if(resume){

const alreadyExists =
resume.skills.some(
s=>
normalize(s.skillName)
===
skill
);

if(!alreadyExists){

resume.skills.push({

skillName:
skill.toUpperCase(),

category:
"Verified Skill",

proficiency:
score>=90
?
"Expert"
:
score>=80
?
"Advanced"
:
"Intermediate",

autoAdded:
true

});

/*
IMPORTANT FIX
avoid validating old incomplete fields
*/

await resume.save({
validateModifiedOnly:true
});

console.log(
"Resume auto updated"
);

// ============ AUTO REGENERATE ATS (AI) ============
// Keep the ATS resume in sync with the newly verified skill
resumeService
.generateATSResume(req.user._id)
.then(()=>
console.log("ATS resume auto-regenerated with AI")
)
.catch(err=>
console.log("ATS auto-regeneration failed:", err.message)
);

}

}

}catch(err){

console.log(
"Resume Update Error:",
err.message
);

/*
do not break test submission
*/

}

}


return sendSuccess(
res,
HTTP_STATUS.OK,
"Submitted",
{
correct,
total,
score,
passed
}
);

});


module.exports = {

initSkillVerification,

uploadCertificate,

getTestQuestions,

submitTest

};
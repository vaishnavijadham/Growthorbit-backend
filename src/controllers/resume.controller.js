'use strict';

const resumeService =
require('../services/resume.service');

const {
awardXP
} =
require('../services/gamification.service');

const asyncHandler =
require('../utils/asyncHandler');

const {
sendSuccess
} =
require('../utils/response');

const {
HTTP_STATUS
} =
require('../constants');

const Resume =
require('../models/Resume.model');

// ================= CREATE =================

const createResume =
asyncHandler(async(req,res)=>{

const body =
req.body || {};

const payload={

personalInfo:{

fullName:
body.personalInfo?.fullName
||
req.user.name
||
'Student',

email:
body.personalInfo?.email
||
req.user.email,

phone:
body.personalInfo?.phone
||
'',

linkedIn:
body.personalInfo?.linkedIn
||
'',

github:
body.personalInfo?.github
||
'',

portfolio:
body.personalInfo?.portfolio
||
'',

languagesKnown:
body.personalInfo?.languagesKnown
||
[]

},

education:
body.education
||
{},

skills:
body.skills
||
[],

achievements:
body.achievements
||
[],

certifications:
body.certifications
||
[],

hobbies:
body.hobbies
||
[],

declaration:
body.declaration
||
{
agreed:false
}

};

const resume =
await resumeService.createResume(
req.user._id,
payload
);

await awardXP(
req.user._id,
'RESUME_UPDATED',
resume._id,
'Resume'
).catch(()=>{});

return sendSuccess(
res,
HTTP_STATUS.CREATED,
'Resume created successfully.',
resume
);

});

// ================= GET =================

const getResume =
asyncHandler(async(req,res)=>{

const resume =
await resumeService.getResume(
req.user._id
);

return sendSuccess(
res,
HTTP_STATUS.OK,
'Resume fetched successfully.',
resume
);

});

// ================= ATS GENERATE =================

const generateATSResume =
asyncHandler(async(req,res)=>{

const resume =
await resumeService.generateATSResume(
req.user._id
);

await awardXP(
req.user._id,
'RESUME_UPDATED',
resume._id,
'Resume'
).catch(()=>{});

return sendSuccess(
res,
HTTP_STATUS.OK,
'ATS Resume generated using AI.',
resume
);

});

// ================= GET ATS =================

const getATSResume =
asyncHandler(async(req,res)=>{

const resume =
await resumeService.getResume(
req.user._id
);

const ats =
resume.resumeVersions?.find(
v=>
v.type==='ats'
);

return sendSuccess(
res,
HTTP_STATUS.OK,
'ATS resume fetched',
ats
);

});

// ================= GET BY ID =================

const getResumeById =
asyncHandler(async(req,res)=>{

const resume =
await resumeService.getResumeById(
req.params.id,
req.user._id
);

return sendSuccess(
res,
HTTP_STATUS.OK,
'Resume fetched successfully.',
resume
);

});

// ================= UPDATE =================

const updateResume =
asyncHandler(async(req,res)=>{

const resume =
await resumeService.updateResume(
req.user._id,
req.body
);

await awardXP(
req.user._id,
'RESUME_UPDATED',
resume._id,
'Resume'
).catch(()=>{});

return sendSuccess(
res,
HTTP_STATUS.OK,
'Resume updated successfully.',
resume
);

});

// ================= HISTORY =================

const getResumeHistory =
asyncHandler(async(req,res)=>{

const history =
await resumeService.getResumeHistory(
req.user._id
);

return sendSuccess(
res,
HTTP_STATUS.OK,
'Resume history fetched.',
history
);

});

// ================= DELETE =================

const deleteResume =
asyncHandler(async(req,res)=>{

await resumeService.deleteResume(
req.params.id,
req.user._id
);

return sendSuccess(
res,
HTTP_STATUS.OK,
'Resume deleted successfully.'
);

});

module.exports={

createResume,

getResume,

generateATSResume,

getATSResume,

getResumeById,

updateResume,

getResumeHistory,

deleteResume

};

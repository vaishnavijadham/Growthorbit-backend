
'use strict';

const {
Task,
TestSubmission
} = require('../models/Task.model');

const {
UserSkill
} = require('../models/Skill.model');

const testService =
require('../services/test.service');

const {
updateResume
} =
require('../services/resume.service');

const asyncHandler =
require('../utils/asyncHandler');

const {
sendSuccess,
sendPaginated
} =
require('../utils/response');

const {
HTTP_STATUS,
TASK_STATUS
} =
require('../constants');

const AppError =
require('../utils/AppError');

const {
getPagination,
getSort
} =
require('../helpers/pagination.helper');

const {
awardXP
} =
require('../services/gamification.service');

const {
recalculateProgress
} =
require('../services/progress.service');


// ================= GET TASKS =================

const getTasks =
asyncHandler(async (req,res)=>{

const {
page,
limit,
skip
}
=
getPagination(
req.query
);

const sort =
getSort(
req.query.sort,
{
createdAt:-1
}
);

const filter={
user:req.user._id
};

if(req.query.status){
filter.status=
req.query.status;
}

if(req.query.roadmap){
filter.roadmap=
req.query.roadmap;
}

const [
tasks,
total
]
=
await Promise.all([

Task.find(filter)
.populate(
'skill',
'name category icon'
)
.sort(sort)
.skip(skip)
.limit(limit),

Task.countDocuments(filter)

]);

sendPaginated(
res,
HTTP_STATUS.OK,
'Tasks fetched.',
tasks,
{
total,
page,
limit
}
);

});


// ================= GET TASK =================

const getTask =
asyncHandler(async (req,res)=>{

const task =
await Task.findOne({

_id:req.params.id,

user:req.user._id

})
.populate(
'skill',
'name category learningUrl'
);

if(!task){

throw new AppError(
'Task not found',
404
);

}

sendSuccess(
res,
HTTP_STATUS.OK,
'Task fetched.',
task
);

});


// ================= CREATE =================

const createTask =
asyncHandler(async (req,res)=>{

const task =
await Task.create({

user:req.user._id,

...req.body,

status:
req.body.status
||
TASK_STATUS.AVAILABLE

});

sendSuccess(
res,
HTTP_STATUS.CREATED,
'Task created.',
task
);

});


// ================= UPDATE STATUS =================

const updateTaskStatus =
asyncHandler(async (req,res)=>{

const task =
await Task.findOne({

_id:req.params.id,

user:req.user._id

});

if(!task){

throw new AppError(
'Task not found',
404
);

}

task.status=
req.body.status;

if(
req.body.status===
TASK_STATUS.COMPLETED
){

task.completedAt=
new Date();

await task.save();

await recalculateProgress(
req.user._id
);

}else{

await task.save();

}

sendSuccess(
res,
HTTP_STATUS.OK,
'Task updated',
task
);

});


// ================= TEST =================

const getTestQuestions =
asyncHandler(async (req,res)=>{

const task =
await Task.findById(
req.params.id
);

if(!task){

throw new AppError(
'Task not found',
404
);

}

const questions =
await testService
.generateQuestions(
task.skill,
50
);

sendSuccess(

res,

HTTP_STATUS.OK,

'Test generated',

{

questions,

passScore:85,

timeLimitMinutes:90

}

);

});


// ================= SUBMIT TEST =================

const submitTest =
asyncHandler(async (req,res)=>{

const task =
await Task.findOne({

_id:req.params.id,

user:req.user._id

})
.populate(
'skill',
'name'
);

if(!task){

throw new AppError(
'Task not found',
404
);

}


const result =
await testService.evaluateTest(

req.user._id,

task.skill,

req.body.answers

);


// SAVE TEST

await TestSubmission.create({

user:
req.user._id,

task:
task._id,

skill:
task.skill?._id,

score:
result.score,

passed:
result.score>=85,

submittedAt:
new Date()

});


task.testScore=
result.score;

task.passed=
result.score>=85;


if(result.score>=85){

task.status=
TASK_STATUS.COMPLETED;

task.completedAt=
new Date();

await task.save();


// UPDATE USER SKILL

if(task.skill?.name){

await UserSkill.findOneAndUpdate(

{

user:req.user._id,

name:
task.skill.name

},

{

user:req.user._id,

name:
task.skill.name,

status:
'completed'

},

{

upsert:true,

new:true

}

);

}


// UPDATE RESUME

await updateResume(

req.user._id,

{

taskResult:{

score:
result.score,

skills:[
task.skill.name
]

}

}

);


// PROGRESS

await recalculateProgress(
req.user._id
);


// XP

await awardXP(

req.user._id,

'TASK_PASS',

task._id,

'Task'

);

}else{

task.status=
TASK_STATUS.IN_PROGRESS;

await task.save();

}


sendSuccess(

res,

HTTP_STATUS.OK,

result.score>=85

?

'🎉 Task Passed!'

:

'Try again',

{

score:
result.score,

passed:
result.score>=85,

taskStatus:
task.status

}

);

});


// ================= DELETE =================

const deleteTask =
asyncHandler(async (req,res)=>{

const task =
await Task.findOneAndDelete({

_id:req.params.id,

user:req.user._id

});

if(!task){

throw new AppError(
'Task not found',
404
);

}

sendSuccess(
res,
HTTP_STATUS.OK,
'Task deleted'
);

});


// ================= EXPORT =================

module.exports={

getTasks,

getTask,

createTask,

updateTaskStatus,

getTestQuestions,

submitTest,

deleteTask

};

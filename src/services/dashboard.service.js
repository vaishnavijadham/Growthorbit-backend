
'use strict';

const Profile = require('../models/Profile.model');
const Resume = require('../models/Resume.model');
const Roadmap = require('../models/Roadmap.model');
const { Task, TestSubmission } = require('../models/Task.model');
const Certificate = require('../models/Certificate.model');
const Gamification = require('../models/Gamification.model');
const Progress = require('../models/Progress.model');

const {
TASK_STATUS,
ROADMAP_STATUS,
CERTIFICATE_STATUS
} = require('../constants');

const logger =
require('../utils/logger');


// ================= BUILD DASHBOARD =================

const buildDashboardSummary =
async (userId)=>{

try{

const [

profile,

progress,

gamification,

activeRoadmap,

tasks,

submissions,

pendingCerts,

resumeDoc,

completedTasks

]=

await Promise.all([

Profile.findOne({
user:userId
}),

Progress.findOne({
user:userId
}),

Gamification.findOne({
user:userId
}),

Roadmap.findOne({
user:userId,
status:
ROADMAP_STATUS.ACTIVE
}),

Task.find({

user:userId,

status:{
$in:[
TASK_STATUS.AVAILABLE,
TASK_STATUS.IN_PROGRESS
]
}

})

.populate(
'skill',
'name'
)

.sort({
priority:-1
})

.limit(5),

TestSubmission.find({

user:userId

})

.populate(
'skill',
'name'
)

.sort({
submittedAt:-1
})

.limit(5),

Certificate.countDocuments({

user:userId,

verificationStatus:
CERTIFICATE_STATUS.PENDING

}),

Resume.findOne({

user:userId,

isActive:true

}),

// IMPORTANT FIX

Task.countDocuments({

user:userId,

status:
TASK_STATUS.COMPLETED

})

]);


const xp=
gamification?.totalXP||0;


const level=

gamification?.levelTitle||

(

xp<100

? 'Beginner'

: xp<500

? 'Intermediate'

: 'Advanced'

);


const roadmapTitle=

activeRoadmap?.title||

'Not set';


const nextStep=

activeRoadmap
?.aiGeneratedContent
?.phases
?.find(
p=>
!p.isCompleted
)

?.title

||

'Complete current tasks';


const taskNames=

(tasks||[])

.map(

t=>

t.skill?.name

||

'Task'

);


const rewards=

(

gamification
?.badges

||

[]

)

.slice(-3)

.map(

b=>

b.name||b

);


const atsVersion=

resumeDoc
?.resumeVersions
?.find(
v=>
v.type==='ats'
);


const atsHtml=

atsVersion?.html

||

'<p>No ATS resume generated yet.</p>';


// SAFE PROGRESS

const tasksDone =

Math.max(

completedTasks,

progress?.tasks?.completed||0

);


const overallProgress =

progress?.overallPercent

||

Math.min(
tasksDone*10,
100
);


return{

progress:
overallProgress,

tasksDone,

level,

roadmap:
roadmapTitle,

nextStep,

tasks:
taskNames,

rewards:
rewards.length
? rewards
: ['No rewards yet'],

atsHtml,

user:{
id:userId
},

quickStats:{

overallProgress,

totalXP:
xp,

currentLevel:
gamification
?.currentLevel
||1,

streak:
gamification
?.currentStreak
||0,

pendingCertificates:
pendingCerts,

hasResume:
!!resumeDoc,

hasAtsResume:
!!atsVersion,

atsGeneratedAt:
atsVersion
?.generatedAt
||null

},

roadmapDetails:

activeRoadmap

? {

title:
activeRoadmap.title,

progress:
activeRoadmap.overallProgress,

totalPhases:

activeRoadmap
?.aiGeneratedContent
?.phases
?.length

||0,

completedPhases:

activeRoadmap
?.aiGeneratedContent
?.phases
?.filter(
p=>
p.isCompleted
)
.length

||0

}

:null,

recentTests:

(submissions||[])

.map(

s=>({

skill:
s.skill?.name,

score:
s.score,

passed:
s.passed

})

)

};

}catch(err){

logger.error(
'Dashboard build failed',
err
);

return{

progress:0,

tasksDone:0,

level:'Beginner',

roadmap:'Not set',

nextStep:
'Start learning',

tasks:[],

rewards:[],

atsHtml:
'<p>No data available</p>',

quickStats:{

overallProgress:0,

totalXP:0,

currentLevel:1,

streak:0,

pendingCertificates:0,

hasResume:false,

hasAtsResume:false,

atsGeneratedAt:null

},

roadmapDetails:null,

recentTests:[]

};

}

};


// ================= ACTIVITY =================

const getActivityTimeline =
async (
userId,
limit=20
)=>{

const gamification=

await Gamification
.findOne({
user:userId
})

.select(
'xpHistory'
);

if(!gamification){

return [];

}

return(

gamification
.xpHistory

||

[]

)

.slice(-limit)

.reverse()

.map(

e=>({

action:e.action,

xpAmount:e.xpAmount,

description:
e.description,

earnedAt:
e.earnedAt

})

);

};


module.exports={

buildDashboardSummary,

getActivityTimeline

};


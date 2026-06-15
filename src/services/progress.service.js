
'use strict';

const Progress =
require('../models/Progress.model');

const {
Task
} =
require('../models/Task.model');

const {
UserSkill
} =
require('../models/Skill.model');

const Certificate =
require('../models/Certificate.model');

const Roadmap =
require('../models/Roadmap.model');

const {

TASK_STATUS,

CERTIFICATE_STATUS

} =
require('../constants');

const logger =
require('../utils/logger');


// ================= RECALCULATE =================

const recalculateProgress =
async (
userId
)=>{

// TASKS

const [

totalTasks,

completedTasks,

inProgressTasks,

lockedTasks

]

=

await Promise.all([

Task.countDocuments({

user:userId

}),

Task.countDocuments({

user:userId,

status:
TASK_STATUS.COMPLETED

}),

Task.countDocuments({

user:userId,

status:
TASK_STATUS.IN_PROGRESS

}),

Task.countDocuments({

user:userId,

status:
TASK_STATUS.LOCKED

})

]);


const taskPercent=

totalTasks

?

Math.floor(
(
completedTasks
/
totalTasks
)
*
100
)

:0;


// SKILLS

const totalSkills=

await UserSkill
.countDocuments({

user:userId

});


const completedSkills=

completedTasks;


const learningSkills=

Math.max(
0,
totalSkills-
completedSkills
);


const skillPercent=

totalSkills

?

Math.floor(
(
completedSkills
/
totalSkills
)
*
100
)

:0;


// ROADMAP

const roadmap=

await Roadmap
.findOne({

user:userId,

status:'active'

});


let totalPhases=0;

let completedPhases=0;


if(
roadmap
?.aiGeneratedContent
?.phases
){

totalPhases=

roadmap
.aiGeneratedContent
.phases
.length;


completedPhases=

roadmap
.aiGeneratedContent
.phases
.filter(
p=>
p.isCompleted
)
.length;

}


const roadmapPercent=

totalPhases

?

Math.floor(
(
completedPhases
/
totalPhases
)
*
100
)

:0;


// CERT

const [

totalCerts,

verifiedCerts

]

=

await Promise.all([

Certificate
.countDocuments({

user:userId

}),

Certificate
.countDocuments({

user:userId,

verificationStatus:
CERTIFICATE_STATUS.VERIFIED

})

]);


const overallPercent=

Math.floor(

taskPercent*
0.6

+

skillPercent*
0.2

+

roadmapPercent*
0.2

);


const data={

overallPercent,

tasks:{

total:
totalTasks,

completed:
completedTasks,

inProgress:
inProgressTasks,

locked:
lockedTasks,

percent:
taskPercent

},

skills:{

total:
totalSkills,

completed:
completedSkills,

learning:
learningSkills,

percent:
skillPercent

},

roadmap:{

totalPhases,

completedPhases,

percent:
roadmapPercent

},

certificates:{

total:
totalCerts,

verified:
verifiedCerts

},

lastCalculatedAt:
new Date()

};


const progress=

await Progress
.findOneAndUpdate(

{

user:userId

},

data,

{

upsert:true,

new:true

}

);


logger.info(
`Progress updated`
);

return progress;

};


// ================= GET =================

const getProgress =
async (
userId
)=>{

let progress=

await Progress
.findOne({

user:userId

});

if(
!progress
){

progress=

await recalculateProgress(
userId
);

}

return progress;

};


module.exports={

recalculateProgress,

getProgress

};


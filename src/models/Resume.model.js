
'use strict';

const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
{

user:{
type:mongoose.Schema.Types.ObjectId,
ref:'User',
required:true,
index:true
},

// ───────── PERSONAL INFO ─────────

personalInfo:{

fullName:{
type:String,
required:[true,'Full name is required'],
trim:true,
maxlength:100
},

phone:{
type:String,
trim:true,
match:[
/^[+]?[\d\s\-().]{7,20}$/,
'Invalid phone number'
]
},

email:{
type:String,
required:[true,'Email is required'],
lowercase:true,
trim:true,
match:[
/^\S+@\S+\.\S+$/,
'Invalid email address'
]
},

linkedIn:{
type:String,
trim:true
},

github:{
type:String,
trim:true
},

portfolio:{
type:String,
trim:true
},

dateOfBirth:{
type:Date
},

languagesKnown:[
{
type:String,
trim:true
}
]

},

// ───────── EDUCATION ─────────

education:{

current:{

courseName:String,

branchName:String,

specialization:String,

currentSemester:String,

institution:String,

startYear:Number,

expectedEndYear:Number

},

past:{

classSemester:String,

institution:String,

percentage:{
type:Number,
min:0,
max:100
},

cgpa:{
type:Number,
min:0,
max:10
},

year:Number

}

},

// ───────── SKILLS ─────────

skills:[{

skillName:{
type:String,
required:true,
trim:true
},

category:{
type:String,
default:'General'
},

proficiency:{
type:String,
enum:[
'Beginner',
'Intermediate',
'Advanced',
'Expert'
],
default:'Beginner'
},

autoAdded:{
type:Boolean,
default:false
},

addedAt:{
type:Date,
default:Date.now
}

}],

// ───────── ATS + ORIGINAL STORAGE ─────────

resumeVersions:[{

type:{
type:String,
enum:[
'original',
'ats'
],
default:'original'
},

html:{
type:String,
default:null
},

generatedAt:{
type:Date,
default:null
},

skillsSnapshot:[{

skillName:String,

proficiency:String

}]

}],

// ───────── ACHIEVEMENTS ─────────

achievements:[{

title:String,

description:String,

year:Number

}],

// ───────── PROJECTS ─────────

projects:[{

title:String,

description:String,

tools:String,

github:String,

vercel:String

}],

// ───────── HOBBIES ─────────

hobbies:[
String
],

// ───────── CERTIFICATIONS ─────────

certifications:[{

title:String,

name:String,

issuer:String,

issueDate:Date,

credentialId:String,

url:String

}],

// ───────── DECLARATION ─────────

declaration:{

agreed:{
type:Boolean,
default:false
},

agreedAt:Date

},

// ───────── AI CONTENT ─────────

aiGeneratedContent:{

summary:{
type:String,
default:null
},

generatedAt:{
type:Date,
default:null
},

status:{

type:String,

enum:[
'pending',
'generated',
'failed'
],

default:'pending'

}

},

// ───────── META ─────────

version:{
type:Number,
default:1
},

isActive:{
type:Boolean,
default:true
},

lastUpdated:{
type:Date,
default:Date.now
}

},

{

timestamps:true,

toJSON:{
virtuals:true
},

toObject:{
virtuals:true
}

}

);

// INDEXES

resumeSchema.index({
user:1,
isActive:1
});

resumeSchema.index({
createdAt:-1
});

// VERSION UPDATE

resumeSchema.pre(
'save',
function(next){

if(!this.isNew){

this.version+=1;

this.lastUpdated=
new Date();

}

next();

}
);

module.exports=
mongoose.model(
'Resume',
resumeSchema
);


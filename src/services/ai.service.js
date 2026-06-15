'use strict';

const axios = require('axios');

async function generateResumeAI(resume) {

try {

const skills =
resume?.skills
?.map(s => s.skillName)
?.join(', ') || 'general technical skills';

const achievements =
resume?.achievements
?.map(a => a.title)
?.join(', ') || 'none listed';

const certifications =
resume?.certifications
?.map(c => c.name || c.title)
?.filter(Boolean)
?.join(', ') || 'none listed';

const prompt = `
You are an expert resume writer specializing in ATS (Applicant Tracking System) optimized resumes.

Write a concise, ATS-friendly professional summary (3-4 sentences, plain text, no markdown, no headings, no quotation marks) for the following student profile. Naturally include relevant keywords from their skills so it passes ATS keyword scans.

Name: ${resume?.personalInfo?.fullName || 'Student'}
Course: ${resume?.education?.current?.courseName || 'N/A'}
Branch/Specialization: ${resume?.education?.current?.branchName || resume?.education?.current?.specialization || 'N/A'}
Skills: ${skills}
Achievements: ${achievements}
Certifications: ${certifications}

Return ONLY the summary text, nothing else.
`;

const response =
await axios.post(

'https://openrouter.ai/api/v1/chat/completions',

{

model:'openai/gpt-4.1-mini',

messages:[
{
role:'system',
content:'You write concise, plain-text, ATS-optimized resume summaries. Never use markdown formatting or headings.'
},
{
role:'user',
content:prompt
}
],

max_tokens:300,

temperature:0.7

},

{

headers:{

Authorization:
`Bearer ${process.env.OPENROUTER_API_KEY}`,

'Content-Type':
'application/json'

},

timeout: 20000

}

);

return (
response.data
?.choices?.[0]
?.message?.content
||
''
).trim();

}

catch(error){

console.log(
'Resume AI generation failed:',
error?.response?.data || error.message
);

return '';

}

}

module.exports = {
generateResumeAI
};

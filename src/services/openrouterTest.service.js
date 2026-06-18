'use strict';

const generateMCQs = async (skill) => {

const response =
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
"openai/gpt-4o-mini",

max_tokens:800,

temperature:0.3,

messages:[

{
role:"system",

content:
`
Return ONLY JSON.

Generate EXACTLY 10 MCQs.

Schema:

[
{
"question":"",
"options":["","","",""],
"answer":0
}
]

Rules:

* answer must be integer 0–3
* short questions
* short options
* no markdown
* no explanations
  `
  },

{
role:"user",

content:
`Generate 10 MCQs for ${skill}`
}

]

})

}
);

const data =
await response.json();

console.log(
"OPENROUTER RESPONSE:",
JSON.stringify(data)
);

if(data.error){

throw new Error(
data.error.message
);

}

let content =
data.choices?.[0]
?.message
?.content;

content =
content
.replace(/`json/g,"")
.replace(/`/g,"")
.trim();

const questions =
JSON.parse(content);

return questions.map(
q=>({

question:q.question,

options:q.options,

answer:Number(q.answer)

})
);

};

module.exports={
generateMCQs
};

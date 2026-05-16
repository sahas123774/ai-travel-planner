const OpenAI =
require('openai');


// OPENROUTER
const openai =
new OpenAI({

  baseURL:
    'https://openrouter.ai/api/v1',

  apiKey:
    process.env.OPENROUTER_API_KEY

});


// GENERATE AI TRIP
async function generateTrip(

  destination,

  days,

  budget

) {

  // PROMPT
  const prompt = `

Create a detailed travel itinerary.

Destination:
${destination}

Days:
${days}

Budget:
₹${budget}

IMPORTANT:

Give response strictly in this format:

Day 1:
Morning:
Afternoon:
Evening:
Food:
Hotel Suggestion:

Day 2:
Morning:
Afternoon:
Evening:
Food:
Hotel Suggestion:

Continue for all days.

Also include:
- famous places
- transport tips
- local foods
- estimated budget tips

Make itinerary according to the given budget.

Keep response clean and structured.

`;

  // AI RESPONSE
  const completion =
    await openai.chat.completions.create({

      model:
        'openai/gpt-3.5-turbo',

      messages: [

        {
          role: 'user',

          content: prompt
        }

      ]

    });

  return completion
    .choices[0]
    .message.content;

}


module.exports =
generateTrip;
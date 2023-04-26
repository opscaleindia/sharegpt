import { Configuration, OpenAIApi } from "openai";
import { NextApiRequest, NextApiResponse } from "next";
import Cors from 'cors'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const cors = Cors({methods: ['POST', 'HEAD']});
function runMiddleware( req: NextApiRequest, res: NextApiResponse, fn: Function) 
{
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
        return (result instanceof Error) ? reject(result) : resolve(result);
    })
  })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse)
{
  await runMiddleware(req, res, cors);

  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const gptQuery:string= req.body.trim();
  if(gptQuery.length === 0) {
    return res.status(400).json({
      error: { message: "Query must not be empty"}
    });
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: gptQuery,
      temperature: 0.3,
      max_tokens: 150,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    });
    res.status(200).json({ 
      result: completion.data.choices[0].text,
      raw: completion.data
    });
  } catch(error: any) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}


import { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";

const model= new OpenAI({ openAIApiKey: process.env.OPENAI_API_KEY, temperature: 0.9 });
const template = "What is a good name for a company that makes {product}?";
const prompt = new PromptTemplate({
	template: template,
	inputVariables: ["product"],
});
const chain = new LLMChain({ llm: model, prompt: prompt });

export default async function handler(req: NextApiRequest, res: NextApiResponse)
{
	const ar_resp = await chain.call({ product: "iPhones" });
	res.send(ar_resp.text);
}


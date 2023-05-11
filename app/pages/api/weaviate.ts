import { NextApiRequest, NextApiResponse } from "next";
import weaviate, { WeaviateClient, ObjectsBatcher } from 'weaviate-ts-client';

const client: WeaviateClient = weaviate.client({
	scheme: 'http',
	host: 'localhost:8080',
	// headers: { 'X-OpenAI-Api-Key': process.env.OPENAI_API_KEY ?? "" },
});

const getData= async ():Promise<string> => JSON.stringify(await client.data.getter().do(), null, 2);
const createClaas= async (obj:Object):Promise<string> => JSON.stringify(await client.schema.classCreator().withClass(obj).do(), null, 2);
const getSchemas= async ():Promise<string> => JSON.stringify(await client.schema.getter().do(), null, 2);

export default async function handler(req: NextApiRequest, res: NextApiResponse)
{
	console.log(req.query);
	switch(req.query.type)
	{
		case "getData": return res.send(await getData());
		case "getSchemas": return res.send(await getSchemas());
		case "importQuestions": return res.send(await importQuestions());
		case "getArticleSummary":
		{
			client.graphql
			.get()
			.withClassName('Article')
			.withFields('content _additional { summary ( properties: ["content"]) { property result } }')
			.do()
			.then((data: any) => {
				res.send(JSON.stringify(data, null, 2));
			})
			.catch((err: Error) => {
				res.send(JSON.stringify(err, null, 2));
			});
			return;
		}
		case "queryQuestions":
		{
			client.graphql
			.get()
			.withClassName('Question')
			.withFields('question answer category')
			.withNearText({concepts: ['biology']})
			.withLimit(2)
			.do()
			.then((data: any) => {
				res.send(JSON.stringify(data, null, 2));
			})
			.catch((err: Error) => {
				res.send(JSON.stringify(err, null, 2));
			});
			return;
		}
		default:
		{
			return res.send(await getSchemas());
		}
	}
}


const classObj = {
	'class': 'Question',
	'vectorizer': 'text2vec-openai',
	'properties': [
		{
			'dataType': ['text'],
			'name': 'question',
			'description': 'The question',
		},
		{
			'dataType': ['text'],
			'name': 'answer',
			'description': 'The answer to the question',
		},
		{
			'dataType': ['text'],
			'name': 'category',
			'description': 'The category of question',
		},
	],
}

interface Question {
	Answer: string;
	Question: string;
	Category: string;
}

async function getJsonData(): Promise<Question[]> {
	const file: Response = await fetch('https://raw.githubusercontent.com/weaviate-tutorials/quickstart/main/data/jeopardy_tiny.json');
	return file.json();
}

async function importQuestions() {
	// Get the data from the data.json file
	const data = await getJsonData();

	// Prepare a batcher
	let batcher: ObjectsBatcher = client.batch.objectsBatcher();
	let counter: number = 0;
	let batchSize: number = 100;

	data.forEach((ques: Question) => {
	// Construct an object with a class and properties 'answer' and 'question'
		const obj = {
			class: 'Question',
				properties: {
				answer: ques.Answer,
				question: ques.Question,
				category: ques.Category,
			},
		}

		// add the object to the batch queue
		batcher = batcher.withObject(obj);

		// When the batch counter reaches batchSize, push the objects to Weaviate
		if (counter++ == batchSize) {
			// flush the batch queue
			batcher
			.do()
			.then(res => {
				console.log(res)
			})
			.catch(err => {
				console.error(err)
			});

			// restart the batch queue
			counter = 0;
			batcher = client.batch.objectsBatcher();
		}
	});

	// Flush the remaining objects
	batcher
	.do()
	.then((res: any) => {
	console.log(res)
	})
	.catch((err: Error) => {
	console.error(err)
	});
}



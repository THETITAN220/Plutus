import { GoogleGenerativeAI } from "@google/generative-ai";
import { SchemaType } from "@google/generative-ai/server";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.FLASH_API_KEY);

const schema = {
  description: "List of user intent: classify it into Want transaction, Check balance, Import wallet, Crypto Trends, General Query",
  type: SchemaType.OBJECT,
  properties: {
    intent: {
      type: SchemaType.STRING,
      description: "Display the intent of the user, only return Want transaction, Check balance, Import wallet, General Query and Crypto Trends",
      nullable: false,
    },
  },
  required: ["intent"],
}

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: schema,
  }
});


export async function POST(req: NextRequest) {

  const { value } = await req.json();
  console.log(value);

  const enhancedValue = `Determine if the user is asking for general query or intends to perform any blockchain task from the query: ${value} and assign the intent accordingly`
  const result = await model.generateContent(enhancedValue);
  // console.log("Result: \n", result);
  // console.log("Response:", result.response);
  console.log("Response: ", result.response.text());

  return NextResponse.json(result.response.text());

}

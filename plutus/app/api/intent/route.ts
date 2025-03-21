import { GoogleGenerativeAI } from "@google/generative-ai";
import { SchemaType } from "@google/generative-ai/server";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.FLASH_API_KEY);

const schema = {
  description: "List of user intent: classify it into Want transaction, Check balance, Import wallet",
  type: SchemaType.OBJECT,
  properties: {
    intent: {
      type: SchemaType.STRING,
      description: "Display the intent of the user",
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
  const result = await model.generateContent(value);
  // console.log("Result: \n", result);
  // console.log("Response:", result.response);
  console.log("Response: ", result.response.text());

  return NextResponse.json(result.response.text());

}

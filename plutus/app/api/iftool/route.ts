import { GoogleGenerativeAI } from "@google/generative-ai";
import { SchemaType } from "@google/generative-ai/server";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.FLASH_API_KEY);

const schema = {
  description: "Identify if tool is needed",
  type: SchemaType.OBJECT,
  properties: {
    detectTool: {
      type: SchemaType.STRING,
      description: "return true if tool is needed otherwise return false",
      nullable: false,
    },
  },
  required: ["detectTool"],
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
  console.log("Response:", result.response.text());
  const responseText = result.response.text();
  const jsonData = JSON.parse(responseText);

  return NextResponse.json(jsonData);

}

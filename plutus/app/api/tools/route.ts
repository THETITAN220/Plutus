import { GoogleGenerativeAI } from "@google/generative-ai";
import { SchemaType } from "@google/generative-ai/server";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.FLASH_API_KEY);

const schema = {
  description: "Identify the tool being called",
  type: SchemaType.OBJECT,
  properties: {
    tool: {
      type: SchemaType.STRING,
      description: "Return name of the tool being called (I am giving exact names of the tools return those): CheckBalance, SendETH, ImportWallet, CryptoChart",
      nullable: false,
    },
  },
  required: ["tool"],
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

import { NextResponse } from "next/server";

const API_KEY = process.env.CRYPTOCOMPARE_API_KEY; // Store API key in .env.local

export async function GET(
  req: Request,
  { params }: { params: { coin: string } }
) {
  const { coin } = params; // Get coin symbol from request
  const url = `https://min-api.cryptocompare.com/data/v2/histohour?fsym=${coin.toUpperCase()}&tsym=USD&limit=5&api_key=${API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch data");

    const data = await response.json();
    return NextResponse.json(data.Data);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
  }
}

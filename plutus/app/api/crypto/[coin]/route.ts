import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { coin: string } }
) {
  const { coin } = await Promise.resolve(params);
  const url = new URL(req.url);
  const range = url.searchParams.get("range") || "7d";
  const API_KEY = process.env.CRYPTOCOMPARE_API_KEY;

  // Set appropriate endpoint and limit based on time range
  let endpoint, limit, aggregate;

  switch (range) {
    case "24h":
      endpoint = "histohour";
      limit = 24;
      aggregate = 1;
      break;
    case "7d":
      endpoint = "histoday";
      limit = 7;
      aggregate = 1;
      break;
    case "30d":
      endpoint = "histoday";
      limit = 30;
      aggregate = 1;
      break;
    case "90d":
      endpoint = "histoday";
      limit = 90;
      aggregate = 1;
      break;
    case "1y":
      endpoint = "histoday";
      limit = 365;
      aggregate = 1;
      break;
    default:
      endpoint = "histoday";
      limit = 7;
      aggregate = 1;
  }

  const apiUrl = `https://min-api.cryptocompare.com/data/v2/${endpoint}?fsym=${coin.toUpperCase()}&tsym=USD&limit=${limit}&aggregate=${aggregate}&api_key=${API_KEY}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Failed to fetch data");

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";

export async function GET() {
  const API_KEY = process.env.NEXT_PUBLIC_CMC_API_KEY;
  const url =
    "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest";

  try {
    const response = await fetch(url, {
      headers: {
        "X-CMC_PRO_API_KEY": API_KEY!,
        Accept: "application/json",
      },
    });

    if (!response.ok) throw new Error("Failed to fetch data");

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching crypto prices" },
      { status: 500 }
    );
  }
}

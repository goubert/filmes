import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("query") ?? "";
  if (!query) return NextResponse.json({ results: [] });

  const apiKey = process.env.NEXT_PUBLIC_TMDB_KEY;
  const url = `https://api.themoviedb.org/3/search/person?api_key=${apiKey}&language=pt-BR&query=${encodeURIComponent(query)}`;

  const res = await fetch(url, { next: { revalidate: 60 } });
  const data = await res.json();

  return NextResponse.json({ results: data.results ?? [] });
}

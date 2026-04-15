import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${params.id}/credits?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}&language=pt-BR`
  );

  const data = await res.json();

  return NextResponse.json(data);
}
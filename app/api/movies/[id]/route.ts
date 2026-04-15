import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${params.id}?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}&language=pt-BR&append_to_response=credits,release_dates`
  );

  const data = await res.json();

  return NextResponse.json(data);
}
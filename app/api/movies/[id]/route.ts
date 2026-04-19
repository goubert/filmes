import { NextResponse } from "next/server";


export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  const movieRes = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}&language=pt-BR&append_to_response=credits,release_dates`
  );

  const providerRes = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}`
  );

  const movie = await movieRes.json();
  const providers = await providerRes.json();

  const streaming =
    providers.results?.BR?.flatrate ||
    providers.results?.US?.flatrate ||
    [];

  return NextResponse.json({
    ...movie,
    streaming,
  });
}
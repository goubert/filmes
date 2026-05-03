import { NextRequest, NextResponse } from "next/server"
import { discoverMoviesByEmotions } from "@/lib/tmdb"

export async function GET(req: NextRequest) {
  const s = req.nextUrl.searchParams

  const toLevel = (v: string | null) =>
    v === "true" ? 2 : v === "false" ? 0 : Number(v ?? 1)

  const emotions = {
    laugh:         toLevel(s.get("laugh")),
    cry:           toLevel(s.get("cry")),
    tense:         toLevel(s.get("tense")),
    scary:         toLevel(s.get("scary")),
    romance:       toLevel(s.get("romance")),
    action:        toLevel(s.get("action")),
    adventure:     toLevel(s.get("adventure")),
    animation:     toLevel(s.get("animation")),
    family:        toLevel(s.get("family")),
    feelgood:      toLevel(s.get("feelgood")),
    melancholic:   toLevel(s.get("melancholic")),
    nostalgic:     toLevel(s.get("nostalgic")),
    psychological: toLevel(s.get("psychological")),
  }

  const yearRange = {
    start: Number(s.get("yearStart") ?? 1900),
    end:   Number(s.get("yearEnd")   ?? 2026),
  }

  const duration = s.get("duration")
  const providerIds = s.get("providers")
    ? s.get("providers")!.split(",").map(Number).filter(Boolean)
    : []
  const page = Number(s.get("page") ?? 1)

  const countries = s.get("countries")?.split(",").filter(Boolean) ?? []
  const actorIds = s.get("cast")?.split(",").map(Number).filter(Boolean) ?? []

  const movies = await discoverMoviesByEmotions(emotions, yearRange, countries, duration, providerIds, page, actorIds)

  return NextResponse.json(movies)
}

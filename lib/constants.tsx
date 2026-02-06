const currentYear = new Date().getFullYear()


export type YearRange = {
  label: string
  start: number
  end: number
}

export const YEAR_RANGES: YearRange[] = [
  { label: "1900 – 1920", start: 1900, end: 1920 },
  { label: "1921 – 1940", start: 1921, end: 1940 },
  { label: "1941 – 1960", start: 1941, end: 1960 },
  { label: "1961 – 1980", start: 1961, end: 1980 },
  { label: "1981 – 2000", start: 1981, end: 2000 },
  { label: "2001 – 2020", start: 2001, end: 2020 },
  { label: "2021 – atualmente", start: 2021, end: currentYear }
]

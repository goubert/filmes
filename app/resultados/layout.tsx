import { AppHeader } from "@/components/app-header";

export default function ResultadosLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppHeader align="center" logoHref="/" />
      {children}
    </>
  );
}

import "./app-header.css";
import Link from "next/link";

interface AppHeaderProps {
  align?: "start" | "center";
  logoHref?: string;
  children?: React.ReactNode;
}

export function AppHeader({ align = "start", logoHref, children }: AppHeaderProps) {
  const logo = <img src="logo-mooviefinder.svg" alt="Moovie Finder" />;

  return (
    <header className={`app-header app-header--${align}`}>
      {logoHref ? <Link href={logoHref}>{logo}</Link> : logo}
      {children}
    </header>
  );
}

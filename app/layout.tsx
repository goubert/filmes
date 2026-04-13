import "./globals.css";
import Clarity from '@microsoft/clarity';
export const metadata ={
  title: "Moovie Finder",
  description: "Encontre filmes de acordo com seu humor."
}
// Make sure to add your actual project id instead of "yourProjectId".
const projectId = "wb2w48973f"

Clarity.init(projectId);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        {children}
      </body>
    </html>
  );
}

import "./globals.css";
import Script from "next/script";
export const metadata ={
  title: "Moovie Finder",
  description: "Encontre filmes de acordo com seu humor."
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script type="text/javascript">
          {`
          (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "wb2w48973f");
          `}
        </Script>
      </head>
      <body className={`antialiased`}>
        {children}
      </body>
    </html>
  );
}

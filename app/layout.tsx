import "./globals.css";
import "@/components/modal-movie/modal-movie.css";
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
        <link rel="preload" as="image" href="/bg-laugh.png" />
        <link rel="preload" as="image" href="/bg-action.png" />
        <link rel="preload" as="image" href="/bg-cry.png" />
        <link rel="preload" as="image" href="/bg-romance.png" />
        <link rel="preload" as="image" href="/bg-scary.png" />
        <link rel="preload" as="image" href="/bg-adventure.png" />
        <link rel="preload" as="image" href="/bg-psichological.png" />
        <link rel="preload" as="image" href="/bg-tense.png" />
        <link rel="preload" as="image" href="/bg-family.png" />
        <link rel="preload" as="image" href="/bg-animation.png" />
        <link rel="preload" as="image" href="/bg-nostalgic.png" />
        <link rel="preload" as="image" href="/bg-feelgood.png" />
        <link rel="preload" as="image" href="/emoji-laugh.png" />
        <link rel="preload" as="image" href="/emoji-action.png" />
        <link rel="preload" as="image" href="/emoji-cry.png" />
        <link rel="preload" as="image" href="/emoji-romance.png" />
        <link rel="preload" as="image" href="/emoji-scary.png" />
        <link rel="preload" as="image" href="/emoji-adventure.png" />
        <link rel="preload" as="image" href="/emoji-psichological.png" />
        <link rel="preload" as="image" href="/emoji-tense.png" />
        <link rel="preload" as="image" href="/emoji-family.png" />
        <link rel="preload" as="image" href="/emoji-animation.png" />
        <link rel="preload" as="image" href="/emoji-nostalgic.png" />
        <link rel="preload" as="image" href="/emoji-feelgood.png" />
        <Script type="text/javascript">
          {`
          (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "wb2w48973f");
          `}
        </Script>

        <Script
          src="hhttps://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2529666899037234"
          strategy="beforeInteractive"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`antialiased`}>
        {children}
      </body>
    </html>
  );
}

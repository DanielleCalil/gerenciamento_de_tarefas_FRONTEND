"use client";
import "./globals.css";
import { useState, useEffect } from "react";

// export const metadata = {
//   title: "SmoakBook",
//   description: "Generated by create next app",
// };

export default function RootLayout({ children }) {
  // const pathname = usePathname();
  // const isHome = pathname === "/usuarios/login";
  // const [isLoading, setIsLoading] = useState(isHome);

  // useEffect(() => {
  //   if (isLoading) return;
  // }, [isLoading]);

  return (
    <html lang="pt-br">
      <head>
        <title>Gerenciamento de Tarefas</title>
        {/* <link rel="icon" href="/Icons TCC/favicon.ico" /> */}
      </head>
      <body className="bg-white">
        <div className="layout">
          {children}
        </div>
      </body>
    </html>
  );
}
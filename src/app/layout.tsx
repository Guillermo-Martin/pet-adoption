import type { Metadata } from "next";
import { Grandstander } from "next/font/google"; // import grandstander
import Layout from "./../components/Layout";
import "@/app/styles/globals.css";
import { Provider } from "@/context/PetContext";

// Using Google fonts in NextJS:  https://youtu.be/DqGr8YwO52Q?si=t6Yd4o4rgd1odf4S
// initialize font
const grandstander = Grandstander({
  subsets: ["latin"],
  variable: "--font-grandstander"
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children,}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="en" className={`${grandstander.variable}`}>
      <body className="font-grandstander">
        <Provider>
          {/* <Layout> */}
          {children}
          {/* </Layout> */}
        </Provider>
      </body>
    </html>
  );
}

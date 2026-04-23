import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { PopupProvider } from "@/components/layout/PopupContext";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-open-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Authority Partners",
    default: "Authority Partners",
  },
  description: "Technology Strategy & Software Engineering",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://authoritypartners.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${openSans.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col">
        <PopupProvider>
          <Navbar />
          {children}
          <Footer />
        </PopupProvider>
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!} />
      <Script id="linkedin-insight" strategy="afterInteractive">
        {`
          _linkedin_partner_id = '8136212';
          window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
          window._linkedin_data_partner_ids.push(_linkedin_partner_id);
        `}
      </Script>
      <Script
        src="https://snap.licdn.com/li.lms-analytics/insight.min.js"
        strategy="afterInteractive"
      />
    </html>
  );
}

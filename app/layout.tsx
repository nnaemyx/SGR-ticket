import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import localFont from 'next/font/local'

export const metadata: Metadata = {
  title: "Lagos in Port Harcourt",
  description: "Get your tickets for the lifestyle party in Port Harcourt",
  icons: {
    icon: '/images/SGR LOGO MAIN copy 1.png',
    apple: '/images/SGR LOGO MAIN copy 1.png',
  },
};

const myFont = localFont({
  src: [
    {
      path: '../fonts/Gilmer Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../fonts/Gilmer Light.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/Gilmer Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../fonts/Gilmer Regular.otf',
      weight: '400',
      style: 'normal',
    },
  ],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://js.paystack.co/v1/inline.js" />
        <link rel="icon" href="/images/SGR LOGO MAIN copy 1.png" />
        <link rel="apple-touch-icon" href="/images/SGR LOGO MAIN copy 1.png" />
      </head>
      <body className={myFont.className}>
        {children}
        <Toaster 
          position="top-center"
          toastOptions={{
            style: {
              background: 'white',
              color: 'black',
              border: '1px solid #e2e8f0',
            },
          }}
        />
      </body>
    </html>
  );
}

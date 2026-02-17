import "./globals.css";
import Navbar from "@/components/Navbar";
import localFont from 'next/font/local'
 
const myFont = localFont({
  src: './fonts/Outfit-Regular.ttf',
})

export const metadata = {
  title: "YT-DLP webGUI",
  description: "download your videos via link without login and sign up for free",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${myFont.className}`}
      >
        <Navbar/>
        {children}
      </body>
    </html>
  );
}

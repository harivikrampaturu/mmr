import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import Head from 'next/head';
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Matri Mirra Residency - Access Restricted',
  description:
    'A peaceful apartment at Shilpa layout, HMT Swarnapuri colony - Contact Admin Vikram for access'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        {/* Import Google Fonts here */}
        <link
          href="https://fonts.googleapis.com/css2?family=Bangers&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className={inter.className}>
        {/*  <header className="px-4 lg:px-6 h-14 flex items-center justify-between bg-white/10 backdrop-blur-md border-b border-white/20">
          <Link href="/" className="flex items-center" prefetch={false}>
            <span className="text-lg font-bold text-white drop-shadow-lg">
              <img src="/logo.png" className="max-w-[80px]" />
            </span>
          </Link>
          <nav className={`flex items-center gap-4`}>
            <div className="text-sm text-white/70">Restricted Access</div>
          </nav>
        </header> */}
        {children}
      </body>
    </html>
  );
}

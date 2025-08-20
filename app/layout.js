import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import Head from 'next/head';
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Matri Mirra Residency',
  description: 'A peaceful apartment at Shilpa layout, HMT Swarnapuri colony'
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
         <header className="px-4 lg:px-6 h-14 flex items-center justify-between bg-white/10 backdrop-blur-md border-b border-white/20">
          <Link href="/" className="flex items-center" prefetch={false}>
            <span className="text-lg font-bold text-white drop-shadow-lg">
              <img src="/logo.png" className="max-w-[80px]" />
            </span>
          </Link>
          <nav className={`flex items-center gap-4 `}>
            <Link
              href='/'
              className='group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50'
              prefetch={false}
            >
              Home
            </Link>

            <Link
              href='/residents'
              className='group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 hidden'
              prefetch={false}
            >
              Residents
            </Link>

            <Link
              href='/contact'
              className='group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50'
              prefetch={false}
            >
              Contact
            </Link>
          </nav>
        </header> 
        {children}
      </body>
    </html>
  );
}

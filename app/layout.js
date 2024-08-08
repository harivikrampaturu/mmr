import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Matri Mirra Residency',
  description: 'A peaceful apartment at Shilpa layout, HMT Swarnapuri colony'
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        {' '}
        <header className='px-4 lg:px-6 h-14 flex items-center justify-between bg-white drop-shadow-sm'>
          <Link href='/' className='flex items-center' prefetch={false}>
            <span className='text-lg font-bold text-sky-600 drop-shadow-lg'>
              Matri Mirra Residency
            </span>
          </Link>
          <nav className='flex items-center gap-4'>
            <Link
              href='/'
              className='group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50'
              prefetch={false}
            >
              Home
            </Link>
            {/*   <Link
              href='#'
              className='group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50'
              prefetch={false}
            >
              Events
            </Link>
            <Link
              href='#'
              className='group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50'
              prefetch={false}
            >
              Residents
            </Link> */}
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

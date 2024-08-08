/**
 * v0 by Vercel.
 * @see https://v0.dev/t/GdWYqFo4TA7
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

export default function Component() {
  return (
    <div className='flex flex-col min-h-[100dvh]'>
      <main className='flex-1'>
        <section className="w-full h-[80vh] bg-[url('/mmr_bg.png')] bg-cover bg-center">
          <div className='h-full w-full flex flex-col items-center justify-center text-white'>
            <div className='h-48 w-full bg-black/60 flex flex-col items-center justify-center text-white'>
              <h1 className='text-4xl font-bold mb-4'>Matri Mirra Residency</h1>
              <p className='max-w-md text-center'>
                Experience luxurious living in the heart of the city. Where
                comfort, convenience, and community come together to create the
                perfect living experience.
              </p>
            </div>
          </div>
        </section>
      </main>
      <footer className='flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t'>
        <p className='text-xs text-muted-foreground'>
          &copy; 2024 Matri Mirra Residency. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

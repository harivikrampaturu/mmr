// pages/contact.js
import Head from 'next/head';

export default function Contact() {
  return (
    <div>
      <Head>
        <title>Contact Us</title>
        <meta name='description' content='Contact Us page with Google Map' />
      </Head>
      <main className='flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4'>
        <div className='bg-white shadow-md rounded-lg p-16 w-full max-w-7xl'>
          <div className='flex flex-col md:flex-row'>
            <div className='md:w-1/2 md:pr-4'>
              <div className='mb-4'>
                <iframe
                  src='https://maps.app.goo.gl/V6rn9b4JpWbZ8Xi19'
                  width='100%'
                  height='450'
                  style={{ border: 0 }}
                  allowFullScreen=''
                  loading='lazy'
                ></iframe>
              </div>
              <p className='font-extrabold'> Matri Mirra Residency,</p>
              <p className='mb-4'>
                Road No 19/22, HMT Swarnapuri colony,
                <br />
                Ameenpur, 502032
              </p>
            </div>
            <div className='md:w-1/2 md:pl-4'>
              <form className='flex flex-col space-y-4'>
                <input
                  type='text'
                  placeholder='Your Name'
                  className='border rounded-lg px-3 py-2'
                />
                <input
                  type='email'
                  placeholder='Your Email'
                  className='border rounded-lg px-3 py-2'
                />
                <textarea
                  placeholder='Your Message'
                  className='border rounded-lg px-3 py-2'
                  rows='4'
                ></textarea>
                <button
                  type='submit'
                  className='bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-700'
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

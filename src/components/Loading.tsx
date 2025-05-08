import React from 'react'
import { Link } from 'react-router-dom'

const Loading = () => {
    const baseButtonStyles = "inline-flex items-center justify-center rounded-md px-6 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
    const primaryButtonStyles = `${baseButtonStyles} bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500`
    const secondaryButtonStyles = `${baseButtonStyles} border border-gray-300 bg-white hover:bg-gray-100 text-gray-800 focus-visible:ring-gray-400`

  return (
    <section className='w-full py-12 md:py-24 lg:py-32 bg-white'>
      <div className='container px-4 md:px-6'>
        <div className='grid gap-8 lg:grid-cols-2 lg:gap-12 items-center'>

            <div className='flex flex-col justify-center space-y-6'>
                <div className='space-y-3'>
                    <h1 className='text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl xl:text-6xl/none text-gray-900'>
                        Công nghệ hiện đại cho cuộc sống thông minh
                    </h1>
                    <p className='max-w-[600px] text-gray-600 md:text-xl'>
                    "Nơi mua sắm đáng tin cậy cho mọi nhà!"
                    </p>
                </div>

                <div className='flex flex-col gap-3 sm:flex-row'>
                    <Link to='products' className={primaryButtonStyles}>
                        Mua sắm ngay
                    </Link>
                    <Link to='voucher' className={secondaryButtonStyles}>
                        Xem khuyến mãi 
                    </Link>
                </div>
            </div>

            <div className='flex justify-center'>
                <img
                    src='https://res.cloudinary.com/dxbjy97kr/image/upload/v1746720561/link-12257_512_derknp.gif'
                    width={600}
                    height={338}
                    className='mx-auto aspect-video overflow-hidden rounded-xl object-contain object-center sm:w-full'
                />
            </div>
            
        </div>
      </div>
    </section>
  )
}

export default Loading

import ListProduct from '@/app/(user)/page/shop/listProduct'
import { Result } from 'antd'
import Link from 'next/link'
import React from 'react'

const CheckoutSuccess = () => {
    return (
        <div className='main-layout min-h-screen'>
            <Result
                status="success"
                title={<p className='text-white'>Successfully order</p>}
                extra={
                    <>
                        <Link
                            href={'/page/shop'}
                            className='py-2.5 px-4 bg-[#1C1B33] rounded-full hover:scale-110 text-white' >
                            <span>Go shop</span>
                        </Link>
                    </>

                }
            />
            <ListProduct />
        </div>
    )
}

export default CheckoutSuccess
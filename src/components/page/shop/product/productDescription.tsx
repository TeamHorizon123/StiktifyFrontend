import React from 'react'

interface IData {
    description: string
}

const ProductDescription = ({ description }: IData) => {
    return (
        <div className='my-4 p-2 rounded-md bg-[#1C1B33] text-white'>
            <p className='p-4 text-2xl font-bold'>Description</p>
            <p className='p-4 text-justify'>{description}</p>
        </div>
    )
}

export default ProductDescription
"use client";

import { Image } from 'antd';
import React, { useEffect, useState } from 'react'

interface IProductImage {
  default: string,
  listImage: string[]
}

const ProductImage = (data: IProductImage) => {
  const [current, setCurrent] = useState<string>(data.default);

  useEffect(() => {
    const setDefault = () => {
      setCurrent(data.default);
    }
    setDefault();
  }, [data.default])

  const handleShow = (url: string) => {
    setCurrent(url);
  }
  return (
    <div className='w-full h-[80vh] py-1 flex flex-col items-center justify-between'>
      <div id='image' className='w-[60vh] h-[60vh] bg-slate-600 rounded-lg overflow-hidden'>
        <Image
          className='rounded-lg border-transparent'
          src={current}
          alt='active i'
          width="100%"
          height="100%" />
      </div>
      {
        <ul className='w-full flex space-x-1 overflow-x-scroll'>
          {
            data.listImage.map((url: string, index) => (
              <li className='w-20 h-20' key={index} onClick={() => { handleShow(url) }}>
                <img className='w-full h-full cursor-pointer bg-white' src={url} alt={"image" + (index + 1)} />
              </li>
            ))
          }
        </ul>

      }
    </div>
  )
}

export default ProductImage
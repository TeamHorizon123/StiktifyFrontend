import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react'
import { Rate } from 'antd';
import { AuthContext } from '@/context/AuthContext';
import { sendRequest } from '@/utils/api';
import { formatDateTime } from '@/utils/utils';

const RatingItem = (data: IProductRating) => {
    const { accessToken } = useContext(AuthContext) ?? {};
    const [user, setUser] = useState<IUser>();

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await sendRequest<IBackendRes<IUser>>({
                    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/get-user/${data.UserId}`,
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    }
                })
                setUser(res.data);
            } catch (error) {
                console.error(error);
            }

        }

        getUser();
    }, [])

    return (
        <div className='p-2 bg-[#FFFFFF0D] border border-[#FFFFFF1A] rounded-md flex space-x-4'>
            <div className='w-16'>
                <img className='w-12 h-12 bg-black rounded-full' src={user?.image} alt="user logo" />
            </div>
            <div>
                <div className='flex items-center space-x-2'>
                    <Link href="">{user?.userName}</Link>
                    <Rate defaultValue={data.Point} disabled />
                    <p className='text-xs'>{formatDateTime(data.CreateAt.toString())}</p>
                </div>
                <p className='py-2 text-sm font-light text-[#D1D5DB]'>
                    {data.Content}
                </p>
                {/* <div className='w-full h-28 flex space-x-1'>
                    <div className='w-28 h-28 bg-black rounded-md'></div>
                    <div className='w-28 h-28 bg-black rounded-md'></div>
                    <div className='w-28 h-28 bg-black rounded-md'></div>
                    <div className='w-28 h-28 bg-black rounded-md'></div>
                </div> */}
                {/* <div className='mt-2 flex space-x-8'>
                    <a className='flex items-center space-x-1' >
                        <BiLike className='text-lg' />
                        <p className='text-sm font-light'>Helpful </p>
                    </a>
                    <a className='flex items-center space-x-2' >
                        <BiDislike className='text-lg' />
                        <p className='text-sm font-light'>Not helpful </p>
                    </a>
                    <a className='flex items-center space-x-2' >
                        <p className='text-sm font-light'>Reply </p>
                    </a>
                </div> */}
            </div>
        </div>
    )
}

export default RatingItem
import ProductItem from '@/components/page/shop/checkout/productItem';
import { AuthContext } from '@/context/AuthContext';
import { sendRequest } from '@/utils/api';
import { formatCurrencyVND } from '@/utils/utils';
import React, { useContext, useEffect, useState } from 'react'

interface IData {
    shopId: string,
    items: ICart[]
}

const CheckoutProduct = (data: IData) => {
    const { accessToken } = useContext(AuthContext) ?? {};
    const [shop, setShop] = useState<Shop | null>(null);
    const [totalProduct, setTotalProduct] = useState(0);

    const SumTotal = (list: ICart[]) => {
        let sum = 0;
        list.map((item) => {
            sum += item.Quantity * (item.Variant.Price ?? item.Option.Price ?? 0)
            setTotalProduct(sum);
        })
    }

    useEffect(() => {
        const getShop = async () => {
            const res = await sendRequest<IListOdata<Shop>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}/odata/shop`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                queryParams: {
                    $filter: `Id eq '${data.shopId}'`
                }
            })

            setShop(res.value[0])
            SumTotal(data.items);
        }

        getShop();
    }, [accessToken, data]);

    return (
        <div className='p-2 rounded-md space-y-3'>
            <div className='flex items-center space-x-2 text-sm'>
                {
                    shop?.ShopType &&
                    <span className=' p-0.5 bg-[#ba1027] font-bold'>{shop?.ShopType}</span>
                }
                <p>{shop?.ShopName ?? "Shop type"}</p>
            </div>
            {
                data.items.map((item) => (
                    <>
                        <ProductItem key={item.Id} {...item} />
                    </>
                ))
            }
            <div className='space-y-2'>
                <p className='text-right font-extralight'>{data.items.length > 1 ? `${data.items.length} items,` : "1 item,"} total <b>{formatCurrencyVND(totalProduct)}</b></p>
                {/* <div className='w-[50%] flex items-center space-x-2'>
                    <p>Message:</p>
                    <Input
                        className='text-white bg-[#454B79] border-[#1C1B33] hover:bg-[#454B79] hover:border-[#1C1B33] focus:bg-[#454B79] placeholder:text-gray-200'
                        placeholder='Message for store owner'
                        onChange={(e) => setMessage(e.target.value)}
                        maxLength={150} />
                </div> */}
            </div>
        </div>
    )
}

export default CheckoutProduct
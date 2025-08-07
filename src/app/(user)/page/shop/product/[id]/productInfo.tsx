"use client";

import React, { useContext, useEffect, useState } from 'react';
import { FaCartPlus } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";
import { FaMinus, FaPlus } from "react-icons/fa";
import ProductFooter from '@/components/page/shop/product/productFooter';
import ProductDescription from '@/components/page/shop/product/productDescription';
import RatingOfProduct from '@/components/page/shop/rating/ratingOfProduct';
import { sendRequest } from '@/utils/api';
import { AuthContext } from '@/context/AuthContext';
// import { IoIosStarOutline } from "react-icons/io";
import { formatCurrencyVND } from '@/utils/utils';
import { Image, notification, Rate } from 'antd';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

interface ProductInfo {
    data: Product
}

const ProductInfo = ({ data }: ProductInfo) => {
    const { accessToken, user } = useContext(AuthContext) ?? {};
    const [quantity, setQuantity] = useState(1);
    const [maxQuantity, setMaxQuantity] = useState(1);
    const [choose, setChoose] = useState<IProductOption | null>(null);
    const [chooseVariant, setChooseVariant] = useState<ProductVariant | null>(null);
    const [currentImg, setCurrentImg] = useState<string | null>(data.ImageUri || "");
    const [options, setOptions] = useState<IProductOption[]>([]);
    const [variants, setVariants] = useState<ProductVariant[]>([]);
    const [currentOption, setCurrentOption] = useState<string | null>("");
    const [api, contextHolder] = notification.useNotification();
    const [validChoose, setValidChoose] = useState(true);
    const [validVariant, setValidVariant] = useState(true);
    const { setSelectedItems } = useCart();
    const router = useRouter();

    const openNotification = (type: 'success' | 'error' | 'info', message: string) => () => {
        api[type]({
            message: 'Notification',
            description: message,
            duration: 3
        });
    };

    const handleUpdateQuantity = (value: number) => {
        setQuantity(quantity + value);
    }

    const handleChooseOption = (option: IProductOption) => {
        setChoose(option.Id === choose?.Id ? null : option);
        setCurrentImg(currentImg === option.Image ? data?.ImageUri : option.Image);
        setCurrentOption(currentOption === option.Id ? "" : option.Id);
    }

    const handleChooseVariant = (variant: ProductVariant) => {
        setChooseVariant(variant.Id === chooseVariant?.Id ? null : variant);
    }

    useEffect(() => {
        const getOptions = async () => {
            try {
                if (!accessToken) return;

                const res = await sendRequest<IListOdata<IProductOption>>({
                    url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}/odata/product-option`,
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    queryParams: {
                        $filter: `ProductId eq '${data?.Id}'`,
                        $expand: "ProductVariants,"
                    }
                });

                if (res.value) {
                    const mappedOptions = res.value.map((option) => ({
                        ...option,
                        Color: option.Color === "None" ? "" : option.Color,
                        Type: option.Type === "None" ? "" : option.Type,
                    }));

                    setOptions(mappedOptions);
                }
            } catch {
            }

        }

        getOptions();
    }, [accessToken, data]);

    useEffect(() => {
        setQuantity(1);
        if (chooseVariant && chooseVariant.Quantity != null) {
            setMaxQuantity(chooseVariant.Quantity);
        } else if (choose && choose.Quantity != null) {
            setMaxQuantity(choose.Quantity);
        } else {
            setMaxQuantity(1); // fallback
        }
    }, [chooseVariant, choose]);

    const handleAddCart = async () => {

        if (!choose) {
            setValidChoose(false);
            return;
        } else {
            setValidChoose(true);
        }

        if (!chooseVariant) {
            setValidVariant(false);
            return;
        } else {
            setValidVariant(true);
        }


        const payload = {
            UserId: user?._id,
            ProductId: data?.Id,
            VariantId: chooseVariant?.Id,
            OptionId: choose?.Id,
            Quantity: quantity,
            ImageUri: choose?.Image
        }

        // console.log(payload);
        try {
            const res = await sendRequest<IOdataRes<string>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}/odata/cart`,
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: payload
            });
            if (res.value)
                openNotification('info', res.value ?? "")();
        } catch {
            openNotification("error", `Error add to cart`)
        }
    }

    const handleBuyNow = () => {
        if (!choose) {
            setValidChoose(false);
            return;
        } else {
            setValidChoose(true);
        }

        if (!chooseVariant) {
            setValidVariant(false);
            return;
        } else {
            setValidVariant(true);
        }

        const payload: ICart[] = [{
            Id: "",
            UserId: user?._id,
            ProductId: data.Id,
            Product: data,
            VariantId: chooseVariant.Id ?? "",
            OptionId: choose.Id ?? "",
            Quantity: quantity,
            ImageUri: choose.Image ?? "",
            CreateAt: new Date(),
            UpdateAt: new Date(),
            Option: choose,
            Variant: chooseVariant
        }]

        setSelectedItems(payload);
        router.push('/page/shop/check-out');
    }

    useEffect(() => {
        const getVariant = async () => {
            const res = await sendRequest<IListOdata<ProductVariant>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}/odata/product-variant`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                queryParams: {
                    $filter: `ProductOptionId eq '${currentOption}'`,
                    $expand: "Size($orderby=Size desc)",
                }
            });
            if (res.value) {
                setVariants(res.value);
            }
        }

        getVariant();
    }, [accessToken, currentOption])

    return (
        <>
            {
                (data) ? (
                    <div >
                        {contextHolder}
                        <div className='grid grid-cols-2'>
                            <Image
                                src={currentImg || ""}
                                alt='Product image' />
                            <div className='flex flex-col px-2 text-white'>
                                <p className='text-3xl font-bold'>{data.Name}</p>
                                <div className='flex items-center space-x-3 font-light text-sm py-3'>
                                    <div className='flex items-center space-x-1'>
                                        <Rate
                                            disabled
                                            defaultValue={data.AveragePoint ?? 0}
                                            allowHalf />
                                        <p>{data.AveragePoint}</p>
                                        {/* <p>({product.Order})</p> */}
                                    </div>
                                    <GoDotFill />
                                    <span>{data.Order} orders</span>
                                </div>
                                <div className='py-5 flex items-center space-x-3'>
                                    <span className='text-4xl font-bold'>{formatCurrencyVND(chooseVariant?.Price || data.Price || 0)}</span>
                                </div>
                                <div className='w-full py-4 flex flex-col space-y-2 justify-start'>
                                    {
                                        options.length > 0 ? (<>
                                            <div className='flex space-x-2 items-center'>
                                                <span>Option:</span>
                                                {
                                                    !validChoose ? (<>
                                                        <p className='font-light text-sm text-red-400'>Please select the option</p>
                                                    </>) : (<></>)
                                                }
                                            </div>
                                            <div className='w-full grid grid-cols-3 gap-3'>
                                                {
                                                    options.map((option: IProductOption) => (
                                                        <>
                                                            {
                                                                option.Id === choose?.Id ? (
                                                                    <button
                                                                        key={option.Id}
                                                                        onClick={() => { handleChooseOption(option) }}
                                                                        className='overflow-hidden h-12 border border-[#C04FD4] bg-[#C04FD4] rounded-md flex items-center space-x-1'>
                                                                        <img className='bg-black w-[40%] h-full text-sm' src={option.Image || ""} alt="option image" />
                                                                        <span className='text-xs text-wrap text-center'>
                                                                            {[option.Color, option.Type].filter(Boolean).join(" - ")}
                                                                        </span>
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        key={option.Id}
                                                                        onClick={() => { handleChooseOption(option) }}
                                                                        className='overflow-hidden h-12 border border-[#C04FD4] hover:bg-[#C04FD4] rounded-md flex items-center space-x-1'>
                                                                        <img className='bg-black w-[40%] h-full text-sm' src={option.Image || ""} alt="option image" />
                                                                        <span className='text-xs text-wrap text-center'>
                                                                            {[option.Color, option.Type].filter(Boolean).join(" - ")}
                                                                        </span>
                                                                    </button>
                                                                )
                                                            }
                                                        </>

                                                    ))
                                                }
                                            </div></>) : (<></>)
                                    }
                                    <div className='flex flex-col items-start'>
                                        {
                                            currentOption && variants.length > 0 ? (<>
                                                <div className='flex space-x-2 items-center'>
                                                    <span>Size:</span>
                                                    {
                                                        !validVariant ? (<>
                                                            <p className='font-light text-sm text-red-400'>Please select the option</p>
                                                        </>) : (<></>)
                                                    }
                                                </div>
                                                <div className='w-full grid grid-cols-6 gap-3'>
                                                    {
                                                        variants.map((variant) => (
                                                            variant.Id === chooseVariant?.Id ? (<>
                                                                <button
                                                                    key={variant.Id}
                                                                    onClick={() => handleChooseVariant(variant)}
                                                                    className=' text-center h-10 border border-[#C04FD4] bg-[#C04FD4] rounded-md flex items-center justify-center space-x-1'>
                                                                    {
                                                                        variant.Size?.Size
                                                                    }
                                                                </button>
                                                            </>) : (<>
                                                                <button
                                                                    key={variant.Id}
                                                                    onClick={() => handleChooseVariant(variant)}
                                                                    className=' text-center h-10 border border-[#C04FD4] hover:bg-[#C04FD4] rounded-md flex items-center justify-center space-x-1'>
                                                                    {
                                                                        variant.Size?.Size
                                                                    }
                                                                </button>
                                                            </>)
                                                        ))
                                                    }
                                                </div>
                                            </>) : (<></>)

                                        }
                                    </div>
                                </div>
                                {
                                    data.ShopId != user?._id
                                    && <>
                                        <div className='flex items-center space-x-5'>
                                            <span>Quantity:</span>
                                            <div className='flex items-center space-x-4'>
                                                <button
                                                    className='p-2 text-xl bg-[#C04FD4] disabled:bg-[#C04FD480] rounded-lg'
                                                    onClick={() => { handleUpdateQuantity(-1) }}
                                                    disabled={quantity <= 1}><FaMinus /></button>
                                                <span className='text-2xl w-16 px-2 text-center'>{quantity}</span>
                                                <button
                                                    className='p-2 text-xl bg-[#C04FD4] disabled:bg-[#C04FD480] rounded-lg'
                                                    onClick={() => { handleUpdateQuantity(1) }}
                                                    disabled={quantity >= maxQuantity}><FaPlus /></button>
                                            </div>
                                        </div>
                                        <div className='py-4 grid grid-cols-2 gap-2'>
                                            <button
                                                onClick={() => handleAddCart()}
                                                className='p-3 rounded-md border border-[#18181B] hover:border-white bg-[#18181B] flex items-center justify-center space-x-2'>
                                                <FaCartPlus />

                                                <span>Add to cart</span>
                                            </button>
                                            <button
                                                onClick={() => handleBuyNow()}
                                                className='p-3 rounded-md border border-[#C04FD4] hover:border-white bg-[#C04FD4] text-center'>
                                                <span>Buy now</span>
                                            </button>
                                        </div>
                                    </>
                                }

                            </div>
                        </div>
                        <ProductFooter data={data.Shop || null} />
                        <ProductDescription description={data.Description || ""} />
                        <RatingOfProduct id={data.Id || ""} />
                    </div >
                ) : (<>
                    <p>None data</p>
                </>)
            }
        </>
    )
}

export default ProductInfo
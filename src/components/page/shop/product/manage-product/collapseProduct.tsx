"use client";

import LoadingItem from '@/components/page/shop/loading/loadingItem';
import { AuthContext } from '@/context/AuthContext';
import { sendRequest } from '@/utils/api';
import { formatDateTimeVn } from '@/utils/utils';
import { Collapse, CollapseProps, Descriptions, Image, List } from 'antd';
import React, { useContext, useEffect, useState } from 'react'

const CollapseOptionProduct = ({ id }: Id) => {
  const { accessToken } = useContext(AuthContext) ?? {};
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState<IProductOption[]>([]);
  const [sizeMap, setSizeMap] = useState<Record<string, string>>({});

  const getOptions = async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const res = await sendRequest<IListOdata<IProductOption>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}/odata/product-option`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        queryParams: {
          $filter: `ProductId eq '${id}'`,
          $expand: "ProductVariants"
        }
      });

      if (res.value) {
        setOptions(res.value);
        await fetchSizeNames(res.value);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {


    getOptions();
  }, [accessToken, id]);

  const fetchSizeNames = async (options: IProductOption[]) => {
    if (!accessToken) return;

    const sizeIds = new Set<string>();
    options.forEach(opt => {
      opt.ProductVariants?.forEach(variant => {
        if (variant.SizeId) sizeIds.add(variant.SizeId);
      });
    });

    const entries: [string, string][] = await Promise.all(
      Array.from(sizeIds).map(async (sizeId) => {
        try {
          const res = await sendRequest<IOdataRes<CategorySize>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}/odata/product-size/${sizeId}`,
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            }
          });
          return [sizeId, res.value?.size || "Unknown"];
        } catch {
          return [sizeId, "Unknown"];
        }
      })
    );

    setSizeMap(Object.fromEntries(entries));
  };

  const optionDetail = (option: IProductOption) => (
    <div>
      {
        option.ProductVariants.length > 0 ?
          (
            <>
              <div className='space-y-2'>
                <Descriptions
                  title="Option Details"
                  bordered
                  size="small"
                  column={1}
                >
                  <Descriptions.Item label="Color">{option.Color || '—'}</Descriptions.Item>
                  <Descriptions.Item label="Type">{option.Type || '—'}</Descriptions.Item>
                  <Descriptions.Item label="Created At">{formatDateTimeVn(option.CreateAt?.toString() || "") || '—'}</Descriptions.Item>
                  <Descriptions.Item label="Image">
                    {option.Image ? (
                      <Image
                        src={option.Image}
                        alt="Option Image"
                        style={{ maxWidth: 120, borderRadius: 6 }}
                      />
                    ) : (
                      <span style={{ color: '#aaa' }}>No image</span>
                    )}
                  </Descriptions.Item>
                </Descriptions>
                <div className=''>
                  <p>Variants:</p>
                  <List
                    dataSource={option.ProductVariants || []}
                    locale={{ emptyText: 'No variants available.' }}
                    renderItem={(variant) => (
                      <List.Item
                      >
                        <List.Item.Meta
                          title={
                            <span>
                              <strong>Size:</strong> {sizeMap[variant.SizeId!] || 'Unknown'}
                            </span>
                          }
                          description={
                            <div className="text-sm text-gray-700 space-y-1">
                              <div><strong>Price:</strong> {variant.Price?.toLocaleString()}₫</div>
                              <div><strong>Quantity:</strong> {variant.Quantity ?? '—'}</div>
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </div>
              </div>
            </>
          ) : (
            <>

            </>
          )
      }
    </div>

  );

  const optionItems: CollapseProps['items'] = options.map((option, index) => (
    {
      key: option?.Id || index,
      label: `Option: ${option?.Color || option?.Type} `,
      children: optionDetail(option)
    }
  ))

  if (loading)
    return (
      <LoadingItem notifyLoading='Loading product option' />
    )

  return (
    <Collapse items={optionItems} bordered={false} defaultActiveKey={['1']} />
  )
}

export default CollapseOptionProduct
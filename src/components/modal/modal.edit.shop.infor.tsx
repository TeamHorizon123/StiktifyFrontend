"use client";

import { AuthContext } from '@/context/AuthContext';
import { sendRequest } from '@/utils/api';
import { LoadingOutlined } from '@ant-design/icons';
import { Form, Input, message, Select, Spin } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useContext, useEffect, useState } from 'react'

const { Option } = Select;

interface Ward {
  ward_code: string;
  ward_name: string;
}

interface Province {
  code: string;
  name: string;
  wards: Ward[];
}

interface UpdateData {
  shopData: Shop,
  showModal: () => void
  loadData: () => void
}

const ModalEditShop = ({ shopData, showModal, loadData }: UpdateData) => {

  const { accessToken } = useContext(AuthContext) ?? {};
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [selectedWards, setSelectedWards] = useState<Ward[]>([]);

  useEffect(() => {
    fetch('/VN_Location.json')
      .then(res => res.json())
      .then((data: Province[]) => {
        const dataSort = (data || []).sort((a, b) =>
          a.name.localeCompare(b.name, 'vi'));
        setProvinces(dataSort);
      });
  }, []);

  useEffect(() => {
    if (shopData.Address) {
      const parts = shopData.Address.split(',');
      form.setFieldsValue({
        ShopName: shopData.ShopName,
        Phone: shopData.Phone,
        Province: parts.at(-1)?.trim(),
        Ward: parts.at(-2)?.trim(),
        Address: parts.slice(0, -2).map(p => p.trim()),
        Description: shopData.Description
      })

      const selectedProvince = provinces.find(p => p.name === parts.at(-1)?.trim());
      const sortedWards = (selectedProvince?.wards || []).sort((a, b) =>
        a.ward_name.localeCompare(b.ward_name, 'vi')
      );
      setSelectedWards(sortedWards);
    }

  }, [shopData, provinces]);

  const handleUpdate = async () => {
    const formData = form.getFieldsValue();
    try {
      setLoading(true);
      const payload = {
        Id: shopData.Id,
        UserId: shopData.UserId,
        ShopName: formData.ShopName,
        Description: formData.Description,
        AvatarUri: shopData.AvatarUri,
        Email: shopData.Email,
        Phone: formData.Phone,
        Status: shopData.Status,
        Address: `${formData.Address}, ${formData.Ward}, ${formData.Province}`,
        ShopType: shopData.ShopType
      }

      const res = await sendRequest<IOdataRes<Shop>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}/odata/shop/${shopData.Id}`,
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: payload
      })

      if (res.value) message.success("Update store information success!");
    } catch (error) {
      message.error('Update store information fail!');
      console.error("error fetch data", error);
    } finally {
      setLoading(false);
      loadData();
      showModal();
    }
  }

  if (loading)
    return (
      <>
        <div className='flex flex-col items-center w-full '>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
          <span>Updating...</span>
        </div>
      </>
    )

  return (
    <div>
      <Form
        layout='horizontal'
        form={form}
        labelCol={{ span: 4 }}
        clearOnDestroy={true}>
        <Form.Item style={{ marginBottom: 0 }}>
          <Form.Item
            name={'ShopName'}
            style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
            rules={[{ required: true, message: 'Receiver Name is required.' }]}>
            <Input placeholder='Receiver Name' maxLength={50} />
          </Form.Item>
          <Form.Item
            name={'Phone'}
            style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
            rules={[{ required: true, message: 'Phone number is required.' },
            { pattern: /^[0-9]{9,15}$/, message: 'Invalid phone number.' }
            ]}>
            <Input placeholder='Phone number' maxLength={15} />
          </Form.Item>
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Form.Item
            name={'Province'}
            style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
            rules={[{ required: true, message: 'Province/City is required.' }]}>
            <Select allowClear showSearch
              // onChange={handleProvinceChange} 
              placeholder="Choose Province/City">
              {provinces.map((province) => (
                <Option key={province.code} value={province.name}>
                  {province.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name={'Ward'}
            style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
            rules={[{ required: true, message: 'Ward/Commune is required.' }]}>
            <Select allowClear showSearch placeholder="Choose Ward/Commune" disabled={!selectedWards.length}>
              {selectedWards.map((ward) => (
                <Option key={ward.ward_code} value={ward.ward_name}>
                  {ward.ward_name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form.Item>

        <Form.Item name={'Address'} rules={[{ required: true, message: 'Specific address is required.' }]}>
          <Input placeholder='Specific address' />
        </Form.Item>

        <Form.Item name={"Description"} rules={[{ required: true, message: 'Description is required.' }]}>
          <TextArea placeholder='Note' rows={4} />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Form.Item
            style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}>
          </Form.Item>
          <Form.Item
            style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}>
            <div className="flex justify-end gap-2">
              <button
                onClick={showModal}
                className="bg-gray-300 hover:bg-gray-400 text-black rounded-lg px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                // loading={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2"
              >
                Save
              </button>
            </div>
          </Form.Item>
        </Form.Item>
      </Form>

    </div>
  )
}

export default ModalEditShop
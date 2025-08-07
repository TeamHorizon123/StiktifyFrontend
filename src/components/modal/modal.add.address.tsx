"use client";

import { AuthContext } from '@/context/AuthContext'
import { sendRequest } from '@/utils/api';
import { LoadingOutlined } from '@ant-design/icons';
import { Form, Input, Select, Spin } from 'antd';
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

const ModalAddAddress = ({ showModal }:
    { showModal: () => void }) => {
    const { accessToken, user } = useContext(AuthContext) ?? {};
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

    const handleProvinceChange = (provinceCode: string) => {
        const selectedProvince = provinces.find(p => p.name === provinceCode);
        const sortedWards = (selectedProvince?.wards || []).sort((a, b) =>
            a.ward_name.localeCompare(b.ward_name, 'vi')
        );
        setSelectedWards(sortedWards);
        form.setFieldsValue({ Ward: undefined });
    };


    const handleCreateAddress = async () => {
        const formData = form.getFieldsValue();
        // console.log(formData);
        try {
            // setLoading(true);
            if (!user || !formData.Receiver || !formData.PhoneReceive) return;
            const payload = {
                UserId: user?._id,
                Receiver: formData.Receiver,
                PhoneReceive: formData.PhoneReceive,
                Address: `${formData.Address}, ${formData.Ward}, ${formData.Province}`,
                Note: formData.Note
            }

            await sendRequest<ICreateResponse>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_SHOP_URL}/odata/user-address`,
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: payload
            })
        } catch {
        } finally {
            setLoading(false);
            showModal();
        }
    }

    if (loading)
        return (
            <>
                <div className='flex flex-col items-center w-full '>
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
                    <span>Creating...</span>
                </div>
            </>
        )

    return (
        <>
            <Form
                layout='horizontal'
                form={form}
                labelCol={{ span: 4 }}
                clearOnDestroy={true}>
                <Form.Item style={{ marginBottom: 0 }}>
                    <Form.Item
                        name={'Receiver'}
                        style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
                        rules={[{ required: true, message: 'Receiver Name is required.' }]}>
                        <Input placeholder='Receiver Name' maxLength={50} />
                    </Form.Item>
                    <Form.Item
                        name={'PhoneReceive'}
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
                        <Select allowClear showSearch onChange={handleProvinceChange} placeholder="Choose Province/City">
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

                <Form.Item name={"Note"}>
                    <TextArea placeholder='Note' rows={2} />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0 }}>
                    <Form.Item
                        style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}>
                    </Form.Item>
                    <Form.Item
                        style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}>
                        <button
                            type='submit'
                            onClick={() => handleCreateAddress()}
                            className='w-full p-2 text-white bg-[#454B79] hover:bg-[#555d95] rounded'>
                            Finish
                        </button>
                    </Form.Item>
                </Form.Item>
            </Form>
        </>
    )
}

export default ModalAddAddress
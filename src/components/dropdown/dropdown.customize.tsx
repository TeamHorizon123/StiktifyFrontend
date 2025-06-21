import React, { ReactNode } from 'react';
import type { MenuProps } from 'antd';
import { Button, Dropdown, Select, Space } from 'antd';

interface IProps {
    title?: string,
    icon?: ReactNode,
    selected: string,
    setSelect: any,
    data: { value: string, title: string }[] | []
}

const DropdownCustomize: React.FC<IProps> = (props) => {
    const { icon, title, selected, setSelect, data } = props
    const { Option } = Select;

    return (
        <Select defaultValue="filter" menuItemSelectedIcon={icon} style={{ width: 120 }} onChange={setSelect}>
            <Option value="filter" disabled>{title}</Option>
            <Option value="" >None</Option>
            {data && data.length > 0 && data.map((item, index) => (
                <Option key={index} value={item.value}>{item.title}</Option>
            ))}
        </Select>
    )
}

export default DropdownCustomize;
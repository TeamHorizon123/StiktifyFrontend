'use client'
import { Select } from "antd";
import { FaFilter } from "react-icons/fa6";
import React from "react";

// interface IProps {
//   title?: string;
//   icon?: ReactNode;
//   selected: string;
//   setSelect: any;
// }

const DropdownFilterProduct = () => {
    // const { icon, title, selected, setSelect } = props;
    const { Option } = Select;
    return (
        <>
            <Select
                defaultValue="filter"
                style={{ width: 120 }}
            >
                <Option value="filter" disabled>
                    <div className="flex items-center space-x-2">
                        <FaFilter />
                        <p>Filter</p>
                    </div>

                </Option>
                <Option value="">None</Option>
                <Option value="Hip Hop">Hip Hop</Option>
                <Option value="Jazz">Jazz</Option>
                <Option value="Classical">Classical</Option>
                <Option value="Electronic">Electronic</Option>
                <Option value="Country">Country</Option>
                <Option value="Reggae">Reggae</Option>
                <Option value="Blues">Blues</Option>
                <Option value="Mashup">Mashup</Option>
                <Option value="Latin">Latin</Option>
                <Option value="Cover">Cover</Option>
                <Option value="Dance">Dance</Option>
                <Option value="Guitar">Guitar</Option>
                <Option value="Japan Music">Japan Music</Option>
                <Option value="EDM">EDM</Option>
                <Option value="Game Music">Game Music</Option>
                <Option value="Movie Music">Movie Music</Option>
                <Option value="Funk">Funk</Option>
                <Option value="Rap">Rap</Option>
            </Select>
        </>
    )
}

export default DropdownFilterProduct
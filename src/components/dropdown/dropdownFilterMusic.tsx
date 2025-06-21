import React, { ReactNode } from "react";
import type { MenuProps } from "antd";
import { Button, Dropdown, Select, Space } from "antd";

interface IProps {
  title?: string;
  icon?: ReactNode;
  selected: string;
  setSelect: any;
}

const DropdownCustomizeFilterMusic: React.FC<IProps> = (props) => {
  const { icon, title, selected, setSelect } = props;
  const { Option } = Select;

  return (
    <Select
      defaultValue="filter"
      menuItemSelectedIcon={icon}
      style={{ width: 120 }}
      onChange={setSelect}
    >
      <Option value="filter" disabled>
        {title}
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
  );
};

export default DropdownCustomizeFilterMusic;

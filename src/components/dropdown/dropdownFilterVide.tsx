import React, { ReactNode } from "react";
import { Select } from "antd";

interface IProps {
  title?: string;
  icon?: ReactNode;
  selected: string;
  setSelect: (value: string) => void;
}

const DropdownCustomizeFilterVideo: React.FC<IProps> = (props) => {
  const { icon, title, selected, setSelect } = props;
  const { Option } = Select;

  return (
    <Select
      value={selected}
      menuItemSelectedIcon={icon}
      style={{ width: 120 }}
      onChange={setSelect}
    >
      <Option value="filter" disabled>
        {title ?? "Filter"}
      </Option>
      <Option value="">None</Option>
      <Option value="recent">Most Recent</Option>
      <Option value="oldest">Oldest</Option>
      <Option value="blocked">Blocked</Option>
      <Option value="flagged">Flagged</Option>
      <Option value="mostViews">Most Viewed</Option>
    </Select>
  );
};

export default DropdownCustomizeFilterVideo;

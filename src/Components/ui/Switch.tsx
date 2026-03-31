import { Switch as AntSwitch, type SwitchProps } from "antd";
import React from "react";

const CustomSwitch: React.FC<SwitchProps> = ({
  style,
  checkedChildren = "Active",
  unCheckedChildren = "Deactive",
  ...props
}) => {
  return (
    <AntSwitch
      checkedChildren={checkedChildren}
      unCheckedChildren={unCheckedChildren}
      style={{
        backgroundColor: props.checked ? "#052e16" : "#d1d5db",
        ...style,
      }}
      {...props}
    />
  );
};

export default CustomSwitch;

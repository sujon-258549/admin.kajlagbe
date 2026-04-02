import { Switch as AntSwitch, type SwitchProps } from "antd";
import React from "react";

const CustomSwitch: React.FC<SwitchProps> = ({
  style,
  checkedChildren = "Active",
  unCheckedChildren = "Inactive",
  ...props
}) => {
  const {loading} = props;
  return (
    <AntSwitch
      checkedChildren={checkedChildren}
      unCheckedChildren={unCheckedChildren}
      loading={loading}
      className="custom-switch"
      style={style}
      {...props}
    />
  );
};

export default CustomSwitch;

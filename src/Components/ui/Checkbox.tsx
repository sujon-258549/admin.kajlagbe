import { Checkbox as AntCheckbox, type CheckboxProps } from "antd";
import React from "react";

const CustomCheckbox: React.FC<CheckboxProps> = ({
  className = "",
  style,
  ...props
}) => {
  return (
    <AntCheckbox
      className={`custom-checkbox text-primary ${className}`}
      style={{
        ...style,
      }}
      {...props}
    />
  );
};

export default CustomCheckbox;

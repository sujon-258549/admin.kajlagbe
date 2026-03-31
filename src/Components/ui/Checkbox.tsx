import {
  Checkbox as AntCheckbox,
  type CheckboxProps,
  ConfigProvider,
} from "antd";
import React from "react";

const CustomCheckbox: React.FC<CheckboxProps> = ({
  className = "",
  style,
  ...props
}) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#052e16", // Primary green color
        },
      }}
    >
      <AntCheckbox
        className={`custom-checkbox text-primary ${className}`}
        style={{
          ...style,
        }}
        {...props}
      />
    </ConfigProvider>
  );
};

export default CustomCheckbox;

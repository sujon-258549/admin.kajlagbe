import { Input as AntInput, type InputProps } from "antd";
import React from "react";

interface CustomInputProps extends Omit<InputProps, "size"> {
  size?: "sm" | "md" | "lg" | "small" | "middle" | "large";
}

const CustomInput: React.FC<CustomInputProps> & {
  TextArea: typeof AntInput.TextArea;
} = ({ className = "", size, ...props }) => {
  // Map shorthand sizes to Ant Design sizes
  const antSize =
    size === "sm"
      ? "small"
      : size === "lg"
        ? "large"
        : size === "md"
          ? "middle"
          : size;

  return (
    <AntInput
      className={`custom-input rounded-lg hover:border-primary! focus:border-primary! ${className}`}
      size={antSize as any}
      {...props}
    />
  );
};

CustomInput.TextArea = AntInput.TextArea;

export default CustomInput;

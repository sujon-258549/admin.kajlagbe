import { Input as AntInput, type InputProps } from "antd";
import React from "react";

interface CustomInputProps extends Omit<InputProps, "size"> {
  size?: "sm" | "md" | "lg" | "small" | "middle" | "large";
}

const inputClassName =
  "custom-input rounded-lg hover:border-primary! focus:border-primary!";

function mapAntSize(size: CustomInputProps["size"]) {
  return size === "sm"
    ? "small"
    : size === "lg"
      ? "large"
      : size === "md"
        ? "middle"
        : size;
}

const CustomInput: React.FC<CustomInputProps> & {
  TextArea: typeof AntInput.TextArea;
  Password: React.FC<CustomInputProps>;
} = ({ className = "", size, ...props }) => {
  const antSize = mapAntSize(size);

  return (
    <AntInput
      className={`${inputClassName} ${className}`}
      size={antSize as any}
      {...props}
    />
  );
};

CustomInput.TextArea = AntInput.TextArea;

CustomInput.Password = ({ className = "", size, ...props }) => {
  const antSize = mapAntSize(size);
  return (
    <AntInput.Password
      className={`${inputClassName} ${className}`}
      size={antSize as any}
      {...props}
    />
  );
};

export default CustomInput;

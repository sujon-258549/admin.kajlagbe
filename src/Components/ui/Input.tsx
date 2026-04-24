import { Input as AntInput, type InputProps } from "antd";
import React from "react";

interface CustomInputProps extends Omit<InputProps, "size"> {
  size?: "sm" | "md" | "lg" | "small" | "middle" | "large";
}

const inputClassName =
  "custom-input rounded-md hover:border-primary! focus:border-primary!";

const sizeHeightClasses = {
  sm: "h-6",
  md: "h-8",
  lg: "h-10",
  small: "h-6",
  middle: "h-8",
  large: "h-10",
};

function mapAntSize(size: CustomInputProps["size"]) {
  return size === "sm"
    ? "small"
    : size === "lg"
      ? "large"
      : size === "md"
        ? "middle"
        : size || "middle";
}

const CustomInput: React.FC<CustomInputProps> & {
  TextArea: typeof AntInput.TextArea;
  Password: React.FC<CustomInputProps>;
} = ({ className = "", size = "md", ...props }) => {
  const antSize = mapAntSize(size);
  const heightClass = sizeHeightClasses[size as keyof typeof sizeHeightClasses] || "h-8";

  return (
    <AntInput
      className={`${inputClassName} ${heightClass} ${className}`}
      size={antSize as any}
      {...props}
    />
  );
};

CustomInput.TextArea = AntInput.TextArea;

CustomInput.Password = ({ className = "", size = "md", ...props }) => {
  const antSize = mapAntSize(size);
  const heightClass = sizeHeightClasses[size as keyof typeof sizeHeightClasses] || "h-8";

  return (
    <AntInput.Password
      className={`${inputClassName} ${heightClass} ${className}`}
      size={antSize as any}
      {...props}
    />
  );
};

export default CustomInput;

import { Select as AntSelect, type SelectProps } from "antd";

interface CustomSelectProps extends Omit<SelectProps, "size"> {
  size?: "sm" | "md" | "lg" | "small" | "middle" | "large";
}

const sizeHeightClasses = {
  sm: "h-6",
  md: "h-8",
  lg: "h-10",
  small: "h-6",
  middle: "h-8",
  large: "h-10",
};

const CustomSelect = ({ size = "md", ...props }: CustomSelectProps) => {
  // Map shorthand sizes to Ant Design sizes
  const antSize =
    size === "sm"
      ? "small"
      : size === "lg"
        ? "large"
        : size === "md"
          ? "middle"
          : size || "middle";

  const heightClass =
    props.mode === "tags" || props.mode === "multiple"
      ? ""
      : sizeHeightClasses[size as keyof typeof sizeHeightClasses] || "h-8";

  return (
    <AntSelect
      {...props}
      size={antSize as any}
      className={`custom-select rounded-md hover:border-primary! focus:border-primary! ${heightClass} ${props.className || ""}`}
      style={{
        width: "100%",
        ...props.style,
      }}
    />
  );
};

export default CustomSelect;

import { Select as AntSelect, type SelectProps } from "antd";

interface CustomSelectProps extends Omit<SelectProps, "size"> {
  size?: "sm" | "md" | "lg" | "small" | "middle" | "large";
}

const CustomSelect = ({ size, ...props }: CustomSelectProps) => {
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
    <AntSelect
      {...props}
      size={antSize as any}
      className={`custom-select hover:border-primary! focus:border-primary! ${props.className || ""}`}
      style={{
        width: "100%",
        ...props.style,
      }}
    />
  );
};

export default CustomSelect;

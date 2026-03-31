import { Button as AntButton, type ButtonProps as AntButtonProps } from "antd";
import React, { useState } from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "danger-outline"
  | "link"
  | "dashed";
type ButtonSize = "sm" | "md" | "lg" | "icon" | "icon-sm";

interface CustomButtonProps extends Omit<AntButtonProps, "size" | "variant"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

// Default (non-hover) inline styles per variant
const variantDefaultStyle: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    backgroundColor: "#052e16",
    borderColor: "#052e16",
    color: "#fff",
  },
  secondary: {
    backgroundColor: "#ff7f00",
    borderColor: "#ff7f00",
    color: "#fff",
  },
  outline: {
    backgroundColor: "transparent",
    borderColor: "#d1d5db",
    color: "#4b5563",
  },
  ghost: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    color: "#6b7280",
  },
  danger: { backgroundColor: "#f43f5e", borderColor: "#f43f5e", color: "#fff" },
  "danger-outline": {
    backgroundColor: "transparent",
    borderColor: "#f43f5e",
    color: "#f43f5e",
  },
  link: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    color: "#052e16",
    padding: 0,
    height: "auto",
  },
  dashed: {
    backgroundColor: "transparent",
    borderColor: "#d1d5db",
    color: "#4b5563",
    borderStyle: "dashed",
  },
};

// Hover inline styles per variant
const variantHoverStyle: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    backgroundColor: "#041f0e",
    borderColor: "#041f0e",
    color: "#fff",
  },
  secondary: {
    backgroundColor: "#e67300",
    borderColor: "#e67300",
    color: "#fff",
  },
  outline: {
    backgroundColor: "transparent",
    borderColor: "#052e16",
    color: "#052e16",
  },
  ghost: {
    backgroundColor: "#f9fafb",
    borderColor: "transparent",
    color: "#374151",
  },
  danger: { backgroundColor: "#e11d48", borderColor: "#e11d48", color: "#fff" },
  "danger-outline": {
    backgroundColor: "#fff1f2",
    borderColor: "#e11d48",
    color: "#e11d48",
  },
  link: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    color: "#041f0e",
    textDecoration: "underline",
  },
  dashed: {
    backgroundColor: "transparent",
    borderColor: "#052e16",
    color: "#052e16",
    borderStyle: "dashed",
  },
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs rounded-sm h-8",
  md: "px-4 py-2 text-sm rounded-sm h-10",
  lg: "px-6 py-3 text-base rounded-sm h-12",
  icon: "w-11 h-11 rounded-sm",
  "icon-sm": "w-8 h-8 rounded-sm",
};

const Button: React.FC<CustomButtonProps> = ({
  variant = "primary",
  size = "md",
  className = "",
  children,
  style,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const baseClasses =
    "transition-all font-medium flex items-center justify-center border-solid";

  const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${className}`;

  const computedStyle: React.CSSProperties = {
    ...(isHovered ? variantHoverStyle[variant] : variantDefaultStyle[variant]),
    transition: "all 0.2s ease",
    ...style, // allow external style overrides
  };

  return (
    <AntButton
      className={combinedClasses}
      style={computedStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {children}
    </AntButton>
  );
};

export default Button;

import React from "react";
import { Button } from "antd";

interface CustomActionButtonProps {
  icon?: React.ReactNode;
  text?: string;
  type?: "primary" | "default" | "dashed" | "link" | "text";
  className?: string;
  onClick?: () => void;
}

const CustomActionButton = React.forwardRef<HTMLElement, CustomActionButtonProps>(
  ({ icon, text, type = "default", className, ...props }, ref) => {
    return (
      <Button
        ref={ref as any}
        type={type}
        icon={icon}
        className={`flex items-center gap-2 ${className}`}
        {...props}
      >
        {text}
      </Button>
    );
  }
);

CustomActionButton.displayName = "CustomActionButton";

export default CustomActionButton;

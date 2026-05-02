import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBangladeshiTakaSign } from "@fortawesome/free-solid-svg-icons";

interface TakaIconProps {
  className?: string;
  size?: any;
}

const TakaIcon: React.FC<TakaIconProps> = ({ className = "", size }) => {
  return (
    <FontAwesomeIcon
      icon={faBangladeshiTakaSign}
      className={className}
      size={size}
    />
  );
};

export default TakaIcon;

import React from "react";

interface ModalHeaderProps {
  title: string;
  subTitle?: string;
  center?: boolean;
  extra?: React.ReactNode;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({
  title,
  subTitle,
  center = true,
  extra,
}) => {
  return (
    <div
      className={`pb-2 flex w-full ${
        center ? "" : ""
      }`}
    >
      <div className={center ? "flex flex-col" : ""}>
        <h3 className="text-xl font-bold text-left   text-[#1e293b]">{title}</h3>
        {subTitle && (
          <p className="text-gray-500 text-sm font-medium">{subTitle}</p>
        )}
      </div>
      {!center && extra && <div className="shrink-0">{extra}</div>}
    </div>
  );
};

export default ModalHeader;

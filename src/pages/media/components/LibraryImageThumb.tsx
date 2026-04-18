import { useState, type CSSProperties } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";

type LibraryImageThumbProps = {
  src: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
};

export function LibraryImageThumb({
  src,
  alt,
  className,
  style,
}: LibraryImageThumbProps) {
  const [broken, setBroken] = useState(false);
  if (broken) {
    return (
      <div
        className={`flex h-full w-full items-center justify-center bg-gray-100 text-gray-400 ${className ?? ""}`}
        style={style}
      >
        <FontAwesomeIcon icon={faImage} className="text-2xl opacity-50" />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      loading="lazy"
      onError={() => setBroken(true)}
    />
  );
}

import React from "react";
import { Link } from "react-router";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface PageHeaderProps {
  title: string;
  subTitle?: string;
  breadcrumb?: BreadcrumbItem[];
  extra?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subTitle,
  breadcrumb,
  extra,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
      <div>
        {breadcrumb && (
          <nav className="flex items-center gap-2 text-[12px] font-medium text-gray-500 mb-1 ">
            {breadcrumb.map((item, index) => (
              <React.Fragment key={index}>
                {item.path ? (
                  <Link
                    to={item.path}
                    className="hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span>{item.label}</span>
                )}
                {index < breadcrumb.length - 1 && (
                  <ChevronRight size={10} className="text-gray-300" />
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
        <h2 className="text-2xl font-semibold text-gray-900 tracking-tight text-nowrap">
          {title}
        </h2>
        {subTitle && <p className="text-sm text-gray-500 mt-0.5">{subTitle}</p>}
      </div>
      {extra && <div className="flex items-center gap-3 pt-1">{extra}</div>}
    </div>
  );
};

export default PageHeader;

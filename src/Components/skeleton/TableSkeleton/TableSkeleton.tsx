import { Skeleton } from "antd";

interface TableSkeletonProps {
  columns: any[];
  rowCount?: number;
}

const TableSkeleton = ({ columns, rowCount = 10 }: TableSkeletonProps) => {
  // Create skeleton columns configuration
  const skeletonColumns = columns?.map((col: any) => ({
    ...col,
    render: () => (
      <Skeleton
        key={col.key || col.dataIndex}
        title={true}
        paragraph={false}
        active
        className="my-1"
      />
    ),
  }));

  // Create dummy data for skeleton rows
  const skeletonData = Array.from({ length: rowCount }).map((_, i) => ({
    id: `skeleton-${i}`,
    _id: `skeleton-${i}`,
    key: `skeleton-${i}`,
  }));

  return { skeletonColumns, skeletonData };
};

export default TableSkeleton;

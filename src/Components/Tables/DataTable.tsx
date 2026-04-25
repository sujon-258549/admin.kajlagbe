import { Table } from "antd";
import { useEffect, useState, useRef } from "react";
import "./AntTable.css";
import TableSkeleton from "../skeleton/TableSkeleton/TableSkeleton";

export default function DataTable(props: any) {
  const {
    data,
    columns,
    rowKey,
    currentPage,
    setLimit,
    setCurrentPage,
    selectRow = false,
    isPaginate,
    showHeader,
    total,
    limit,
    isLoading = false,
    onSelectRowsChange,
    showSizeChanger = false,
    clearSelectionTrigger = false,
    expandable,
    ...rest
  } = props;

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    if (clearSelectionTrigger) {
      setSelectedRowKeys([]);
    }
  }, [clearSelectionTrigger]);

  const handleRowSelectionChange = (
    selectedRowKeys: any,
    selectedRows: any,
  ) => {
    setSelectedRowKeys(selectedRowKeys);
    if (onSelectRowsChange) {
      onSelectRowsChange(selectedRows);
    }
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: handleRowSelectionChange,
    getCheckboxProps: (record: any) => {
      return { disabled: record.name === "Disabled User", name: record.name };
    },
  };

  const tableWrapperRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    const wrapper = tableWrapperRef.current;
    if (!wrapper) return;

    const findScrollable = () => {
      return (wrapper.querySelector(".ant-table-content") ||
        wrapper.querySelector(".ant-table-body") ||
        (wrapper.firstChild as HTMLElement)) as HTMLElement;
    };

    const slider = findScrollable();
    if (!slider) return;

    let isDown = false;
    let startX: number;
    let scrollLeft: number;

    const onMouseDown = (e: MouseEvent) => {
      isDown = true;
      isDraggingRef.current = false;
      slider.style.cursor = "grabbing";
      slider.style.userSelect = "none";
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    };

    const onMouseLeave = () => {
      isDown = false;
      slider.style.cursor = "grab";
      slider.style.removeProperty("user-select");
    };

    const onMouseUp = () => {
      isDown = false;
      slider.style.cursor = "grab";
      slider.style.removeProperty("user-select");
      setTimeout(() => {
        isDraggingRef.current = false;
      }, 0);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 1;

      if (Math.abs(walk) > 5) {
        isDraggingRef.current = true;
      }
      slider.scrollLeft = scrollLeft - walk;
    };

    slider.style.cursor = "grab";
    slider.addEventListener("mousedown", onMouseDown);
    slider.addEventListener("mouseleave", onMouseLeave);
    slider.addEventListener("mouseup", onMouseUp);
    slider.addEventListener("mousemove", onMouseMove);

    return () => {
      slider.removeEventListener("mousedown", onMouseDown);
      slider.removeEventListener("mouseleave", onMouseLeave);
      slider.removeEventListener("mouseup", onMouseUp);
      slider.removeEventListener("mousemove", onMouseMove);
      slider.style.cursor = "";
      slider.style.removeProperty("user-select");
    };
  }, [data, isLoading, columns]);

  const handleOnRow = (record: any, rowIndex: number) => {
    const originalOnRowProps = rest.onRow ? rest.onRow(record, rowIndex) : {};
    return {
      ...originalOnRowProps,
      onClick: (e: any) => {
        if (isDraggingRef.current) return;
        if (originalOnRowProps.onClick) {
          originalOnRowProps.onClick(e);
        }
      },
    };
  };

  // Use the new TableSkeleton component logic
  const { skeletonColumns, skeletonData } = TableSkeleton({ 
    columns, 
    rowCount: limit || 10 
  });

  return (
    <div ref={tableWrapperRef} className="w-full">
      <Table
        {...rest}
        onRow={handleOnRow}
        className="border border-gray-200 rounded-lg overflow-hidden shadow-none custom-table"
        rowKey={rowKey ? rowKey : "_id"}
        rowSelection={selectRow && !isLoading ? rowSelection : undefined}
        dataSource={isLoading ? skeletonData : (data || [])}
        columns={isLoading ? skeletonColumns : columns}
        tableLayout="fixed"
        scroll={{ x: true }}
        expandable={expandable}
        pagination={
          isPaginate && !isLoading
            ? {
                pageSize: limit || 20,
                total: total || data?.count || data?.length || 0,
                current: currentPage,
                onChange: (page) => {
                  setCurrentPage(page);
                },
                showSizeChanger: showSizeChanger,
                pageSizeOptions: [
                  "10", "25", "50", "100", "200", "500", "1000",
                ],
                onShowSizeChange: (_current, newSize) => {
                  setLimit(newSize);
                  setCurrentPage(1);
                },
                showQuickJumper: true,
              }
            : false
        }
        showHeader={showHeader}
      />
    </div>
  );
}


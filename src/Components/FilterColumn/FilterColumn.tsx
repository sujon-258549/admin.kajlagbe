import { ColumnHeightOutlined, DownOutlined } from "@ant-design/icons";
import { Card, Dropdown } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import CustomCheckbox from "../ui/Checkbox";
import Button from "../ui/Button";

// Accepts any table column shape — title can be string or ReactNode (JSX)
interface TableColumn {
  key?: string;
  dataIndex?: string;
  title?: React.ReactNode;
  [key: string]: unknown;
}

interface ColumnFilterProps {
  tableName: string;
  columns: TableColumn[];
  onChangeSelectedKeys?: (keys: string[]) => void;
}

/** Convert a camelCase / snake_case key to a readable Title Case label */
const keyToLabel = (key: string): string =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();

const FilterColumn: React.FC<ColumnFilterProps> = ({
  tableName,
  columns,
  onChangeSelectedKeys,
}) => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  /**
   * Normalise the raw column definitions into { key, label } pairs.
   * - Skips columns without a key
   * - Uses string title if available, otherwise derives a label from the key
   */
  const normalisedColumns = useMemo(
    () =>
      columns
        .filter((col): col is TableColumn & { key: string } => !!col.key)
        .map((col) => ({
          key: col.key,
          label:
            typeof col.title === "string" ? col.title : keyToLabel(col.key),
        })),
    [columns],
  );

  // Initialize selected columns from localStorage or default to all columns
  useEffect(() => {
    if (!normalisedColumns.length) return;

    const allKeys = normalisedColumns.map((col) => col.key);
    const saved = localStorage.getItem(`table_columns_${tableName}`);
    let finalKeys: string[] = [];

    if (saved) {
      const savedKeys: string[] = JSON.parse(saved);
      const validKeys = savedKeys.filter((key) =>
        normalisedColumns.some((col) => col.key === key),
      );
      finalKeys = validKeys.length ? validKeys : allKeys;

      if (validKeys.length !== savedKeys.length) {
        localStorage.setItem(
          `table_columns_${tableName}`,
          JSON.stringify(finalKeys),
        );
      }
    } else {
      finalKeys = allKeys;
      localStorage.setItem(
        `table_columns_${tableName}`,
        JSON.stringify(finalKeys),
      );
    }

    // Only update state if different
    setSelectedKeys((prev) => {
      if (JSON.stringify(prev) !== JSON.stringify(finalKeys)) {
        onChangeSelectedKeys?.(finalKeys);
        return finalKeys;
      }
      return prev;
    });

    // Run only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (keys: string[]) => {
    setSelectedKeys(keys);
    onChangeSelectedKeys?.(keys);
    localStorage.setItem(`table_columns_${tableName}`, JSON.stringify(keys));
  };

  const allKeys = normalisedColumns.map((col) => col.key);

  const columnMenu = (
    <Card className="p-4 w-56">
      <div className="flex flex-col gap-2">
        {/* Select All */}
        <CustomCheckbox
          checked={selectedKeys.length === normalisedColumns.length}
          indeterminate={
            selectedKeys.length > 0 &&
            selectedKeys.length < normalisedColumns.length
          }
          onChange={(e) => handleChange(e.target.checked ? allKeys : [])}
        >
          Select All
        </CustomCheckbox>

        <div className="border-t border-gray-100 my-1" />

        {/* Individual columns */}
        {normalisedColumns.map((col) => (
          <CustomCheckbox
            key={col.key}
            checked={selectedKeys.includes(col.key)}
            onChange={(e) =>
              handleChange(
                e.target.checked
                  ? [...selectedKeys, col.key]
                  : selectedKeys.filter((k) => k !== col.key),
              )
            }
          >
            {col.label}
          </CustomCheckbox>
        ))}
      </div>
    </Card>
  );

  return (
    <Dropdown dropdownRender={() => columnMenu} trigger={["click"]}>
      <Button icon={<ColumnHeightOutlined />} type="default">
        Filter Columns <DownOutlined />
      </Button>
    </Dropdown>
  );
};

export default FilterColumn;

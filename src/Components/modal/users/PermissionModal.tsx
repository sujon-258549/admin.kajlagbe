import { Modal } from "antd";
import { useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import CustomButton from "../../ui/Button";
import CustomInput from "../../ui/Input";
import CustomCheckbox from "../../ui/Checkbox";
import ModalHeader from "../../common/ModalHeader";

interface PermissionModalProps {
  open: boolean;
  onClose: () => void;
  designationName: string;
}

const modules = [
  { name: "Dashboard", permissions: ["View"] },
  { name: "Employees", permissions: ["View", "Create", "Update", "Delete"] },
  { name: "Departments", permissions: ["View", "Create", "Update", "Delete"] },
  { name: "Designations", permissions: ["View", "Create", "Update", "Delete"] },
  { name: "Roles", permissions: ["View", "Create", "Update", "Delete"] },
  { name: "Permissions", permissions: ["View", "Create", "Update", "Delete"] },
  { name: "Categories", permissions: ["View", "Create", "Update", "Delete"] },
  {
    name: "SubCategories",
    permissions: ["View", "Create", "Update", "Delete"],
  },
  { name: "Subscription", permissions: ["View", "Create", "Update", "Delete"] },
  {
    name: "Job Management",
    permissions: ["View", "Create", "Update", "Delete"],
  },
  { name: "Apply Job", permissions: ["View", "Create", "Update", "Delete"] },
  { name: "Settings", permissions: ["View", "Update"] },
];

const PermissionModal = ({
  open,
  onClose,
  designationName,
}: PermissionModalProps) => {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(() =>
    modules.flatMap((m) => m.permissions.map((p) => `${m.name}-${p}`)),
  );
  const [searchQuery, setSearchQuery] = useState("");

  const togglePermission = (permId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permId)
        ? prev.filter((p) => p !== permId)
        : [...prev, permId],
    );
  };

  const isModuleSelected = (moduleName: string) => {
    const module = modules.find((m) => m.name === moduleName);
    if (!module) return false;
    return module.permissions.every((p) =>
      selectedPermissions.includes(`${moduleName}-${p}`),
    );
  };

  const toggleModule = (moduleName: string) => {
    const module = modules.find((m) => m.name === moduleName);
    if (!module) return;

    const allPerms = module.permissions.map((p) => `${moduleName}-${p}`);
    if (isModuleSelected(moduleName)) {
      setSelectedPermissions((prev) =>
        prev.filter((p) => !allPerms.includes(p)),
      );
    } else {
      setSelectedPermissions((prev) =>
        Array.from(new Set([...prev, ...allPerms])),
      );
    }
  };

  const handleSelectAllBtn = () => {
    const all = modules.flatMap((m) =>
      m.permissions.map((p) => `${m.name}-${p}`),
    );
    setSelectedPermissions(all);
  };

  const handleClearAllBtn = () => {
    setSelectedPermissions([]);
  };

  const handleGlobalToggle = (checked: boolean) => {
    if (checked) handleSelectAllBtn();
    else handleClearAllBtn();
  };

  const filteredModules = modules.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalPermissionsCount = modules.reduce(
    (acc, m) => acc + m.permissions.length,
    0,
  );
  const isAllSelected = selectedPermissions.length === totalPermissionsCount;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={onClose}
      width={900}
      centered
      closable={true}
      footer={null}
      title={
        <ModalHeader
          title="Manage Permissions"
          subTitle={`Configure access for ${designationName}`}
          center={false}
          extra={
            <CustomInput
              prefix={<SearchOutlined className="text-gray-400" />}
              placeholder="Search modules..."
              size="md"
              className="max-w-xs"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          }
        />
      }
    >
      <div className="pt-4">
        {/* Action Bar */}
        <div className="flex items-center justify-between mb-6 px-2">
          <CustomCheckbox
            className="text-gray-600 font-bold text-sm tracking-tight"
            checked={isAllSelected}
            onChange={(e: any) => handleGlobalToggle(e.target.checked)}
          >
            Select all permissions
          </CustomCheckbox>
          <div className="flex items-center gap-6">
            <span className="text-sm font-semibold text-gray-400 tracking-tight">
              {selectedPermissions.length} / {totalPermissionsCount} selected
            </span>
            <div className="flex gap-2">
              <CustomButton
                size="sm"
                variant="outline"
                onClick={handleSelectAllBtn}
              >
                Select All
              </CustomButton>
              <CustomButton
                size="sm"
                variant="outline"
                onClick={handleClearAllBtn}
              >
                Clear All
              </CustomButton>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar pb-6 px-1">
          {filteredModules.map((module) => (
            <div
              key={module.name}
              className="border border-primary/30 rounded-lg p-5 bg-white hover:border-primary hover:shadow-sm transition-all duration-300"
            >
              <div className="flex justify-between items-center mb-5">
                <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wider">
                  {module.name}
                </h4>
                <CustomCheckbox
                  checked={isModuleSelected(module.name)}
                  onChange={() => toggleModule(module.name)}
                  className="h-5 w-5 scale-125"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {module.permissions.map((perm) => {
                  const permId = `${module.name}-${perm}`;
                  const isSelected = selectedPermissions.includes(permId);
                  return (
                    <CustomButton
                      key={perm}
                      size="sm"
                      variant={isSelected ? "primary" : "outline"}
                      onClick={() => togglePermission(permId)}
                      className={!isSelected ? "bg-gray-100! border-0!" : ""}
                    >
                      {perm}
                    </CustomButton>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Final Save Button Section */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 px-2">
          <CustomButton variant="outline" onClick={onClose}>
            Cancel
          </CustomButton>
          <CustomButton variant="primary" onClick={onClose}>
            Save Permissions
          </CustomButton>
        </div>
      </div>
    </Modal>
  );
};

export default PermissionModal;

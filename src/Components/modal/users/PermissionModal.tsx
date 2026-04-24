import { Modal, Spin } from "antd";
import { useState, useEffect } from "react";
import { SearchOutlined } from "@ant-design/icons";
import CustomButton from "../../ui/Button";
import CustomInput from "../../ui/Input";
import CustomCheckbox from "../../ui/Checkbox";
import ModalHeader from "../../common/ModalHeader";
import type { TRole } from "../../types";
import { 
  useGetRolePermissionsQuery, 
  useUpdateRolePermissionsMutation 
} from "../../redux/features/rolePermissionApi/rolePermissionApi";
import { toast } from "sonner";

interface PermissionModalProps {
  open: boolean;
  onClose: () => void;
  role: TRole | null;
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
  role,
}: PermissionModalProps) => {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: permissionsData, isLoading: isFetching } = useGetRolePermissionsQuery(role?.id, {
    skip: !open || !role?.id,
  });

  const [updatePermissions, { isLoading: isUpdating }] = useUpdateRolePermissionsMutation();

  // Sync server data to local state
  useEffect(() => {
    if (permissionsData?.success && permissionsData?.data) {
      const flatPerms: string[] = [];
      permissionsData.data.forEach((item: any) => {
        item.permissions.forEach((p: string) => {
          flatPerms.push(`${item.module}-${p}`);
        });
      });
      setSelectedPermissions(flatPerms);
    } else if (!isFetching) {
      setSelectedPermissions([]);
    }
  }, [permissionsData, isFetching]);

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

  const handleSelectAllByType = (type: string) => {
    const toAdd: string[] = [];
    modules.forEach((m) => {
      if (m.permissions.includes(type)) {
        toAdd.push(`${m.name}-${type}`);
      }
    });
    setSelectedPermissions((prev) => Array.from(new Set([...prev, ...toAdd])));
  };

  const handleFullAccess = () => {
    const all = modules.flatMap((m) =>
      m.permissions.map((p) => `${m.name}-${p}`),
    );
    setSelectedPermissions(all);
  };

  const handleClearAllBtn = () => {
    setSelectedPermissions([]);
  };

  const filteredModules = modules.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalPermissionsCount = modules.reduce(
    (acc, m) => acc + m.permissions.length,
    0,
  );
  const isAllSelected = selectedPermissions.length === totalPermissionsCount;

  const handleSave = async () => {
    if (!role?.id) return;

    // Transform flat array ["Module-Perm"] into [{ module: "Module", permissions: ["Perm"] }]
    const transformedPermissions = modules.reduce((acc: any[], module) => {
      const modulePermissions = selectedPermissions
        .filter((p) => p.startsWith(`${module.name}-`))
        .map((p) => p.replace(`${module.name}-`, ""));

      if (modulePermissions.length > 0) {
        acc.push({
          module: module.name,
          permissions: modulePermissions,
        });
      }
      return acc;
    }, []);

    try {
      const res = await updatePermissions({
        roleId: role.id,
        permissions: transformedPermissions,
      }).unwrap();

      if (res?.success) {
        toast.success(res?.message || "Permissions updated successfully");
        onClose();
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update permissions");
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={handleSave}
      width={1000}
      style={{ top: 60 }}
      closable={true}
      footer={null}
      destroyOnClose
      confirmLoading={isUpdating}
      styles={{
        header: {
          padding: "20px 24px 10px",
          margin: 0,
        },
        body: {
          padding: "10px 24px 24px",
          margin: 0,
        },
      }}
      title={
        <ModalHeader
          title="Manage Permissions"
          subTitle={`Configure system access for ${role?.role || "selected role"}`}
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
      <Spin spinning={isFetching || isUpdating}>
        <div className="pt-2">
          {/* Quick Action Bar */}
          <div className="bg-gray-50/50 border border-gray-200 rounded-md p-4 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mr-2">Quick Grant:</span>
                <CustomButton variant="outline" size="sm" className="h-8 text-xs font-semibold px-4" onClick={() => handleSelectAllByType("View")}>
                  View All
                </CustomButton>
                <CustomButton variant="outline" size="sm" className="h-8 text-xs font-semibold px-4" onClick={() => handleSelectAllByType("Create")}>
                  Create All
                </CustomButton>
                <CustomButton variant="outline" size="sm" className="h-8 text-xs font-semibold px-4" onClick={() => handleSelectAllByType("Update")}>
                  Update All
                </CustomButton>
                <CustomButton variant="outline" size="sm" className="h-8 text-xs font-semibold px-4" onClick={() => handleSelectAllByType("Delete")}>
                  Delete All
                </CustomButton>
                <div className="w-px h-6 bg-gray-200 mx-2" />
                <CustomButton variant="primary" size="sm" className="h-8 text-xs font-semibold px-5" onClick={handleFullAccess}>
                  Grant Full Access
                </CustomButton>
              </div>
              
              <div className="flex items-center gap-4 ml-auto">
                <div className="text-right">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-tight">Selection Progress</span>
                  <span className="text-sm font-bold text-primary">
                    {selectedPermissions.length} / {totalPermissionsCount} Selected
                  </span>
                </div>
                <CustomButton variant="danger-outline" size="sm" className="h-8 text-xs font-semibold" onClick={handleClearAllBtn}>
                  Reset All
                </CustomButton>
              </div>
            </div>
          </div>

          {/* Global Select Header */}
          <div className="flex items-center mb-5 px-1">
            <CustomCheckbox
              className="text-gray-700 font-semibold text-sm"
              checked={isAllSelected}
              onChange={(e: any) => e.target.checked ? handleFullAccess() : handleClearAllBtn()}
            >
              Select all system permissions
            </CustomCheckbox>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-h-[50vh] overflow-y-auto pr-3 custom-scrollbar pb-4">
            {filteredModules.map((module) => (
              <div
                key={module.name}
                className="border border-gray-300 rounded-md p-5 bg-white hover:border-primary/50 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <div className="flex justify-between items-center mb-5 border-b border-gray-100 pb-3">
                  <h4 className="font-bold text-gray-800 text-[12px] uppercase tracking-wide">
                    {module.name}
                  </h4>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Module Level</span>
                    <CustomCheckbox
                      checked={isModuleSelected(module.name)}
                      onChange={() => toggleModule(module.name)}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {module.permissions.map((perm) => {
                    const permId = `${module.name}-${perm}`;
                    const isSelected = selectedPermissions.includes(permId);
                    return (
                      <CustomButton
                        key={perm}
                        variant={isSelected ? "primary" : "outline"}
                        size="sm"
                        onClick={() => togglePermission(permId)}
                        className={`h-8 px-4 text-[11px] font-semibold ${!isSelected ? "border-gray-200 text-gray-500 hover:text-primary hover:border-primary" : ""}`}
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
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-4">
            <CustomButton variant="outline" className="font-semibold px-6" onClick={onClose} disabled={isUpdating}>
              Cancel
            </CustomButton>
            <CustomButton variant="primary" className="font-semibold px-10 shadow-md" onClick={handleSave} loading={isUpdating}>
              Save Permissions
            </CustomButton>
          </div>
        </div>
      </Spin>
    </Modal>
  );
};

export default PermissionModal;

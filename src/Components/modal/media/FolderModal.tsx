import { Form, Modal } from "antd";
import { useEffect } from "react";
import ModalHeader from "../../common/ModalHeader";
import type { TFolder, TFolderCreateUpdatePayload } from "../../types";
import CustomInput from "../../ui/Input";
import CustomSelect from "../../ui/Select";
import CustomSwitch from "../../ui/Switch";

function slugFromName(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/gi, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || `folder-${Date.now()}`;
}

interface FolderModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: TFolderCreateUpdatePayload) => Promise<boolean>;
  editData?: TFolder | null;
  folderOptions: { label: string; value: string }[];
  /** Parent folder when creating (usually the folder you are viewing). */
  defaultParentId?: string;
}

const FolderModal = ({
  open,
  onClose,
  onSubmit,
  editData,
  folderOptions,
  defaultParentId,
}: FolderModalProps) => {
  const [form] = Form.useForm();

  /** Parent picker only when creating at root; hidden on edit and when parent is implicit. */
  const showParentField = !editData && !defaultParentId;

  useEffect(() => {
    if (open) {
      if (editData) {
        form.setFieldsValue({
          name: editData.name,
          status: editData.status === true,
        });
      } else {
        form.resetFields();
        if (defaultParentId) {
          form.setFieldsValue({ status: true });
        } else {
          form.setFieldsValue({ status: true, parentId: undefined });
        }
      }
    }
  }, [defaultParentId, editData, open, form]);

  const handleOk = async () => {
    const values = await form.validateFields();
    const name = String(values.name).trim();
    const uniqueSuffix = () => Date.now().toString(36);
    const parentId = editData
      ? editData.parentId ?? undefined
      : defaultParentId || values.parentId || undefined;

    const payload: TFolderCreateUpdatePayload = {
      name,
      slug: editData
        ? editData.slug?.trim() ||
          `${slugFromName(name)}-${uniqueSuffix()}`
        : `${slugFromName(name)}-${uniqueSuffix()}`,
      parentId,
      status: Boolean(values.status),
    };
    const isSuccess = await onSubmit(payload);
    if (isSuccess) {
      form.resetFields();
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      title={
        <ModalHeader
          title={editData ? "Update Folder" : "Create Folder"}
          subTitle={
            editData
              ? "Edit folder details for media management."
              : defaultParentId
                ? "This folder will be created inside the folder you currently have open."
                : "Create a folder for organizing media files."
          }
        />
      }
      okText={editData ? "Update" : "Create"}
      cancelText="Cancel"
      okButtonProps={{ className: "modal-btn-primary" }}
      cancelButtonProps={{ className: "modal-btn-outline-primary" }}
      width={530}
      centered
    >
      <Form form={form} layout="vertical" className="pt-4" initialValues={{ status: true }}>
        <Form.Item
          name="name"
          label={<span className="font-semibold text-gray-700">Folder Name</span>}
          required
          rules={[{ required: true, message: "Please enter folder name" }]}
        >
          <CustomInput placeholder="e.g., Banner, Blogs, Profiles" size="md" />
        </Form.Item>

        {showParentField ? (
          <Form.Item
            name="parentId"
            label={<span className="font-semibold text-gray-700">Parent Folder (optional)</span>}
          >
            <CustomSelect
              size="md"
              options={folderOptions}
              allowClear
              placeholder="Select parent folder"
            />
          </Form.Item>
        ) : null}

        <Form.Item
          name="status"
          valuePropName="checked"
          label={<span className="font-semibold text-gray-700">Status</span>}
        >
          <CustomSwitch
            checkedChildren="Active"
            unCheckedChildren="Inactive"
            size="default"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FolderModal;

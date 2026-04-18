import { useState } from "react";
import { Input, Modal } from "antd";
import type { TMediaImage } from "../../types";
import CustomButton from "../../ui/Button";

interface ImageRenameModalProps {
  open: boolean;
  image: TMediaImage | null;
  onClose: () => void;
  /** Trimmed name is validated in the parent; throw to keep the modal open (e.g. empty name). */
  onSave: (name: string) => Promise<void>;
  saving?: boolean;
}

/** Mounted only when `open && image`; `key={image.id}` on parent remounts for each image — no sync effect. */
function ImageRenameModalFields({
  image,
  onClose,
  onSave,
  saving,
}: {
  image: TMediaImage;
  onClose: () => void;
  onSave: (name: string) => Promise<void>;
  saving: boolean;
}) {
  const [name, setName] = useState(() => image.name);

  const handleSave = async () => {
    await onSave(name);
  };

  return (
    <>
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Image name"
        onPressEnter={() => void handleSave()}
      />
      <div className="mt-5 flex flex-wrap justify-end gap-2 border-t border-gray-100 pt-4">
        <CustomButton
          htmlType="button"
          variant="outline"
          size="sm"
          onClick={onClose}
        >
          Cancel
        </CustomButton>
        <CustomButton
          htmlType="button"
          variant="primary"
          size="sm"
          loading={saving}
          onClick={() => void handleSave()}
        >
          Save
        </CustomButton>
      </div>
    </>
  );
}

const ImageRenameModal = ({
  open,
  image,
  onClose,
  onSave,
  saving = false,
}: ImageRenameModalProps) => {
  return (
    <Modal
      title="Rename image"
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      closable
    >
      {open && image ? (
        <ImageRenameModalFields
          key={image.id}
          image={image}
          onClose={onClose}
          onSave={onSave}
          saving={saving}
        />
      ) : null}
    </Modal>
  );
};

export default ImageRenameModal;

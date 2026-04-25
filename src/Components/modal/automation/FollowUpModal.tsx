import React, { useEffect } from "react";
import { Modal, Form, Input, message } from "antd";
import { useSendIndividualFollowUpMutation } from "../../../redux/features/automationApi/automationApi";
import ModalHeader from "../../common/ModalHeader";
import CustomButton from "../../ui/Button";
import RichTextEditor from "../../ui/RichTextEditor";

interface FollowUpModalProps {
  open: boolean;
  onClose: () => void;
  userData: {
    id: string;
    name: string;
    email: string;
  } | null;
}

const FollowUpModal: React.FC<FollowUpModalProps> = ({
  open,
  onClose,
  userData,
}) => {
  const [form] = Form.useForm();
  const [sendFollowUp, { isLoading }] = useSendIndividualFollowUpMutation();

  useEffect(() => {
    if (open && userData) {
      form.setFieldsValue({
        subject: `Regarding your profile on Kaj Lagbe`,
        content: "",
      });
    } else {
      form.resetFields();
    }
  }, [open, userData, form]);

  const onFinish = async (values: any) => {
    if (!userData?.id) return;
    try {
      await sendFollowUp({
        userId: userData.id,
        subject: values.subject,
        content: values.content,
      }).unwrap();
      message.success("Follow-up email sent successfully!");
      onClose();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to send follow-up email.");
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      width={1000}
      style={{ top: 20 }}
      title={
        <ModalHeader
          title="Send Follow-up Email"
          subTitle={`Send a personalized email to ${userData?.name || "the user"}`}
        />
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          content: "",
        }}
      >
        <Form.Item
          name="subject"
          label="Subject"
          rules={[{ required: true, message: "Please enter a subject" }]}
        >
          <Input placeholder="Enter email subject" size="large" />
        </Form.Item>

        <Form.Item
          name="content"
          label="Message Content"
          rules={[{ required: true, message: "Please enter message content" }]}
          valuePropName="value"
        >
          <RichTextEditor
            value={form.getFieldValue("content")}
            onChange={(content) => form.setFieldsValue({ content })}
            placeholder="Write your professional follow-up message here..."
          />
        </Form.Item>

        <div className="flex justify-end gap-3 mt-6">
          <CustomButton variant="outline" onClick={onClose}>
            Cancel
          </CustomButton>
          <CustomButton variant="primary" htmlType="submit" loading={isLoading}>
            Send Follow-up
          </CustomButton>
        </div>
      </Form>
    </Modal>
  );
};

export default FollowUpModal;

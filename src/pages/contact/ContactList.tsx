import {  Tooltip, Popconfirm, message, Modal, Input } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faTrash,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import DataTable from "../../Components/Tables/DataTable";
import CustomButton from "../../Components/ui/Button";
import PageHeader from "../../Components/common/PageHeader";
import { useContact } from "../../apihooks/useContact";
import PageListPrint from "../../Components/common/PageListPrint";
import { useRoutePermission } from "../../utils/buttonPurmission";
import { useState, useEffect, memo } from "react";
import formatDate from "../../Components/utils/dateFormate";
import { useSocket } from "../../context/SocketContext";

const { TextArea } = Input;

// Separate component for Modal Content to prevent lag during typing
const ContactFeedbackModal = ({ 
  open, 
  onClose, 
  contact, 
  onSendFeedback 
}: { 
  open: boolean, 
  onClose: () => void, 
  contact: any, 
  onSendFeedback: (id: string, message: string) => Promise<void> 
}) => {
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (open) setFeedbackMessage("");
  }, [open]);

  const handleSend = async () => {
    if (!feedbackMessage.trim()) {
      message.warning("Please enter a feedback message");
      return;
    }
    setIsSending(true);
    try {
      await onSendFeedback(contact.id, feedbackMessage);
      setFeedbackMessage("");
    } catch  {
      // Error handled by parent
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Modal
      title="Message Details & Feedback"
      open={open}
      onCancel={onClose}
      styles={{
        mask: { backdropFilter: "blur(4px)" },
      }}
      footer={
        <div className="flex items-center justify-end gap-3">
          <CustomButton variant="outline" onClick={onClose}>
            Close
          </CustomButton>
          <CustomButton 
            variant="primary" 
            onClick={handleSend}
            loading={isSending}
            disabled={!feedbackMessage.trim()}
            icon={<FontAwesomeIcon icon={faPaperPlane} className="text-xs" />}
          >
            Send Feedback
          </CustomButton>
        </div>
      }
      width={700}
    >
      {contact && (
        <div className="space-y-6 py-4 max-h-[70vh] overflow-y-auto px-1">
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div>
              <label className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">From</label>
              <p className="text-sm font-semibold text-gray-900">{contact.name}</p>
            </div>
            <div>
              <label className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Date</label>
              <p className="text-sm text-gray-700">{formatDate(contact.createdAt)}</p>
            </div>
            <div>
              <label className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Email</label>
              <p className="text-sm text-indigo-600 font-medium">{contact.email}</p>
            </div>
            <div>
              <label className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Phone</label>
              <p className="text-sm text-gray-700">{contact.phone || "—"}</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Subject</label>
            <p className="text-base font-bold text-gray-900">{contact.subject || "No Subject"}</p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">User Message</label>
            <div className="p-4 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 whitespace-pre-wrap leading-relaxed shadow-sm">
              {contact.message}
            </div>
          </div>

          {contact.aiResponse && (
            <div className="space-y-2">
              <label className="text-[10px] text-indigo-500 uppercase font-bold tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                AI Automated Acknowledgment
              </label>
              <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-lg text-sm text-indigo-700 italic leading-relaxed">
                "{contact.aiResponse}"
              </div>
            </div>
          )}

          <hr className="border-gray-100" />

          <div className="space-y-3">
            <label className="text-[10px] text-primary uppercase font-bold tracking-wider flex items-center gap-2">
              <FontAwesomeIcon icon={faPaperPlane} className="text-[10px]" />
              Send Direct Email Feedback
            </label>
            <TextArea
              rows={4}
              placeholder="Write your professional response here..."
              value={feedbackMessage}
              onChange={(e) => setFeedbackMessage(e.target.value)}
              className="rounded-lg border-gray-200 focus:border-primary focus:ring-primary/20 transition-all text-sm p-4 bg-gray-50/30"
            />
          </div>
        </div>
      )}
    </Modal>
  );
};

// Memoized table component to prevent unnecessary updates
const ContactTable = memo(({ contacts, columns, isLoading }: any) => (
  <DataTable
    data={contacts}
    columns={columns}
    rowKey="id"
    isLoading={isLoading}
    showHeader={true}
  />
));

const ContactList = () => {
  const { can } = useRoutePermission();
  const { contacts, isLoading, deleteContact, sendFeedback, refetch } = useContact();
  const { socket } = useSocket();
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);

  useEffect(() => {
    if (socket) {
      socket.on("new-contact", () => {
        refetch();
      });

      return () => {
        socket.off("new-contact");
      };
    }
  }, [socket, refetch]);

  const handleDelete = async (id: string) => {
    try {
      await deleteContact(id).unwrap();
      message.success("Contact message deleted successfully");
      refetch();
    } catch {
      message.error("Failed to delete contact message");
    }
  };

  const handleView = (record: any) => {
    setSelectedContact(record);
    setViewModalOpen(true);
  };

  const handleSendFeedbackAction = async (id: string, feedbackMsg: string) => {
    try {
      await sendFeedback({
        id,
        data: { message: feedbackMsg },
      }).unwrap();
      message.success("Feedback sent successfully");
      refetch();
    } catch (error: any) {
      message.error(error?.data?.message || "Failed to send feedback");
      throw error;
    }
  };

  const columns = [
    {
      title: "Action",
      key: "action",
      width: 100,
      render: (_: unknown, record: any) => (
        <div className="flex items-center gap-2">
          <Tooltip title="View Message & Reply">
            <CustomButton
              variant="outline"
              size="icon-sm"
              onClick={() => handleView(record)}
              icon={<FontAwesomeIcon icon={faEye} className="text-xs" />}
            />
          </Tooltip>

          {can("delete") && (
            <Popconfirm
              title="Delete Message"
              description="Are you sure you want to delete this message?"
              onConfirm={() => handleDelete(record.id)}
              okText="Delete"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
            >
              <Tooltip title="Delete">
                <CustomButton
                  variant="danger-outline"
                  size="icon-sm"
                  icon={<FontAwesomeIcon icon={faTrash} className="text-xs" />}
                />
              </Tooltip>
            </Popconfirm>
          )}
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => (
        <span className="text-sm text-gray-600 whitespace-nowrap">
          {formatDate(date)}
        </span>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name: string) => (
        <span className="font-semibold text-gray-800 text-sm whitespace-nowrap">
          {name || "—"}
        </span>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email: string) => (
        <span className="text-sm text-gray-600 whitespace-nowrap">{email}</span>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (phone: string) => (
        <span className="text-sm text-gray-600 whitespace-nowrap">{phone || "—"}</span>
      ),
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      render: (subject: string) => (
        <span className="text-sm text-gray-800 font-medium">{subject || "—"}</span>
      ),
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      ellipsis: true,
      render: (msg: string) => (
        <span className="text-xs text-gray-500 line-clamp-1">{msg}</span>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        breadcrumb={[{ label: "Home", path: "/" }, { label: "Contact Messages" }]}
        title="Contact Messages"
        subTitle="Manage inquiries and messages from the contact form"
        extra={
          <div className="flex gap-3">
            <PageListPrint 
              tableData={contacts?.map((item: any) => ({
                Date: formatDate(item.createdAt),
                Name: item.name,
                Email: item.email,
                Phone: item.phone,
                Subject: item.subject,
                Message: item.message
              }))}
              fileName="contact-messages"
            />
          </div>
        }
      />

      <div className="h-2" />

      <div>
        <ContactTable contacts={contacts} columns={columns} isLoading={isLoading} />
      </div>

      <ContactFeedbackModal 
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        contact={selectedContact}
        onSendFeedback={handleSendFeedbackAction}
      />
    </div>
  );
};

export default ContactList;

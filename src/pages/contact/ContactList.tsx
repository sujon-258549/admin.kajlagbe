import {  Tooltip, Popconfirm, message, Modal } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import DataTable from "../../Components/Tables/DataTable";
import CustomButton from "../../Components/ui/Button";
import PageHeader from "../../Components/common/PageHeader";
import { useContact } from "../../apihooks/useContact";
import { useRoutePermission } from "../../utils/buttonPurmission";
import { useState, useEffect } from "react";
import formatDate from "../../Components/utils/dateFormate";
import { useSocket } from "../../context/SocketContext";
import { toast } from "sonner";

const ContactList = () => {
  const { can } = useRoutePermission();
  const { contacts, isLoading, deleteContact, refetch } = useContact();
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

  const columns = [
    {
      title: "Action",
      key: "action",
      width: 100,
      render: (_: unknown, record: any) => (
        <div className="flex items-center gap-2">
          <Tooltip title="View Message">
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
      />

      <div className="h-2" />

      <div className="">
        <DataTable
          data={contacts}
          columns={columns}
          rowKey="id"
          isLoading={isLoading}
          showHeader={true}
        />
      </div>

      <Modal
        title="Message Details"
        open={viewModalOpen}
        onCancel={() => setViewModalOpen(false)}
        footer={[
          <CustomButton key="close" onClick={() => setViewModalOpen(false)}>
            Close
          </CustomButton>
        ]}
        width={600}
      >
        {selectedContact && (
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 uppercase font-bold">From</label>
                <p className="text-sm font-semibold">{selectedContact.name}</p>
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase font-bold">Date</label>
                <p className="text-sm">{formatDate(selectedContact.createdAt)}</p>
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase font-bold">Email</label>
                <p className="text-sm">{selectedContact.email}</p>
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase font-bold">Phone</label>
                <p className="text-sm">{selectedContact.phone || "—"}</p>
              </div>
            </div>
            <hr className="border-gray-100" />
            <div>
              <label className="text-xs text-gray-400 uppercase font-bold">Subject</label>
              <p className="text-sm font-bold text-gray-800">{selectedContact.subject || "No Subject"}</p>
            </div>
            <div>
              <label className="text-xs text-gray-400 uppercase font-bold">Message</label>
              <div className="mt-1 p-4 bg-gray-50 rounded-sm text-sm text-gray-700 whitespace-pre-wrap min-h-[100px]">
                {selectedContact.message}
              </div>
            </div>
            {selectedContact.aiResponse && (
              <div>
                <label className="text-xs text-indigo-400 uppercase font-bold flex items-center gap-1">
                  <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></span>
                  AI Automated Feedback
                </label>
                <div className="mt-1 p-4 bg-indigo-50 border border-indigo-100 rounded-sm text-sm text-indigo-700 italic">
                  "{selectedContact.aiResponse}"
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ContactList;

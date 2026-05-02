import React from "react";
import { Button, Dropdown, Space } from "antd";
import { Printer, Download } from "lucide-react";
import { FaFileCsv, FaFilePdf } from "react-icons/fa6";
import CustomActionButton from "../Button/CustomActionButton";
import { getPrintStyles } from "../../styles/printStyles";

interface PrintGroup {
  title: string;
  tableData: any[];
  fileName: string;
}

interface PrintProps {
  tableData?: any[];
  fileName?: string;
  groups?: PrintGroup[];
  logoUrl?: string;
  backgroundImageUrl?: string;
  customText?: string;
  customIcon?: React.ReactNode;
  type?: "primary" | "default" | "dashed" | "link" | "text";
  className?: string;
}

const PageListPrint: React.FC<PrintProps> = ({
  tableData,
  fileName = "exported-data",
  groups,
  logoUrl = "/images/logo/logo.png",
  backgroundImageUrl = "/images/logo/logo2.png",
  customText,
  customIcon,
  type = "default",
  className,
}) => {
  // Core Logic for Exporting
  const runExport = (
    data: any[],
    name: string,
    type: "pdf-print" | "pdf-download" | "csv",
  ) => {
    if (!data.length) return;
    const headers = Object.keys(data[0]);

    if (type === "csv") {
      const csv = [
        headers.join(","),
        ...data.map((row) =>
          headers
            .map((h) => {
              let val = row[h] ?? "";
              if (typeof val === "string") val = val.replace(/<[^>]*>/g, "");
              return JSON.stringify(val);
            })
            .join(","),
        ),
      ].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${name}.csv`;
      link.click();
    } else if (type === "pdf-print") {
      const iframe = document.createElement("iframe");
      iframe.style.position = "fixed";
      iframe.style.right = "0";
      iframe.style.bottom = "0";
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.style.border = "0";
      document.body.appendChild(iframe);

      const tableRows = data
        .map(
          (row) =>
            `<tr>${headers
              .map((h) => {
                const val = row[h] ?? "";
                const isStatus = h.toLowerCase().includes("status");
                const isAmount = ["Amount", "Price", "Total", "Qty"].some((k) =>
                  h.toLowerCase().includes(k.toLowerCase()),
                );
                const isImage =
                  h.toLowerCase().includes("image") ||
                  (typeof val === "string" &&
                    (val.startsWith("http") || val.startsWith("/api")) &&
                    val.match(/\.(jpeg|jpg|gif|png|webp)/i));
                let content = val;
                if (isImage)
                  content = `<img src="${val}" style="width: 30px; height: 30px; object-fit: cover; border-radius: 4px;" onerror="this.src='https://via.placeholder.com/40'" />`;
                else if (
                  isStatus &&
                  typeof val === "string" &&
                  !val.includes("<span")
                ) {
                  content = `<span style="padding: 2px 6px; font-size: 10px; font-weight: bold; color: black; display: inline-block; min-width: 50px; text-align: center;">${val}</span>`;
                }
                return `<td style="border-bottom:1px solid #e5e7eb;padding:4px 6px;font-size:10px;color:#111827;${isAmount ? "text-align:right;" : ""}${isImage ? "text-align:center;" : ""}">${content}</td>`;
              })
              .join("")}</tr>`,
        )
        .join("");

      const html = `
        <html>
          <head>
            <title>${name}</title>
            <style>
              ${getPrintStyles(backgroundImageUrl)}
              th { padding: 4px 6px !important; font-size: 10px !important; }
              @media print {
                .no-print { display: none !important; }
              }
            </style>
          </head>
          <body>
            <div class="page-container">
                <div class="header">
                  <div class="header-left">
                    <img src="${logoUrl}" alt="Logo" />
                    <div class="title">${name}</div>
                  </div>
                  <div class="subtitle">Generated on: ${new Date().toLocaleString()}</div>
                </div>
                ${backgroundImageUrl ? '<div class="watermark"></div>' : ""}
                <div class="table-container">
                  <table>
                    <thead>
                      <tr>
                        ${headers
                          .map(
                            (h) =>
                              `<th style="${["Amount", "Qty", "Price"].includes(h) ? "text-align:right;" : ""}">${h}</th>`,
                          )
                          .join("")}
                      </tr>
                    </thead>
                    <tbody>${tableRows}</tbody>
                  </table>
                </div>
              </div>
            <script>
              window.focus();
              const images = document.querySelectorAll('img');
              let loaded = 0;
              let triggered = false;
              
              const doPrint = () => {
                if (triggered) return;
                triggered = true;
                window.print();
              };

              const checkReady = () => {
                loaded++;
                if (loaded >= images.length) {
                  setTimeout(doPrint, 500);
                }
              };

              if (images.length > 0) {
                images.forEach(img => {
                  if (img.complete) checkReady();
                  else {
                    img.onload = checkReady;
                    img.onerror = checkReady;
                  }
                });
                // Fail-safe: print after 5 seconds regardless
                setTimeout(doPrint, 5000);
              } else {
                setTimeout(doPrint, 500);
              }
            </script>
          </body>
        </html>
      `;

      const doc = iframe.contentWindow?.document || iframe.contentDocument;
      if (doc) {
        doc.open();
        doc.write(html);
        doc.close();
      }

      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 10000);
    } else if (type === "pdf-download") {
      const tableRows = data
        .map(
          (row) =>
            `<tr>${headers
              .map((h) => {
                const val = row[h] ?? "";
                const isStatus = h.toLowerCase().includes("status");
                const isAmount = ["Amount", "Price", "Total", "Qty"].some((k) =>
                  h.toLowerCase().includes(k.toLowerCase()),
                );
                const isImage =
                  h.toLowerCase().includes("image") ||
                  (typeof val === "string" &&
                    (val.startsWith("http") || val.startsWith("/api")) &&
                    val.match(/\.(jpeg|jpg|gif|png|webp)/i));
                let content = val;
                if (isImage)
                  content = `<img src="${val}" style="width: 30px; height: 30px; object-fit: cover; border-radius: 4px;" onerror="this.src='https://via.placeholder.com/40'" />`;
                else if (
                  isStatus &&
                  typeof val === "string" &&
                  !val.includes("<span")
                ) {
                  const colorMap: any = {
                    PENDING: "#faad14",
                    PROCESSING: "#1890ff",
                    HOLD: "#f5222d",
                    CONFIRM: "#13c2c2",
                    SHIPPED: "#722ed1",
                    DELIVERED: "#52c41a",
                    CANCELLED: "#8c8c8c",
                    ACTIVE: "#1BA143",
                    INACTIVE: "#f5222d",
                  };
                  const color = colorMap[val.toUpperCase()] || "#d9d9d9";
                  content = `<span style="padding: 2px 6px; border-radius: 999px; font-size: 10px; font-weight: bold; background-color: ${color}; color: white; border: 1px solid ${color}; display: inline-block; min-width: 50px; text-align: center;">${val}</span>`;
                }
                return `<td style="border-bottom:1px solid #e5e7eb;padding:4px 6px;font-size:10px;color:#111827;${isAmount ? "text-align:right;" : ""}${isImage ? "text-align:center;" : ""}">${content}</td>`;
              })
              .join("")}</tr>`,
        )
        .join("");

      const tableHTML = `
        <div class="page-container">
          <div class="header">
            <div class="header-left">
              <img src="${logoUrl}" alt="Logo" />
              <div class="title">${name}</div>
            </div>
            <div class="subtitle">Generated on: ${new Date().toLocaleString()}</div>
          </div>
          ${backgroundImageUrl ? '<div class="watermark"></div>' : ""}
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  ${headers
                    .map(
                      (h) =>
                        `<th style="${["Amount", "Qty", "Price"].includes(h) ? "text-align:right;" : ""}">${h}</th>`,
                    )
                    .join("")}
                </tr>
              </thead>
              <tbody>${tableRows}</tbody>
            </table>
          </div>
          <div id="page-number" class="page-number"></div>
        </div>
      `;
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = tableHTML;
      const styles = document.createElement("style");
      styles.textContent = getPrintStyles(backgroundImageUrl);
      const container = document.createElement("div");
      container.appendChild(styles);
      container.appendChild(tempDiv);

      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
      script.onload = () => {
        const options = {
          margin: [10, 10, 10, 10],
          filename: `${name}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          pagebreak: { mode: ["css", "legacy"] },
        };
        // @ts-expect-error htm12
        const pdf = html2pdf().set(options).from(container);
        pdf
          .toPdf()
          .get("pdf")
          .then((pdfDoc: any) => {
            const totalPages = pdfDoc.internal.getNumberOfPages();
            if (totalPages > 1) {
              for (let i = 1; i <= totalPages; i++) {
                pdfDoc.setPage(i);
                pdfDoc.setFontSize(10);
                pdfDoc.setTextColor(100, 100, 100);
                pdfDoc.text(
                  `Page ${i} of ${totalPages}`,
                  pdfDoc.internal.pageSize.getWidth() - 25,
                  pdfDoc.internal.pageSize.getHeight() - 10,
                );
              }
            }
            pdfDoc.save(`${name}.pdf`);
          });
      };
      document.head.appendChild(script);
    }
  };

  const renderSingleGroup = (data: any[], name: string, title?: string) => (
    <div className="flex flex-col">
      {title && (
        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-1 mb-1">
          {title}
        </div>
      )}
      <div className="flex gap-1.5 p-0.5">
        <Button
          type="primary"
          icon={<FaFilePdf size={12} />}
          size="small"
          style={{
            flex: 1,
            backgroundColor: "#1BA143",
            fontSize: "10px",
            height: "26px",
            padding: "0 8px",
          }}
          onClick={() => runExport(data, name, "pdf-print")}
        >
          Print PDF
        </Button>
        <Button
          type="primary"
          icon={<FaFileCsv size={12} />}
          size="small"
          style={{
            flex: 1,
            backgroundColor: "orange",
            fontSize: "10px",
            height: "26px",
            padding: "0 8px",
          }}
          onClick={() => runExport(data, name, "csv")}
        >
          CSV
        </Button>
        <Button
          type="default"
          icon={<Download size={11} />}
          size="small"
          style={{
            fontSize: "10px",
            height: "26px",
            width: "26px",
            padding: 0,
          }}
          onClick={() => runExport(data, name, "pdf-download")}
        />
      </div>
    </div>
  );

  const menuContent = (
    <div className="!border bg-white p-1.5 rounded-lg !border-gray-100 !shadow-lg w-[240px] mb-3 z-[9999]">
      {groups ? (
        <Space direction="vertical" size={12} style={{ width: "100%" }}>
          {groups.map((g, idx) => (
            <div key={idx}>
              {renderSingleGroup(g.tableData, g.fileName, g.title)}
            </div>
          ))}
        </Space>
      ) : (
        renderSingleGroup(tableData || [], fileName)
      )}
    </div>
  );

  return (
    <Dropdown
      trigger={["click"]}
      dropdownRender={() => menuContent}
      placement="bottomRight"
      disabled={
        tableData?.length === 0 &&
        (!groups || groups.every((g) => g.tableData.length === 0))
      }
      arrow
    >
      <CustomActionButton
        icon={customIcon === undefined ? <Printer size={16} /> : customIcon}
        type={type}
        className={className}
        text={customText || "Print"}
      />
    </Dropdown>
  );
};

export default PageListPrint;

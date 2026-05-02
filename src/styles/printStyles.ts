export const getPrintStyles = (backgroundImageUrl?: string) => `
  @media print {
    .no-print { display: none !important; }
    @page { margin: 15mm; }
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
  
  .page-container {
    padding: 0;
    color: #111827;
    position: relative;
    min-height: 100%;
  }

  ${
    backgroundImageUrl
      ? `
  .page-container::before {
    content: "";
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-30deg);
    width: 500px;
    height: 500px;
    background-image: url("${backgroundImageUrl}");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    opacity: 0.03;
    pointer-events: none;
    z-index: -1;
  }`
      : ""
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 2px solid #e5e7eb;
  }

  .header img {
    height: 40px;
    width: auto;
  }

  .header .title {
    font-size: 24px;
    font-weight: bold;
    color: #111827;
    text-transform: uppercase;
  }

  .header .subtitle {
    font-size: 12px;
    color: #6b7280;
    margin-top: 5px;
  }

  .table-container {
    width: 100%;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th {
    background-color: #f9fafb !important;
    color: #374151;
    font-weight: 600;
    text-align: left;
    text-transform: uppercase;
    border-bottom: 2px solid #e5e7eb;
  }

  td {
    border-bottom: 1px solid #f3f4f6;
  }

  .print-button {
    background-color: #1BA143;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    margin-bottom: 20px;
  }

  .page-number {
    position: fixed;
    bottom: 20px;
    right: 20px;
    font-size: 10px;
    color: #9ca3af;
  }
`;

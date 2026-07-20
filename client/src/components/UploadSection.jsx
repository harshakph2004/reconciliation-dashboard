import { useState } from "react";
import api from "../services/api";

function UploadSection() {
  const [orderFile, setOrderFile] = useState(null);
  const [paymentFile, setPaymentFile] = useState(null);

  const uploadOrders = async () => {
    if (!orderFile) {
      alert("Please select Orders CSV");
      return;
    }

    const formData = new FormData();
    formData.append("file", orderFile);

    try {
      const res = await api.post("/upload/orders", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert(res.data.message);

      // Refresh dashboard
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Order upload failed");
    }
  };

  const uploadPayments = async () => {
    if (!paymentFile) {
      alert("Please select Payments CSV");
      return;
    }

    const formData = new FormData();
    formData.append("file", paymentFile);

    try {
      const res = await api.post("/upload/payments", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert(res.data.message);

      // Refresh dashboard
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Payment upload failed");
    }
  };

  const runReconciliation = async () => {
    try {
      const res = await api.post("/reconcile");

      alert(res.data.message);

      // Refresh dashboard
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Reconciliation failed");
    }
  };

  return (
    <>
      {/* Orders Upload */}
      <div className="card shadow p-4 mt-4">
        <h3>📤 Upload Orders CSV</h3>

        <input
          type="file"
          className="form-control mt-3"
          accept=".csv"
          onChange={(e) => setOrderFile(e.target.files[0])}
        />

        <button
          className="btn btn-success mt-3"
          onClick={uploadOrders}
        >
          Upload Orders
        </button>
      </div>

      {/* Payments Upload */}
      <div className="card shadow p-4 mt-4">
        <h3>💳 Upload Payments CSV</h3>

        <input
          type="file"
          className="form-control mt-3"
          accept=".csv"
          onChange={(e) => setPaymentFile(e.target.files[0])}
        />

        <button
          className="btn btn-primary mt-3"
          onClick={uploadPayments}
        >
          Upload Payments
        </button>
      </div>

      {/* Reconciliation */}
      <div className="card shadow p-4 mt-4 mb-5">
        <h3>⚙️ Reconciliation</h3>

        <button
          className="btn btn-danger mt-3"
          onClick={runReconciliation}
        >
          Run Reconciliation
        </button>
      </div>
    </>
  );
}

export default UploadSection;
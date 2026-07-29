import { useState } from "react";
import api from "../services/api";

function UploadSection() {
  const [orderFile, setOrderFile] = useState(null);
  const [paymentFile, setPaymentFile] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

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
      setIsRunning(true);
      const res = await api.post("/reconcile");

      alert(res.data.message);

      // Refresh dashboard
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Reconciliation failed");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <section className="workflow-card">
      <div className="section-heading">
        <div><p className="eyebrow">DATA INTAKE</p><h2>Run a reconciliation</h2><p>Upload CSV exports, then compare orders against their payments.</p></div>
        <button className="btn btn-primary" onClick={runReconciliation} disabled={isRunning}>{isRunning ? "Reconciling…" : "Run reconciliation"}</button>
      </div>
      <div className="upload-grid">
        <label className="upload-card">
          <span className="upload-icon">↑</span><strong>Orders CSV</strong><small>{orderFile ? orderFile.name : "Select an orders export"}</small>
          <input type="file" accept=".csv" onChange={(e) => setOrderFile(e.target.files[0])} />
          <button type="button" className="btn btn-outline-primary btn-sm" onClick={uploadOrders}>Upload orders</button>
        </label>
        <label className="upload-card">
          <span className="upload-icon">↓</span><strong>Payments CSV</strong><small>{paymentFile ? paymentFile.name : "Select a payments export"}</small>
          <input type="file" accept=".csv" onChange={(e) => setPaymentFile(e.target.files[0])} />
          <button type="button" className="btn btn-outline-primary btn-sm" onClick={uploadPayments}>Upload payments</button>
        </label>
        <div className="workflow-step"><span>03</span><strong>Compare records</strong><small>Detect matches, missing payments, duplicates, and amount differences.</small></div>
      </div>
    </section>
  );
}

export default UploadSection;

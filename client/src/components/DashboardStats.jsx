import { useEffect, useState } from "react";
import api from "../services/api";

function DashboardStats() {
  const [stats, setStats] = useState({
    totalResults: 0,
    matched: 0,
    discrepancies: 0,
    moneyAtRisk: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await api.get("/results");

      const results = Array.isArray(res.data) ? res.data : [];

      const matched = results.filter(
        (r) => r.issueType === "Matched"
      ).length;

      const discrepancies = results.length - matched;

      const moneyAtRisk = results.reduce((sum, r) => {
        return sum + (Number(r.orderAmount || 0) || 0);
      }, 0);

      setStats({
        totalResults: results.length,
        matched,
        discrepancies,
        moneyAtRisk,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const Card = ({ title, value, tone, helper }) => (
    <div className="col-md-6 col-xl-3">
      <div className={`metric-card ${tone}`}>
        <p>{title}</p>
        <strong>{title === "Money At Risk" ? `$${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : value}</strong>
        <small>{helper}</small>
      </div>
    </div>
  );

  return (
    <div className="row g-3 metrics-row">
      <Card title="Records reconciled" value={stats.totalResults} tone="neutral" helper="Total records reviewed" />
      <Card title="Matched" value={stats.matched} tone="success" helper="Ready to close" />
      <Card title="Exceptions" value={stats.discrepancies} tone="danger" helper="Needs review" />
      <Card title="Value reviewed" value={stats.moneyAtRisk} tone="warning" helper="Order value in results" />
    </div>
  );
}

export default DashboardStats;

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

  const Card = ({ title, value, color }) => (
    <div className="col-md-3">
      <div className={`card text-white bg-${color} mb-3 shadow`}>
        <div className="card-body text-center">
          <h6>{title}</h6>
          <h2>{title === "Money At Risk" ? `$${value}` : value}</h2>
        </div>
      </div>
    </div>
  );

  return (
    <div className="row mt-4">
      <Card title="Total Results" value={stats.totalResults} color="dark" />
      <Card title="Matched" value={stats.matched} color="success" />
      <Card title="Discrepancies" value={stats.discrepancies} color="danger" />
      <Card title="Money At Risk" value={stats.moneyAtRisk} color="warning" />
    </div>
  );
}

export default DashboardStats;
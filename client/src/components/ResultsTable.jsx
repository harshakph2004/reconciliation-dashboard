import { useEffect, useState } from "react";
import api from "../services/api";

function ResultsTable() {
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const res = await api.get("/results");
      setResults(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredResults = results.filter((row) => {
    const matchesSearch =
      (row.orderId || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (row.transactionRef || "")
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || row.issueType === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="card shadow mt-4 p-4 mb-5">
      <h3 className="mb-3">Reconciliation Results</h3>

      <div className="row mb-3">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search Order ID / Transaction Ref"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <select
            className="form-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Matched">Matched</option>
            <option value="Missing Payment">Missing Payment</option>
            <option value="Amount Mismatch">Amount Mismatch</option>
            <option value="Duplicate Payment">Duplicate Payment</option>
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>Order ID</th>
              <th>Transaction Ref</th>
              <th>Issue Type</th>
              <th>Order Amount</th>
              <th>Payment Amount</th>
              <th>Difference</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredResults.length > 0 ? (
              filteredResults.map((row) => (
                <tr key={row.id}>
                  <td>{row.orderId}</td>
                  <td>{row.transactionRef || "-"}</td>
                  <td>{row.issueType}</td>
                  <td>{Number(row.orderAmount).toFixed(2)}</td>
                  <td>
                    {row.paymentAmount == null
                      ? "-"
                      : Number(row.paymentAmount).toFixed(2)}
                  </td>
                  <td>{Number(row.difference).toFixed(2)}</td>
                  <td>
                    <span
                      className={`badge ${
                        row.status === "Matched"
                          ? "bg-success"
                          : "bg-danger"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ResultsTable;
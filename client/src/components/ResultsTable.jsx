import { useEffect, useState } from "react";
import api from "../services/api";

function ResultsTable() {
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  // AI States
  const [loadingAI, setLoadingAI] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [aiData, setAiData] = useState(null);

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

  // Explain discrepancy using AI
  const explainDiscrepancy = async (row) => {
    try {
      setLoadingAI(true);
      setShowAI(true);

      const res = await api.post("/llm/explain", {
        discrepancy: {
          orderId: row.orderId,
          transactionRef: row.transactionRef,
          issueType: row.issueType,
          orderAmount: row.orderAmount,
          paymentAmount: row.paymentAmount,
          difference: row.difference,
          status: row.status,
        },
      });

      setAiData(res.data);
    } catch (err) {
      console.error(err);

      setAiData({
        summary: "Unable to generate AI explanation.",
        possibleCause: "AI service failed.",
        recommendedAction: "Please try again later.",
        confidence: "Unknown",
      });
    } finally {
      setLoadingAI(false);
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
            <th>AI Action</th>
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

                <td>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => explainDiscrepancy(row)}
                  >
                    ✨ Explain AI
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">
                No results found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    {showAI && (
      <div className="card mt-4 border-primary">
        <div className="card-body">
          <h4 className="text-primary">AI Explanation</h4>

          {loadingAI ? (
            <div className="text-center p-3">
              <div className="spinner-border text-primary"></div>
              <p className="mt-2">Generating explanation...</p>
            </div>
          ) : (
            aiData && (
              <>
                <p>
                  <strong>Summary:</strong><br />
                  {aiData.summary}
                </p>

                <p>
                  <strong>Possible Cause:</strong><br />
                  {aiData.possibleCause}
                </p>

                <p>
                  <strong>Recommended Action:</strong><br />
                  {aiData.recommendedAction}
                </p>

                <p>
                  <strong>Confidence:</strong>{" "}
                  <span className="badge bg-info">
                    {aiData.confidence}
                  </span>
                </p>

                <button
                  className="btn btn-secondary"
                  onClick={() => setShowAI(false)}
                >
                  Close
                </button>
              </>
            )
          )}
        </div>
      </div>
    )}
  </div>
);
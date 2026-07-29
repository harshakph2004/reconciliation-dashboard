import { Fragment, useEffect, useState } from "react";
import api from "../services/api";

function ResultsTable() {
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  // AI States
  const [loadingAI, setLoadingAI] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [aiData, setAiData] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

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
      setSelectedRow(row);
      setAiData(null);

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
        summary: err.response?.data?.message || "Unable to generate an AI explanation.",
        possibleCause: "The AI service could not process this record.",
        recommendedAction: "Check the Groq API configuration and try again.",
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
  <section className="results-card">
    <div className="section-heading results-heading">
      <div><p className="eyebrow">EXCEPTION REVIEW</p><h2>Reconciliation results</h2><p>{filteredResults.length} record{filteredResults.length === 1 ? "" : "s"} shown</p></div>
    </div>

    <div className="row g-3 mb-4">
      <div className="col-md-7">
        <input
          type="text"
          className="form-control"
          placeholder="Search Order ID / Transaction Ref"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="col-md-4">
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
      <table className="table results-table">
        <thead>
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
              <Fragment key={row.id}>
                <tr>
                  <td>{row.orderId}</td>
                  <td>{row.transactionRef || "-"}</td>
                  <td><span className={`issue-pill ${row.issueType === "Matched" ? "matched" : "open"}`}>{row.issueType}</span></td>
                  <td>${Number(row.orderAmount).toFixed(2)}</td>
                  <td>{row.paymentAmount == null ? "-" : `$${Number(row.paymentAmount).toFixed(2)}`}</td>
                  <td className={Number(row.difference) === 0 ? "amount-neutral" : "amount-alert"}>${Number(row.difference).toFixed(2)}</td>
                  <td><span className={`status-pill ${row.status === "Matched" ? "matched" : "open"}`}>{row.status}</span></td>
                  <td>
                    <button className="btn btn-outline-primary btn-sm ai-button" onClick={() => explainDiscrepancy(row)}>
                      ✨ Explain AI
                    </button>
                  </td>
                </tr>

                {showAI && selectedRow?.id === row.id && (
                  <tr className="ai-detail-row">
                    <td colSpan="8">
                      <div className="ai-panel ai-inline-panel">
                        <div className="ai-panel-heading">
                          <div><p className="eyebrow">AI INVESTIGATION</p><h3>Explanation for {row.orderId}</h3></div>
                          <button className="icon-close" onClick={() => setShowAI(false)} aria-label="Close">×</button>
                        </div>
                        {loadingAI ? (
                          <div className="text-center p-3"><div className="spinner-border text-primary"></div><p className="mt-2">Analysing this discrepancy…</p></div>
                        ) : aiData && (
                          <>
                            <div className="ai-answer"><span>Summary</span><p>{aiData.summary}</p></div>
                            <div className="ai-answer"><span>Possible cause</span><p>{aiData.possibleCause}</p></div>
                            <div className="ai-answer"><span>Recommended action</span><p>{aiData.recommendedAction}</p></div>
                            <p className="confidence">Confidence <strong>{aiData.confidence}</strong></p>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center empty-state">
                No records match your current search.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

  </section>
);
}
export default ResultsTable;

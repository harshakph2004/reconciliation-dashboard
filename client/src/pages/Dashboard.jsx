import DashboardStats from "../components/DashboardStats";
import UploadSection from "../components/UploadSection";
import ResultsTable from "../components/ResultsTable";

function Dashboard() {
  const logout = () => {
    localStorage.removeItem("token");
    window.location.assign("/login");
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/dashboard"><span>R</span> Reconcile</a>
        <div className="topbar-actions">
          <span className="secure-label">● Secure workspace</span>
          <button className="text-button" onClick={logout}>Sign out</button>
        </div>
      </header>
      <main className="dashboard-content">
        <section className="dashboard-intro">
          <div>
            <p className="eyebrow">OPERATIONS OVERVIEW</p>
            <h1>Reconciliation dashboard</h1>
            <p>Review order and payment records, investigate exceptions, and keep your books in sync.</p>
          </div>
          <div className="sync-note"><span>●</span> Live reconciliation workspace</div>
        </section>
        <DashboardStats />
        <UploadSection />
        <ResultsTable />
      </main>
    </div>
  );
}

export default Dashboard;

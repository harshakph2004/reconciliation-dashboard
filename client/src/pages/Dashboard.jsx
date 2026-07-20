import DashboardStats from "../components/DashboardStats";
import UploadSection from "../components/UploadSection";
import ResultsTable from "../components/ResultsTable";

function Dashboard() {
  return (
    <div className="container mt-5">
      <h1 className="text-center text-primary mb-4">
        Reconciliation Dashboard
      </h1>

      <DashboardStats />

      <UploadSection />

      <ResultsTable />
    </div>
  );
}

export default Dashboard;
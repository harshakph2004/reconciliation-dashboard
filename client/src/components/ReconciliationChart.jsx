import api from "../services/api";

const fetchData = async () => {
  try {
    const res = await api.get("/results");

    const results = Array.isArray(res.data) ? res.data : [];

    let matched = 0;
    let missing = 0;
    let mismatch = 0;
    let duplicate = 0;

    results.forEach((item) => {
      switch (item.issueType) {
        case "Matched":
          matched++;
          break;
        case "Missing Payment":
          missing++;
          break;
        case "Amount Mismatch":
          mismatch++;
          break;
        case "Duplicate Payment":
          duplicate++;
          break;
        default:
          break;
      }
    });

    setChartData({
      labels: [
        "Matched",
        "Missing Payment",
        "Amount Mismatch",
        "Duplicate Payment",
      ],
      datasets: [
        {
          label: "Records",
          data: [matched, missing, mismatch, duplicate],
          backgroundColor: [
            "#28a745",
            "#ffc107",
            "#dc3545",
            "#0d6efd",
          ],
        },
      ],
    });
  } catch (err) {
    console.error(err);
  }
};
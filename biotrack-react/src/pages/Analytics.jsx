import { useEffect, useState } from "react";

function Analytics() {
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/samples")
      .then((response) => response.json())
      .then((data) => {
        setSamples(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Analytics fetch error:", error);
        setLoading(false);
      });
  }, []);

  const total = samples.length;

  const pending = samples.filter(
    (sample) => sample.status === "Pending"
  ).length;

  const inProgress = samples.filter(
    (sample) => sample.status === "In Progress"
  ).length;

  const completed = samples.filter(
    (sample) => sample.status === "Completed"
  ).length;

  if (loading) {
    return (
      <main>
        <h1>Analytics Dashboard</h1>
        <p>Loading analytics...</p>
      </main>
    );
  }

  return (
    <main>
      <h1>Analytics Dashboard</h1>

      <p>
        Overview of sample analysis progress from PostgreSQL.
      </p>

      <section>
        <h2>Sample Summary</h2>

        <div className="analytics-grid">

          <div className="analytics-card">
            <h3>Total Samples</h3>
            <p>{total}</p>
          </div>

          <div className="analytics-card">
            <h3>Pending</h3>
            <p>{pending}</p>
          </div>

          <div className="analytics-card">
            <h3>In Progress</h3>
            <p>{inProgress}</p>
          </div>

          <div className="analytics-card">
            <h3>Completed</h3>
            <p>{completed}</p>
          </div>

        </div>
      </section>

      <section>
        <h2>Status Distribution</h2>

        <div className="chart-row">
          <span>Pending</span>

          <div className="bar-container">
            <div
              className="bar"
              style={{
                width:
                  total > 0
                    ? `${(pending / total) * 100}%`
                    : "0%"
              }}
            />
          </div>

          <span>{pending}</span>
        </div>

        <div className="chart-row">
          <span>In Progress</span>

          <div className="bar-container">
            <div
              className="bar"
              style={{
                width:
                  total > 0
                    ? `${(inProgress / total) * 100}%`
                    : "0%"
              }}
            />
          </div>

          <span>{inProgress}</span>
        </div>

        <div className="chart-row">
          <span>Completed</span>

          <div className="bar-container">
            <div
              className="bar"
              style={{
                width:
                  total > 0
                    ? `${(completed / total) * 100}%`
                    : "0%"
              }}
            />
          </div>

          <span>{completed}</span>
        </div>
      </section>
    </main>
  );
}

export default Analytics;
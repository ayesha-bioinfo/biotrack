import { useEffect, useState } from "react";

function Researchers() {
  const [samples, setSamples] = useState([]);

  useEffect(() => {
    const savedSamples =
      JSON.parse(localStorage.getItem("samples")) || [];

    setSamples(savedSamples);
  }, []);

  // Group samples by researcher
  const researcherData = {};

  samples.forEach((sample) => {
    const name = sample.researcher?.trim();

    if (!name) {
      return;
    }

    if (!researcherData[name]) {
      researcherData[name] = {
        total: 0,
        pending: 0,
        inProgress: 0,
        completed: 0,
      };
    }

    researcherData[name].total += 1;

    if (sample.status === "Pending") {
      researcherData[name].pending += 1;
    }

    if (sample.status === "In Progress") {
      researcherData[name].inProgress += 1;
    }

    if (sample.status === "Completed") {
      researcherData[name].completed += 1;
    }
  });

  const researchers = Object.entries(researcherData);

  return (
    <main>
      <h1>Researchers</h1>

      <p>
        View researchers and their assigned samples.
      </p>

      <section>
        <h2>Researcher Overview</h2>

        {researchers.length === 0 ? (
          <p>No researchers found.</p>
        ) : (
          <div className="researcher-grid">

            {researchers.map(([name, data]) => (
              <div
                className="researcher-card"
                key={name}
              >
                <h3>{name}</h3>

                <p>
                  <strong>Total Samples:</strong>{" "}
                  {data.total}
                </p>

                <p>
                  <strong>Pending:</strong>{" "}
                  {data.pending}
                </p>

                <p>
                  <strong>In Progress:</strong>{" "}
                  {data.inProgress}
                </p>

                <p>
                  <strong>Completed:</strong>{" "}
                  {data.completed}
                </p>

              </div>
            ))}

          </div>
        )}

      </section>
    </main>
  );
}

export default Researchers;
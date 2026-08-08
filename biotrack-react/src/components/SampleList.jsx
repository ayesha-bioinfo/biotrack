function SampleList({
  samples,
  onEditSample,
  onDeleteSample
}) {

  if (samples.length === 0) {
    return (
      <section>
        <h2>Sample List</h2>
        <p>No samples added yet.</p>
      </section>
    );
  }

  return (
    <section>

      <h2>Sample List</h2>

      {samples.map(function (sample, index) {

        return (
          <div
            className="sample-card"
            key={index}
          >

            <h3>{sample.id}</h3>

            <p>
              <strong>Sample Type:</strong>{" "}
              {sample.type}
            </p>

            <p>
              <strong>Analysis:</strong>{" "}
              {sample.analysis}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {sample.status}
            </p>

            <p>
              <strong>Researcher:</strong>{" "}
              {sample.researcher}
            </p>

            <p>
              <strong>Notes:</strong>{" "}
              {sample.notes || "No notes"}
            </p>

            <button
              className="edit-btn"
              onClick={() => onEditSample(index)}
            >
              Edit
            </button>

            <button
              className="delete-btn"
              onClick={() => onDeleteSample(index)}
            >
              Delete
            </button>

          </div>
        );
      })}

    </section>
  );
}

export default SampleList;
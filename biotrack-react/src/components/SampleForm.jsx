import { useEffect, useState } from "react";

function SampleForm({ onAddSample, editingSample }) {
  const [sampleId, setSampleId] = useState("");
  const [sampleType, setSampleType] = useState("Tumor");
  const [analysisType, setAnalysisType] = useState("RNA-seq");
  const [status, setStatus] = useState("Pending");
  const [researcher, setResearcher] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (editingSample) {
      setSampleId(editingSample.id);
      setSampleType(editingSample.type);
      setAnalysisType(editingSample.analysis);
      setStatus(editingSample.status);
      setResearcher(editingSample.researcher);
      setNotes(editingSample.notes);
    }
  }, [editingSample]);

  function handleSubmit(event) {
    event.preventDefault();

    if (sampleId.trim() === "") {
      alert("Please enter a Sample ID.");
      return;
    }

    const sample = {
      id: sampleId,
      type: sampleType,
      analysis: analysisType,
      status: status,
      researcher: researcher,
      notes: notes
    };

    onAddSample(sample);

    setSampleId("");
    setSampleType("Tumor");
    setAnalysisType("RNA-seq");
    setStatus("Pending");
    setResearcher("");
    setNotes("");
  }

  return (
    <section>

      <h2>
        {editingSample ? "Edit Sample" : "Add New Sample"}
      </h2>

      <form onSubmit={handleSubmit}>

        <label>Sample ID</label>
        <input
          type="text"
          placeholder="e.g. COAD-001"
          value={sampleId}
          onChange={(event) =>
            setSampleId(event.target.value)
          }
        />

        <label>Sample Type</label>
        <select
          value={sampleType}
          onChange={(event) =>
            setSampleType(event.target.value)
          }
        >
          <option>Tumor</option>
          <option>Normal</option>
          <option>Blood</option>
        </select>

        <label>Analysis Type</label>
        <select
          value={analysisType}
          onChange={(event) =>
            setAnalysisType(event.target.value)
          }
        >
          <option>RNA-seq</option>
          <option>DEG Analysis</option>
          <option>Pathway Analysis</option>
          <option>Other</option>
        </select>

        <label>Status</label>
        <select
          value={status}
          onChange={(event) =>
            setStatus(event.target.value)
          }
        >
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>

        <label>Researcher Name</label>
        <input
          type="text"
          placeholder="Enter researcher name"
          value={researcher}
          onChange={(event) =>
            setResearcher(event.target.value)
          }
        />

        <label>Notes</label>
        <textarea
          placeholder="Optional notes"
          value={notes}
          onChange={(event) =>
            setNotes(event.target.value)
          }
        />

        <button type="submit">
          {editingSample
            ? "Update Sample"
            : "Add Sample"}
        </button>

      </form>

    </section>
  );
}

export default SampleForm;
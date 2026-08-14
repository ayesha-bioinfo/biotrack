import { useEffect, useState } from "react";

function SampleForm({ onAddSample, editingSample }) {
  const [sampleId, setSampleId] = useState("");
  const [sampleType, setSampleType] = useState("Tumor");
  const [analysisType, setAnalysisType] = useState("RNA-seq");
  const [status, setStatus] = useState("Pending");
  const [researcher, setResearcher] = useState("");

  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState("");

  // =========================
  // LOAD PROJECTS
  // =========================
  useEffect(() => {
    fetch("http://localhost:5000/api/projects")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Could not load projects");
        }

        return response.json();
      })
      .then((data) => {
        setProjects(data);
      })
      .catch((error) => {
        console.error(
          "Project loading error:",
          error
        );
      });
  }, []);

  // =========================
  // LOAD SAMPLE FOR EDITING
  // =========================
  useEffect(() => {
    if (editingSample) {
      setSampleId(editingSample.id || "");
      setSampleType(editingSample.type || "Tumor");
      setAnalysisType(editingSample.analysis || "RNA-seq");
      setStatus(editingSample.status || "Pending");
      setResearcher(editingSample.researcher || "");

      setProjectId(
        editingSample.projectId
          ? String(editingSample.projectId)
          : ""
      );
    }
  }, [editingSample]);

  // =========================
  // SUBMIT FORM
  // =========================
  function handleSubmit(event) {
    event.preventDefault();

    if (sampleId.trim() === "") {
      alert("Please enter a Sample ID.");
      return;
    }

    if (!projectId) {
      alert("Please select a research project.");
      return;
    }

    const sample = {
      id: sampleId.trim(),
      type: sampleType,
      analysis: analysisType,
      status,
      researcher: researcher.trim(),
      notes: null,
      projectId: Number(projectId)
    };

    onAddSample(sample);

    setSampleId("");
    setSampleType("Tumor");
    setAnalysisType("RNA-seq");
    setStatus("Pending");
    setResearcher("");
    setProjectId("");
  }

  return (
    <section className="sample-form-content">

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
          <option value="Tumor">Tumor</option>
          <option value="Normal">Normal</option>
          <option value="Blood">Blood</option>
        </select>

        <label>Research Project</label>
        <select
          value={projectId}
          onChange={(event) =>
            setProjectId(event.target.value)
          }
        >
          <option value="">
            Select Project
          </option>

          {projects.map((project) => (
            <option
              key={project.id}
              value={project.id}
            >
              {project.projectName}
            </option>
          ))}
        </select>

        <label>Analysis Type</label>
        <select
          value={analysisType}
          onChange={(event) =>
            setAnalysisType(event.target.value)
          }
        >
          <option value="RNA-seq">RNA-seq</option>
          <option value="DEG Analysis">
            DEG Analysis
          </option>
          <option value="Pathway Analysis">
            Pathway Analysis
          </option>
          <option value="Other">Other</option>
        </select>

        <label>Status</label>
        <select
          value={status}
          onChange={(event) =>
            setStatus(event.target.value)
          }
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">
            In Progress
          </option>
          <option value="Completed">
            Completed
          </option>
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
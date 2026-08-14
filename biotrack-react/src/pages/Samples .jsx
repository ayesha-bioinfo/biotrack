import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  FlaskConical,
  Search,
  Plus,
  X,
  Snowflake,
  Dna,
  UserRound,
  FileText,
  Clock3,
  CheckCircle2,
  CircleDashed,
  Activity,
  Beaker,
  Boxes,
  ChevronRight,
  Trash2,
  Pencil,
  MapPin,
  Microscope,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import "./Samples.css";

const API_BASE = "http://localhost:5000";

function Samples() {
  const [searchParams] = useSearchParams();
  const requestedProjectId = searchParams.get("projectId");

  const [samples, setSamples] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    sampleId: "",
    sampleType: "",
    analysisType: "RNA-seq",
    status: "Pending",
    researcher: "",
    notes: "",
    projectId: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [sampleRes, projectRes] = await Promise.all([
        fetch(`${API_BASE}/api/samples`),
        fetch(`${API_BASE}/api/projects`)
      ]);

      const sampleData = sampleRes.ok ? await sampleRes.json() : [];
      const projectData = projectRes.ok ? await projectRes.json() : [];

      setSamples(Array.isArray(sampleData) ? sampleData : []);
      setProjects(Array.isArray(projectData) ? projectData : []);

      if (Array.isArray(sampleData) && sampleData.length > 0) {
        setSelectedId(sampleData[0].dbId ?? sampleData[0].db_id ?? sampleData[0].id);
      }
    } catch (error) {
      console.error("Samples page loading error:", error);
    } finally {
      setLoading(false);
    }
  }

  const normalizedSamples = useMemo(() => {
    return samples.map((sample) => {
      const effectiveProjectId =
        sample.projectId ?? sample.project_id ?? null;

      const project = projects.find(
        (item) => Number(item.id) === Number(effectiveProjectId)
      );

      return {
        ...sample,
        recordKey: sample.dbId ?? sample.db_id ?? sample.id,
        displayId: sample.sampleId ?? sample.sample_id ?? sample.id ?? `S-${sample.dbId ?? sample.db_id ?? "unknown"}`,
        sampleType: sample.sampleType ?? sample.sample_type ?? sample.type ?? "Unknown",
        analysisType: sample.analysisType ?? sample.analysis_type ?? sample.analysis ?? "Not assigned",
        projectId: effectiveProjectId,
        projectName: sample.projectName ?? sample.project_name ?? project?.projectName ?? project?.project_name ?? "Unassigned project",
        projectCode: sample.projectCode ?? sample.project_code ?? project?.projectCode ?? project?.project_code ?? "—",
        researcher: sample.researcher || "Unassigned",
        status: sample.status || "Pending",
        notes: sample.notes || "No notes added",
        createdAt: sample.createdAt ?? sample.created_at ?? null
      };
    });
  }, [samples, projects]);

  const filteredSamples = useMemo(() => {
    const q = search.trim().toLowerCase();

    return normalizedSamples.filter((sample) => {
      const matchesSearch =
        !q ||
        [
          sample.displayId,
          sample.sampleType,
          sample.analysisType,
          sample.researcher,
          sample.projectName,
          sample.projectCode
        ].some((value) => String(value || "").toLowerCase().includes(q));

      const matchesStatus = statusFilter === "All" || sample.status === statusFilter;
      const matchesType = typeFilter === "All" || sample.sampleType === typeFilter;
      const matchesProject =
        !requestedProjectId ||
        String(sample.projectId) === String(requestedProjectId);

      return matchesSearch && matchesStatus && matchesType && matchesProject;
    });
  }, [normalizedSamples, search, statusFilter, typeFilter, requestedProjectId]);

  const selectedSample =
    normalizedSamples.find((sample) => String(sample.recordKey) === String(selectedId)) ||
    filteredSamples[0] ||
    normalizedSamples[0] ||
    null;

  const sampleTypes = [...new Set(normalizedSamples.map((sample) => sample.sampleType))].filter(Boolean);
  const statuses = [...new Set(normalizedSamples.map((sample) => sample.status))].filter(Boolean);

  function resetForm() {
    setEditingId(null);
    setForm({
      sampleId: "",
      sampleType: "",
      analysisType: "RNA-seq",
      status: "Pending",
      researcher: "",
      notes: "",
      projectId: ""
    });
  }

  function openCreateForm() {
    resetForm();
    setShowForm(true);
  }

  function openEditForm(sample) {
    setEditingId(sample.displayId);
    setForm({
      sampleId: sample.displayId,
      sampleType: sample.sampleType,
      analysisType: sample.analysisType,
      status: sample.status,
      researcher: sample.researcher === "Unassigned" ? "" : sample.researcher,
      notes: sample.notes === "No notes added" ? "" : sample.notes,
      projectId: String(sample.projectId ?? sample.project_id ?? "")
    });
    setShowForm(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const projectIdValue = form.projectId ? Number(form.projectId) : null;

    if (
      !form.sampleId.trim() ||
      !form.sampleType.trim() ||
      !form.analysisType.trim() ||
      !form.status.trim()
    ) {
      alert("Please complete Sample ID, Sample Type, Analysis Type and Status.");
      return;
    }

    const cleanSampleId = form.sampleId.trim();
    const cleanSampleType = form.sampleType.trim();
    const cleanAnalysisType = form.analysisType.trim();
    const cleanStatus = form.status.trim();

    // The BioTrack backend has existed in more than one field-name shape
    // during development. Sending the aliases below keeps the redesigned
    // form compatible with the original API as well as the newer schema.
    const payload = {
      id: cleanSampleId,
      sampleId: cleanSampleId,
      sample_id: cleanSampleId,

      type: cleanSampleType,
      sampleType: cleanSampleType,
      sample_type: cleanSampleType,

      analysis: cleanAnalysisType,
      analysisType: cleanAnalysisType,
      analysis_type: cleanAnalysisType,

      status: cleanStatus,
      researcher: form.researcher.trim(),
      notes: form.notes.trim(),

      projectId: projectIdValue,
      project_id: projectIdValue
    };

    try {
      const url = editingId
        ? `${API_BASE}/api/samples/${encodeURIComponent(editingId)}`
        : `${API_BASE}/api/samples`;

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const responseText = await response.text();
      let responseData = null;

      try {
        responseData = responseText ? JSON.parse(responseText) : null;
      } catch {
        responseData = responseText;
      }

      if (!response.ok) {
        const serverMessage =
          responseData?.message ||
          responseData?.error ||
          (typeof responseData === "string" ? responseData : "") ||
          `Request failed with status ${response.status}`;
        throw new Error(serverMessage);
      }

      setShowForm(false);
      resetForm();
      await loadData();
    } catch (error) {
      console.error("Sample save error:", error);
      alert(
        editingId
          ? `Could not update this sample. ${error.message}`
          : `Could not add the sample. ${error.message}`
      );
    }
  }

  async function handleDelete(sample) {
    const confirmed = window.confirm(`Delete ${sample.displayId}?`);
    if (!confirmed) return;

    try {
      const response = await fetch(`${API_BASE}/api/samples/${encodeURIComponent(sample.displayId)}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Delete failed");

      await loadData();
    } catch (error) {
      console.error(error);
      alert("Could not delete this sample.");
    }
  }

  const getStatusClass = (status = "") => {
    const value = status.toLowerCase();
    if (value.includes("complete")) return "sample-status-complete";
    if (value.includes("progress") || value.includes("analysis")) return "sample-status-progress";
    return "sample-status-pending";
  };

  const getStage = (status = "") => {
    const value = status.toLowerCase();
    if (value.includes("complete")) return 4;
    if (value.includes("progress") || value.includes("analysis")) return 3;
    return 2;
  };

  if (loading) {
    return (
      <main className="samples-lab-page samples-loading">
        <div className="samples-loading-orbit"><FlaskConical size={34} /></div>
        <h1>Opening Sample Laboratory...</h1>
      </main>
    );
  }

  return (
    <main className="samples-lab-page">
      <section className="samples-lab-hero">
        <div className="samples-hero-copy">
          <span className="samples-kicker"><Sparkles size={16} /> Biological Sample Registry</span>
          <h1>Every specimen has a <span>story.</span></h1>
          <p>
            Follow each biological sample from registration to analysis without turning the page into another statistics dashboard.
            BioTrack keeps the specimen, its project, researcher, workflow and notes connected in one laboratory workspace.
          </p>
          <div className="samples-hero-actions">
            <button className="samples-primary-btn" onClick={openCreateForm}>
              <Plus size={19} /> Register New Sample
            </button>
            <div className="samples-live-note">
              <span className="samples-live-dot" /> Laboratory registry connected
            </div>
          </div>
        </div>

        <div className="specimen-stage" aria-hidden="true">
          <div className="specimen-ring ring-one" />
          <div className="specimen-ring ring-two" />
          <div className="specimen-platform" />
          <div className="vial-rack">
            {[0, 1, 2, 3, 4].map((item) => (
              <div className={`vial vial-${item + 1}`} key={item}>
                <span className="vial-cap" />
                <span className="vial-liquid" />
              </div>
            ))}
          </div>
          <div className="specimen-callout callout-a"><Snowflake size={18} /><span>Storage-aware</span></div>
          <div className="specimen-callout callout-b"><ShieldCheck size={18} /><span>Traceable</span></div>
          <div className="specimen-callout callout-c"><Microscope size={18} /><span>Analysis-ready</span></div>
        </div>
      </section>

      <section className="sample-path-section">
        <div className="sample-path-heading">
          <span>Specimen Journey</span>
          <h2>One sample. One traceable path.</h2>
          <p>Instead of more charts, this page focuses on where a specimen is and what happens next.</p>
        </div>

        <div className="sample-path">
          {[
            ["01", "Register", "Identity & metadata", FlaskConical],
            ["02", "Preserve", "Storage & handling", Snowflake],
            ["03", "Process", "Research workflow", Beaker],
            ["04", "Interpret", "Analysis outcome", Dna]
          ].map(([number, title, subtitle, Icon], index) => (
            <div className="sample-path-step" key={title}>
              <div className="sample-path-icon"><Icon size={23} /></div>
              <div><span>{number}</span><strong>{title}</strong><small>{subtitle}</small></div>
              {index < 3 && <ChevronRight className="sample-path-arrow" size={22} />}
            </div>
          ))}
        </div>
      </section>

      <section className="sample-workbench">
        <div className="sample-registry-panel-v4">
          <div className="sample-registry-toolbar-v4">
            <div className="sample-search-v4">
              <Search size={18} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search sample, project, researcher..."
              />
            </div>

            <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
              <option value="All">All sample types</option>
              {sampleTypes.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>

            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="All">All statuses</option>
              {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </div>

          <div className="sample-registry-title-row">
            <div>
              <span>Live Registry</span>
              <h2>Biological Specimens</h2>
            </div>
            <small>{filteredSamples.length} visible</small>
          </div>

          <div className="sample-list-v4">
            {filteredSamples.length === 0 ? (
              <div className="samples-empty-state">
                <FlaskConical size={34} />
                <h3>No specimens match your filters</h3>
                <p>Try another search or register a new sample.</p>
              </div>
            ) : (
              filteredSamples.map((sample, index) => (
                <article
                  key={sample.recordKey}
                  className={`sample-row-v4 ${String(selectedSample?.recordKey) === String(sample.recordKey) ? "sample-row-selected" : ""}`}
                  onClick={() => setSelectedId(sample.recordKey)}
                  style={{ animationDelay: `${Math.min(index, 8) * 55}ms` }}
                >
                  <div className="sample-row-icon"><FlaskConical size={21} /></div>

                  <div className="sample-row-main">
                    <div className="sample-row-idline">
                      <strong>{sample.displayId}</strong>
                      <span className={`sample-status-pill ${getStatusClass(sample.status)}`}>{sample.status}</span>
                    </div>
                    <p>{sample.sampleType} · {sample.analysisType}</p>
                  </div>

                  <div className="sample-row-project">
                    <span>Project</span>
                    <strong>{sample.projectName}</strong>
                  </div>

                  <div className="sample-row-researcher">
                    <span>Researcher</span>
                    <strong><UserRound size={15} /> {sample.researcher}</strong>
                  </div>

                  <div className="sample-row-actions" onClick={(event) => event.stopPropagation()}>
                    <button title="Edit" onClick={() => openEditForm(sample)}><Pencil size={16} /></button>
                    <button title="Delete" onClick={() => handleDelete(sample)}><Trash2 size={16} /></button>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>

        <aside className="sample-dossier">
          {selectedSample ? (
            <>
              <div className="dossier-top">
                <div className="dossier-icon"><FlaskConical size={24} /></div>
                <div>
                  <span>Selected Specimen</span>
                  <h2>{selectedSample.displayId}</h2>
                  <p>{selectedSample.sampleType} · {selectedSample.analysisType}</p>
                </div>
              </div>

              <div className="dossier-project">
                <span>Connected Study</span>
                <strong>{selectedSample.projectName}</strong>
                <small>{selectedSample.projectCode}</small>
              </div>

              <div className="dossier-details">
                <div><UserRound size={17} /><span><small>Researcher</small><strong>{selectedSample.researcher}</strong></span></div>
                <div><Activity size={17} /><span><small>Current status</small><strong>{selectedSample.status}</strong></span></div>
                <div><Clock3 size={17} /><span><small>Registered</small><strong>{selectedSample.createdAt ? new Date(selectedSample.createdAt).toLocaleDateString() : "Not recorded"}</strong></span></div>
                <div><MapPin size={17} /><span><small>Storage</small><strong>Record not yet added</strong></span></div>
              </div>

              <div className="dossier-workflow">
                <div className="dossier-section-heading"><span>Specimen Workflow</span><strong>Live path</strong></div>
                <div className="workflow-rail">
                  {["Registered", "Prepared", "In Analysis", "Completed"].map((label, index) => {
                    const active = index + 1 <= getStage(selectedSample.status);
                    return (
                      <div className={`workflow-node ${active ? "workflow-node-active" : ""}`} key={label}>
                        <div>{active ? <CheckCircle2 size={18} /> : <CircleDashed size={18} />}</div>
                        <span>{label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="dossier-notes">
                <div className="dossier-section-heading"><span>Research Notes</span><FileText size={17} /></div>
                <p>{selectedSample.notes}</p>
              </div>

              <button className="dossier-edit-btn" onClick={() => openEditForm(selectedSample)}>
                Open Specimen Record <ChevronRight size={18} />
              </button>
            </>
          ) : (
            <div className="dossier-empty"><Boxes size={36} /><h3>Select a specimen</h3></div>
          )}
        </aside>
      </section>

      <section className="lab-principles">
        <div><Snowflake size={24} /><span><strong>Preservation first</strong><small>Keep handling and storage visible.</small></span></div>
        <div><ShieldCheck size={24} /><span><strong>Traceable records</strong><small>Every sample stays tied to its study.</small></span></div>
        <div><Microscope size={24} /><span><strong>Workflow context</strong><small>Know exactly what happens next.</small></span></div>
      </section>

      {showForm && (
        <div className="sample-modal-backdrop" onMouseDown={() => setShowForm(false)}>
          <div className="sample-modal" onMouseDown={(event) => event.stopPropagation()}>
            <button className="sample-modal-close" onClick={() => setShowForm(false)}><X size={20} /></button>
            <span className="samples-kicker">{editingId ? "Update Specimen" : "New Specimen"}</span>
            <h2>{editingId ? "Edit sample record" : "Register biological sample"}</h2>
            <p>Capture the essential information first. Detailed storage fields can be added later without cluttering the registry.</p>

            <form onSubmit={handleSubmit} className="sample-modal-form">
              <label>Sample ID<input required value={form.sampleId} onChange={(e) => setForm({ ...form, sampleId: e.target.value })} placeholder="e.g. COAD-001" /></label>
              <label>Sample Type<input required value={form.sampleType} onChange={(e) => setForm({ ...form, sampleType: e.target.value })} placeholder="Tumor, Blood, Tissue..." /></label>
              <label>Analysis Type<select value={form.analysisType} onChange={(e) => setForm({ ...form, analysisType: e.target.value })}><option>RNA-seq</option><option>DNA-seq</option><option>Proteomics</option><option>Histology</option><option>Other</option></select></label>
              <label>Status<select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option>Pending</option><option>In Progress</option><option>Completed</option></select></label>
              <label>Researcher<input value={form.researcher} onChange={(e) => setForm({ ...form, researcher: e.target.value })} placeholder="Researcher name" /></label>
              <label>Project<select value={form.projectId} onChange={(e) => setForm({ ...form, projectId: e.target.value })}><option value="">Unassigned</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.projectName ?? project.project_name ?? `Project ${project.id}`}</option>)}</select></label>
              <label className="sample-form-full">Notes<textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Handling notes, preparation details, priority..." /></label>
              <button className="sample-save-btn" type="submit">{editingId ? "Save Changes" : "Register Sample"} <ChevronRight size={18} /></button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default Samples;
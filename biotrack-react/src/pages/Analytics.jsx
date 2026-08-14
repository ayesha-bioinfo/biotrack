import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from "recharts";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  CircleGauge,
  Dna,
  FileText,
  Filter,
  FlaskConical,
  FolderKanban,
  Lightbulb,
  Sparkles,
  TrendingUp
} from "lucide-react";
import "./Analytics.css";

const API_BASE = "http://localhost:5000";
const PIE_COLORS = ["#2f8cff", "#20d6b5", "#8b5cf6", "#f59e0b", "#ec4899", "#38bdf8"];

function normalizeSample(sample) {
  return {
    ...sample,
    id: sample.id,
    sampleId: sample.sampleId ?? sample.sample_id ?? `S-${sample.id}`,
    sampleType: sample.sampleType ?? sample.sample_type ?? sample.type ?? "Unknown",
    analysisType: sample.analysisType ?? sample.analysis_type ?? sample.analysis ?? "Unassigned",
    status: sample.status || "Pending",
    researcher: sample.researcher || "Unassigned",
    projectId: sample.projectId ?? sample.project_id ?? null,
    createdAt: sample.createdAt ?? sample.created_at ?? null
  };
}

function normalizeProject(project) {
  return {
    ...project,
    projectCode: project.projectCode ?? project.project_code ?? `PRJ-${project.id}`,
    projectName: project.projectName ?? project.project_name ?? `Project ${project.id}`,
    targetSamples: Number(project.targetSamples ?? project.target_samples ?? 0),
    status: project.status || "Unknown"
  };
}

function Analytics() {
  const [samples, setSamples] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projectFilter, setProjectFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [sampleRes, projectRes] = await Promise.all([
          fetch(`${API_BASE}/api/samples`),
          fetch(`${API_BASE}/api/projects`)
        ]);

        if (!sampleRes.ok) throw new Error("Could not load samples");
        if (!projectRes.ok) throw new Error("Could not load projects");

        const sampleData = await sampleRes.json();
        const projectData = await projectRes.json();
        setSamples((Array.isArray(sampleData) ? sampleData : []).map(normalizeSample));
        setProjects((Array.isArray(projectData) ? projectData : []).map(normalizeProject));
      } catch (error) {
        console.error("Analytics loading error:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const visibleSamples = useMemo(() => {
    return samples.filter((sample) => {
      const matchesProject = projectFilter === "All" || String(sample.projectId) === projectFilter;
      const matchesType = typeFilter === "All" || sample.sampleType === typeFilter;
      return matchesProject && matchesType;
    });
  }, [samples, projectFilter, typeFilter]);

  const sampleTypes = useMemo(() => [...new Set(samples.map((s) => s.sampleType))].filter(Boolean), [samples]);

  const stageCounts = useMemo(() => {
    const counts = { Pending: 0, "In Progress": 0, Completed: 0 };
    visibleSamples.forEach((sample) => {
      if (sample.status === "Completed") counts.Completed += 1;
      else if (sample.status === "In Progress") counts["In Progress"] += 1;
      else counts.Pending += 1;
    });
    return counts;
  }, [visibleSamples]);

  const completionRate = visibleSamples.length
    ? Math.round((stageCounts.Completed / visibleSamples.length) * 100)
    : 0;

  const analysisMix = useMemo(() => {
    const counts = {};
    visibleSamples.forEach((sample) => {
      counts[sample.analysisType] = (counts[sample.analysisType] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [visibleSamples]);

  const trendData = useMemo(() => {
    const months = {};
    visibleSamples.forEach((sample) => {
      if (!sample.createdAt) return;
      const date = new Date(sample.createdAt);
      if (Number.isNaN(date.getTime())) return;
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (!months[key]) months[key] = { month: key, Registered: 0, Completed: 0 };
      months[key].Registered += 1;
      if (sample.status === "Completed") months[key].Completed += 1;
    });

    const rows = Object.values(months).sort((a, b) => a.month.localeCompare(b.month));
    let cumulativeRegistered = 0;
    let cumulativeCompleted = 0;
    return rows.map((row) => {
      cumulativeRegistered += row.Registered;
      cumulativeCompleted += row.Completed;
      return {
        month: new Date(`${row.month}-01`).toLocaleDateString(undefined, { month: "short", year: "2-digit" }),
        Registered: cumulativeRegistered,
        Completed: cumulativeCompleted
      };
    });
  }, [visibleSamples]);

  const projectHealth = useMemo(() => {
    return projects.map((project) => {
      const projectSamples = samples.filter((s) => Number(s.projectId) === Number(project.id));
      const completed = projectSamples.filter((s) => s.status === "Completed").length;
      const assigned = projectSamples.length;
      const recruitment = project.targetSamples > 0 ? Math.min(100, Math.round((assigned / project.targetSamples) * 100)) : 0;
      const completion = assigned > 0 ? Math.round((completed / assigned) * 100) : 0;
      return { ...project, assigned, completed, recruitment, completion };
    }).sort((a, b) => b.completion - a.completion);
  }, [projects, samples]);

  const insights = useMemo(() => {
    const topProject = projectHealth[0];
    const topAnalysis = [...analysisMix].sort((a, b) => b.value - a.value)[0];
    const unassigned = visibleSamples.filter((s) => !s.projectId).length;

    return [
      {
        icon: TrendingUp,
        title: "Strongest study",
        text: topProject ? `${topProject.projectName} currently leads with ${topProject.completion}% sample completion.` : "Project completion will appear once samples are linked."
      },
      {
        icon: Dna,
        title: "Dominant workflow",
        text: topAnalysis ? `${topAnalysis.name} is the most represented analysis workflow with ${topAnalysis.value} samples.` : "No analysis workflow has been assigned yet."
      },
      {
        icon: Lightbulb,
        title: "Attention signal",
        text: unassigned > 0 ? `${unassigned} sample${unassigned === 1 ? "" : "s"} are not linked to a project and may need review.` : "Every visible sample is linked to a research project."
      }
    ];
  }, [projectHealth, analysisMix, visibleSamples]);

  function scrollToInsights() {
    document
      .getElementById("analytics-insights")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function createReport() {
    const generatedAt = new Date().toLocaleString();
    const projectLabel =
      projectFilter === "All"
        ? "All studies"
        : projects.find((p) => String(p.id) === projectFilter)?.projectName ||
          "Selected study";

    const lines = [
      "BIOTRACK RESEARCH INTELLIGENCE REPORT",
      "====================================",
      `Generated: ${generatedAt}`,
      `Study filter: ${projectLabel}`,
      `Sample type filter: ${typeFilter}`,
      "",
      `Visible samples: ${visibleSamples.length}`,
      `Pending: ${stageCounts.Pending}`,
      `In Progress: ${stageCounts["In Progress"]}`,
      `Completed: ${stageCounts.Completed}`,
      `Completion rate: ${completionRate}%`,
      "",
      "KEY INSIGHTS",
      ...insights.map((item, index) => `${index + 1}. ${item.title}: ${item.text}`),
      "",
      "PROJECT HEALTH",
      ...projectHealth.map(
        (project) =>
          `- ${project.projectName} (${project.projectCode}): ${project.completion}% complete, ${project.assigned}/${project.targetSamples || "—"} samples`
      ),
      "",
      "ANALYSIS MIX",
      ...(analysisMix.length
        ? analysisMix.map((item) => `- ${item.name}: ${item.value}`)
        : ["- No analysis data available"])
    ];

    const blob = new Blob([lines.join("\\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `BioTrack_Research_Report_${new Date()
      .toISOString()
      .slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return <main className="analytics-intel-page"><div className="analytics-loader"><BrainCircuit size={36} /><h1>Building research intelligence...</h1></div></main>;
  }

  return (
    <main className="analytics-intel-page">
      <section className="analytics-intel-hero">
        <div className="analytics-hero-copy">
          <span className="analytics-kicker"><Sparkles size={16} /> Research Intelligence</span>
          <h1>Turn operational data into <span>scientific insight.</span></h1>
          <p>
            Analytics should explain what is happening across your studies—not overwhelm you with numbers.
            BioTrack combines workflow movement, study performance and analysis patterns in one focused workspace.
          </p>
          <div className="analytics-hero-actions">
            <button className="analytics-primary-btn" type="button" onClick={scrollToInsights}><BrainCircuit size={19} /> Explore Insights</button>
            <button className="analytics-secondary-btn" type="button" onClick={createReport}><FileText size={18} /> Create Report</button>
          </div>
        </div>

        <div className="analytics-signal-stage" aria-hidden="true">
          <div className="signal-ring ring-a" />
          <div className="signal-ring ring-b" />
          <div className="signal-platform" />
          <div className="signal-bars">
            {[38, 62, 78, 104, 88, 126, 98].map((height, i) => <span key={i} style={{ height }} />)}
          </div>
          <div className="signal-callout callout-one"><Activity size={18} /> Live patterns</div>
          <div className="signal-callout callout-two"><BarChart3 size={18} /> Study comparison</div>
          <div className="signal-callout callout-three"><BrainCircuit size={18} /> Insight engine</div>
        </div>
      </section>

      <section className="analytics-filter-strip">
        <div className="filter-label"><Filter size={18} /><span>Focus the workspace</span></div>
        <label>Study
          <select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)}>
            <option value="All">All studies</option>
            {projects.map((project) => <option key={project.id} value={project.id}>{project.projectName}</option>)}
          </select>
        </label>
        <label>Sample type
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="All">All sample types</option>
            {sampleTypes.map((type) => <option key={type}>{type}</option>)}
          </select>
        </label>
        <div className="analytics-context-note">
          <CircleGauge size={19} />
          <span><strong>{completionRate}%</strong> completion in current view · {visibleSamples.length} samples</span>
        </div>
      </section>

      <section className="analytics-intel-grid">
        <article className="analytics-panel analytics-trend-panel">
          <div className="analytics-panel-heading">
            <div><span>Research Flow</span><h2>Sample journey over time</h2></div>
            <div className="mini-stage-row">
              <span><i className="dot pending" /> {stageCounts.Pending} pending</span>
              <span><i className="dot progress" /> {stageCounts["In Progress"]} active</span>
              <span><i className="dot complete" /> {stageCounts.Completed} complete</span>
            </div>
          </div>
          <div className="analytics-chart-large">
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 18, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(120,160,210,.12)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: "#8aa0ba", fontSize: 13 }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fill: "#8aa0ba", fontSize: 13 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#07172f", border: "1px solid #1d4d7c", borderRadius: 10 }} />
                  <Line type="monotone" dataKey="Registered" stroke="#2f8cff" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="Completed" stroke="#20d6b5" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : <div className="analytics-empty-chart"><Activity size={34} /><h3>Trend begins with timestamped samples</h3><p>New registry entries will build this timeline automatically.</p></div>}
          </div>
        </article>

        <aside className="analytics-panel insight-engine" id="analytics-insights">
          <div className="analytics-panel-heading"><div><span>Insight Engine</span><h2>What BioTrack notices</h2></div><BrainCircuit size={26} /></div>
          <div className="insight-stack">
            {insights.map(({ icon: Icon, title, text }) => (
              <div className="insight-card" key={title}>
                <div className="insight-icon"><Icon size={21} /></div>
                <div><strong>{title}</strong><p>{text}</p></div>
              </div>
            ))}
          </div>
          <button className="insight-action" type="button" onClick={() => setShowSummary(true)}>Open research summary <ArrowUpRight size={17} /></button>
        </aside>

        <article className="analytics-panel project-health-panel">
          <div className="analytics-panel-heading"><div><span>Study Performance</span><h2>Project health map</h2></div><FolderKanban size={25} /></div>
          <div className="project-health-list">
            {projectHealth.length ? projectHealth.map((project) => (
              <div className="project-health-row" key={project.id}>
                <div className="project-health-name"><strong>{project.projectName}</strong><small>{project.projectCode}</small></div>
                <div className="health-meter"><span style={{ width: `${project.completion}%` }} /></div>
                <div className="health-values"><strong>{project.completion}%</strong><small>{project.assigned}/{project.targetSamples || "—"} samples</small></div>
              </div>
            )) : <div className="analytics-empty-small">No projects available.</div>}
          </div>
        </article>

        <article className="analytics-panel analysis-mix-panel">
          <div className="analytics-panel-heading"><div><span>Workflow Profile</span><h2>Analysis mix</h2></div><FlaskConical size={25} /></div>
          <div className="analysis-mix-layout">
            <div className="analysis-donut">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={analysisMix} dataKey="value" nameKey="name" innerRadius={62} outerRadius={92} paddingAngle={4}>
                    {analysisMix.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#07172f", border: "1px solid #1d4d7c", borderRadius: 10 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="donut-center"><strong>{visibleSamples.length}</strong><span>samples</span></div>
            </div>
            <div className="analysis-legend">
              {analysisMix.map((item, i) => <div key={item.name}><i style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} /><span>{item.name}</span><strong>{item.value}</strong></div>)}
            </div>
          </div>
        </article>
      </section>

      <section className="analytics-closing-strip">
        <div><CheckCircle2 size={22} /><span><strong>Focused, not crowded.</strong><small>Only the signals that help you make research decisions.</small></span></div>
        <div><BrainCircuit size={22} /><span><strong>Interpretation first.</strong><small>Insights sit beside the data that produced them.</small></span></div>
        <div><BarChart3 size={22} /><span><strong>Connected to BioTrack.</strong><small>Projects and samples feed this view directly.</small></span></div>
      </section>

      {showSummary && (
        <div className="analytics-summary-backdrop" onMouseDown={() => setShowSummary(false)}>
          <section
            className="analytics-summary-modal"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="analytics-summary-header">
              <div>
                <span>Research Summary</span>
                <h2>Current BioTrack intelligence</h2>
                <p>
                  A concise interpretation of the filters and live records currently visible.
                </p>
              </div>
              <button type="button" onClick={() => setShowSummary(false)}>×</button>
            </div>

            <div className="analytics-summary-overview">
              <div><span>Visible samples</span><strong>{visibleSamples.length}</strong></div>
              <div><span>Completion</span><strong>{completionRate}%</strong></div>
              <div><span>Active</span><strong>{stageCounts["In Progress"]}</strong></div>
            </div>

            <div className="analytics-summary-insights">
              {insights.map(({ icon: Icon, title, text }) => (
                <div key={title}>
                  <Icon size={20} />
                  <span><strong>{title}</strong><p>{text}</p></span>
                </div>
              ))}
            </div>

            <div className="analytics-summary-actions">
              <button type="button" onClick={createReport}>
                <FileText size={17} /> Download report
              </button>
              <button type="button" onClick={() => setShowSummary(false)}>
                Close summary
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default Analytics;

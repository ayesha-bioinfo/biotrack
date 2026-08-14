import { useEffect, useMemo, useState } from "react";
import {
  Users,
  Search,
  Network,
  UserRound,
  FlaskConical,
  Dna,
  FolderKanban,
  CheckCircle2,
  Clock3,
  Activity,
  ArrowRight,
  Sparkles,
  Link2,
  Microscope,
  Layers3,
  ChevronRight,
  CircleDot
} from "lucide-react";
import "./Researchers.css";

const API_BASE = "http://localhost:5000";

function Researchers() {
  const [samples, setSamples] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedName, setSelectedName] = useState("");

  useEffect(() => {
    async function loadTeamData() {
      try {
        const [sampleRes, projectRes] = await Promise.all([
          fetch(`${API_BASE}/api/samples`),
          fetch(`${API_BASE}/api/projects`)
        ]);

        const sampleData = sampleRes.ok ? await sampleRes.json() : [];
        const projectData = projectRes.ok ? await projectRes.json() : [];

        setSamples(Array.isArray(sampleData) ? sampleData : []);
        setProjects(Array.isArray(projectData) ? projectData : []);
      } catch (error) {
        console.error("Researchers page loading error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadTeamData();
  }, []);

  const normalizedSamples = useMemo(() => {
    return samples.map((sample) => {
      const projectId = sample.projectId ?? sample.project_id ?? null;
      const project = projects.find(
        (item) => Number(item.id) === Number(projectId)
      );

      return {
        ...sample,
        sampleId:
          sample.sampleId ??
          sample.sample_id ??
          `S-${sample.id}`,
        analysisType:
          sample.analysisType ??
          sample.analysis_type ??
          sample.analysis ??
          "Unassigned",
        sampleType:
          sample.sampleType ??
          sample.sample_type ??
          sample.type ??
          "Unknown",
        projectId,
        projectName:
          project?.projectName ??
          project?.project_name ??
          "Unassigned project",
        projectCode:
          project?.projectCode ??
          project?.project_code ??
          "—",
        researcher:
          sample.researcher?.trim() || "",
        status:
          sample.status || "Pending"
      };
    });
  }, [samples, projects]);

  const researchers = useMemo(() => {
    const map = {};

    normalizedSamples.forEach((sample) => {
      if (!sample.researcher) return;

      if (!map[sample.researcher]) {
        map[sample.researcher] = {
          name: sample.researcher,
          samples: [],
          analyses: {},
          projects: {},
          pending: 0,
          inProgress: 0,
          completed: 0
        };
      }

      const person = map[sample.researcher];
      person.samples.push(sample);

      person.analyses[sample.analysisType] =
        (person.analyses[sample.analysisType] || 0) + 1;

      if (sample.projectId) {
        person.projects[sample.projectId] = {
          id: sample.projectId,
          name: sample.projectName,
          code: sample.projectCode
        };
      }

      const status = String(sample.status).toLowerCase();

      if (status.includes("complete")) {
        person.completed += 1;
      } else if (
        status.includes("progress") ||
        status.includes("analysis")
      ) {
        person.inProgress += 1;
      } else {
        person.pending += 1;
      }
    });

    return Object.values(map)
      .map((person) => {
        const total = person.samples.length;
        const completionRate =
          total > 0
            ? Math.round((person.completed / total) * 100)
            : 0;

        const expertise = Object.entries(person.analyses)
          .sort((a, b) => b[1] - a[1])
          .map(([name, count]) => ({ name, count }));

        const projectList = Object.values(person.projects);

        return {
          ...person,
          total,
          completionRate,
          expertise,
          projectList
        };
      })
      .sort((a, b) => b.total - a.total);
  }, [normalizedSamples]);

  useEffect(() => {
    if (!selectedName && researchers.length > 0) {
      setSelectedName(researchers[0].name);
    }
  }, [researchers, selectedName]);

  const filteredResearchers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) return researchers;

    return researchers.filter((researcher) => {
      const searchable = [
        researcher.name,
        ...researcher.expertise.map((item) => item.name),
        ...researcher.projectList.map((project) => project.name),
        ...researcher.projectList.map((project) => project.code)
      ];

      return searchable.some((value) =>
        String(value || "").toLowerCase().includes(query)
      );
    });
  }, [researchers, searchTerm]);

  const selectedResearcher =
    researchers.find((item) => item.name === selectedName) ||
    filteredResearchers[0] ||
    researchers[0] ||
    null;

  const collaborators = useMemo(() => {
    if (!selectedResearcher) return [];

    const selectedProjects = new Set(
      selectedResearcher.projectList.map((project) =>
        String(project.id)
      )
    );

    return researchers
      .filter((person) => person.name !== selectedResearcher.name)
      .map((person) => {
        const shared = person.projectList.filter((project) =>
          selectedProjects.has(String(project.id))
        );

        return {
          ...person,
          sharedProjects: shared
        };
      })
      .filter((person) => person.sharedProjects.length > 0)
      .sort(
        (a, b) =>
          b.sharedProjects.length - a.sharedProjects.length
      )
      .slice(0, 5);
  }, [researchers, selectedResearcher]);

  const teamExpertise = useMemo(() => {
    const counts = {};

    researchers.forEach((researcher) => {
      researcher.expertise.forEach(({ name, count }) => {
        counts[name] = (counts[name] || 0) + count;
      });
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [researchers]);

  const getInitials = (name = "") =>
    name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const getStatusClass = (status = "") => {
    const value = status.toLowerCase();

    if (value.includes("complete")) {
      return "research-status-complete";
    }

    if (
      value.includes("progress") ||
      value.includes("analysis")
    ) {
      return "research-status-progress";
    }

    return "research-status-pending";
  };

  if (loading) {
    return (
      <main className="research-studio-page research-studio-loading">
        <div className="research-loading-orbit">
          <Users size={34} />
        </div>
        <h1>Opening Collaboration Studio...</h1>
      </main>
    );
  }

  return (
    <main className="research-studio-page">
      <section className="research-studio-hero">
        <div className="research-studio-copy">
          <span className="research-studio-kicker">
            <Sparkles size={16} />
            Research Collaboration Studio
          </span>

          <h1>
            Science moves faster when
            <span> people connect.</span>
          </h1>

          <p>
            Explore the people behind each study, understand
            their expertise, see where they contribute, and
            discover how research work connects across BioTrack.
          </p>

          <div className="research-hero-caption">
            <Network size={18} />
            <span>
              Built from live sample assignments and project links
            </span>
          </div>
        </div>

        <div className="research-network-hero" aria-hidden="true">
          <div className="network-orbit orbit-one" />
          <div className="network-orbit orbit-two" />

          <div className="network-core">
            <Users size={38} />
          </div>

          <div className="network-node node-one">
            <Microscope size={20} />
          </div>

          <div className="network-node node-two">
            <Dna size={20} />
          </div>

          <div className="network-node node-three">
            <FlaskConical size={20} />
          </div>

          <div className="network-node node-four">
            <FolderKanban size={20} />
          </div>

          <span className="network-label label-one">
            Expertise
          </span>
          <span className="network-label label-two">
            Projects
          </span>
          <span className="network-label label-three">
            Samples
          </span>
        </div>
      </section>

      <section className="research-studio-toolbar">
        <div className="research-studio-search">
          <Search size={19} />
          <input
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            placeholder="Search researcher, expertise or project..."
          />
        </div>

        <div className="research-studio-presence">
          <span className="presence-dot" />
          <strong>{researchers.length}</strong>
          <span>research contributors visible</span>
        </div>
      </section>

      <section className="research-command-grid">
        <aside className="research-roster">
          <div className="research-panel-heading">
            <div>
              <span>Team Directory</span>
              <h2>Research Contributors</h2>
            </div>

            <UserRound size={23} />
          </div>

          <div className="research-roster-list">
            {filteredResearchers.length === 0 ? (
              <div className="research-empty">
                <Users size={32} />
                <h3>No researchers found</h3>
                <p>
                  Researchers appear here after samples are
                  assigned to them.
                </p>
              </div>
            ) : (
              filteredResearchers.map((researcher, index) => (
                <button
                  key={researcher.name}
                  className={`research-person-row ${
                    selectedResearcher?.name === researcher.name
                      ? "research-person-active"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedName(researcher.name)
                  }
                  style={{
                    animationDelay: `${Math.min(index, 8) * 55}ms`
                  }}
                >
                  <div className="research-person-avatar">
                    {getInitials(researcher.name)}
                  </div>

                  <div className="research-person-copy">
                    <strong>{researcher.name}</strong>
                    <span>
                      {researcher.expertise[0]?.name ||
                        "Research contributor"}
                    </span>
                  </div>

                  <div className="research-person-signal">
                    <span
                      className={
                        researcher.inProgress > 0
                          ? "signal-live"
                          : ""
                      }
                    />
                    <small>
                      {researcher.inProgress > 0
                        ? "Active"
                        : "Available"}
                    </small>
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        <section className="research-profile-stage">
          {selectedResearcher ? (
            <>
              <div className="research-profile-top">
                <div className="profile-main-identity">
                  <div className="profile-large-avatar">
                    {getInitials(selectedResearcher.name)}
                  </div>

                  <div>
                    <span>Selected Researcher</span>
                    <h2>{selectedResearcher.name}</h2>
                    <p>
                      Research contributor across{" "}
                      {selectedResearcher.projectList.length}{" "}
                      connected{" "}
                      {selectedResearcher.projectList.length === 1
                        ? "study"
                        : "studies"}
                    </p>
                  </div>
                </div>

                <div className="profile-availability">
                  <span className="presence-dot" />
                  {selectedResearcher.inProgress > 0
                    ? "Active workflows"
                    : "No active workflows"}
                </div>
              </div>

              <div className="research-profile-body">
                <div className="research-profile-column">
                  <div className="research-section-title">
                    <Layers3 size={18} />
                    <span>Expertise Signature</span>
                  </div>

                  <div className="expertise-signature">
                    {selectedResearcher.expertise.length === 0 ? (
                      <span className="expertise-chip">
                        No analysis assigned
                      </span>
                    ) : (
                      selectedResearcher.expertise.map(
                        (item, index) => (
                          <div
                            className="expertise-chip"
                            key={item.name}
                          >
                            <span
                              className={`expertise-dot expertise-${(index % 4) + 1}`}
                            />
                            <strong>{item.name}</strong>
                            <small>
                              {item.count}{" "}
                              {item.count === 1
                                ? "sample"
                                : "samples"}
                            </small>
                          </div>
                        )
                      )
                    )}
                  </div>

                  <div className="research-section-title project-title-space">
                    <FolderKanban size={18} />
                    <span>Study Connections</span>
                  </div>

                  <div className="research-project-links">
                    {selectedResearcher.projectList.length === 0 ? (
                      <div className="research-soft-empty">
                        No connected project yet.
                      </div>
                    ) : (
                      selectedResearcher.projectList.map(
                        (project) => (
                          <div
                            className="research-project-link"
                            key={project.id}
                          >
                            <div>
                              <span>{project.code}</span>
                              <strong>{project.name}</strong>
                            </div>
                            <ChevronRight size={18} />
                          </div>
                        )
                      )
                    )}
                  </div>
                </div>

                <div className="research-profile-column">
                  <div className="research-section-title">
                    <FlaskConical size={18} />
                    <span>Current Sample Queue</span>
                  </div>

                  <div className="research-sample-queue">
                    {selectedResearcher.samples
                      .slice(0, 5)
                      .map((sample) => (
                        <div
                          className="research-sample-item"
                          key={sample.id}
                        >
                          <div className="research-sample-icon">
                            <FlaskConical size={18} />
                          </div>

                          <div className="research-sample-info">
                            <strong>{sample.sampleId}</strong>
                            <span>
                              {sample.sampleType} ·{" "}
                              {sample.analysisType}
                            </span>
                          </div>

                          <span
                            className={`research-status-pill ${getStatusClass(
                              sample.status
                            )}`}
                          >
                            {sample.status}
                          </span>
                        </div>
                      ))}
                  </div>

                  <div className="research-progress-story">
                    <div className="research-progress-heading">
                      <span>Workflow completion</span>
                      <strong>
                        {selectedResearcher.completionRate}%
                      </strong>
                    </div>

                    <div className="research-progress-track">
                      <div
                        className="research-progress-fill"
                        style={{
                          width: `${selectedResearcher.completionRate}%`
                        }}
                      />
                    </div>

                    <p>
                      {selectedResearcher.completed} completed ·{" "}
                      {selectedResearcher.inProgress} active ·{" "}
                      {selectedResearcher.pending} awaiting action
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="research-profile-empty">
              <Users size={42} />
              <h2>No researcher selected</h2>
            </div>
          )}
        </section>
      </section>

      <section className="collaboration-layer">
        <div className="collaboration-heading">
          <div>
            <span>Collaboration Layer</span>
            <h2>How this researcher connects to the team</h2>
            <p>
              Shared projects create collaboration paths between
              researchers. BioTrack derives these links from the
              studies attached to their samples.
            </p>
          </div>

          <Network size={30} />
        </div>

        <div className="collaboration-content">
          <div className="collaboration-map">
            <div className="collab-center">
              <div className="collab-center-avatar">
                {selectedResearcher
                  ? getInitials(selectedResearcher.name)
                  : "BT"}
              </div>
              <strong>
                {selectedResearcher?.name || "Researcher"}
              </strong>
              <span>Current focus</span>
            </div>

            {collaborators.length === 0 ? (
              <div className="collaboration-empty">
                <Link2 size={22} />
                <span>
                  No shared-project collaborators detected yet.
                </span>
              </div>
            ) : (
              collaborators.map((person, index) => (
                <div
                  className={`collab-peer collab-peer-${index + 1}`}
                  key={person.name}
                >
                  <span className="collab-line" />
                  <button
                    onClick={() =>
                      setSelectedName(person.name)
                    }
                  >
                    <div className="collab-peer-avatar">
                      {getInitials(person.name)}
                    </div>
                    <strong>{person.name}</strong>
                    <small>
                      {person.sharedProjects.length} shared{" "}
                      {person.sharedProjects.length === 1
                        ? "study"
                        : "studies"}
                    </small>
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="team-expertise-board">
            <div className="research-section-title">
              <Microscope size={18} />
              <span>Team Capability Map</span>
            </div>

            <p className="team-expertise-intro">
              The strongest analysis capabilities currently visible
              across the team.
            </p>

            <div className="team-expertise-list">
              {teamExpertise.map((item, index) => {
                const max =
                  teamExpertise[0]?.count || 1;

                return (
                  <div
                    className="team-expertise-row"
                    key={item.name}
                  >
                    <div className="team-expertise-name">
                      <CircleDot size={15} />
                      <span>{item.name}</span>
                    </div>

                    <div className="team-expertise-track">
                      <div
                        style={{
                          width: `${Math.max(
                            18,
                            (item.count / max) * 100
                          )}%`
                        }}
                      />
                    </div>

                    <strong>{item.count}</strong>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="research-principles">
        <div>
          <Network size={24} />
          <span>
            <strong>Connected by studies</strong>
            <small>
              Collaboration is derived from shared project work.
            </small>
          </span>
        </div>

        <div>
          <Microscope size={24} />
          <span>
            <strong>Expertise made visible</strong>
            <small>
              Analysis assignments reveal real team strengths.
            </small>
          </span>
        </div>

        <div>
          <Activity size={24} />
          <span>
            <strong>Work in context</strong>
            <small>
              Each researcher is tied directly to active samples.
            </small>
          </span>
        </div>
      </section>
    </main>
  );
}

export default Researchers;

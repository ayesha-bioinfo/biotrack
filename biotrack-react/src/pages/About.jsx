import {
  Dna,
  FlaskConical,
  FolderKanban,
  BarChart3,
  Users,
  ShieldCheck,
  Workflow,
  Sparkles,
  ArrowRight,
  CircleDot,
  Layers3,
  Database,
  BrainCircuit
} from "lucide-react";
import "./About.css";

function About() {
  const pillars = [
    {
      icon: FolderKanban,
      number: "01",
      title: "Define the study",
      text: "Create a research foundation before samples and analyses begin."
    },
    {
      icon: FlaskConical,
      number: "02",
      title: "Trace every specimen",
      text: "Keep biological material connected to its study, researcher and workflow."
    },
    {
      icon: Users,
      number: "03",
      title: "Connect the team",
      text: "Make research contribution and collaboration visible across active studies."
    },
    {
      icon: BarChart3,
      number: "04",
      title: "Turn work into insight",
      text: "Interpret research activity through focused analytics rather than disconnected records."
    }
  ];

  return (
    <main className="about-story-page">
      <section className="about-story-hero">
        <div className="about-story-copy">
          <span className="about-kicker">
            <Sparkles size={16} />
            About BioTrack
          </span>

          <h1>
            Research is complex.
            <span> Tracking it should not be.</span>
          </h1>

          <p>
            BioTrack is a connected research operations platform
            designed to bring projects, biological samples,
            researchers and analysis workflows into one coherent
            scientific workspace.
          </p>

          <div className="about-manifesto">
            <CircleDot size={17} />
            <span>
              One research question. One connected operational story.
            </span>
          </div>
        </div>

        <div className="about-system-visual" aria-hidden="true">
          <div className="about-system-ring ring-a" />
          <div className="about-system-ring ring-b" />

          <div className="about-system-core">
            <Dna size={42} />
            <span>BioTrack</span>
          </div>

          <div className="system-node system-node-1">
            <FolderKanban size={21} />
            <span>Projects</span>
          </div>

          <div className="system-node system-node-2">
            <FlaskConical size={21} />
            <span>Samples</span>
          </div>

          <div className="system-node system-node-3">
            <Users size={21} />
            <span>People</span>
          </div>

          <div className="system-node system-node-4">
            <BarChart3 size={21} />
            <span>Insights</span>
          </div>
        </div>
      </section>

      <section className="about-origin-section">
        <div className="about-origin-heading">
          <span>Why BioTrack Exists</span>
          <h2>From fragmented records to one research narrative.</h2>
        </div>

        <div className="about-origin-grid">
          <div className="about-origin-card">
            <div className="origin-icon">
              <Database size={24} />
            </div>
            <h3>The problem</h3>
            <p>
              Research information often lives in separate
              spreadsheets, notes, sample lists and analysis
              outputs. The scientific work may be connected, but
              the operational record is not.
            </p>
          </div>

          <div className="about-origin-bridge">
            <Workflow size={28} />
            <span />
            <ArrowRight size={25} />
          </div>

          <div className="about-origin-card origin-card-accent">
            <div className="origin-icon">
              <Layers3 size={24} />
            </div>
            <h3>The BioTrack approach</h3>
            <p>
              Keep the study at the center, then connect each
              specimen, researcher and analytical step around it
              so context is never lost.
            </p>
          </div>
        </div>
      </section>

      <section className="about-journey-section">
        <div className="about-section-heading">
          <span>Operating Philosophy</span>
          <h2>Four workspaces. One research journey.</h2>
          <p>
            Each major BioTrack area has one specific job instead
            of repeating the same dashboard information.
          </p>
        </div>

        <div className="about-pillar-grid">
          {pillars.map(({ icon: Icon, number, title, text }) => (
            <article className="about-pillar" key={number}>
              <div className="pillar-number">{number}</div>
              <div className="pillar-icon">
                <Icon size={25} />
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-architecture">
        <div className="architecture-copy">
          <span>Platform Architecture</span>
          <h2>Built around relationships, not isolated screens.</h2>
          <p>
            BioTrack becomes more useful as records connect:
            projects give samples context, samples reveal
            researcher activity, and those relationships feed the
            analytical view.
          </p>

          <div className="architecture-principles">
            <div>
              <ShieldCheck size={20} />
              <span>
                <strong>Traceable</strong>
                <small>Every record keeps its scientific context.</small>
              </span>
            </div>

            <div>
              <BrainCircuit size={20} />
              <span>
                <strong>Interpretable</strong>
                <small>Analytics explain activity instead of only counting it.</small>
              </span>
            </div>

            <div>
              <Workflow size={20} />
              <span>
                <strong>Connected</strong>
                <small>Every page advances the research journey.</small>
              </span>
            </div>
          </div>
        </div>

        <div className="architecture-map">
          <div className="architecture-center">
            <Dna size={28} />
            <strong>Research Study</strong>
          </div>

          <div className="architecture-branch branch-projects">
            <FolderKanban size={21} />
            <span>Projects</span>
          </div>

          <div className="architecture-branch branch-samples">
            <FlaskConical size={21} />
            <span>Samples</span>
          </div>

          <div className="architecture-branch branch-people">
            <Users size={21} />
            <span>Researchers</span>
          </div>

          <div className="architecture-branch branch-insights">
            <BarChart3 size={21} />
            <span>Analytics</span>
          </div>
        </div>
      </section>

      <section className="about-closing">
        <div>
          <span>BioTrack</span>
          <h2>Research. Track. Discover.</h2>
          <p>
            A clearer operational layer for modern scientific work.
          </p>
        </div>

        <div className="about-closing-mark">
          <Dna size={34} />
        </div>
      </section>
    </main>
  );
}

export default About;

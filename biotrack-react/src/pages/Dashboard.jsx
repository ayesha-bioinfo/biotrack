import { Link } from "react-router-dom";
import {
  ArrowRight,
  FlaskConical,
  Users,
  BarChart3,
  Dna,
  Microscope,
  ShieldCheck,
  Rocket,
  BrainCircuit,
  RefreshCw,
  CircleCheck,
  Sparkles
} from "lucide-react";


const workflow = [
  {
    number: "01",
    title: "Register & Track Samples",
    description:
      "Register biological samples, capture research metadata and follow each specimen through its analysis workflow.",
    link: "/samples",
    linkLabel: "Go to Samples",
    icon: FlaskConical,
    tone: "green"
  },
  {
    number: "02",
    title: "Coordinate Researchers",
    description:
      "Connect researchers with active samples, monitor responsibilities and collaborate across the research team.",
    link: "/researchers",
    linkLabel: "Go to Researchers",
    icon: Users,
    tone: "purple"
  },
  {
    number: "03",
    title: "Explore Analytics",
    description:
      "Interpret sample activity, monitor research workflows and uncover meaningful operational insights.",
    link: "/analytics",
    linkLabel: "Go to Analytics",
    icon: BarChart3,
    tone: "orange"
  }
];


const benefits = [
  {
    title: "Accelerate Discovery",
    text: "Streamline your research workflow in one platform.",
    icon: Rocket
  },
  {
    title: "Secure & Reliable",
    text: "Structured tracking for your valuable research data.",
    icon: ShieldCheck
  },
  {
    title: "Collaborative",
    text: "Built for teams, designed for science.",
    icon: Users
  },
  {
    title: "Smart Insights",
    text: "Turn operational data into actionable knowledge.",
    icon: BrainCircuit
  },
  {
    title: "Always Evolving",
    text: "A flexible platform that grows with your research.",
    icon: RefreshCw
  }
];


function Dashboard() {
  return (
    <main className="journey-dashboard dark-research-dashboard">

      {/* =========================
          HERO SECTION
      ========================= */}

      <section className="dark-hero">

        <div className="dark-hero-glow dark-hero-glow-one" />
        <div className="dark-hero-glow dark-hero-glow-two" />


        {/* HERO TEXT */}

        <div className="dark-hero-copy">

          <div className="dark-eyebrow">
            <Sparkles size={15} />
            Research Operations Platform
          </div>


          <h1>
            From biological sample
            <br />
            to scientific <span>insight.</span>
          </h1>


          <p>
            BioTrack connects biological samples,
            researchers and analytical workflows in one
            <strong> intelligent research platform.</strong>
          </p>


          {/* HERO BUTTONS */}

          <div className="dark-hero-actions">

            <Link
              to="/samples"
              className="dark-primary-btn"
            >
              Explore Samples
              <ArrowRight size={19} />
            </Link>


            <Link
              to="/analytics"
              className="dark-secondary-btn"
            >
              Explore Analytics
            </Link>

          </div>


          {/* SYSTEM STATUS */}

          <div className="system-status">

            <CircleCheck size={14} />

            <span>
              System Status:
            </span>

            <strong>
              All Systems Operational
            </strong>

          </div>

        </div>


        {/* =========================
            SCIENTIFIC VISUAL
        ========================= */}

        <div
          className="research-visual"
          aria-hidden="true"
        >

          <div className="visual-stars" />

          <div className="visual-orbit orbit-one" />
          <div className="visual-orbit orbit-two" />
          <div className="visual-orbit orbit-three" />


          {/* DNA CORE */}

          <div className="dna-core-shell">

            <div className="dna-core-glow" />

            <Dna
              size={150}
              strokeWidth={1.25}
            />

          </div>


          {/* RESEARCH NODE */}

          <div className="visual-node visual-node-research">

            <div className="visual-node-icon">
              <Microscope size={27} />
            </div>

            <span>
              Research
            </span>

          </div>


          {/* SAMPLE NODE */}

          <div className="visual-node visual-node-samples">

            <div className="visual-node-icon">
              <FlaskConical size={27} />
            </div>

            <span>
              Samples
            </span>

          </div>


          {/* ANALYTICS NODE */}

          <div className="visual-node visual-node-analytics">

            <div className="visual-node-icon">
              <BarChart3 size={28} />
            </div>

            <span>
              Analytics
            </span>

          </div>


          {/* COLLABORATION NODE */}

          <div className="visual-node visual-node-team">

            <div className="visual-node-icon">
              <Users size={28} />
            </div>

            <span>
              Collaboration
            </span>

          </div>

        </div>

      </section>


      {/* =========================
          RESEARCH JOURNEY
      ========================= */}

      <section className="research-journey-section">

        <div className="journey-heading">

          <div className="journey-label">

            <span />

            Research Journey

            <span />

          </div>


          <h2>
            Your Research. Our Workflow. Better Outcomes.
          </h2>

        </div>


        {/* =========================
            WORKFLOW CARDS
        ========================= */}

        <div className="workflow-card-grid">

          {workflow.map(
            ({
              number,
              title,
              description,
              link,
              linkLabel,
              icon: Icon,
              tone
            }) => (

              <Link
                to={link}
                key={number}
                className={`workflow-dark-card workflow-${tone}`}
              >

                <div className="workflow-top-row">

                  <div className="workflow-dark-icon">

                    <Icon size={31} />

                  </div>


                  <span className="workflow-card-number">
                    {number}
                  </span>

                </div>


                <div className="workflow-card-line">

                  <span />

                  <ArrowRight size={20} />

                </div>


                <h3>
                  {title}
                </h3>


                <p>
                  {description}
                </p>


                <div className="workflow-card-link">

                  {linkLabel}

                  <ArrowRight size={17} />

                </div>

              </Link>

            )
          )}

        </div>


        {/* =========================
            BENEFITS STRIP
        ========================= */}

        <div className="research-benefit-strip">

          {benefits.map(
            ({
              title,
              text,
              icon: Icon
            }) => (

              <div
                className="benefit-item"
                key={title}
              >

                <div className="benefit-icon">

                  <Icon size={25} />

                </div>


                <div>

                  <strong>
                    {title}
                  </strong>

                  <p>
                    {text}
                  </p>

                </div>

              </div>

            )
          )}

        </div>

      </section>

    </main>
  );
}


export default Dashboard;
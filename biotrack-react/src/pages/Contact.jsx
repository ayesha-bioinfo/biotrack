import { useState } from "react";
import {
  Mail,
  MessageSquareText,
  Wrench,
  FlaskConical,
  Lightbulb,
  Send,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  LifeBuoy,
  ChevronRight
} from "lucide-react";
import "./Contact.css";

function Contact() {
  const [topic, setTopic] = useState("General Question");
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const topics = [
    {
      name: "General Question",
      icon: MessageSquareText,
      hint: "Questions about BioTrack or how the platform works."
    },
    {
      name: "Technical Support",
      icon: Wrench,
      hint: "Something is not behaving as expected."
    },
    {
      name: "Research Workflow",
      icon: FlaskConical,
      hint: "Discuss a sample, project or analysis workflow."
    },
    {
      name: "Product Feedback",
      icon: Lightbulb,
      hint: "Share an idea that could improve BioTrack."
    }
  ];

  function handleChange(event) {
    const { name, value } = event.target;

    setSubmitted(false);
    setFormData((current) => ({
      ...current,
      [name]: value
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      alert("Please complete your name, email and message.");
      return;
    }

    setSubmitted(true);
    setFormData({
      name: "",
      email: "",
      message: ""
    });
  }

  return (
    <main className="contact-hub-page">
      <section className="contact-hub-hero">
        <div className="contact-hub-copy">
          <span className="contact-kicker">
            <Sparkles size={16} />
            BioTrack Support Hub
          </span>

          <h1>
            Need help moving
            <span> research forward?</span>
          </h1>

          <p>
            Tell us what you are trying to accomplish. BioTrack
            support is organized around your research context so
            your message starts with the right information.
          </p>

          <div className="contact-response-note">
            <Clock3 size={17} />
            <span>
              Clear context leads to faster, more useful support.
            </span>
          </div>
        </div>

        <div className="contact-signal-visual" aria-hidden="true">
          <div className="signal-ring signal-ring-one" />
          <div className="signal-ring signal-ring-two" />

          <div className="signal-core">
            <Mail size={38} />
          </div>

          <div className="signal-pulse signal-pulse-a">
            <MessageSquareText size={20} />
          </div>

          <div className="signal-pulse signal-pulse-b">
            <Wrench size={20} />
          </div>

          <div className="signal-pulse signal-pulse-c">
            <FlaskConical size={20} />
          </div>
        </div>
      </section>

      <section className="contact-support-grid">
        <aside className="contact-topic-panel">
          <div className="contact-panel-heading">
            <span>Start Here</span>
            <h2>What can we help with?</h2>
            <p>
              Choose the reason that best matches your message.
            </p>
          </div>

          <div className="contact-topic-list">
            {topics.map(({ name, icon: Icon, hint }) => (
              <button
                key={name}
                type="button"
                onClick={() => {
                  setTopic(name);
                  setSubmitted(false);
                }}
                className={`contact-topic-card ${
                  topic === name ? "contact-topic-active" : ""
                }`}
              >
                <div className="contact-topic-icon">
                  <Icon size={21} />
                </div>

                <div>
                  <strong>{name}</strong>
                  <span>{hint}</span>
                </div>

                <ChevronRight size={18} />
              </button>
            ))}
          </div>

          <div className="contact-trust-card">
            <ShieldCheck size={22} />
            <div>
              <strong>Research-aware support</strong>
              <span>
                Keep sensitive study information out of the
                message unless it is necessary for troubleshooting.
              </span>
            </div>
          </div>
        </aside>

        <section className="contact-composer">
          <div className="contact-composer-header">
            <div>
              <span>Message Composer</span>
              <h2>{topic}</h2>
              <p>
                Give enough detail for someone to understand the
                problem without reproducing your entire workflow.
              </p>
            </div>

            <div className="composer-icon">
              <LifeBuoy size={25} />
            </div>
          </div>

          {submitted ? (
            <div className="contact-success-state">
              <div className="contact-success-icon">
                <CheckCircle2 size={34} />
              </div>

              <span>Message Prepared</span>
              <h2>Thank you for reaching out.</h2>
              <p>
                Your message was captured successfully in this
                BioTrack demo interface.
              </p>

              <button
                type="button"
                onClick={() => setSubmitted(false)}
              >
                Send another message
                <ArrowRight size={17} />
              </button>
            </div>
          ) : (
            <form
              className="contact-composer-form"
              onSubmit={handleSubmit}
            >
              <div className="contact-form-row">
                <label>
                  <span>Your Name</span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                  />
                </label>

                <label>
                  <span>Email Address</span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                  />
                </label>
              </div>

              <label className="contact-message-field">
                <span>Message</span>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={
                    topic === "Technical Support"
                      ? "Describe what happened, what you expected, and any error message you saw..."
                      : topic === "Research Workflow"
                      ? "Describe the project, sample or workflow question you want help with..."
                      : topic === "Product Feedback"
                      ? "Tell us what would make BioTrack more useful..."
                      : "How can we help?"
                  }
                />
              </label>

              <div className="contact-form-footer">
                <div className="contact-selected-topic">
                  <span>Topic</span>
                  <strong>{topic}</strong>
                </div>

                <button
                  className="contact-send-btn"
                  type="submit"
                >
                  <Send size={18} />
                  Send Message
                </button>
              </div>
            </form>
          )}
        </section>
      </section>

      <section className="contact-next-section">
        <div className="contact-next-heading">
          <span>What Happens Next</span>
          <h2>A simple support path.</h2>
        </div>

        <div className="contact-next-steps">
          <div>
            <span>01</span>
            <strong>Describe the context</strong>
            <small>
              Tell us what you were trying to do.
            </small>
          </div>

          <ArrowRight size={20} />

          <div>
            <span>02</span>
            <strong>Identify the issue</strong>
            <small>
              Include the page, action or error involved.
            </small>
          </div>

          <ArrowRight size={20} />

          <div>
            <span>03</span>
            <strong>Continue the research</strong>
            <small>
              Use the response to move forward confidently.
            </small>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Contact;

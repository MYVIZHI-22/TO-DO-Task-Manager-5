import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

const starterPlans = [
  {
    id: 1,
    subject: "Web Technology",
    title: "HTML Forms",
    deadline: "2026-10-12",
    status: "In Progress",
    color: "#7357F6",
    bg: "#F0EDFF",
    fontSize: "16",
    fontStyle: "normal",
    fontColor: "#25213B",
  },
  {
    id: 2,
    subject: "JavaScript",
    title: "DOM Manipulation",
    deadline: "2026-10-15",
    status: "Pending",
    color: "#E89B35",
    bg: "#FFF4E3",
    fontSize: "16",
    fontStyle: "normal",
    fontColor: "#25213B",
  },
  {
    id: 3,
    subject: "Database",
    title: "SQL Queries",
    deadline: "2026-10-18",
    status: "Completed",
    color: "#219B79",
    bg: "#E5F8F0",
    fontSize: "16",
    fontStyle: "normal",
    fontColor: "#25213B",
  },
];

const emptyForm = {
  subject: "",
  title: "",
  deadline: "",
  color: "#7357F6",
  bg: "#F0EDFF",
  fontSize: "16",
  fontStyle: "normal",
  fontColor: "#25213B",
};

function readPlans() {
  try {
    const saved = localStorage.getItem("studyflow-assessments");
    return saved ? JSON.parse(saved) : starterPlans;
  } catch {
    return starterPlans;
  }
}

function formatDate(date) {
  if (!date) return "No deadline";
  return new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function App() {
  const [plans, setPlans] = useState(readPlans);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    localStorage.setItem("studyflow-assessments", JSON.stringify(plans));
  }, [plans]);

  const counts = useMemo(
    () => ({
      total: plans.length,
      pending: plans.filter((p) => p.status === "Pending").length,
      progress: plans.filter((p) => p.status === "In Progress").length,
      completed: plans.filter((p) => p.status === "Completed").length,
    }),
    [plans]
  );

  const visiblePlans = useMemo(() => {
    return plans
      .filter((p) => {
        const text = `${p.subject} ${p.title}`.toLowerCase();
        const matchesSearch = text.includes(search.toLowerCase());
        const matchesFilter = filter === "All" || p.status === filter;
        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return a.deadline.localeCompare(b.deadline);
      });
  }, [plans, search, filter]);

  function updateForm(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function addPlan(event) {
    event.preventDefault();

    const newPlan = {
      ...form,
      id: Date.now(),
      status: "Pending",
    };

    setPlans((current) => [newPlan, ...current]);
    setForm(emptyForm);
    setShowForm(false);
    setNotice("Assessment added successfully!");
    setTimeout(() => setNotice(""), 2500);
  }

  function changeStatus(id, status) {
    setPlans((current) =>
      current.map((p) => (p.id === id ? { ...p, status } : p))
    );
  }

  function deletePlan(id) {
    if (window.confirm("Delete this assessment?")) {
      setPlans((current) => current.filter((p) => p.id !== id));
    }
  }

  function deadlineLabel(date, status) {
    if (status === "Completed") return "Completed";
    if (!date) return "No deadline";

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(date + "T00:00:00");
    const days = Math.ceil((due - today) / 86400000);

    if (days < 0) return `${Math.abs(days)} day(s) overdue`;
    if (days === 0) return "Due today";
    if (days === 1) return "Due tomorrow";
    return `${days} days left`;
  }

  const progress = counts.total
    ? Math.round((counts.completed / counts.total) * 100)
    : 0;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">S</div>
          <div>
            <h2>StudyFlow</h2>
            <span>STUDENT WORKSPACE</span>
          </div>
        </div>

        <p className="nav-label">WORKSPACE</p>
        <button className="nav-item active">
          <span>▦</span> Dashboard
        </button>
        <button
          className="nav-item"
          onClick={() => {
            setFilter("All");
            document
              .getElementById("assessment-list")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <span>▤</span> Assessments
        </button>
        <button
          className="nav-item"
          onClick={() => {
            setFilter("Pending");
            document
              .getElementById("assessment-list")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <span>◷</span> Pending work
        </button>
        <button
          className="nav-item"
          onClick={() => {
            setFilter("Completed");
            document
              .getElementById("assessment-list")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <span>✓</span> Completed
        </button>

        <div className="sidebar-bottom">
          <div className="focus-card">
            <div className="focus-icon">✦</div>
            <h3>Stay focused!</h3>
            <p>Small steps every day lead to big results.</p>
            <div className="focus-line">
              <span style={{ width: `${progress}%` }} />
            </div>
            <small>{progress}% completed</small>
          </div>
          <div className="profile">
            <div className="avatar">ST</div>
            <div>
              <strong>Student</strong>
              <span>My workspace</span>
            </div>
            <span className="profile-dots">•••</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">Workspace <span>/</span> Dashboard</div>
          <div className="topbar-right">
            <span className="today-chip">
              ◷ {new Date().toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
            <div className="top-avatar">ST</div>
          </div>
        </header>

        <section className="welcome-section">
          <div>
            <p className="eyebrow">YOUR PERSONAL STUDY SPACE</p>
            <h1>Let's make progress <span>✦</span></h1>
            <p className="welcome-subtitle">
              Organize your assessments, manage deadlines, and stay on track.
            </p>
          </div>
          <button className="primary-button" onClick={() => setShowForm(!showForm)}>
            <span>＋</span> {showForm ? "Close form" : "New assessment"}
          </button>
        </section>

        {notice && <div className="notice">✓ {notice}</div>}

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-top">
              <span>Total assessments</span>
              <div className="stat-icon purple">▤</div>
            </div>
            <div className="stat-number">{counts.total}</div>
            <p>All your planned tasks</p>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span>Pending</span>
              <div className="stat-icon orange">◷</div>
            </div>
            <div className="stat-number">{counts.pending}</div>
            <p>Waiting to be started</p>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span>In progress</span>
              <div className="stat-icon blue">↗</div>
            </div>
            <div className="stat-number">{counts.progress}</div>
            <p>Work in progress</p>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span>Completed</span>
              <div className="stat-icon green">✓</div>
            </div>
            <div className="stat-number">{counts.completed}</div>
            <p>Tasks finished successfully</p>
          </div>
        </section>

        {showForm && (
          <section className="form-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">PLAN SOMETHING NEW</p>
                <h2>Create an assessment</h2>
              </div>
              <button className="close-button" onClick={() => setShowForm(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={addPlan}>
              <div className="form-grid">
                <label>
                  Subject name
                  <input
                    name="subject"
                    value={form.subject}
                    onChange={updateForm}
                    placeholder="e.g. Web Technology"
                    required
                  />
                </label>

                <label>
                  Assessment title
                  <input
                    name="title"
                    value={form.title}
                    onChange={updateForm}
                    placeholder="e.g. HTML Forms"
                    required
                  />
                </label>

                <label>
                  Deadline
                  <input
                    type="date"
                    name="deadline"
                    value={form.deadline}
                    onChange={updateForm}
                    required
                  />
                </label>

                <label>
                  Font size
                  <select name="fontSize" value={form.fontSize} onChange={updateForm}>
                    <option value="14">Small</option>
                    <option value="16">Medium</option>
                    <option value="18">Large</option>
                    <option value="20">Extra large</option>
                  </select>
                </label>

                <label>
                  Font style
                  <select name="fontStyle" value={form.fontStyle} onChange={updateForm}>
                    <option value="normal">Normal</option>
                    <option value="italic">Italic</option>
                  </select>
                </label>

                <label>
                  Text color
                  <div className="color-control">
                    <input
                      type="color"
                      name="fontColor"
                      value={form.fontColor}
                      onChange={updateForm}
                    />
                    <span>{form.fontColor}</span>
                  </div>
                </label>

                <label>
                  Card background
                  <div className="color-control">
                    <input
                      type="color"
                      name="bg"
                      value={form.bg}
                      onChange={updateForm}
                    />
                    <span>{form.bg}</span>
                  </div>
                </label>

                <label>
                  Subject accent
                  <div className="color-control">
                    <input
                      type="color"
                      name="color"
                      value={form.color}
                      onChange={updateForm}
                    />
                    <span>{form.color}</span>
                  </div>
                </label>
              </div>

              <div className="preview-label">LIVE PREVIEW</div>
              <div
                className="live-preview"
                style={{
                  backgroundColor: form.bg,
                  color: form.fontColor,
                  fontSize: `${form.fontSize}px`,
                  fontStyle: form.fontStyle,
                  borderLeft: `5px solid ${form.color}`,
                }}
              >
                <strong>{form.title || "Your assessment title"}</strong>
                <span>{form.subject || "Your subject name"}</span>
                <small>{form.deadline ? formatDate(form.deadline) : "Choose a deadline"}</small>
              </div>

              <div className="form-actions">
                <button type="button" className="secondary-button" onClick={() => setForm(emptyForm)}>
                  Reset
                </button>
                <button type="submit" className="primary-button">
                  ＋ Add assessment
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="content-grid" id="assessment-list">
          <div className="assessment-panel">
            <div className="list-heading">
              <div>
                <p className="eyebrow">YOUR TO-DO LIST</p>
                <h2>Assessment plans</h2>
                <p className="panel-subtitle">Keep every task in one place.</p>
              </div>
              <span className="count-badge">{visiblePlans.length} tasks</span>
            </div>

            <div className="toolbar">
              <div className="search-box">
                <span>⌕</span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search assessments..."
                />
              </div>
              <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="All">All status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="plan-list">
              {visiblePlans.map((plan) => (
                <article
                  className="plan-card"
                  key={plan.id}
                  style={{
                    backgroundColor: plan.bg,
                    color: plan.fontColor,
                    fontSize: `${plan.fontSize}px`,
                    fontStyle: plan.fontStyle,
                    borderLeft: `4px solid ${plan.color}`,
                  }}
                >
                  <div className="plan-main">
                    <div className="subject-dot" style={{ background: plan.color }} />
                    <div className="plan-info">
                      <span className="subject-name">{plan.subject}</span>
                      <h3>{plan.title}</h3>
                      <div className="deadline-line">
                        <span>◷</span> {formatDate(plan.deadline)}
                        <span className="deadline-separator">·</span>
                        <span className={
                          plan.status !== "Completed" && plan.deadline &&
                          new Date(plan.deadline + "T00:00:00") < new Date(new Date().setHours(0,0,0,0))
                            ? "overdue"
                            : ""
                        }>
                          {deadlineLabel(plan.deadline, plan.status)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="plan-actions">
                    <select
                      className={`status-select ${plan.status.toLowerCase().replace(" ", "-")}`}
                      value={plan.status}
                      onChange={(e) => changeStatus(plan.id, e.target.value)}
                      aria-label={`Change status for ${plan.title}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                    <button
                      className="delete-button"
                      onClick={() => deletePlan(plan.id)}
                      title="Delete assessment"
                      aria-label={`Delete ${plan.title}`}
                    >
                      🗑
                    </button>
                  </div>
                </article>
              ))}

              {visiblePlans.length === 0 && (
                <div className="empty-state">
                  <div className="empty-icon">▤</div>
                  <h3>No assessments found</h3>
                  <p>Try another search or add a new assessment.</p>
                  <button className="primary-button" onClick={() => setShowForm(true)}>
                    ＋ Create assessment
                  </button>
                </div>
              )}
            </div>
          </div>

          <aside className="right-column">
            <div className="progress-panel">
              <p className="eyebrow">YOUR ACHIEVEMENTS</p>
              <h2>Progress overview</h2>
              <div
                className="progress-ring"
                style={{
                  background: `conic-gradient(#7357F6 ${progress * 3.6}deg, #EEEAFB 0deg)`,
                }}
              >
                <div className="progress-ring-inner">
                  <strong>{progress}%</strong>
                  <span>completed</span>
                </div>
              </div>
              <h3>{progress === 100 && counts.total ? "Amazing work!" : "You're making progress!"}</h3>
              <p className="progress-description">
                {counts.completed} out of {counts.total} assessments completed.
              </p>
              <div className="progress-bar">
                <span style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="deadline-panel">
              <div className="deadline-panel-icon">◷</div>
              <p className="eyebrow">UP NEXT</p>
              {plans.filter((p) => p.status !== "Completed" && p.deadline)
                .sort((a, b) => a.deadline.localeCompare(b.deadline))
                .slice(0, 1)
                .map((plan) => (
                  <div key={plan.id}>
                    <h3>{plan.title}</h3>
                    <p>{plan.subject}</p>
                    <div className="next-deadline">
                      <span>Deadline</span>
                      <strong>{formatDate(plan.deadline)}</strong>
                    </div>
                    <div className="next-deadline">
                      <span>Time left</span>
                      <strong>{deadlineLabel(plan.deadline, plan.status)}</strong>
                    </div>
                  </div>
                ))}
              {plans.every((p) => p.status === "Completed" || !p.deadline) && (
                <div>
                  <h3>You're all caught up!</h3>
                  <p>No upcoming deadlines. Great job!</p>
                </div>
              )}
            </div>

            <div className="tip-panel">
              <span className="tip-sparkle">✦</span>
              <div>
                <h3>Study tip</h3>
                <p>Break large assignments into smaller tasks and finish them one by one.</p>
              </div>
            </div>
          </aside>
        </section>

        <footer className="footer">
          <span>StudyFlow © 2026</span>
          <span>Plan smart. Learn better. ✦</span>
        </footer>
      </main>
    </div>
  );
}

export default App;

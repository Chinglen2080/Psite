import { type ReactNode, useEffect, useState } from "react"

type ProjectLink = {
  label: string
  href: string
}

type Project = {
  title: string
  description: string
  link: string
  tag: string
  action: string
  image?: string
  imageAlt?: string
  relatedLinks?: ProjectLink[]
}

type SiteContent = {
  name: string
  intro: string
  about: string
  now: string
  location: string
  email: string
  projects: Project[]
}

const starterContent: SiteContent = {
  name: "Pradhya",
  intro: "I build communication tools for a more resilient internet.",
  about:
    "I’m a student developer in Manipur, India. Project Enclave began with a local problem: internet shutdowns can take everyday services with them. I’m exploring a different shape for software—one where people and devices can still connect directly when a central service is out.",
  now: "I’m iterating on Enclave Messenger, testing its available transports, and making it easier for people to install and understand. It’s an early project, and I’m sharing the progress as I go.",
  location: "Manipur, India",
  email: "contact@projectenclave.dev",
  projects: [
    {
      title: "Enclave Messenger",
      description:
        "An early peer-to-peer messenger with end-to-end encrypted messages, web and terminal interfaces, and no central chat server. Current transport work includes LAN, Bluetooth, an internet DHT, and send-only SMS; LoRa is planned.",
      link: "https://github.com/Project-Enclave/Enclave-Messenger",
      tag: "active build · Python",
      action: "Browse the code",
      image:
        "https://cdn.hackclub.com/01a0b4f9-633d-7b26-ac79-01f84c65c0be/Fri%20Sep%20%204%2004-29-55%20PM%20IST%202026%20Web-hero.jpg",
      imageAlt: "Enclave Messenger’s web interface",
      relatedLinks: [
        {
          label: "Setup guide",
          href: "https://messenger.docs.projectenclave.dev",
        },
        {
          label: "Releases",
          href: "https://github.com/Project-Enclave/Enclave-Messenger/releases/latest",
        },
      ],
    },
    {
      title: "Project Enclave",
      description:
        "A longer-term effort to reduce reliance on one server or company. The messenger is its first project; distributed publishing and self-hosted sites are ideas for later.",
      link: "https://projectenclave.dev/",
      tag: "the wider idea · in progress",
      action: "Visit the project site",
    },
  ],
}

const legacyPlaceholders = {
  name: "your name",
  intro: "I make small things for the internet.",
  about:
    "This is my little corner of the web. I like making useful things, learning in public, and following ideas that seem interesting.",
  now: "Learning how to make websites feel more human, keeping a tiny sketchbook, and looking for a new song to play on repeat.",
  location: "somewhere on the internet",
  email: "hello@example.com",
  projects: [
    "A tiny useful thing",
    "My favorite experiment",
    "Something in progress",
  ],
}

function loadContent(): SiteContent {
  try {
    const saved = localStorage.getItem("personal-site-content")
    if (!saved) return starterContent

    const parsed = JSON.parse(saved) as Partial<SiteContent>
    const content = { ...starterContent, ...parsed }
    const projects = Array.isArray(parsed.projects)
      ? parsed.projects.flatMap((project, index) => {
          if (project.title !== legacyPlaceholders.projects[index])
            return [project]
          return starterContent.projects[index]
            ? [starterContent.projects[index]]
            : []
        })
      : starterContent.projects

    return {
      ...content,
      name:
        content.name === legacyPlaceholders.name
          ? starterContent.name
          : content.name,
      intro:
        content.intro === legacyPlaceholders.intro
          ? starterContent.intro
          : content.intro,
      about:
        content.about === legacyPlaceholders.about
          ? starterContent.about
          : content.about,
      now:
        content.now === legacyPlaceholders.now
          ? starterContent.now
          : content.now,
      location:
        content.location === legacyPlaceholders.location
          ? starterContent.location
          : content.location,
      email:
        content.email === legacyPlaceholders.email
          ? starterContent.email
          : content.email,
      projects,
    }
  } catch {
    return starterContent
  }
}

function Icon({
  name,
}: {
  name: "edit" | "arrow" | "moon" | "sun" | "plus" | "close"
}) {
  const paths = {
    edit: (
      <>
        <path d="m4 16-.8 4 4-.8L18.4 8 15.9 5.6 4 16Z" />
        <path d="m14.8 6.7 2.5 2.5" />
      </>
    ),
    arrow: <path d="M5 12h13M13 6l6 6-6 6" />,
    moon: <path d="M20 15.2A8 8 0 0 1 8.8 4 8.2 8.2 0 1 0 20 15.2Z" />,
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

function EditableText({
  value,
  onChange,
  edit,
  multiline = false,
  className = "",
}: {
  value: string
  onChange: (value: string) => void
  edit: boolean
  multiline?: boolean
  className?: string
}) {
  if (!edit) {
    return multiline ? (
      <p className={className}>{value}</p>
    ) : (
      <span className={className}>{value}</span>
    )
  }

  if (multiline) {
    return (
      <textarea
        className={"edit-field " + className}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    )
  }

  return (
    <input
      className={"edit-field " + className}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  )
}

function ExternalLink({
  href,
  children,
}: {
  href: string
  children: ReactNode
}) {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  )
}

export default function App() {
  const [content, setContent] = useState<SiteContent>(loadContent)
  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState(false)
  const [dark, setDark] = useState(
    () => localStorage.getItem("personal-site-mode") === "dark",
  )

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light"
    localStorage.setItem("personal-site-mode", dark ? "dark" : "light")
  }, [dark])

  const update = <K extends keyof SiteContent,>(
    key: K,
    value: SiteContent[K],
  ) => {
    setContent((current) => ({ ...current, [key]: value }))
  }

  const updateProject = (index: number, key: keyof Project, value: string) => {
    setContent((current) => ({
      ...current,
      projects: current.projects.map((project, projectIndex) =>
        projectIndex === index ? { ...project, [key]: value } : project,
      ),
    }))
  }

  const save = () => {
    localStorage.setItem("personal-site-content", JSON.stringify(content))
    setEditing(false)
    setSaved(true)
    window.setTimeout(() => setSaved(false), 1800)
  }

  const addProject = () => {
    update("projects", [
      ...content.projects,
      {
        title: "A new project",
        description: "What are you exploring?",
        link: "https://",
        tag: "in progress",
        action: "Open project",
      },
    ])
  }

  const deleteProject = (index: number) => {
    update(
      "projects",
      content.projects.filter((_, projectIndex) => projectIndex !== index),
    )
  }

  return (
    <div className="page-shell" id="top">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <header className="site-header">
        <a className="logo" href="#top" aria-label={content.name + " — home"}>
          <span>~/</span>
          {content.name}
        </a>

        <nav aria-label="Main navigation">
          <a href="#work">work</a>
          <a href="#about">about</a>
          <a href="#now">now</a>
          <button
            className="nav-button theme-button"
            onClick={() => setDark((value) => !value)}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            aria-pressed={dark}
          >
            <Icon name={dark ? "sun" : "moon"} />
          </button>
          <button
            className={"nav-button edit-button " + (editing ? "active" : "")}
            onClick={() => (editing ? save() : setEditing(true))}
            aria-pressed={editing}
          >
            <Icon name="edit" />
            {editing ? "save" : "edit"}
          </button>
        </nav>
      </header>

      {editing && (
        <div className="edit-notice" role="status">
          <span className="status-dot" />
          edit mode is on — update a highlighted field, then save
        </div>
      )}
      {saved && (
        <div className="saved-toast" role="status">
          changes saved in this browser
        </div>
      )}

      <main id="main-content">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="eyebrow-mark" />
              student developer <span className="eyebrow-divider">/</span>{" "}
              Manipur, India
            </p>
            <h1 id="hero-title">
              Hi, I’m{" "}
              <em>
                <EditableText
                  value={content.name}
                  onChange={(value) => update("name", value)}
                  edit={editing}
                />
              </em>
              .
              <br />
              <EditableText
                value={content.intro}
                onChange={(value) => update("intro", value)}
                edit={editing}
              />
            </h1>
            <p className="hero-description">
              I’m working on Project Enclave: experiments in communication and
              publishing that depend less on central services.
            </p>
            <p className="small-note">
              // small steps toward software that can keep connecting
            </p>
            <div className="button-row">
              <a className="button primary-button" href="#work">
                see what I’m building <Icon name="arrow" />
              </a>
              <a
                className="button ghost-button"
                href={"mailto:" + content.email}
              >
                say hello
              </a>
            </div>
          </div>

          <div
            className="network-card"
            aria-label="A direct connection between two peers"
          >
            <div className="network-card-header">
              <span>FIELD NOTE 001</span>
              <span className="network-status">
                <span className="status-dot" /> in development
              </span>
            </div>
            <div className="network-diagram" aria-hidden="true">
              <div className="network-node">
                <span className="node-symbol">01</span>
                <span>peer one</span>
              </div>
              <div className="network-link">
                <span>direct · p2p</span>
              </div>
              <div className="network-node">
                <span className="node-symbol node-symbol-alt">02</span>
                <span>peer two</span>
              </div>
            </div>
            <div className="network-card-footer">
              <span>no central chat server</span>
              <span className="network-signal" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
              </span>
            </div>
          </div>
        </section>

        <div className="divider" />

        <section
          id="work"
          className="content-section"
          aria-labelledby="work-title"
        >
          <div className="section-heading">
            <div>
              <p className="section-kicker">01 / selected work</p>
              <h2 id="work-title">Building Enclave</h2>
            </div>
            <p className="section-aside">
              An independent project, learning in the open.
            </p>
          </div>

          <div className="project-grid">
            {content.projects.map((project, index) => (
              <article
                className="card project-card"
                key={project.title + index}
              >
                {project.image && (
                  <div className="project-art">
                    <img
                      src={project.image}
                      alt={project.imageAlt || ""}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                )}

                <div className="project-content">
                  <div className="card-topline">
                    <span className="project-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="tag">
                      {editing ? (
                        <EditableText
                          value={project.tag}
                          onChange={(value) =>
                            updateProject(index, "tag", value)
                          }
                          edit
                        />
                      ) : (
                        project.tag
                      )}
                    </span>
                  </div>

                  <h3>
                    <EditableText
                      value={project.title}
                      onChange={(value) => updateProject(index, "title", value)}
                      edit={editing}
                    />
                  </h3>
                  <EditableText
                    value={project.description}
                    onChange={(value) =>
                      updateProject(index, "description", value)
                    }
                    edit={editing}
                    multiline
                    className="project-description"
                  />

                  {editing ? (
                    <label className="link-editor">
                      project URL
                      <EditableText
                        value={project.link}
                        onChange={(value) =>
                          updateProject(index, "link", value)
                        }
                        edit
                      />
                    </label>
                  ) : (
                    <div className="project-actions">
                      <ExternalLink href={project.link}>
                        <span className="project-link">
                          {project.action || "open project"}{" "}
                          <Icon name="arrow" />
                        </span>
                      </ExternalLink>
                      {project.relatedLinks?.map((relatedLink) => (
                        <ExternalLink
                          key={relatedLink.href}
                          href={relatedLink.href}
                        >
                          <span className="related-link">
                            {relatedLink.label}
                          </span>
                        </ExternalLink>
                      ))}
                    </div>
                  )}

                  {editing && (
                    <button
                      className="remove-button"
                      onClick={() => deleteProject(index)}
                    >
                      <Icon name="close" /> remove
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
          {editing && (
            <button className="add-button" onClick={addProject}>
              <Icon name="plus" /> add project
            </button>
          )}
        </section>

        <div className="divider" />

        <section
          id="about"
          className="content-section"
          aria-labelledby="about-title"
        >
          <div className="section-heading">
            <div>
              <p className="section-kicker">02 / the reason</p>
              <h2 id="about-title">Why this work matters to me</h2>
            </div>
          </div>

          <div className="about-grid">
            <div className="card about-card">
              <span className="about-mark" aria-hidden="true">
                “
              </span>
              <EditableText
                value={content.about}
                onChange={(value) => update("about", value)}
                edit={editing}
                multiline
              />
            </div>
            <div className="card details-card">
              <p className="section-kicker">A few coordinates</p>
              <dl>
                <div>
                  <dt>based</dt>
                  <dd>
                    <EditableText
                      value={content.location}
                      onChange={(value) => update("location", value)}
                      edit={editing}
                    />
                  </dd>
                </div>
                <div>
                  <dt>building</dt>
                  <dd>
                    <ExternalLink href="https://projectenclave.dev/">
                      Project Enclave
                    </ExternalLink>
                  </dd>
                </div>
                <div>
                  <dt>stage</dt>
                  <dd>
                    <span className="status-dot" /> early development
                  </dd>
                </div>
                <div>
                  <dt>contact</dt>
                  <dd>
                    {editing ? (
                      <EditableText
                        value={content.email}
                        onChange={(value) => update("email", value)}
                        edit
                      />
                    ) : (
                      <a href={"mailto:" + content.email}>{content.email}</a>
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <div className="divider" />

        <section
          id="now"
          className="content-section"
          aria-labelledby="now-title"
        >
          <div className="section-heading">
            <div>
              <p className="section-kicker">03 / right now</p>
              <h2 id="now-title">What I’m working on</h2>
            </div>
            <span className="live-badge">
              <span className="status-dot" /> current focus
            </span>
          </div>
          <div className="now-card">
            <EditableText
              value={content.now}
              onChange={(value) => update("now", value)}
              edit={editing}
              multiline
            />
            <div className="now-footer">
              <span>one step at a time</span>
              <span className="network-signal" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
              </span>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <p>Built with curiosity in Manipur. Still in progress.</p>
        <div>
          <ExternalLink href="https://projectenclave.dev/">
            Project Enclave
          </ExternalLink>
          <span aria-hidden="true">·</span>
          <a href="#top">back to top ↑</a>
        </div>
      </footer>
    </div>
  )
}

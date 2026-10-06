import { useEffect, useState } from "react"

// Set true to show the optional in-browser profile editor.
const PROFILE_EDITOR_ENABLED = false

type Project = {
  title: string
  description: string
  link: string
  tag: string
}

type SiteContent = {
  name: string
  nickname: string
  intro: string
  about: string
  now: string
  email: string
  projects: Project[]
}

type SocialLink = {
  name: string
  handle: string
  href?: string
  mark: string
}

const starterContent: SiteContent = {
  name: "Pradhya",
  nickname: "Prad",
  intro: "a little corner of my internet",
  about:
    "I collect songs, get attached to fictional people, and make little corners of the internet feel like mine. I like imagining things that discomfort me for some reason.",
  now: "something",
  email: "pradhya@projectenclave.dev",
  projects: [
    {
      title: "Enclave Messenger",
      description:
        "A peer-to-peer messenger exploring ways to keep messages moving when central services are unreachable. Still early, still changing.",
      link: "https://github.com/Project-Enclave/Enclave-Messenger",
      tag: "currently building",
    },
    {
      title: "Project Enclave",
      description:
        "A longer-term project about communication and publishing with fewer single points of failure.",
      link: "https://projectenclave.dev/",
      tag: "the bigger idea",
    },
  ],
}

const favoriteArtists = [
  "akezu",
  "boywithuke",
  "hevlog",
  "toby fox",
  "msi",
  "the marías",
  "fish in a birdcage",
  "flavor foley",
  "mongopsy",
  "sleep token",
]

const favoriteSongs = [
  "alt vers.",
  "spider dance",
  "what do they know?",
  "no one noticed",
  "dangerous",
  "provider",
  "love in paradise",
  "shoot love you",
  "plot twist 10",
  "rule #34",
  "murder every 1 u know!",
  "internet dont listen",
]

const currentlyWatching = ["the ramparts of ice", "black clover"]

const finishedWatching = [
  "sakamoto days",
  "hell’s paradise",
  "spy x family",
  "bsd",
  "call of the night",
  "stranger things",
  "tadc",
  "murder drones",
  "the fragrant flower blooms with dignity",
]

const gamesAndFandoms = [
  "doki doki literature club",
  "murder drones",
  "the amazing digital circus",
  "fundamental paper education",
  "rusty lake",
]

const socialLinks: SocialLink[] = [
  {
    name: "Tumblr",
    handle: "@pradhya",
    href: "https://www.tumblr.com/pradhya",
    mark: "t",
  },
  {
    name: "Spotify",
    handle: "my profile",
    href: "https://open.spotify.com/user/31e6l2oz36qiqyncuc3m5yqthsze?si=nVw1QiB8S0mN_wvMNzfiVg",
    mark: "♫",
  },
  {
    name: "Telegram",
    handle: "@pradhyaa",
    href: "https://t.me/pradhyaa",
    mark: "↗",
  },
  {
    name: "Instagram",
    handle: "@prad.hya_",
    href: "https://www.instagram.com/prad.hya_/",
    mark: "◎",
  },
  {
    name: "GitHub",
    handle: "@chinglen2080",
    href: "https://github.com/chinglen2080",
    mark: "⌘",
  },
  {
    name: "Discord",
    handle: "@chinglenalt",
    mark: "☁",
  },
]

const portraitImage =
  "https://64.media.tumblr.com/224f719f13b948368ba6ee3ea9c9ad61/19a56e52e6bf425e-16/s2048x3072/957ab3fd92ac18fdd554a6c8152f1d2e3e860e89.jpg"

function loadContent(): SiteContent {
  try {
    const saved = localStorage.getItem("personal-site-content")
    if (!saved) return starterContent

    const parsed = JSON.parse(saved) as Partial<SiteContent>
    const content = { ...starterContent, ...parsed }

    if (content.name === "your name") content.name = starterContent.name
    if (content.email === "hello@example.com")
      content.email = starterContent.email
    if (content.email === "contact@projectenclave.dev") {
      content.email = starterContent.email
    }
    if (content.intro === "I make small things for the internet.") {
      content.intro = starterContent.intro
    }
    if (
      content.intro ===
      "I build communication tools for a more resilient internet."
    ) {
      content.intro = starterContent.intro
    }
    if (
      content.about ===
      "This is my little corner of the web. I like making useful things, learning in public, and following ideas that seem interesting."
    ) {
      content.about = starterContent.about
    }
    if (
      content.about.startsWith("I’m a student developer in Manipur, India.")
    ) {
      content.about = starterContent.about
    }
    if (
      content.now.startsWith(
        "I’m iterating on Enclave Messenger, testing its available transports",
      )
    ) {
      content.now = starterContent.now
    }

    return content
  } catch {
    return starterContent
  }
}

function Icon({
  name,
}: {
  name: "arrow" | "moon" | "sun" | "edit" | "close" | "plus"
}) {
  const paths = {
    arrow: <path d="M5 12h13M13 6l6 6-6 6" />,
    moon: <path d="M20 15.2A8 8 0 0 1 8.8 4 8.2 8.2 0 1 0 20 15.2Z" />,
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </>
    ),
    edit: (
      <>
        <path d="m4 16-.8 4 4-.8L18.4 8 15.9 5.6 4 16Z" />
        <path d="m14.8 6.7 2.5 2.5" />
      </>
    ),
    close: <path d="m6 6 12 12M18 6 6 18" />,
    plus: <path d="M12 5v14M5 12h14" />,
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

function SocialCard({ item }: { item: SocialLink }) {
  const cardContent = (
    <>
      <span className="social-mark" aria-hidden="true">
        {item.mark}
      </span>
      <span className="social-copy">
        <span className="social-name">{item.name}</span>
        <span className="social-handle">{item.handle}</span>
      </span>
      <span className="social-arrow" aria-hidden="true">
        {item.href ? "↗" : "·"}
      </span>
    </>
  )

  return item.href ? (
    <a
      className="social-card"
      href={item.href}
      target="_blank"
      rel="noreferrer"
    >
      {cardContent}
    </a>
  ) : (
    <div className="social-card social-card-static">{cardContent}</div>
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
          <span className="logo-mark">✳</span>
          <span>{content.name}</span>
        </a>

        <nav aria-label="Main navigation">
          <a href="#music">music</a>
          <a href="#watchlist">shows</a>
          <a href="#links">links</a>
          <button
            className="theme-button"
            onClick={() => setDark((value) => !value)}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            aria-pressed={dark}
          >
            <Icon name={dark ? "sun" : "moon"} />
          </button>
          {PROFILE_EDITOR_ENABLED && (
            <button
              className={"edit-button " + (editing ? "active" : "")}
              onClick={() => (editing ? save() : setEditing(true))}
              aria-pressed={editing}
            >
              <Icon name="edit" />
              {editing ? "save" : "edit"}
            </button>
          )}
        </nav>
      </header>

      {PROFILE_EDITOR_ENABLED && editing && (
        <div className="edit-notice" role="status">
          <span className="status-dot" />
          edit mode is on — update a highlighted field, then save
        </div>
      )}
      {PROFILE_EDITOR_ENABLED && saved && (
        <div className="saved-toast" role="status">
          changes saved in this browser
        </div>
      )}

      <main id="main-content">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="eyebrow-mark" />
              she/her <span className="eyebrow-divider">·</span> minor
            </p>
            <span className="handwritten hero-wave">hiii, welcome in!</span>
            <h1 id="hero-title">
              <EditableText
                value={content.name}
                onChange={(value) => update("name", value)}
                edit={editing}
              />
              <span className="hero-period">!</span>
            </h1>
            <p className="hero-alias">
              or just{" "}
              <EditableText
                value={content.nickname}
                onChange={(value) => update("nickname", value)}
                edit={editing}
              />
              .
            </p>
            <p className="hero-intro">
              <EditableText
                value={content.intro}
                onChange={(value) => update("intro", value)}
                edit={editing}
              />
            </p>
            <p className="hero-note">
              music, fictional people & very specific internet corners
            </p>
            <div className="hero-stickers" aria-label="A few things I like">
              <span>songs on repeat</span>
              <span>fandom brain</span>
              <span>currently a wip</span>
            </div>
            <div className="button-row">
              <a className="button primary-button" href="#music">
                see my favorites <Icon name="arrow" />
              </a>
              <a
                className="button ghost-button"
                href="mailto:pradhya@projectenclave.dev"
              >
                say hi
              </a>
            </div>
          </div>

          <figure className="portrait-polaroid">
            <span className="tape-strip" aria-hidden="true" />
            <img src={portraitImage} alt="Profile image chosen by Pradhya" />
            <figcaption>one little piece of my internet</figcaption>
            <span className="portrait-stamp handwritten">
              made of tabs & feelings
            </span>
          </figure>
        </section>

        <div className="page-note">
          <span>last updated: 02 july 2026</span>
          <span>little personal corner · take a look around</span>
        </div>

        <section
          id="about"
          className="content-section about-section"
          aria-labelledby="about-title"
        >
          <div className="section-title">
            <div>
              <p className="section-kicker">01 / a little about me</p>
              <h2 id="about-title">the person behind the tabs</h2>
            </div>
            <span className="handwritten margin-note">
              hello from my side of the screen ♡
            </span>
          </div>

          <div className="about-grid">
            <article className="paper-card about-card">
              <span className="card-tape" aria-hidden="true" />
              <h3 className="handwritten">so, hi!</h3>
              <EditableText
                value={content.about}
                onChange={(value) => update("about", value)}
                edit={editing}
                multiline
              />
            </article>

            <aside className="paper-card quick-facts">
              <p className="section-kicker">tiny facts</p>
              <dl>
                <div>
                  <dt>name</dt>
                  <dd>Pradhya / Prad</dd>
                </div>
                <div>
                  <dt>pronouns</dt>
                  <dd>she / her</dd>
                </div>
                <div>
                  <dt>vibe</dt>
                  <dd>INTJ // IST</dd>
                </div>
                <div>
                  <dt>messages</dt>
                  <dd>open, but I might be slow</dd>
                </div>
              </dl>
              <p className="handwritten fact-doodle">moots welcome :)</p>
            </aside>
          </div>
        </section>

        <section
          id="music"
          className="content-section music-section"
          aria-labelledby="music-title"
        >
          <div className="section-title">
            <div>
              <p className="section-kicker">02 / things in my headphones</p>
              <h2 id="music-title">music i keep coming back to</h2>
            </div>
            <span className="handwritten margin-note">volume up, probably</span>
          </div>

          <div className="music-now paper-card">
            <span className="tape-strip tape-small" aria-hidden="true" />
            <div>
              <p className="section-kicker">
                currently listening · from my july intro
              </p>
              <p className="now-song handwritten">{content.now}</p>
            </div>
            <span className="music-scribble" aria-hidden="true">
              ♫ ♪ ♫
            </span>
          </div>

          <div className="music-grid">
            <article className="paper-card list-card artists-card">
              <div className="card-label-row">
                <h3 className="handwritten">artists i like</h3>
                <span className="doodle-star" aria-hidden="true">
                  ✳
                </span>
              </div>
              <div className="tag-cloud">
                {favoriteArtists.map((artist) => (
                  <span className="tag" key={artist}>
                    {artist}
                  </span>
                ))}
              </div>
            </article>

            <article className="paper-card list-card songs-card">
              <div className="card-label-row">
                <h3 className="handwritten">favorite songs</h3>
                <span className="handwritten song-note">shuffle forever</span>
              </div>
              <ol className="song-list">
                {favoriteSongs.map((song, index) => (
                  <li key={song}>
                    <span className="song-index">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{song}</span>
                  </li>
                ))}
              </ol>
              <p className="disclaimer">
                “Plot Twist 10” is a favorite; I’m not the artist Oricade.
              </p>
            </article>
          </div>
        </section>

        <section
          id="watchlist"
          className="content-section shows-section"
          aria-labelledby="shows-title"
        >
          <div className="section-title">
            <div>
              <p className="section-kicker">
                03 / currently in fictional worlds
              </p>
              <h2 id="shows-title">shows, anime & other brain space</h2>
            </div>
            <span className="handwritten margin-note">one more episode</span>
          </div>

          <div className="watch-grid">
            <article className="paper-card watch-card current-watch">
              <span className="mini-stamp">on screen now</span>
              <h3 className="handwritten">currently watching</h3>
              <ul className="plain-list">
                {currentlyWatching.map((show) => (
                  <li key={show}>{show}</li>
                ))}
              </ul>
            </article>
            <article className="paper-card watch-card next-watch">
              <span className="mini-stamp mini-stamp-coral">up next</span>
              <h3 className="handwritten">plan to watch</h3>
              <ul className="plain-list">
                <li>frieren</li>
              </ul>
            </article>
            <article className="paper-card watch-card finished-watch">
              <span className="mini-stamp mini-stamp-purple">
                the list keeps growing
              </span>
              <h3 className="handwritten">finished</h3>
              <div className="tag-cloud compact-tags">
                {finishedWatching.map((show) => (
                  <span className="tag" key={show}>
                    {show}
                  </span>
                ))}
              </div>
            </article>
          </div>

          <article className="paper-card fandom-card">
            <div>
              <p className="section-kicker">game worlds & fandoms</p>
              <h3 className="handwritten">things i’m into</h3>
            </div>
            <div className="tag-cloud">
              {gamesAndFandoms.map((fandom) => (
                <span className="tag" key={fandom}>
                  {fandom}
                </span>
              ))}
            </div>
          </article>
        </section>

        <section
          className="content-section note-section"
          aria-label="A random thought"
        >
          <article className="thought-card">
            <span className="thought-spark" aria-hidden="true">
              ✦
            </span>
            <p className="section-kicker">random thought, left here</p>
            <blockquote className="handwritten">
              I like imagining things that discomfort me for some reason.
            </blockquote>
            <span
              className="thought-spark thought-spark-bottom"
              aria-hidden="true"
            >
              ✧
            </span>
          </article>
        </section>

        <section
          id="links"
          className="content-section links-section"
          aria-labelledby="links-title"
        >
          <div className="section-title">
            <div>
              <p className="section-kicker">04 / find me around</p>
              <h2 id="links-title">the links page within the page</h2>
            </div>
            <span className="handwritten margin-note">
              most places: @chinglen2080
            </span>
          </div>

          <div className="social-grid">
            {socialLinks.map((item) => (
              <SocialCard item={item} key={item.name} />
            ))}
            <a
              className="social-card email-card"
              href="mailto:pradhya@projectenclave.dev"
            >
              <span className="social-mark" aria-hidden="true">
                @
              </span>
              <span className="social-copy">
                <span className="social-name">Email</span>
                <span className="social-handle">
                  pradhya@projectenclave.dev
                </span>
              </span>
              <span className="social-arrow" aria-hidden="true">
                ↗
              </span>
            </a>
          </div>
          <div className="social-footnote">
            <span className="status-dot" />
            DMs are open · moots welcome · replies are not guaranteed
          </div>
        </section>

        <section
          id="projects"
          className="content-section projects-section"
          aria-labelledby="projects-title"
        >
          <div className="section-title">
            <div>
              <p className="section-kicker">05 / things i’m helping make</p>
              <h2 id="projects-title">a tiny project corner</h2>
            </div>
          </div>

          <div className="project-grid">
            {content.projects.map((project, index) => (
              <article
                className="paper-card project-card"
                key={project.title + index}
              >
                <div className="card-label-row">
                  <span className="project-number">0{index + 1}</span>
                  <span className="tag">{project.tag}</span>
                </div>
                <h3 className="handwritten">
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
                />
                {editing ? (
                  <label className="link-editor">
                    link
                    <EditableText
                      value={project.link}
                      onChange={(value) => updateProject(index, "link", value)}
                      edit
                    />
                  </label>
                ) : (
                  <a
                    className="text-link"
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    open project <Icon name="arrow" />
                  </a>
                )}
                {editing && (
                  <button
                    className="remove-button"
                    onClick={() => deleteProject(index)}
                  >
                    <Icon name="close" /> remove
                  </button>
                )}
              </article>
            ))}
          </div>
          {editing && (
            <button className="add-button" onClick={addProject}>
              <Icon name="plus" /> add project
            </button>
          )}
        </section>
      </main>

      <footer className="site-footer">
        <p>made with love, too many tabs, and a very specific playlist.</p>
        <div>
          <a href="mailto:pradhya@projectenclave.dev">say hi</a>
          <span aria-hidden="true">·</span>
          <a href="#top">back to top ↑</a>
        </div>
      </footer>
    </div>
  )
}

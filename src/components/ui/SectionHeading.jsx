// Small eyebrow label + larger display heading — the recurring header
// pattern every content section (About, Skills, Projects, ...) builds on.
// `id` (when passed) lands on the <h2> so the parent <section> can point
// `aria-labelledby` at it, giving the section an accessible name/landmark
// instead of being an unnamed generic container.
export default function SectionHeading({ eyebrow, title, id, className = "" }) {
  return (
    <div className={`mb-12 ${className}`}>
      {eyebrow && (
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">
          {eyebrow}
        </p>
      )}
      <h2 id={id} className="font-display text-text">
        {title}
      </h2>
    </div>
  );
}

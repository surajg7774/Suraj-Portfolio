// Small pill/tag element — used for skill chips and project tech-stack tags.
// `data-badge` gives callers (e.g. ProjectCaseStudy's tech-stack stage) a
// stable selector to stagger these in without a wrapper element.
export default function Badge({ children, className = "" }) {
  return (
    <span
      data-badge
      className={`inline-flex items-center rounded-full border border-white/10 bg-bg/60 px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-textMuted ${className}`}
    >
      {children}
    </span>
  );
}

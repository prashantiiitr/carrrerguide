export default function Empty({ title = "Nothing here yet", hint }) {
  return (
    <div className="text-center py-10 border border-neutral-800 rounded-2xl bg-neutral-900/40">
      <div className="text-lg font-medium">{title}</div>
      {hint ? <div className="subtle mt-1">{hint}</div> : null}
    </div>
  );
}

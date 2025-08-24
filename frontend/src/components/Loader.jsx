export default function Loader({ text = "Loading..." }) {
  return (
    <div className="flex items-center justify-center gap-2 text-sm subtle">
      <span className="inline-block h-2 w-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.2s]" />
      <span className="inline-block h-2 w-2 rounded-full bg-indigo-500 animate-bounce" />
      <span className="inline-block h-2 w-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
      <span className="ml-2">{text}</span>
    </div>
  );
}

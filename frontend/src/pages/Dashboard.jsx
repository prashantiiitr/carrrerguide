import { useEffect, useMemo, useState } from "react";
import API from "../api/api";
import toast from "react-hot-toast";

function Tabs({ tab, setTab }) {
  const base = "px-4 py-2 rounded-xl border border-neutral-800";
  const active = base + " bg-indigo-600 text-white";
  const idle = base + " bg-neutral-900/40 text-neutral-300 hover:bg-neutral-900";
  return (
    <div className="flex gap-2">
      <button className={tab==="roadmap"?active:idle} onClick={()=>setTab("roadmap")}>Roadmap</button>
      <button className={tab==="projects"?active:idle} onClick={()=>setTab("projects")}>Projects</button>
      <button className={tab==="mock"?active:idle} onClick={()=>setTab("mock")}>Mock Interview</button>
    </div>
  );
}

function Card({ title, value, hint }) {
  return (
    <div className="card">
      <div className="subtle">{title}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
      {hint ? <div className="subtle mt-1">{hint}</div> : null}
    </div>
  );
}

function Track({ track }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="font-medium">{track.name}</div>
        <button className="btn" onClick={()=>setOpen(o=>!o)}>{open ? "Collapse" : "Expand"}</button>
      </div>
      {open && (
        <div className="mt-4 grid gap-3">
          {track.weeks.map((w) => (
            <div key={w.week} className="rounded-xl border border-neutral-800 p-4">
              <div className="font-medium">Week {w.week}: {w.focus}</div>
              {w.outcomes?.length ? (
                <ul className="list-disc ml-5 subtle mt-2">{w.outcomes.map((o, i) => <li key={i}>{o}</li>)}</ul>
              ) : null}
              {w.resources?.length ? (
                <div className="mt-2">
                  <div className="subtle">Resources</div>
                  <ul className="list-disc ml-5">
                    {w.resources.map((r, i) => (
                      <li key={i}><a className="navlink" href={r.url} target="_blank" rel="noreferrer">{r.title}</a></li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectsTab() {
  const [loading, setLoading] = useState(true);
  const [doc, setDoc] = useState(null);
  const [form, setForm] = useState({ targetRole: "Frontend Developer", useDb: true });

  const load = async () => {
    try { const { data } = await API.get("/ai/projects"); setDoc(data); }
    catch { /* ok, none yet */ }
    finally { setLoading(false); }
  };
  useEffect(()=>{ load(); },[]);

  const generate = async () => {
    setLoading(true);
    try {
      const { data } = await API.post("/ai/projects", form);
      setDoc(data);
      toast.success("Projects generated");
    } finally { setLoading(false); }
  };

  return (
    <div className="grid gap-6">
      <div className="card grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <label className="subtle">Target Role</label>
          <input className="input mt-1" value={form.targetRole} onChange={e=>setForm(f=>({...f, targetRole:e.target.value}))}/>
        </div>
        <div className="flex items-end">
          <label className="inline-flex items-center gap-2 subtle">
            <input type="checkbox" className="accent-indigo-500" checked={form.useDb}
              onChange={e=>setForm(f=>({...f, useDb:e.target.checked}))}/>
            Use my saved Skills
          </label>
        </div>
        <div className="md:col-span-3 flex justify-end">
          <button className="btn" onClick={generate} disabled={loading}>
            {doc ? "Regenerate" : "Generate Projects"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="subtle">Loading projects...</div>
      ) : doc?.projects?.length ? (
        <div className="grid md:grid-cols-2 gap-4">
          {doc.projects.map((p, i) => (
            <div key={i} className="card grid gap-2">
              <div className="font-medium">{p.title} <span className="subtle">• {p.difficulty}</span></div>
              <div className="subtle">{p.description}</div>
              {p.steps?.length ? (
                <div>
                  <div className="subtle">Steps</div>
                  <ul className="list-disc ml-5">{p.steps.map((s, j)=><li key={j}>{s}</li>)}</ul>
                </div>
              ) : null}
              {p.resources?.length ? (
                <div>
                  <div className="subtle">Resources</div>
                  <ul className="list-disc ml-5">
                    {p.resources.map((r, j)=><li key={j}><a className="navlink" href={r.url} target="_blank">{r.title}</a></li>)}
                  </ul>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <div className="card"><div className="subtle">No projects yet. Click “Generate Projects”.</div></div>
      )}
    </div>
  );
}

function MockTab() {
  const [loading, setLoading] = useState(true);
  const [doc, setDoc] = useState(null);
  const [form, setForm] = useState({
    targetRole: "Frontend Developer",
    seniority: "Junior",
    numTechnical: 6,
    numBehavioral: 4,
    companyLevel: "Startup"
  });
  const [showAnswers, setShowAnswers] = useState({});

  const load = async () => {
    try { const { data } = await API.get("/ai/mock"); setDoc(data); }
    catch { /* ok */ }
    finally { setLoading(false); }
  };
  useEffect(()=>{ load(); },[]);

  const generate = async () => {
    setLoading(true);
    try {
      const { data } = await API.post("/ai/mock", form);
      setDoc(data);
      setShowAnswers({});
      toast.success("Mock questions generated");
    } finally { setLoading(false); }
  };

  const toggle = (key) => setShowAnswers(s => ({...s, [key]: !s[key]}));

  return (
    <div className="grid gap-6">
      <div className="card grid gap-4 md:grid-cols-5">
        <div>
          <label className="subtle">Target Role</label>
          <input className="input mt-1" value={form.targetRole}
                 onChange={e=>setForm(f=>({...f, targetRole:e.target.value}))}/>
        </div>

        <div>
          <label className="subtle">Seniority</label>
          <select className="select mt-1" value={form.seniority}
                  onChange={e=>setForm(f=>({...f, seniority:e.target.value}))}>
            <option>Junior</option>
            <option>Mid</option>
            <option>Senior</option>
          </select>
        </div>

        <div>
          <label className="subtle">Company Level</label>
          <select className="select mt-1" value={form.companyLevel}
                  onChange={e=>setForm(f=>({...f, companyLevel:e.target.value}))}>
            <option>Startup</option>
            <option>Mid</option>
            <option>MNC</option>
            <option>FAANG</option>
          </select>
        </div>

        <div>
          <label className="subtle"># Technical</label>
          <input className="input mt-1" type="number" min="1" max="20"
                 value={form.numTechnical}
                 onChange={e=>setForm(f=>({...f, numTechnical:Number(e.target.value)}))}/>
        </div>

        <div>
          <label className="subtle"># Behavioral</label>
          <input className="input mt-1" type="number" min="1" max="20"
                 value={form.numBehavioral}
                 onChange={e=>setForm(f=>({...f, numBehavioral:Number(e.target.value)}))}/>
        </div>

        <div className="md:col-span-5 flex justify-end">
          <button className="btn" onClick={generate} disabled={loading}>
            {doc ? "Regenerate" : "Generate Questions"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="subtle">Loading questions...</div>
      ) : doc?.mock ? (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="card">
            <div className="font-medium mb-2">Technical</div>
            <ul className="grid gap-3">
              {doc.mock.technical?.map((q, i)=>(
                <li key={`t-${i}`} className="rounded-xl border border-neutral-800 p-3">
                  <div className="font-medium">{q.question}</div>
                  <button className="btn mt-2" onClick={()=>toggle(`t-${i}`)}>
                    {showAnswers[`t-${i}`] ? "Hide Answer" : "Reveal Answer"}
                  </button>
                  {showAnswers[`t-${i}`] && <div className="subtle mt-2">{q.answer}</div>}
                </li>
              ))}
            </ul>
          </div>
          <div className="card">
            <div className="font-medium mb-2">Behavioral</div>
            <ul className="grid gap-3">
              {doc.mock.behavioral?.map((q, i)=>(
                <li key={`b-${i}`} className="rounded-xl border border-neutral-800 p-3">
                  <div className="font-medium">{q.question}</div>
                  <button className="btn mt-2" onClick={()=>toggle(`b-${i}`)}>
                    {showAnswers[`b-${i}`] ? "Hide Answer" : "Reveal Answer"}
                  </button>
                  {showAnswers[`b-${i}`] && <div className="subtle mt-2">{q.answer}</div>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="card"><div className="subtle">No questions yet. Click “Generate Questions”.</div></div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [tab, setTab] = useState("roadmap");

  // ROADMAP state (kept from previous session)
  const [loading, setLoading] = useState(true);
  const [roadmapDoc, setRoadmapDoc] = useState(null);
  const [genLoading, setGenLoading] = useState(false);
  const [form, setForm] = useState({ targetRole: "Frontend Developer", timePerDayHours: 2, useDb: true });
  const roadmap = roadmapDoc?.roadmap;

  const stats = useMemo(() => {
    const totalTracks = roadmap?.tracks?.length || 0;
    const totalWeeks = roadmap?.schedule?.totalWeeks || 0;
    const quickWins = roadmap?.quickWins?.length || 0;
    const metrics = roadmap?.metrics?.length || 0;
    return { totalTracks, totalWeeks, quickWins, metrics };
  }, [roadmap]);

  const load = async () => {
    try {
      const { data } = await API.get("/ai/roadmap");
      setRoadmapDoc(data);
    } catch { /* ok */ }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const generate = async () => {
    setGenLoading(true);
    try {
      const { data } = await API.post("/ai/roadmap", form);
      setRoadmapDoc(data);
      toast.success("Roadmap generated");
    } finally { setGenLoading(false); }
  };

  return (
    <div className="grid gap-6">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="heading">AI Dashboard</h2>
          <div className="subtle">Roadmap • Projects • Mock Interview</div>
        </div>
        <Tabs tab={tab} setTab={setTab} />
      </div>

      {tab === "roadmap" && (
        <>
          <div className="card grid gap-4 md:grid-cols-4">
            <div className="md:col-span-2">
              <label className="subtle">Target Role</label>
              <input className="input mt-1" name="targetRole"
                    value={form.targetRole}
                    onChange={(e)=>setForm(f=>({...f, targetRole:e.target.value}))}
                    placeholder="e.g., Frontend Developer" />
            </div>
            <div>
              <label className="subtle">Hours / Day</label>
              <input className="input mt-1" type="number" min="1" max="12"
                    value={form.timePerDayHours}
                    onChange={(e)=>setForm(f=>({...f, timePerDayHours: Number(e.target.value)}))} />
            </div>
            <div className="flex items-end">
              <label className="inline-flex items-center gap-2 subtle">
                <input type="checkbox" className="accent-indigo-500"
                      checked={form.useDb}
                      onChange={(e)=>setForm(f=>({...f, useDb: e.target.checked}))} />
                Use my saved Profile/Skills/Goals
              </label>
            </div>
            <div className="md:col-span-4 flex justify-end">
              <button className="btn" onClick={generate} disabled={genLoading}>
                {genLoading ? "Generating..." : (roadmap ? "Regenerate Roadmap" : "Generate Roadmap")}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="subtle">Loading roadmap...</div>
          ) : roadmap ? (
            <>
              <div className="grid md:grid-cols-4 gap-4">
                <Card title="Tracks" value={stats.totalTracks} />
                <Card title="Total Weeks" value={stats.totalWeeks} />
                <Card title="Quick Wins" value={stats.quickWins} />
                <Card title="Metrics" value={stats.metrics} />
              </div>

              <div className="card">
                <div className="font-medium mb-2">Summary</div>
                <div className="subtle">{roadmap.summary}</div>
              </div>

              {Array.isArray(roadmap.tracks) && roadmap.tracks.map((t, idx) => (
                <Track key={idx} track={t} />
              ))}

              <div className="grid md:grid-cols-2 gap-4">
                <div className="card">
                  <div className="font-medium">Quick Wins</div>
                  <ul className="list-disc ml-5 mt-2">
                    {roadmap.quickWins?.map((q, i) => <li key={i}>{q}</li>)}
                  </ul>
                </div>
                <div className="card">
                  <div className="font-medium">Risks</div>
                  <ul className="list-disc ml-5 mt-2">
                    {roadmap.risks?.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
              </div>

              {roadmap.metrics?.length ? (
                <div className="card">
                  <div className="font-medium">Metrics to Track</div>
                  <ul className="list-disc ml-5 mt-2">
                    {roadmap.metrics.map((m, i) => <li key={i}>{m}</li>)}
                  </ul>
                </div>
              ) : null}
            </>
          ) : (
            <div className="card"><div className="subtle">No roadmap yet. Click “Generate Roadmap”.</div></div>
          )}
        </>
      )}

      {tab === "projects" && <ProjectsTab />}
      {tab === "mock" && <MockTab />}
    </div>
  );
}

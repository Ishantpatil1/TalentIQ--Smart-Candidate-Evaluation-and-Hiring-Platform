import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Doughnut, Bar } from "react-chartjs-2";
import "./charts/chartSetup";
import { motion } from "framer-motion";
import JobBoard from "./JobBoard";
import Footer from "./Footer";

export default function CandidateHomeDashboard() {
  const token = localStorage.getItem("token");
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Trend selector
  const [trend, setTrend] = useState("monthly"); // weekly | monthly | yearly

  // ✅ “real-time” via polling
  useEffect(() => {
    let timer = null;

    const load = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/dashboard/candidate", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
        setErr("");
      } catch (e) {
        setErr("Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    load();
    timer = setInterval(load, 12000); // every 12s

    return () => clearInterval(timer);
  }, [token]);


  // ✅ Trend-aware top stats
  const topStats = useMemo(() => {
    const s = data?.stats || {};
    const totalApplied = s.totalApplied ?? 0;
    const totalInterviews = s.totalInterviews ?? 0;

    const weekly = s.last7 ?? 0;
    const monthly = s.last30 ?? 0;
    const yearly = s.last365 ?? s.last365Days ?? s.lastYear ?? (monthly * 12);

    const appliedInTrend =
      trend === "weekly" ? weekly : trend === "yearly" ? yearly : monthly;

    const label =
      trend === "weekly"
        ? "Applied (Last 7 days)"
        : trend === "yearly"
          ? "Applied (Last 365 days)"
          : "Applied (Last 30 days)";

    return {
      totalApplied,
      appliedInTrend,
      appliedInTrendLabel: label,
      totalInterviews,
      weekly,
      monthly,
      yearly,
    };
  }, [data, trend]);

  // ✅ Status -> Color mapping (Shortlisted green, Applied blue, Rejected red)
  const getStatusColor = (label) => {
    const s = String(label || "").trim().toLowerCase();
    if (s.includes("shortlist")) return "rgba(34,197,94,0.95)"; // green
    if (s.includes("reject")) return "rgba(239,68,68,0.95)"; // red
    if (s.includes("applied")) return "rgba(59,130,246,0.95)"; // blue
    return "rgba(139,92,246,0.95)"; // fallback purple
  };

  // ✅ Trend-aware status breakdown chart + fixed colors
  const statusChart = useMemo(() => {
    const s = data?.stats || {};

    const breakdown =
      trend === "weekly"
        ? s.statusBreakdownWeekly || s.statusBreakdownLast7 || s.statusBreakdown
        : trend === "yearly"
          ? s.statusBreakdownYearly || s.statusBreakdownLast365 || s.statusBreakdown
          : s.statusBreakdownMonthly || s.statusBreakdownLast30 || s.statusBreakdown;

    const safe = breakdown || {};
    const labels = Object.keys(safe);
    const values = labels.map((k) => safe[k]);

    const bg = labels.map((l) => getStatusColor(l));
    const border = labels.map((l) => getStatusColor(l).replace("0.95", "1"));

    return {
      labels,
      datasets: [
        {
          label: "Applications",
          data: values,
          backgroundColor: bg,
          borderColor: border,
          borderWidth: 2,
          hoverOffset: 10,
        },
      ],
    };
  }, [data, trend]);

  const statusChartOptions = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "68%",
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            boxWidth: 12,
            boxHeight: 12,
            padding: 14,
            font: { size: 12, weight: "600" },
          },
        },
        tooltip: {
          backgroundColor: "rgba(15, 23, 42, 0.92)",
          padding: 12,
          borderWidth: 1,
          borderColor: "rgba(148,163,184,0.25)",
        },
      },
    };
  }, []);

  // ✅ Bar gradient helper (SAFE)
  const barGradient = (ctx, c1, c2) => {
    const chart = ctx.chart;
    const { ctx: c, chartArea } = chart;
    if (!chartArea) return c1;
    const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    g.addColorStop(0, c1);
    g.addColorStop(1, c2);
    return g;
  };

  // ✅ Trend-aware BAR chart data (PLAIN OBJECT)
  const trendChart = useMemo(() => {
    const s = data?.stats || {};

    const arr =
      trend === "weekly"
        ? s.weeklyTrend || s.last7Trend || []
        : trend === "yearly"
          ? s.yearlyTrend || s.last365Trend || []
          : s.monthlyTrend || [];

    const fallbackMonthly = s.monthlyTrend || [];
    const useArr = arr.length ? arr : trend === "yearly" ? fallbackMonthly : arr;

    const labels = useArr.map((x) => x.month || x.label || x.day || x.week || "");
    const points = useArr.map((x) => x.count ?? 0);

    return {
      labels,
      datasets: [
        {
          label:
            trend === "weekly"
              ? "Applies (Daily)"
              : trend === "yearly"
                ? "Applies (Monthly)"
                : "Applies (Monthly)",
          data: points,
          borderWidth: 0,
          borderRadius: 14,
          maxBarThickness: 44,
        },
      ],
    };
  }, [data, trend]);

  // ✅ Trend-aware BAR options (colorful + clean)
  const trendChartOptions = useMemo(() => {
    const weeklyBar = ["rgba(34,197,94,1)", "rgba(59,130,246,0.55)"];
    const monthlyBar = ["rgba(99,102,241,1)", "rgba(236,72,153,0.55)"];
    const yearlyBar = ["rgba(245,158,11,1)", "rgba(239,68,68,0.55)"];

    const [c1, c2] =
      trend === "weekly" ? weeklyBar : trend === "yearly" ? yearlyBar : monthlyBar;

    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          labels: { font: { size: 12, weight: "700" } },
        },
        tooltip: {
          backgroundColor: "rgba(15, 23, 42, 0.92)",
          padding: 12,
          borderWidth: 1,
          borderColor: "rgba(148,163,184,0.25)",
        },
      },
      scales: {
        x: { grid: { display: false }, ticks: { maxRotation: 0, autoSkip: true } },
        y: { grid: { color: "rgba(148,163,184,0.18)" }, ticks: { precision: 0 } },
      },
      datasets: {
        bar: {
          backgroundColor: (ctx) => barGradient(ctx, c1, c2),
          hoverBackgroundColor: (ctx) => barGradient(ctx, c1, "rgba(255,255,255,0.35)"),
        },
      },
    };
  }, [trend]);

  const applicationsTable = data?.applications || [];

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px] text-slate-400 font-medium">
      Synchronizing your performance data...
    </div>
  );
  
  if (err) return (
    <div className="p-6 bg-red-50 text-red-500 rounded-2xl border border-red-100 mx-auto max-w-lg text-center my-10">
      {err}
    </div>
  );

  return (
    <div className="space-y-8 pb-10" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* HEADER / TREND SWITCH */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          color: "#fff"
        }}
      >
        <div>
          <h1 className="text-3xl font-black tracking-tight m-0">Performance <span className="text-indigo-400">Insights</span></h1>
          <p className="text-slate-400 font-medium mt-1 mb-0">Track your professional growth and application engagement.</p>
        </div>

        <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-1.5 shadow-inner">
          <button
            onClick={() => setTrend("weekly")}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${trend === "weekly" ? "bg-white text-slate-900 shadow-lg" : "text-black/70 hover:text-white"}`}
          >
            Weekly
          </button>
          <button
            onClick={() => setTrend("monthly")}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${trend === "monthly" ? "bg-white text-slate-900 shadow-lg" : "text-black/70 hover:text-white"}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setTrend("yearly")}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${trend === "yearly" ? "bg-white text-slate-900 shadow-lg" : "text-black/70 hover:text-white"}`}
          >
            Yearly
          </button>
        </div>
      </motion.div>

      {/* TOP STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Stat title="Total Applied" value={topStats.totalApplied} accent="linear-gradient(135deg,#6366f1,#8b5cf6)" delay={0.1} />
        <Stat
          title={topStats.appliedInTrendLabel}
          value={topStats.appliedInTrend}
          accent={
            trend === "weekly"
              ? "linear-gradient(135deg,#22c55e,#16a34a)"
              : trend === "yearly"
                ? "linear-gradient(135deg,#f59e0b,#f97316)"
                : "linear-gradient(135deg,#6366f1,#8b5cf6)"
          }
          delay={0.2}
        />
        <Stat title="Applied (Last 30 days)" value={topStats.monthly} accent="linear-gradient(135deg,#ec4899,#f43f5e)" delay={0.3} />
        <Stat title="Total Interviews" value={topStats.totalInterviews} accent="linear-gradient(135deg,#10b981,#059669)" delay={0.4} />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Outcome Distribution">
          <div className="h-[320px] pt-4">
            <Doughnut data={statusChart} options={statusChartOptions} />
          </div>
        </Card>

        <Card title={`Activity Trend (${trend.toUpperCase()})`}>
          <div className="h-[320px] pt-4">
            <Bar data={trendChart} options={trendChartOptions} />
          </div>
        </Card>
      </div>

      {/* APPLIED JOBS SNAPSHOT */}
      <Card title="Application Activity Log">
        <div className="overflow-x-auto mt-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 font-bold uppercase tracking-wider border-b border-slate-50">
                <th className="py-4 px-2">Role</th>
                <th className="py-4">Status</th>
                <th className="py-4 text-center">Benchmark</th>
                <th className="py-4 text-center">Compatibility</th>
                <th className="py-4 text-center">Evaluation</th>
                <th className="py-4 text-center">Interviews</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {applicationsTable.map((a) => (
                <tr key={a._id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-2 font-bold text-slate-700">{a.job?.title}</td>
                  <td>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${a.status.toLowerCase().includes('reject') ? 'bg-red-50 text-red-500' : 'bg-indigo-50 text-indigo-600'}`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="text-center font-semibold text-slate-600">{a.testScore === null ? "—" : `${a.testScore}%`}</td>
                  <td className="text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-[11px] font-bold text-indigo-500">{a.profileMatch}%</span>
                      <div className="w-12 h-1 bg-slate-100 rounded-full mt-1">
                        <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${a.profileMatch}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="text-center font-black text-slate-900">{a.resumeScore}%</td>
                  <td className="text-center font-medium text-slate-500">{a.interviewsGivenForThisJob}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* JOBS LIST ON HOME */}
      <div className="pt-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-8 w-1.5 bg-indigo-600 rounded-full" />
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Explore Opportunities</h2>
        </div>
        <JobBoard />
      </div>

      {/* HELP / TIPS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {data.tips.map((t, i) => (
          <div 
            key={i} 
            className="p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden"
            style={{ 
              background: i % 2 === 0 ? "#6366f1" : "#8b5cf6",
              color: "#fff"
            }}
          >
            <div className="absolute top-0 right-0 p-6 opacity-10 text-6xl">💡</div>
            <h3 className="text-xl font-bold mb-4 relative z-10">{t.title}</h3>
            <ul className="list-none p-0 m-0 space-y-3 relative z-10 opacity-90">
              {t.bullets.map((b, idx) => (
                <li key={idx} className="text-sm flex gap-3">
                  <span className="text-white/40">•</span> {b}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({ title, value, accent, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -5 }}
      className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm relative overflow-hidden"
    >
      <div
        className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-5 blur-2xl"
        style={{ background: accent }}
      />
      <div className="relative">
        <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{title}</div>
        <div className="text-3xl font-black text-slate-900 mt-1">{value}</div>
      </div>
    </motion.div>
  );
}

function Card({ title, children }) {
  return (
    <div className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-6">
        <div className="font-bold text-slate-800 text-lg tracking-tight">{title}</div>
        <div className="h-1 w-8 bg-slate-100 rounded-full" />
      </div>
      <div>{children}</div>
    </div>
  );
}


// import React, { useEffect, useMemo, useState } from "react";
// import axios from "axios";
// import { Doughnut, Bar } from "react-chartjs-2";
// import "./charts/chartSetup";
// import { motion } from "framer-motion";
// import JobBoard from "./JobBoard";
// import Footer from "./Footer";

// export default function CandidateHomeDashboard() {
//   const token = localStorage.getItem("token");
//   const [data, setData] = useState(null);
//   const [err, setErr] = useState("");
//   const [loading, setLoading] = useState(true);

//   // ✅ Trend selector
//   const [trend, setTrend] = useState("monthly"); // weekly | monthly | yearly

//   // ✅ “real-time” via polling
//   useEffect(() => {
//     let timer = null;

//     const load = async () => {
//       try {
//         const res = await axios.get("http://localhost:3000/api/dashboard/candidate", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setData(res.data);
//         setErr("");
//       } catch (e) {
//         setErr("Failed to load dashboard.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     load();
//     timer = setInterval(load, 12000); // every 12s

//     return () => clearInterval(timer);
//   }, [token]);


//   // ✅ Trend-aware top stats
//   const topStats = useMemo(() => {
//     const s = data?.stats || {};
//     const totalApplied = s.totalApplied ?? 0;
//     const totalInterviews = s.totalInterviews ?? 0;

//     const weekly = s.last7 ?? 0;
//     const monthly = s.last30 ?? 0;
//     const yearly = s.last365 ?? s.last365Days ?? s.lastYear ?? (monthly * 12);

//     const appliedInTrend =
//       trend === "weekly" ? weekly : trend === "yearly" ? yearly : monthly;

//     const label =
//       trend === "weekly"
//         ? "Applied (Last 7 days)"
//         : trend === "yearly"
//           ? "Applied (Last 365 days)"
//           : "Applied (Last 30 days)";

//     return {
//       totalApplied,
//       appliedInTrend,
//       appliedInTrendLabel: label,
//       totalInterviews,
//       weekly,
//       monthly,
//       yearly,
//     };
//   }, [data, trend]);

//   // ✅ Status -> Color mapping (Shortlisted green, Applied blue, Rejected red)
//   const getStatusColor = (label) => {
//     const s = String(label || "").trim().toLowerCase();
//     if (s.includes("shortlist")) return "rgba(34,197,94,0.95)"; // green
//     if (s.includes("reject")) return "rgba(239,68,68,0.95)"; // red
//     if (s.includes("applied")) return "rgba(59,130,246,0.95)"; // blue
//     return "rgba(139,92,246,0.95)"; // fallback purple
//   };

//   // ✅ Trend-aware status breakdown chart + fixed colors
//   const statusChart = useMemo(() => {
//     const s = data?.stats || {};

//     const breakdown =
//       trend === "weekly"
//         ? s.statusBreakdownWeekly || s.statusBreakdownLast7 || s.statusBreakdown
//         : trend === "yearly"
//           ? s.statusBreakdownYearly || s.statusBreakdownLast365 || s.statusBreakdown
//           : s.statusBreakdownMonthly || s.statusBreakdownLast30 || s.statusBreakdown;

//     const safe = breakdown || {};
//     const labels = Object.keys(safe);
//     const values = labels.map((k) => safe[k]);

//     const bg = labels.map((l) => getStatusColor(l));
//     const border = labels.map((l) => getStatusColor(l).replace("0.95", "1"));

//     return {
//       labels,
//       datasets: [
//         {
//           label: "Applications",
//           data: values,
//           backgroundColor: bg,
//           borderColor: border,
//           borderWidth: 2,
//           hoverOffset: 10,
//         },
//       ],
//     };
//   }, [data, trend]);

//   const statusChartOptions = useMemo(() => {
//     return {
//       responsive: true,
//       maintainAspectRatio: false,
//       cutout: "68%",
//       plugins: {
//         legend: {
//           position: "bottom",
//           labels: {
//             boxWidth: 12,
//             boxHeight: 12,
//             padding: 14,
//             font: { size: 12, weight: "600" },
//           },
//         },
//         tooltip: {
//           backgroundColor: "rgba(15, 23, 42, 0.92)",
//           padding: 12,
//           borderWidth: 1,
//           borderColor: "rgba(148,163,184,0.25)",
//         },
//       },
//     };
//   }, []);

//   // ✅ Bar gradient helper (SAFE)
//   const barGradient = (ctx, c1, c2) => {
//     const chart = ctx.chart;
//     const { ctx: c, chartArea } = chart;
//     if (!chartArea) return c1;
//     const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
//     g.addColorStop(0, c1);
//     g.addColorStop(1, c2);
//     return g;
//   };

//   // ✅ Trend-aware BAR chart data (PLAIN OBJECT)
//   const trendChart = useMemo(() => {
//     const s = data?.stats || {};

//     const arr =
//       trend === "weekly"
//         ? s.weeklyTrend || s.last7Trend || []
//         : trend === "yearly"
//           ? s.yearlyTrend || s.last365Trend || []
//           : s.monthlyTrend || [];

//     const fallbackMonthly = s.monthlyTrend || [];
//     const useArr = arr.length ? arr : trend === "yearly" ? fallbackMonthly : arr;

//     const labels = useArr.map((x) => x.month || x.label || x.day || x.week || "");
//     const points = useArr.map((x) => x.count ?? 0);

//     return {
//       labels,
//       datasets: [
//         {
//           label:
//             trend === "weekly"
//               ? "Applies (Daily)"
//               : trend === "yearly"
//                 ? "Applies (Monthly)"
//                 : "Applies (Monthly)",
//           data: points,
//           borderWidth: 0,
//           borderRadius: 14,
//           maxBarThickness: 44,
//         },
//       ],
//     };
//   }, [data, trend]);

//   // ✅ Trend-aware BAR options (colorful + clean)
//   const trendChartOptions = useMemo(() => {
//     const weeklyBar = ["rgba(34,197,94,1)", "rgba(59,130,246,0.55)"];
//     const monthlyBar = ["rgba(99,102,241,1)", "rgba(236,72,153,0.55)"];
//     const yearlyBar = ["rgba(245,158,11,1)", "rgba(239,68,68,0.55)"];

//     const [c1, c2] =
//       trend === "weekly" ? weeklyBar : trend === "yearly" ? yearlyBar : monthlyBar;

//     return {
//       responsive: true,
//       maintainAspectRatio: false,
//       plugins: {
//         legend: {
//           position: "top",
//           labels: { font: { size: 12, weight: "700" } },
//         },
//         tooltip: {
//           backgroundColor: "rgba(15, 23, 42, 0.92)",
//           padding: 12,
//           borderWidth: 1,
//           borderColor: "rgba(148,163,184,0.25)",
//         },
//       },
//       scales: {
//         x: { grid: { display: false }, ticks: { maxRotation: 0, autoSkip: true } },
//         y: { grid: { color: "rgba(148,163,184,0.18)" }, ticks: { precision: 0 } },
//       },
//       datasets: {
//         bar: {
//           backgroundColor: (ctx) => barGradient(ctx, c1, c2),
//           hoverBackgroundColor: (ctx) => barGradient(ctx, c1, "rgba(255,255,255,0.35)"),
//         },
//       },
//     };
//   }, [trend]);

//   const applicationsTable = data?.applications || [];

//   if (loading) return <div className="text-center py-10 text-slate-500">Loading dashboard…</div>;
//   if (err) return <div className="text-center py-10 text-red-600">{err}</div>;

//   return (
//     <div className="space-y-8">
//       {/* HEADER / TREND SWITCH */}
//       <div
//         className="p-5 rounded-3xl shadow-xl border bg-white/70 backdrop-blur-md flex flex-col md:flex-row md:items-center md:justify-between gap-4"
//         style={{
//           background:
//             "radial-gradient(circle at 20% 20%, rgba(99,102,241,0.20), transparent 55%), radial-gradient(circle at 80% 30%, rgba(236,72,153,0.20), transparent 55%), linear-gradient(135deg, rgba(255,255,255,0.82), rgba(255,255,255,0.50))",
//         }}
//       >
//         <div>
//           <div className="text-xl font-extrabold text-slate-900">Welcome back 👋</div>
//           <div className="text-sm text-slate-600">
//             Track your progress and switch trends (Weekly / Monthly / Yearly).
//           </div>
//         </div>

//         <div className="flex items-center gap-2 bg-white/70 border rounded-2xl p-1 shadow-sm w-fit">
//           <button
//             onClick={() => setTrend("weekly")}
//             className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${trend === "weekly" ? "text-white shadow" : "text-slate-700 hover:bg-white/70"
//               }`}
//             style={trend === "weekly" ? { background: "linear-gradient(135deg,#22c55e,#16a34a)" } : {}}
//           >
//             Weekly
//           </button>
//           <button
//             onClick={() => setTrend("monthly")}
//             className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${trend === "monthly" ? "text-white shadow" : "text-slate-700 hover:bg-white/70"
//               }`}
//             style={trend === "monthly" ? { background: "linear-gradient(135deg,#6366f1,#8b5cf6)" } : {}}
//           >
//             Monthly
//           </button>
//           <button
//             onClick={() => setTrend("yearly")}
//             className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${trend === "yearly" ? "text-white shadow" : "text-slate-700 hover:bg-white/70"
//               }`}
//             style={trend === "yearly" ? { background: "linear-gradient(135deg,#f59e0b,#f97316)" } : {}}
//           >
//             Yearly
//           </button>
//         </div>
//       </div>

//       {/* TOP STATS */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <Stat title="Total Applied" value={topStats.totalApplied} accent="linear-gradient(135deg,#3b82f6,#6366f1)" />
//         <Stat
//           title={topStats.appliedInTrendLabel}
//           value={topStats.appliedInTrend}
//           accent={
//             trend === "weekly"
//               ? "linear-gradient(135deg,#22c55e,#16a34a)"
//               : trend === "yearly"
//                 ? "linear-gradient(135deg,#f59e0b,#f97316)"
//                 : "linear-gradient(135deg,#6366f1,#8b5cf6)"
//           }
//         />
//         <Stat title="Applied (Last 30 days)" value={topStats.monthly} accent="linear-gradient(135deg,#a855f7,#ec4899)" />
//         <Stat title="Total Interviews" value={topStats.totalInterviews} accent="linear-gradient(135deg,#10b981,#059669)" />
//       </div>

//       {/* CHARTS */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <Card title="Application Status Breakdown" glow="radial-gradient(circle at 30% 30%, rgba(99,102,241,0.22), transparent 55%)">
//           <div className="h-[320px]">
//             <Doughnut data={statusChart} options={statusChartOptions} />
//           </div>
//         </Card>

//         <Card
//           title={`Apply Trend (${trend === "weekly" ? "Weekly" : trend === "yearly" ? "Yearly" : "Monthly"})`}
//           glow="radial-gradient(circle at 70% 30%, rgba(236,72,153,0.18), transparent 55%)"
//         >
//           <div className="h-[320px]">
//             <Bar data={trendChart} options={trendChartOptions} />
//           </div>
//         </Card>
//       </div>

//       {/* APPLIED JOBS SNAPSHOT */}
//       <Card title="Your Applied Jobs (Snapshot)" glow="radial-gradient(circle at 20% 20%, rgba(34,197,94,0.16), transparent 55%)">
//         <div className="overflow-auto">
//           <table className="w-full text-sm">
//             <thead className="text-left text-slate-500">
//               <tr>
//                 <th className="py-2">Job</th>
//                 <th>Status</th>
//                 <th>Test</th>
//                 <th>Profile Match</th>
//                 <th>Resume Score</th>
//                 <th>Interviews</th>
//               </tr>
//             </thead>

//             <tbody>
//               {applicationsTable.map((a) => (
//                 <tr key={a._id} className="border-t">
//                   <td className="py-2 font-medium">{a.job?.title}</td>
//                   <td className="font-semibold">{a.status}</td>
//                   <td>{a.testScore === null ? "—" : `${a.testScore}%`}</td>
//                   <td>{a.profileMatch}%</td>
//                   <td>{a.resumeScore}%</td>
//                   <td>{a.interviewsGivenForThisJob}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </Card>

//       {/* JOBS LIST ON HOME (same like Jobs tab) */}
//       <Card title="Explore Jobs (Same as Jobs tab)" glow="radial-gradient(circle at 80% 40%, rgba(59,130,246,0.16), transparent 55%)">
//         <JobBoard />
//       </Card>

//       {/* HELP / TIPS */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {data.tips.map((t, i) => (
//           <Card key={i} title={t.title} glow="radial-gradient(circle at 40% 30%, rgba(245,158,11,0.16), transparent 55%)">
//             <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
//               {t.bullets.map((b, idx) => (
//                 <li key={idx}>{b}</li>
//               ))}
//             </ul>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// }

// function Stat({ title, value, accent }) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 8 }}
//       animate={{ opacity: 1, y: 0 }}
//       whileHover={{ y: -3 }}
//       className="p-4 rounded-2xl bg-white/80 shadow border relative overflow-hidden"
//     >
//       <div
//         className="absolute -top-12 -right-12 w-36 h-36 rounded-full opacity-75"
//         style={{ background: accent, filter: "blur(2px)" }}
//       />
//       <div className="relative">
//         <div className="text-xs text-slate-600 font-semibold">{title}</div>
//         <div className="text-2xl font-extrabold text-slate-900 mt-1">{value}</div>
//       </div>
//     </motion.div>
//   );
// }

// function Card({ title, children, glow }) {
//   return (
//     <div
//       className="p-5 rounded-2xl bg-white/80 shadow border relative overflow-hidden"
//       style={{
//         background:
//           `${glow || ""}, linear-gradient(135deg, rgba(255,255,255,0.86), rgba(255,255,255,0.55))`,
//       }}
//     >
//       <div className="font-semibold text-slate-900 mb-4 relative">{title}</div>
//       <div className="relative">{children}</div>
//     </div>
//   );
// }

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Bar, Line } from "react-chartjs-2";
import "./charts/chartSetup";
import { motion } from "framer-motion";

export default function RecruiterHomeDashboard() {
  const token = localStorage.getItem("token");
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Trend selector
  const [trend, setTrend] = useState("monthly"); // weekly | monthly | yearly

  useEffect(() => {
    let timer = null;

    const load = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/dashboard/recruiter", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
        setErr("");
      } catch (e) {
        setErr("Failed to load recruiter dashboard.");
      } finally {
        setLoading(false);
      }
    };

    load();
    timer = setInterval(load, 12000);

    return () => clearInterval(timer);
  }, [token]);

  // ✅ Trend-aware top stats
  const topStats = useMemo(() => {
    const s = data?.stats || {};
    const totalJobs = s.totalJobs ?? 0;
    const totalApplications = s.totalApplications ?? 0;
    const totalInterviews = s.totalInterviews ?? 0;

    const weekly = s.last7 ?? 0;
    const monthly = s.last30 ?? 0;
    const yearly = s.last365 ?? s.last365Days ?? s.lastYear ?? (monthly * 12);

    const jobsInTrend =
      trend === "weekly" ? weekly : trend === "yearly" ? yearly : monthly;

    const label =
      trend === "weekly"
        ? "Jobs (Last 7 days)"
        : trend === "yearly"
        ? "Jobs (Last 365 days)"
        : "Jobs (Last 30 days)";

    return {
      totalJobs,
      jobsInTrend,
      jobsInTrendLabel: label,
      totalApplications,
      totalInterviews,
      weekly,
      monthly,
      yearly,
    };
  }, [data, trend]);

  // ✅ Color helpers
  const barGradient = (ctx, c1, c2) => {
    const chart = ctx.chart;
    const { ctx: c, chartArea } = chart;
    if (!chartArea) return c1; // first render
    const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    g.addColorStop(0, c1);
    g.addColorStop(1, c2);
    return g;
  };

  // ✅ Charts data (plain objects, no function)
  const appsPerJobChart = useMemo(() => {
    const rows = data?.jobs || [];
    return {
      labels: rows.map((x) => x.title),
      datasets: [
        {
          label: "Applications",
          data: rows.map((x) => x.applications),
          borderWidth: 0,
          borderRadius: 14,
          maxBarThickness: 44,
        },
      ],
    };
  }, [data]);

  const interviewsPerJobChart = useMemo(() => {
    const rows = data?.jobs || [];
    return {
      labels: rows.map((x) => x.title),
      datasets: [
        {
          label: "Interviews",
          data: rows.map((x) => x.interviews),
          borderWidth: 0,
          borderRadius: 14,
          maxBarThickness: 44,
        },
      ],
    };
  }, [data]);

  // ✅ Trend-aware jobs created chart
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

    return {
      labels: useArr.map((x) => x.month || x.label || x.day || x.week || ""),
      datasets: [
        {
          label:
            trend === "weekly"
              ? "Jobs created (Daily)"
              : trend === "yearly"
              ? "Jobs created (Monthly)"
              : "Jobs created (Monthly)",
          data: useArr.map((x) => x.count ?? 0),
          tension: 0.35,
          borderWidth: 3,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBorderWidth: 2,
          pointBackgroundColor: "rgba(255,255,255,0.95)",
          fill: true,
        },
      ],
    };
  }, [data, trend]);

  // ✅ Bar options (colorful + clean)
  const barOptionsApps = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "top", labels: { font: { size: 12, weight: "700" } } },
        tooltip: {
          backgroundColor: "rgba(15, 23, 42, 0.92)",
          padding: 12,
          borderWidth: 1,
          borderColor: "rgba(148,163,184,0.25)",
        },
      },
      scales: {
        x: { grid: { display: false }, ticks: { autoSkip: true, maxRotation: 0 } },
        y: { grid: { color: "rgba(148,163,184,0.18)" }, ticks: { precision: 0 } },
      },
      datasets: {
        bar: {
          backgroundColor: (ctx) => barGradient(ctx, "rgba(59,130,246,1)", "rgba(99,102,241,0.55)"),
          hoverBackgroundColor: (ctx) => barGradient(ctx, "rgba(37,99,235,1)", "rgba(99,102,241,0.75)"),
        },
      },
    };
  }, []);

  const barOptionsInterviews = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "top", labels: { font: { size: 12, weight: "700" } } },
        tooltip: {
          backgroundColor: "rgba(15, 23, 42, 0.92)",
          padding: 12,
          borderWidth: 1,
          borderColor: "rgba(148,163,184,0.25)",
        },
      },
      scales: {
        x: { grid: { display: false }, ticks: { autoSkip: true, maxRotation: 0 } },
        y: { grid: { color: "rgba(148,163,184,0.18)" }, ticks: { precision: 0 } },
      },
      datasets: {
        bar: {
          backgroundColor: (ctx) => barGradient(ctx, "rgba(16,185,129,1)", "rgba(59,130,246,0.55)"),
          hoverBackgroundColor: (ctx) => barGradient(ctx, "rgba(5,150,105,1)", "rgba(59,130,246,0.75)"),
        },
      },
    };
  }, []);

  // ✅ Line options (safe gradient, no crash)
  const trendChartOptions = useMemo(() => {
    const weeklyLine = ["rgba(34,197,94,1)", "rgba(59,130,246,1)"];
    const monthlyLine = ["rgba(59,130,246,1)", "rgba(99,102,241,1)"];
    const yearlyLine = ["rgba(245,158,11,1)", "rgba(239,68,68,1)"];

    const [c1, c2] =
      trend === "weekly" ? weeklyLine : trend === "yearly" ? yearlyLine : monthlyLine;

    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "top", labels: { font: { size: 12, weight: "700" } } },
        tooltip: {
          backgroundColor: "rgba(15, 23, 42, 0.92)",
          padding: 12,
          borderWidth: 1,
          borderColor: "rgba(148,163,184,0.25)",
        },
      },
      scales: {
        x: { grid: { display: false }, ticks: { autoSkip: true, maxRotation: 0 } },
        y: { grid: { color: "rgba(148,163,184,0.18)" }, ticks: { precision: 0 } },
      },
      elements: {
        line: {
          borderColor: (ctx) => {
            const chart = ctx.chart;
            const { ctx: c, chartArea } = chart;
            if (!chartArea) return c1;
            const g = c.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
            g.addColorStop(0, c1);
            g.addColorStop(1, c2);
            return g;
          },
          backgroundColor: (ctx) => {
            const chart = ctx.chart;
            const { ctx: c, chartArea } = chart;
            if (!chartArea) return "rgba(59,130,246,0.12)";
            const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            g.addColorStop(0, "rgba(59,130,246,0.22)");
            g.addColorStop(1, "rgba(59,130,246,0.02)");
            return g;
          },
        },
        point: {
          borderColor: c1,
        },
      },
    };
  }, [trend]);

  if (loading) return <div className="text-center py-10 text-slate-500">Loading dashboard…</div>;
  if (err) return <div className="text-center py-10 text-red-600">{err}</div>;

  return (
    <div className="space-y-8">
      {/* HEADER / TREND SWITCH */}
      <div
        className="p-5 rounded-3xl shadow-xl border bg-white/70 backdrop-blur-md flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, rgba(16,185,129,0.20), transparent 55%), radial-gradient(circle at 80% 30%, rgba(59,130,246,0.20), transparent 55%), linear-gradient(135deg, rgba(255,255,255,0.82), rgba(255,255,255,0.50))",
        }}
      >
        <div>
          <div className="text-xl font-extrabold text-slate-900">Recruiter Overview 📌</div>
          <div className="text-sm text-slate-600">
            Switch trends (Weekly / Monthly / Yearly) to see performance clearly.
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white/70 border rounded-2xl p-1 shadow-sm w-fit">
          <button
            onClick={() => setTrend("weekly")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
              trend === "weekly" ? "text-white shadow" : "text-slate-700 hover:bg-white/70"
            }`}
            style={trend === "weekly" ? { background: "linear-gradient(135deg,#22c55e,#16a34a)" } : {}}
          >
            Weekly
          </button>
          <button
            onClick={() => setTrend("monthly")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
              trend === "monthly" ? "text-white shadow" : "text-slate-700 hover:bg-white/70"
            }`}
            style={trend === "monthly" ? { background: "linear-gradient(135deg,#3b82f6,#6366f1)" } : {}}
          >
            Monthly
          </button>
          <button
            onClick={() => setTrend("yearly")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
              trend === "yearly" ? "text-white shadow" : "text-slate-700 hover:bg-white/70"
            }`}
            style={trend === "yearly" ? { background: "linear-gradient(135deg,#f59e0b,#f97316)" } : {}}
          >
            Yearly
          </button>
        </div>
      </div>

      {/* TOP STATS */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Stat title="Total Jobs" value={topStats.totalJobs} accent="linear-gradient(135deg,#6366f1,#8b5cf6)" />
        <Stat
          title={topStats.jobsInTrendLabel}
          value={topStats.jobsInTrend}
          accent={
            trend === "weekly"
              ? "linear-gradient(135deg,#22c55e,#16a34a)"
              : trend === "yearly"
              ? "linear-gradient(135deg,#f59e0b,#f97316)"
              : "linear-gradient(135deg,#3b82f6,#6366f1)"
          }
        />
        <Stat title="Jobs (Last 30 days)" value={topStats.monthly} accent="linear-gradient(135deg,#ec4899,#a855f7)" />
        <Stat title="Total Applications" value={topStats.totalApplications} accent="linear-gradient(135deg,#3b82f6,#2563eb)" />
        <Stat title="Total Interviews" value={topStats.totalInterviews} accent="linear-gradient(135deg,#10b981,#059669)" />
      </div>

      {/* VISUALS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Applications Per Job" glow="radial-gradient(circle at 30% 30%, rgba(59,130,246,0.18), transparent 55%)">
          <div className="h-[320px]">
            <Bar data={appsPerJobChart} options={barOptionsApps} />
          </div>
        </Card>

        <Card title="Interviews Per Job" glow="radial-gradient(circle at 70% 30%, rgba(16,185,129,0.18), transparent 55%)">
          <div className="h-[320px]">
            <Bar data={interviewsPerJobChart} options={barOptionsInterviews} />
          </div>
        </Card>
      </div>

      <Card
        title={`Jobs Created Trend (${trend === "weekly" ? "Weekly" : trend === "yearly" ? "Yearly" : "Monthly"})`}
        glow="radial-gradient(circle at 40% 30%, rgba(245,158,11,0.16), transparent 55%)"
      >
        <div className="h-[340px]">
          <Line data={trendChart} options={trendChartOptions} />
        </div>
      </Card>

      {/* TABLE */}
      <Card title="Job Insights" glow="radial-gradient(circle at 80% 40%, rgba(99,102,241,0.16), transparent 55%)">
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-500">
              <tr>
                <th className="py-2">Job</th>
                <th>Status</th>
                <th>Applications</th>
                <th>Interviews</th>
              </tr>
            </thead>
            <tbody>
              {(data.jobs || []).map((j) => (
                <tr key={j.jobId} className="border-t">
                  <td className="py-2 font-medium">{j.title}</td>
                  <td className="font-semibold">{j.status}</td>
                  <td>{j.applications}</td>
                  <td>{j.interviews}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function Stat({ title, value, accent }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      className="p-4 rounded-2xl bg-white/80 shadow border relative overflow-hidden"
    >
      <div
        className="absolute -top-12 -right-12 w-36 h-36 rounded-full opacity-75"
        style={{ background: accent, filter: "blur(2px)" }}
      />
      <div className="relative">
        <div className="text-xs text-slate-600 font-semibold">{title}</div>
        <div className="text-2xl font-extrabold text-slate-900 mt-1">{value}</div>
      </div>
    </motion.div>
  );
}

function Card({ title, children, glow }) {
  return (
    <div
      className="p-5 rounded-2xl bg-white/80 shadow border relative overflow-hidden"
      style={{
        background:
          `${glow || ""}, linear-gradient(135deg, rgba(255,255,255,0.86), rgba(255,255,255,0.55))`,
      }}
    >
      <div className="font-semibold text-slate-900 mb-4 relative">{title}</div>
      <div className="relative">{children}</div>
    </div>
  );
}



// import React, { useEffect, useMemo, useState } from "react";
// import axios from "axios";
// import { Bar, Line } from "react-chartjs-2";
// import "./charts/chartSetup";
// import { motion } from "framer-motion";

// export default function RecruiterHomeDashboard() {
//   const token = localStorage.getItem("token");
//   const [data, setData] = useState(null);
//   const [err, setErr] = useState("");
//   const [loading, setLoading] = useState(true);

//   // ✅ Trend selector
//   const [trend, setTrend] = useState("monthly"); // weekly | monthly | yearly

//   useEffect(() => {
//     let timer = null;

//     const load = async () => {
//       try {
//         const res = await axios.get("http://localhost:3000/api/dashboard/recruiter", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setData(res.data);
//         setErr("");
//       } catch (e) {
//         setErr("Failed to load recruiter dashboard.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     load();
//     timer = setInterval(load, 12000);

//     return () => clearInterval(timer);
//   }, [token]);

//   // ✅ Trend-aware top stats
//   const topStats = useMemo(() => {
//     const s = data?.stats || {};
//     const totalJobs = s.totalJobs ?? 0;
//     const totalApplications = s.totalApplications ?? 0;
//     const totalInterviews = s.totalInterviews ?? 0;

//     const weekly = s.last7 ?? 0;
//     const monthly = s.last30 ?? 0;
//     const yearly = s.last365 ?? s.last365Days ?? s.lastYear ?? (monthly * 12);

//     const jobsInTrend =
//       trend === "weekly" ? weekly : trend === "yearly" ? yearly : monthly;

//     const label =
//       trend === "weekly"
//         ? "Jobs (Last 7 days)"
//         : trend === "yearly"
//         ? "Jobs (Last 365 days)"
//         : "Jobs (Last 30 days)";

//     return {
//       totalJobs,
//       jobsInTrend,
//       jobsInTrendLabel: label,
//       totalApplications,
//       totalInterviews,
//       weekly,
//       monthly,
//       yearly,
//     };
//   }, [data, trend]);

//   const appsPerJobChart = useMemo(() => {
//     const rows = data?.jobs || [];
//     return {
//       labels: rows.map((x) => x.title),
//       datasets: [{ label: "Applications", data: rows.map((x) => x.applications) }],
//     };
//   }, [data]);

//   const interviewsPerJobChart = useMemo(() => {
//     const rows = data?.jobs || [];
//     return {
//       labels: rows.map((x) => x.title),
//       datasets: [{ label: "Interviews", data: rows.map((x) => x.interviews) }],
//     };
//   }, [data]);

//   // ✅ Trend-aware jobs created chart
//   const trendChart = useMemo(() => {
//     const s = data?.stats || {};

//     const arr =
//       trend === "weekly"
//         ? s.weeklyTrend || s.last7Trend || []
//         : trend === "yearly"
//         ? s.yearlyTrend || s.last365Trend || []
//         : s.monthlyTrend || [];

//     const fallbackMonthly = s.monthlyTrend || [];
//     const useArr = arr.length ? arr : trend === "yearly" ? fallbackMonthly : arr;

//     return {
//       labels: useArr.map((x) => x.month || x.label || x.day || x.week || ""),
//       datasets: [
//         {
//           label:
//             trend === "weekly"
//               ? "Jobs created (Daily)"
//               : trend === "yearly"
//               ? "Jobs created (Monthly)"
//               : "Jobs created (Monthly)",
//           data: useArr.map((x) => x.count ?? 0),
//           tension: 0.25,
//         },
//       ],
//     };
//   }, [data, trend]);

//   if (loading) return <div className="text-center py-10 text-slate-500">Loading dashboard…</div>;
//   if (err) return <div className="text-center py-10 text-red-600">{err}</div>;

//   return (
//     <div className="space-y-8">
//       {/* HEADER / TREND SWITCH */}
//       <div
//         className="p-5 rounded-3xl shadow-xl border bg-white/70 backdrop-blur-md flex flex-col md:flex-row md:items-center md:justify-between gap-4"
//         style={{
//           background:
//             "radial-gradient(circle at 20% 20%, rgba(16,185,129,0.18), transparent 55%), radial-gradient(circle at 80% 30%, rgba(59,130,246,0.18), transparent 55%), linear-gradient(135deg, rgba(255,255,255,0.78), rgba(255,255,255,0.45))",
//         }}
//       >
//         <div>
//           <div className="text-xl font-extrabold text-slate-900">
//             Recruiter Overview 📌
//           </div>
//           <div className="text-sm text-slate-600">
//             Switch trends (Weekly / Monthly / Yearly) to see performance clearly.
//           </div>
//         </div>

//         <div className="flex items-center gap-2 bg-white/70 border rounded-2xl p-1 shadow-sm w-fit">
//           <button
//             onClick={() => setTrend("weekly")}
//             className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
//               trend === "weekly" ? "text-white shadow" : "text-slate-700 hover:bg-white/70"
//             }`}
//             style={trend === "weekly" ? { background: "linear-gradient(135deg,#22c55e,#16a34a)" } : {}}
//           >
//             Weekly
//           </button>
//           <button
//             onClick={() => setTrend("monthly")}
//             className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
//               trend === "monthly" ? "text-white shadow" : "text-slate-700 hover:bg-white/70"
//             }`}
//             style={trend === "monthly" ? { background: "linear-gradient(135deg,#3b82f6,#6366f1)" } : {}}
//           >
//             Monthly
//           </button>
//           <button
//             onClick={() => setTrend("yearly")}
//             className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
//               trend === "yearly" ? "text-white shadow" : "text-slate-700 hover:bg-white/70"
//             }`}
//             style={trend === "yearly" ? { background: "linear-gradient(135deg,#f59e0b,#f97316)" } : {}}
//           >
//             Yearly
//           </button>
//         </div>
//       </div>

//       {/* TOP STATS */}
//       <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
//         <Stat
//           title="Total Jobs"
//           value={topStats.totalJobs}
//           accent="linear-gradient(135deg,#6366f1,#8b5cf6)"
//         />
//         <Stat
//           title={topStats.jobsInTrendLabel}
//           value={topStats.jobsInTrend}
//           accent={
//             trend === "weekly"
//               ? "linear-gradient(135deg,#22c55e,#16a34a)"
//               : trend === "yearly"
//               ? "linear-gradient(135deg,#f59e0b,#f97316)"
//               : "linear-gradient(135deg,#3b82f6,#6366f1)"
//           }
//         />
//         <Stat
//           title="Jobs (Last 30 days)"
//           value={topStats.monthly}
//           accent="linear-gradient(135deg,#ec4899,#a855f7)"
//         />
//         <Stat
//           title="Total Applications"
//           value={topStats.totalApplications}
//           accent="linear-gradient(135deg,#3b82f6,#2563eb)"
//         />
//         <Stat
//           title="Total Interviews"
//           value={topStats.totalInterviews}
//           accent="linear-gradient(135deg,#10b981,#059669)"
//         />
//       </div>

//       {/* VISUALS */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <Card title="Applications Per Job" glow="radial-gradient(circle at 30% 30%, rgba(59,130,246,0.16), transparent 55%)">
//           <Bar data={appsPerJobChart} />
//         </Card>

//         <Card title="Interviews Per Job" glow="radial-gradient(circle at 70% 30%, rgba(16,185,129,0.16), transparent 55%)">
//           <Bar data={interviewsPerJobChart} />
//         </Card>
//       </div>

//       <Card
//         title={`Jobs Created Trend (${trend === "weekly" ? "Weekly" : trend === "yearly" ? "Yearly" : "Monthly"})`}
//         glow="radial-gradient(circle at 40% 30%, rgba(245,158,11,0.14), transparent 55%)"
//       >
//         <Line data={trendChart} />
//       </Card>

//       {/* TABLE */}
//       <Card title="Job Insights" glow="radial-gradient(circle at 80% 40%, rgba(99,102,241,0.14), transparent 55%)">
//         <div className="overflow-auto">
//           <table className="w-full text-sm">
//             <thead className="text-left text-slate-500">
//               <tr>
//                 <th className="py-2">Job</th>
//                 <th>Status</th>
//                 <th>Applications</th>
//                 <th>Interviews</th>
//               </tr>
//             </thead>
//             <tbody>
//               {(data.jobs || []).map((j) => (
//                 <tr key={j.jobId} className="border-t">
//                   <td className="py-2 font-medium">{j.title}</td>
//                   <td>{j.status}</td>
//                   <td>{j.applications}</td>
//                   <td>{j.interviews}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </Card>
//     </div>
//   );
// }

// function Stat({ title, value, accent }) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 8 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="p-4 rounded-2xl bg-white/80 shadow border relative overflow-hidden"
//     >
//       <div
//         className="absolute -top-12 -right-12 w-36 h-36 rounded-full opacity-70"
//         style={{ background: accent, filter: "blur(2px)" }}
//       />
//       <div className="relative">
//         <div className="text-xs text-slate-600 font-semibold">{title}</div>
//         <div className="text-2xl font-bold text-slate-900 mt-1">{value}</div>
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
//           `${glow || ""}, linear-gradient(135deg, rgba(255,255,255,0.82), rgba(255,255,255,0.55))`,
//       }}
//     >
//       <div className="font-semibold text-slate-900 mb-4 relative">{title}</div>
//       <div className="relative">{children}</div>
//     </div>
//   );
// }

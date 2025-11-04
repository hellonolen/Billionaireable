import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { COLORS, timeline, allocation, businesses, pipelineDeals, timeAlloc, healthSeries, macro, risk, impact, legacy } from "./constants";
import { NewsFeedDetail } from "./newsFeedSection";
import { DetailSquare } from "@/components/DashboardComponents";
import { MiniStat } from "@/components/DashboardComponents";
import { SectionKey } from "@/pages/Dashboard";

export function getDetailContent(key: SectionKey) {
  switch (key) {
    case "Net Worth & Asset Allocation":
      return (
        <>
          <DetailSquare title="Net Worth Trend">
            <ResponsiveContainer>
              <AreaChart data={timeline}>
                <CartesianGrid stroke={COLORS.border} />
                <XAxis dataKey="month" hide />
                <YAxis hide />
                <Tooltip />
                <Area dataKey="netWorth" stroke={COLORS.primary} fillOpacity={0.2} fill={COLORS.primary} />
              </AreaChart>
            </ResponsiveContainer>
          </DetailSquare>
          <DetailSquare title="Allocation by Class">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={allocation} dataKey="value" nameKey="name" innerRadius={60} outerRadius={80} label>
                  {allocation.map((_, i) => (
                    <Cell key={i} fill={[COLORS.primary, COLORS.accent, COLORS.secondary, "#93C5FD", "#A7F3D0", "#E5E7EB"][i % 6]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </DetailSquare>
          <DetailSquare title="Concentration">
            <ResponsiveContainer>
              <BarChart data={[{ k: "Top 3", v: 41 }, { k: "Top 10", v: 68 }, { k: "Rest", v: 32 }]}>
                <CartesianGrid stroke={COLORS.border} />
                <XAxis dataKey="k" />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="v" fill={COLORS.accent} radius={[8,8,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </DetailSquare>
          <DetailSquare title="YoY Growth">
            <div className="grid grid-cols-2 gap-3">
              <MiniStat label="Net Worth" value="+18%" />
              <MiniStat label="Liquid Assets" value="+12%" />
              <MiniStat label="Private Equity" value="+22%" />
              <MiniStat label="Real Estate" value="+8%" />
            </div>
          </DetailSquare>
          <DetailSquare title="Geographic Split">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={[{name:"US",value:52},{name:"EU",value:28},{name:"Asia",value:20}]} dataKey="value" nameKey="name" innerRadius={60} outerRadius={80} label>
                  {[0,1,2].map((i) => (
                    <Cell key={i} fill={[COLORS.primary, COLORS.accent, COLORS.secondary][i]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </DetailSquare>
          <DetailSquare title="Key Metrics">
            <div className="grid grid-cols-2 gap-3">
              <MiniStat label="Total NW" value="$1.2B" />
              <MiniStat label="Liquid %" value="42%" />
              <MiniStat label="IRR (5Y)" value="16%" />
              <MiniStat label="Volatility" value="Low" />
            </div>
          </DetailSquare>
        </>
      );

    case "Cash & Liquidity Runway":
      return (
        <>
          <DetailSquare title="Cash & Near-Cash">
            <ResponsiveContainer>
              <LineChart data={timeline}>
                <CartesianGrid stroke={COLORS.border} />
                <XAxis dataKey="month" hide />
                <YAxis hide />
                <Tooltip />
                <Line type="monotone" dataKey="cash" stroke={COLORS.accent} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </DetailSquare>
          <DetailSquare title="Runway (months)">
            <div className="h-full grid place-items-center">
              <ResponsiveContainer width="90%" height="80%">
                <RadialBarChart innerRadius="60%" outerRadius="100%" data={[{ name: "runway", value: 18 }]} startAngle={180} endAngle={0}>
                  <RadialBar dataKey="value" fill={COLORS.primary} cornerRadius={16}/>
                  <Tooltip />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="-mt-6 text-center">
                <div className="text-2xl font-semibold" style={{ color: COLORS.text }}>18</div>
                <div className="text-xs" style={{ color: COLORS.subt }}>months</div>
              </div>
            </div>
          </DetailSquare>
          <DetailSquare title="Credit Lines">
            <div className="grid grid-cols-2 gap-4">
              <MiniStat label="Committed" value="$220M" />
              <MiniStat label="Available" value="$140M" />
              <MiniStat label="Avg Cost" value="SOFR + 250bps" />
              <MiniStat label="Utilization" value="36%" />
            </div>
          </DetailSquare>
          <DetailSquare title="Monthly Burn">
            <ResponsiveContainer>
              <BarChart data={timeline.slice(0, 6)}>
                <CartesianGrid stroke={COLORS.border} />
                <XAxis dataKey="month" />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="cash" fill={COLORS.secondary} radius={[8,8,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </DetailSquare>
          <DetailSquare title="Liquidity Sources">
            <div className="grid grid-cols-2 gap-3">
              <MiniStat label="Cash" value="$120M" />
              <MiniStat label="Treasuries" value="$85M" />
              <MiniStat label="Credit" value="$140M" />
              <MiniStat label="Total" value="$345M" />
            </div>
          </DetailSquare>
          <DetailSquare title="Stress Scenarios">
            <div className="grid grid-cols-2 gap-3">
              <MiniStat label="Base" value="18 mo" />
              <MiniStat label="Moderate" value="14 mo" />
              <MiniStat label="Severe" value="9 mo" />
              <MiniStat label="Status" value="Healthy" />
            </div>
          </DetailSquare>
        </>
      );

    case "Business KPIs":
      return (
        <>
          <DetailSquare title="Revenue & EBITDA">
            <ResponsiveContainer>
              <AreaChart data={timeline}>
                <CartesianGrid stroke={COLORS.border} />
                <XAxis dataKey="month" hide />
                <YAxis hide />
                <Tooltip />
                <Area dataKey="revenue" stroke={COLORS.primary} fillOpacity={0.2} fill={COLORS.primary} />
                <Area dataKey="ebitda" stroke={COLORS.accent} fillOpacity={0.15} fill={COLORS.accent} />
              </AreaChart>
            </ResponsiveContainer>
          </DetailSquare>
          <DetailSquare title="Company Snapshot">
            <div className="overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left" style={{ color: COLORS.subt }}>
                    <th className="py-2">Company</th>
                    <th>Revenue</th>
                    <th>Margin</th>
                    <th>Churn</th>
                    <th>Growth</th>
                  </tr>
                </thead>
                <tbody>
                  {businesses.map((b, i) => (
                    <tr key={i} className="border-t" style={{ borderColor: COLORS.border }}>
                      <td className="py-2 font-medium" style={{ color: COLORS.text }}>{b.name}</td>
                      <td>${b.revenue}M</td>
                      <td>{b.margin}%</td>
                      <td>{b.churn}%</td>
                      <td>{b.growth}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DetailSquare>
          <DetailSquare title="Unit Economics">
            <div className="grid grid-cols-2 gap-3">
              <MiniStat label="CAC" value="$210" />
              <MiniStat label="LTV" value="$2,950" />
              <MiniStat label="Payback" value="7.5 mo" />
              <MiniStat label="GRR" value="96%" />
            </div>
          </DetailSquare>
          <DetailSquare title="Growth Trends">
            <ResponsiveContainer>
              <LineChart data={timeline.slice(0, 6)}>
                <CartesianGrid stroke={COLORS.border} />
                <XAxis dataKey="month" />
                <YAxis hide />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke={COLORS.primary} />
              </LineChart>
            </ResponsiveContainer>
          </DetailSquare>
          <DetailSquare title="Margins by Company">
            <ResponsiveContainer>
              <BarChart data={businesses}>
                <CartesianGrid stroke={COLORS.border} />
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="margin" fill={COLORS.accent} radius={[8,8,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </DetailSquare>
          <DetailSquare title="Portfolio Summary">
            <div className="grid grid-cols-2 gap-3">
              <MiniStat label="Total Revenue" value="$242M" />
              <MiniStat label="Avg Margin" value="37%" />
              <MiniStat label="Avg Growth" value="17%" />
              <MiniStat label="Companies" value="4" />
            </div>
          </DetailSquare>
        </>
      );

    case "Investment Performance":
      return (
        <>
          <DetailSquare title="IRR by Vintage">
            <ResponsiveContainer>
              <BarChart data={[{ k: '2018', v: 14 }, { k: '2019', v: 16 }, { k: '2020', v: 19 }, { k: '2021', v: 17 }, { k: '2022', v: 15 }, { k: '2023', v: 21 }]}>
                <CartesianGrid stroke={COLORS.border} />
                <XAxis dataKey="k" />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="v" fill={COLORS.primary} radius={[8,8,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </DetailSquare>
          <DetailSquare title="Realized vs Unrealized">
            <ResponsiveContainer>
              <AreaChart data={timeline}>
                <CartesianGrid stroke={COLORS.border} />
                <XAxis dataKey="month" hide />
                <YAxis hide />
                <Tooltip />
                <Area dataKey="revenue" stroke={COLORS.primary} fillOpacity={0.2} fill={COLORS.primary} />
                <Area dataKey="ebitda" stroke={COLORS.accent} fillOpacity={0.15} fill={COLORS.accent} />
              </AreaChart>
            </ResponsiveContainer>
          </DetailSquare>
          <DetailSquare title="Volatility & Concentration">
            <div className="grid grid-cols-2 gap-3">
              <MiniStat label="Volatility" value="Low" />
              <MiniStat label="Sector tilt" value="Tech/Health" />
              <MiniStat label="Geography" value="US/EU" />
              <MiniStat label="MOIC" value="2.1x" />
            </div>
          </DetailSquare>
          <DetailSquare title="Top Performers">
            <div className="overflow-hidden text-sm">
              <div className="space-y-2">
                <div className="flex justify-between p-2 rounded" style={{ background: COLORS.panel }}>
                  <span style={{ color: COLORS.text }}>HealthTech Series A</span>
                  <span className="font-semibold" style={{ color: COLORS.primary }}>4.2x</span>
                </div>
                <div className="flex justify-between p-2 rounded" style={{ background: COLORS.panel }}>
                  <span style={{ color: COLORS.text }}>SaaS Buyout</span>
                  <span className="font-semibold" style={{ color: COLORS.primary }}>3.8x</span>
                </div>
                <div className="flex justify-between p-2 rounded" style={{ background: COLORS.panel }}>
                  <span style={{ color: COLORS.text }}>FinTech Growth</span>
                  <span className="font-semibold" style={{ color: COLORS.primary }}>2.9x</span>
                </div>
              </div>
            </div>
          </DetailSquare>
          <DetailSquare title="Asset Class Returns">
            <ResponsiveContainer>
              <BarChart data={[{k:"PE",v:22},{k:"VC",v:28},{k:"RE",v:12},{k:"Public",v:15}]}>
                <CartesianGrid stroke={COLORS.border} />
                <XAxis dataKey="k" />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="v" fill={COLORS.accent} radius={[8,8,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </DetailSquare>
          <DetailSquare title="Portfolio Metrics">
            <div className="grid grid-cols-2 gap-3">
              <MiniStat label="Total IRR" value="18%" />
              <MiniStat label="MOIC" value="2.1x" />
              <MiniStat label="Realized" value="$420M" />
              <MiniStat label="Unrealized" value="$680M" />
            </div>
          </DetailSquare>
        </>
      );

    case "Pipeline of Opportunities & Exits":
      return (
        <>
          <DetailSquare title="Top Deals">
            <div className="overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left" style={{ color: COLORS.subt }}>
                    <th className="py-2">Deal</th>
                    <th>Prob</th>
                    <th>Exp Return</th>
                    <th>TTC</th>
                    <th>Capital</th>
                  </tr>
                </thead>
                <tbody>
                  {pipelineDeals.map((d, i) => (
                    <tr key={i} className="border-t" style={{ borderColor: COLORS.border }}>
                      <td className="py-2 font-medium" style={{ color: COLORS.text }}>{d.deal}</td>
                      <td>{Math.round(d.prob * 100)}%</td>
                      <td>{d.expReturn}x</td>
                      <td>{d.ttc}</td>
                      <td>${d.capital}M</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DetailSquare>
          <DetailSquare title="Expected Value">
            <div className="grid grid-cols-2 gap-3">
              <MiniStat label="PW EV ($MM)" value="125" />
              <MiniStat label=">=0.6 prob" value={pipelineDeals.filter(d=>d.prob>=0.6).length} />
              <MiniStat label="Avg Return" value="2.8x" />
              <MiniStat label="Total Deals" value={pipelineDeals.length} />
            </div>
          </DetailSquare>
          <DetailSquare title="Required Capital">
            <div className="grid grid-cols-2 gap-3">
              <MiniStat label="Total" value="$125M" />
              <MiniStat label="Next 90d" value="$40M" />
              <MiniStat label="Next 180d" value="$85M" />
              <MiniStat label="Available" value="$140M" />
            </div>
          </DetailSquare>
          <DetailSquare title="Deal Flow by Stage">
            <ResponsiveContainer>
              <BarChart data={[{k:"Seed",v:2},{k:"Series B",v:1},{k:"Buyout",v:1}]}>
                <CartesianGrid stroke={COLORS.border} />
                <XAxis dataKey="k" />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="v" fill={COLORS.primary} radius={[8,8,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </DetailSquare>
          <DetailSquare title="Exit Pipeline">
            <div className="overflow-hidden text-sm">
              <div className="space-y-2">
                <div className="flex justify-between p-2 rounded" style={{ background: COLORS.panel }}>
                  <span style={{ color: COLORS.text }}>HealthTech IPO</span>
                  <span style={{ color: COLORS.subt }}>Q2 2025</span>
                </div>
                <div className="flex justify-between p-2 rounded" style={{ background: COLORS.panel }}>
                  <span style={{ color: COLORS.text }}>SaaS Secondary</span>
                  <span style={{ color: COLORS.subt }}>Q3 2025</span>
                </div>
              </div>
            </div>
          </DetailSquare>
          <DetailSquare title="Pipeline Health">
            <div className="grid grid-cols-2 gap-3">
              <MiniStat label="Quality Score" value="8.2/10" />
              <MiniStat label="Diversification" value="Good" />
              <MiniStat label="Timing" value="Favorable" />
              <MiniStat label="Competition" value="Moderate" />
            </div>
          </DetailSquare>
        </>
      );

    case "Key People / Talent":
      return (
        <>
          <DetailSquare title="Leadership KPIs">
            <div className="grid grid-cols-2 gap-3 text-xs" style={{ color: COLORS.subt }}>
              <MiniStat label="Total Leaders" value="12" />
              <MiniStat label="Retention" value="94%" />
              <MiniStat label="Avg Tenure" value="4.2y" />
              <MiniStat label="Performance" value="8.6/10" />
            </div>
          </DetailSquare>
          <DetailSquare title="Succession Planning">
            <div className="grid grid-cols-2 gap-3">
              <MiniStat label="Ready Now" value="8" />
              <MiniStat label="1-2 Years" value="4" />
              <MiniStat label="Coverage" value="100%" />
              <MiniStat label="Risk" value="Low" />
            </div>
          </DetailSquare>
          <DetailSquare title="Open Roles">
            <div className="overflow-hidden text-sm">
              <div className="space-y-2">
                <div className="flex justify-between p-2 rounded" style={{ background: COLORS.panel }}>
                  <span style={{ color: COLORS.text }}>CFO - HealthTech</span>
                  <span style={{ color: COLORS.subt }}>Active</span>
                </div>
                <div className="flex justify-between p-2 rounded" style={{ background: COLORS.panel }}>
                  <span style={{ color: COLORS.text }}>VP Ops - SaaS</span>
                  <span style={{ color: COLORS.subt }}>Offer Out</span>
                </div>
                <div className="flex justify-between p-2 rounded" style={{ background: COLORS.panel }}>
                  <span style={{ color: COLORS.text }}>GM - Consumer</span>
                  <span style={{ color: COLORS.subt }}>Sourcing</span>
                </div>
              </div>
            </div>
          </DetailSquare>
          <DetailSquare title="Compensation Benchmarks">
            <div className="grid grid-cols-2 gap-3">
              <MiniStat label="vs Market" value="+12%" />
              <MiniStat label="Equity %" value="18%" />
              <MiniStat label="Bonus Pool" value="$8.2M" />
              <MiniStat label="Competitiveness" value="Strong" />
            </div>
          </DetailSquare>
          <DetailSquare title="Team Diversity">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={[{name:"Diverse",value:42},{name:"Other",value:58}]} dataKey="value" nameKey="name" innerRadius={60} outerRadius={80}>
                  {[0,1].map((i) => (
                    <Cell key={i} fill={[COLORS.accent, COLORS.secondary][i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </DetailSquare>
          <DetailSquare title="Development & Training">
            <div className="grid grid-cols-2 gap-3">
              <MiniStat label="Budget" value="$420K" />
              <MiniStat label="Programs" value="8" />
              <MiniStat label="Participation" value="92%" />
              <MiniStat label="Satisfaction" value="8.8/10" />
            </div>
          </DetailSquare>
        </>
      );

    case "Time Allocation & Productivity":
      return (
        <>
          <DetailSquare title="Time by Category">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={timeAlloc} dataKey="value" nameKey="name" innerRadius={60} outerRadius={80}>
                  {timeAlloc.map((_, i) => (
                    <Cell key={i} fill={[COLORS.primary, COLORS.accent, COLORS.secondary, "#93C5FD", "#A7F3D0"][i % 5]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </DetailSquare>
          <DetailSquare title="Weekly Breakdown">
            <div className="grid grid-cols-2 gap-3">
              <MiniStat label="Strategy" value="36%" />
              <MiniStat label="Operations" value="22%" />
              <MiniStat label="Deals" value="18%" />
              <MiniStat label="People" value="14%" />
            </div>
          </DetailSquare>
          <DetailSquare title="Meeting Load">
            <ResponsiveContainer>
              <BarChart data={[{k:"Mon",v:6},{k:"Tue",v:8},{k:"Wed",v:5},{k:"Thu",v:7},{k:"Fri",v:4}]}>
                <CartesianGrid stroke={COLORS.border} />
                <XAxis dataKey="k" />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="v" fill={COLORS.secondary} radius={[8,8,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </DetailSquare>
          <DetailSquare title="Focus Time">
            <div className="grid grid-cols-2 gap-3">
              <MiniStat label="Deep Work" value="18h/wk" />
              <MiniStat label="Meetings" value="22h/wk" />
              <MiniStat label="Admin" value="5h/wk" />
              <MiniStat label="Balance" value="Good" />
            </div>
          </DetailSquare>
          <DetailSquare title="Productivity Score">
            <div className="h-full grid place-items-center">
              <ResponsiveContainer width="90%" height="80%">
                <RadialBarChart innerRadius="60%" outerRadius="100%" data={[{ name: "score", value: 82 }]} startAngle={180} endAngle={0}>
                  <RadialBar dataKey="value" fill={COLORS.primary} cornerRadius={16}/>
                  <Tooltip />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="-mt-6 text-center">
                <div className="text-2xl font-semibold" style={{ color: COLORS.text }}>82</div>
                <div className="text-xs" style={{ color: COLORS.subt }}>out of 100</div>
              </div>
            </div>
          </DetailSquare>
          <DetailSquare title="Key Insights">
            <div className="overflow-hidden text-sm">
              <div className="space-y-2">
                <div className="p-2 rounded" style={{ background: COLORS.panel }}>
                  <span style={{ color: COLORS.text }}>Strategy time up 8% vs last quarter</span>
                </div>
                <div className="p-2 rounded" style={{ background: COLORS.panel }}>
                  <span style={{ color: COLORS.text }}>Meeting efficiency improved 12%</span>
                </div>
                <div className="p-2 rounded" style={{ background: COLORS.panel }}>
                  <span style={{ color: COLORS.text }}>Deep work blocks optimized</span>
                </div>
              </div>
            </div>
          </DetailSquare>
        </>
      );

    case "Personal Health & Cognitive Performance":
      return (
        <>
          <DetailSquare title="HRV & Sleep Trends">
            <ResponsiveContainer>
              <LineChart data={healthSeries}>
                <CartesianGrid stroke={COLORS.border} />
                <XAxis dataKey="d" />
                <YAxis hide />
                <Tooltip />
                <Line type="monotone" dataKey="hrv" stroke={COLORS.primary} dot={false} />
                <Line type="monotone" dataKey="sleep" stroke={COLORS.accent} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </DetailSquare>
          <DetailSquare title="Current Metrics">
            <div className="grid grid-cols-2 gap-3">
              <MiniStat label="HRV" value="62ms" />
              <MiniStat label="Sleep" value="7.2h" />
              <MiniStat label="RHR" value="58bpm" />
              <MiniStat label="Recovery" value="Good" />
            </div>
          </DetailSquare>
          <DetailSquare title="Cognitive Performance">
            <div className="grid grid-cols-2 gap-3">
              <MiniStat label="Focus Score" value="8.4/10" />
              <MiniStat label="Memory" value="8.1/10" />
              <MiniStat label="Processing" value="8.6/10" />
              <MiniStat label="Overall" value="8.4/10" />
            </div>
          </DetailSquare>
          <DetailSquare title="Activity Levels">
            <ResponsiveContainer>
              <BarChart data={[{k:"Mon",v:8200},{k:"Tue",v:9100},{k:"Wed",v:7800},{k:"Thu",v:8900},{k:"Fri",v:10200}]}>
                <CartesianGrid stroke={COLORS.border} />
                <XAxis dataKey="k" />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="v" fill={COLORS.accent} radius={[8,8,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </DetailSquare>
          <DetailSquare title="Stress & Recovery">
            <div className="grid grid-cols-2 gap-3">
              <MiniStat label="Stress" value="Low" />
              <MiniStat label="Recovery" value="92%" />
              <MiniStat label="Readiness" value="High" />
              <MiniStat label="Trend" value="Improving" />
            </div>
          </DetailSquare>
          <DetailSquare title="Health Goals">
            <div className="overflow-hidden text-sm">
              <div className="space-y-2">
                <div className="p-2 rounded" style={{ background: COLORS.panel }}>
                  <div className="flex justify-between mb-1">
                    <span style={{ color: COLORS.text }}>Sleep 7.5h avg</span>
                    <span style={{ color: COLORS.subt }}>96%</span>
                  </div>
                  <div className="w-full h-2 rounded-full" style={{ background: COLORS.border }}>
                    <div className="h-full rounded-full" style={{ width: "96%", background: COLORS.primary }} />
                  </div>
                </div>
                <div className="p-2 rounded" style={{ background: COLORS.panel }}>
                  <div className="flex justify-between mb-1">
                    <span style={{ color: COLORS.text }}>10k steps daily</span>
                    <span style={{ color: COLORS.subt }}>88%</span>
                  </div>
                  <div className="w-full h-2 rounded-full" style={{ background: COLORS.border }}>
                    <div className="h-full rounded-full" style={{ width: "88%", background: COLORS.accent }} />
                  </div>
                </div>
              </div>
            </div>
          </DetailSquare>
        </>
      );

    case "Reputation, Brand & Legal/Regulatory":
      return (
        <>
          <DetailSquare title="Sentiment Trend">
            <ResponsiveContainer>
              <LineChart data={timeline}>
                <CartesianGrid stroke={COLORS.border} />
                <XAxis dataKey="month" hide />
                <YAxis hide />
                <Tooltip />
                <Line type="monotone" dataKey="sentiment" stroke={COLORS.primary} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </DetailSquare>
          <DetailSquare title="Media Coverage">
            <div className="grid grid-cols-2 gap-3">
              <MiniStat label="This Month" value="12" />
              <MiniStat label="Positive" value="10" />
              <MiniStat label="Neutral" value="2" />
              <MiniStat label="Negative" value="0" />
            </div>
          </DetailSquare>
          <DetailSquare title="Legal & Compliance">
            <div className="grid grid-cols-2 gap-3">
              <MiniStat label="Active Issues" value="0" />
              <MiniStat label="Pending" value="0" />
              <MiniStat label="Compliance" value="Current" />
              <MiniStat label="Risk" value="Low" />
            </div>
          </DetailSquare>
          <DetailSquare title="Brand Value">
            <div className="h-full grid place-items-center">
              <ResponsiveContainer width="90%" height="80%">
                <RadialBarChart innerRadius="60%" outerRadius="100%" data={[{ name: "value", value: 84 }]} startAngle={180} endAngle={0}>
                  <RadialBar dataKey="value" fill={COLORS.accent} cornerRadius={16}/>
                  <Tooltip />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="-mt-6 text-center">
                <div className="text-2xl font-semibold" style={{ color: COLORS.text }}>84</div>
                <div className="text-xs" style={{ color: COLORS.subt }}>Brand Score</div>
              </div>
            </div>
          </DetailSquare>
          <DetailSquare title="Regulatory Updates">
            <div className="overflow-hidden text-sm">
              <div className="space-y-2">
                <div className="p-2 rounded" style={{ background: COLORS.panel }}>
                  <span style={{ color: COLORS.text }}>All filings current</span>
                </div>
                <div className="p-2 rounded" style={{ background: COLORS.panel }}>
                  <span style={{ color: COLORS.text }}>No pending actions</span>
                </div>
                <div className="p-2 rounded" style={{ background: COLORS.panel }}>
                  <span style={{ color: COLORS.text }}>Compliance review Q1</span>
                </div>
              </div>
            </div>
          </DetailSquare>
          <DetailSquare title="Stakeholder Relations">
            <div className="grid grid-cols-2 gap-3">
              <MiniStat label="Satisfaction" value="8.8/10" />
              <MiniStat label="Trust Index" value="9.1/10" />
              <MiniStat label="Engagement" value="High" />
              <MiniStat label="Transparency" value="Excellent" />
            </div>
          </DetailSquare>
        </>
      );

    case "Macroeconomic & Market":
      return (
        <>
          <DetailSquare title="Key Indicators">
            <div className="overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  {macro.map((m, i) => (
                    <tr key={i} className="border-t" style={{ borderColor: COLORS.border }}>
                      <td className="py-2 font-medium" style={{ color: COLORS.text }}>{m.k}</td>
                      <td className="text-right">{m.v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DetailSquare>
          <DetailSquare title="Market Sentiment">
            <div className="h-full grid place-items-center">
              <ResponsiveContainer width="90%" height="80%">
                <RadialBarChart innerRadius="60%" outerRadius="100%" data={[{ name: "sentiment", value: 68 }]} startAngle={180} endAngle={0}>
                  <RadialBar dataKey="value" fill={COLORS.primary} cornerRadius={16}/>
                  <Tooltip />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="-mt-6 text-center">
                <div className="text-2xl font-semibold" style={{ color: COLORS.text }}>68</div>
                <div className="text-xs" style={{ color: COLORS.subt }}>Bullish</div>
              </div>
            </div>
          </DetailSquare>
          <DetailSquare title="Sector Performance">
            <ResponsiveContainer>
              <BarChart data={[{k:"Tech",v:18},{k:"Health",v:14},{k:"Finance",v:9},{k:"Energy",v:6}]}>
                <CartesianGrid stroke={COLORS.border} />
                <XAxis dataKey="k" />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="v" fill={COLORS.accent} radius={[8,8,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </DetailSquare>
          <DetailSquare title="Economic Outlook">
            <div className="grid grid-cols-2 gap-3">
              <MiniStat label="GDP Growth" value="2.4%" />
              <MiniStat label="Inflation" value="3.2%" />
              <MiniStat label="Unemployment" value="3.8%" />
              <MiniStat label="Outlook" value="Stable" />
            </div>
          </DetailSquare>
          <DetailSquare title="Portfolio Correlation">
            <ResponsiveContainer>
              <LineChart data={timeline.slice(0, 6)}>
                <CartesianGrid stroke={COLORS.border} />
                <XAxis dataKey="month" />
                <YAxis hide />
                <Tooltip />
                <Line type="monotone" dataKey="netWorth" stroke={COLORS.primary} />
              </LineChart>
            </ResponsiveContainer>
          </DetailSquare>
          <DetailSquare title="Key Risks">
            <div className="overflow-hidden text-sm">
              <div className="space-y-2">
                <div className="p-2 rounded" style={{ background: COLORS.panel }}>
                  <span style={{ color: COLORS.text }}>Rate volatility - Moderate</span>
                </div>
                <div className="p-2 rounded" style={{ background: COLORS.panel }}>
                  <span style={{ color: COLORS.text }}>Geopolitical - Low</span>
                </div>
                <div className="p-2 rounded" style={{ background: COLORS.panel }}>
                  <span style={{ color: COLORS.text }}>Credit spreads - Stable</span>
                </div>
              </div>
            </div>
          </DetailSquare>
        </>
      );

    case "Network & Deal Flow Quality":
      return (
        <>
          <DetailSquare title="High‑value Intros">
            <div className="grid grid-cols-3 gap-3">
              <MiniStat label="This wk" value="4" />
              <MiniStat label="This mo" value="12" />
              <MiniStat label="YTD" value="68" />
            </div>
          </DetailSquare>
          <DetailSquare title="Follow‑ups">
            <div className="grid grid-cols-3 gap-3">
              <MiniStat label="Due" value="6" />
              <MiniStat label="Scheduled" value="9" />
              <MiniStat label="Closed" value="14" />
            </div>
          </DetailSquare>
          <DetailSquare title="Co‑investors">
            <div className="grid grid-cols-3 gap-3">
              <MiniStat label="Active" value="7" />
              <MiniStat label="Dormant" value="3" />
              <MiniStat label="New" value="2" />
            </div>
          </DetailSquare>
          <DetailSquare title="Network Growth">
            <ResponsiveContainer>
              <LineChart data={timeline.slice(0, 6)}>
                <CartesianGrid stroke={COLORS.border} />
                <XAxis dataKey="month" />
                <YAxis hide />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke={COLORS.primary} />
              </LineChart>
            </ResponsiveContainer>
          </DetailSquare>
          <DetailSquare title="Deal Quality Score">
            <div className="h-full grid place-items-center">
              <ResponsiveContainer width="90%" height="80%">
                <RadialBarChart innerRadius="60%" outerRadius="100%" data={[{ name: "quality", value: 78 }]} startAngle={180} endAngle={0}>
                  <RadialBar dataKey="value" fill={COLORS.accent} cornerRadius={16}/>
                  <Tooltip />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="-mt-6 text-center">
                <div className="text-2xl font-semibold" style={{ color: COLORS.text }}>78</div>
                <div className="text-xs" style={{ color: COLORS.subt }}>High Quality</div>
              </div>
            </div>
          </DetailSquare>
          <DetailSquare title="Top Referrers">
            <div className="overflow-hidden text-sm">
              <div className="space-y-2">
                <div className="flex justify-between p-2 rounded" style={{ background: COLORS.panel }}>
                  <span style={{ color: COLORS.text }}>Partner A</span>
                  <span style={{ color: COLORS.subt }}>18 intros</span>
                </div>
                <div className="flex justify-between p-2 rounded" style={{ background: COLORS.panel }}>
                  <span style={{ color: COLORS.text }}>Partner B</span>
                  <span style={{ color: COLORS.subt }}>12 intros</span>
                </div>
                <div className="flex justify-between p-2 rounded" style={{ background: COLORS.panel }}>
                  <span style={{ color: COLORS.text }}>Partner C</span>
                  <span style={{ color: COLORS.subt }}>9 intros</span>
                </div>
              </div>
            </div>
          </DetailSquare>
        </>
      );

    case "Risk Exposures & Hedging":
      return (
        <>
          <DetailSquare title="Risk Scores">
            <div className="grid grid-cols-2 gap-3 text-sm">
              {risk.map((r,i)=> (
                <div key={i} className="rounded-lg p-3 border flex items-center justify-between" style={{ borderColor: COLORS.border, background: COLORS.bg }}>
                  <span style={{ color: COLORS.text }}>{r.type}</span>
                  <span className="font-semibold" style={{ color: COLORS.accent }}>{r.score}</span>
                </div>
              ))}
            </div>
          </DetailSquare>
          <DetailSquare title="Downside Scenarios">
            <div className="grid grid-cols-2 gap-3">
              <MiniStat label="Base Case" value="-5%" />
              <MiniStat label="Moderate" value="-12%" />
              <MiniStat label="Severe" value="-22%" />
              <MiniStat label="VaR (95%)" value="$42M" />
            </div>
          </DetailSquare>
          <DetailSquare title="Hedging Effectiveness">
            <div className="grid grid-cols-2 gap-3">
              <MiniStat label="Coverage" value="72%" />
              <MiniStat label="Cost" value="1.3% NAV" />
              <MiniStat label="Efficiency" value="Good" />
              <MiniStat label="Rebalance" value="Q1" />
            </div>
          </DetailSquare>
          <DetailSquare title="Risk Trend">
            <ResponsiveContainer>
              <LineChart data={timeline.slice(0, 6)}>
                <CartesianGrid stroke={COLORS.border} />
                <XAxis dataKey="month" />
                <YAxis hide />
                <Tooltip />
                <Line type="monotone" dataKey="cash" stroke={COLORS.secondary} />
              </LineChart>
            </ResponsiveContainer>
          </DetailSquare>
          <DetailSquare title="Hedging Instruments">
            <div className="overflow-hidden text-sm">
              <div className="space-y-2">
                <div className="flex justify-between p-2 rounded" style={{ background: COLORS.panel }}>
                  <span style={{ color: COLORS.text }}>Equity Puts</span>
                  <span style={{ color: COLORS.subt }}>$28M</span>
                </div>
                <div className="flex justify-between p-2 rounded" style={{ background: COLORS.panel }}>
                  <span style={{ color: COLORS.text }}>Rate Swaps</span>
                  <span style={{ color: COLORS.subt }}>$45M</span>
                </div>
                <div className="flex justify-between p-2 rounded" style={{ background: COLORS.panel }}>
                  <span style={{ color: COLORS.text }}>FX Collars</span>
                  <span style={{ color: COLORS.subt }}>$18M</span>
                </div>
              </div>
            </div>
          </DetailSquare>
          <DetailSquare title="Concentration Risk">
            <ResponsiveContainer>
              <BarChart data={[{k:"Top 1",v:18},{k:"Top 3",v:41},{k:"Top 10",v:68}]}>
                <CartesianGrid stroke={COLORS.border} />
                <XAxis dataKey="k" />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="v" fill={COLORS.primary} radius={[8,8,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </DetailSquare>
        </>
      );

    case "Philanthropy, ESG & Impact":
      return (
        <>
          <DetailSquare title="Philanthropy">
            <div className="grid grid-cols-1 gap-2 text-sm">
              {impact.map((p,i)=> (
                <div key={i} className="rounded-lg p-2 border flex items-center justify-between" style={{ borderColor: COLORS.border, background: COLORS.bg }}>
                  <span style={{ color: COLORS.text }}>{p.name}</span>
                  <span>${p.deployed}M • {p.outcome}</span>
                </div>
              ))}
            </div>
          </DetailSquare>
          <DetailSquare title="ESG Scores">
            <div className="grid grid-cols-2 gap-3">
              <MiniStat label="Environmental" value="8.2/10" />
              <MiniStat label="Social" value="8.6/10" />
              <MiniStat label="Governance" value="9.1/10" />
              <MiniStat label="Overall" value="8.6/10" />
            </div>
          </DetailSquare>
          <DetailSquare title="Governance">
            <div className="grid grid-cols-2 gap-3">
              <MiniStat label="Meetings" value="4/qtr" />
              <MiniStat label="Policies" value="Updated" />
              <MiniStat label="Compliance" value="100%" />
              <MiniStat label="Transparency" value="High" />
            </div>
          </DetailSquare>
          <DetailSquare title="Impact Metrics">
            <ResponsiveContainer>
              <BarChart data={[{k:"Education",v:3000},{k:"Health",v:12},{k:"Climate",v:5}]}>
                <CartesianGrid stroke={COLORS.border} />
                <XAxis dataKey="k" />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="v" fill={COLORS.accent} radius={[8,8,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </DetailSquare>
          <DetailSquare title="Deployment Trend">
            <ResponsiveContainer>
              <LineChart data={timeline.slice(0, 6)}>
                <CartesianGrid stroke={COLORS.border} />
                <XAxis dataKey="month" />
                <YAxis hide />
                <Tooltip />
                <Line type="monotone" dataKey="ebitda" stroke={COLORS.primary} />
              </LineChart>
            </ResponsiveContainer>
          </DetailSquare>
          <DetailSquare title="Future Commitments">
            <div className="grid grid-cols-2 gap-3">
              <MiniStat label="2025" value="$8.5M" />
              <MiniStat label="2026" value="$9.2M" />
              <MiniStat label="Total Pledged" value="$42M" />
              <MiniStat label="Status" value="On Track" />
            </div>
          </DetailSquare>
        </>
      );

    case "News & Market Intelligence":
      return <NewsFeedDetail />;

    case "Personal Goals & Legacy":
      return (
        <>
          <DetailSquare title="Projects">
            <div className="grid grid-cols-1 gap-3">
              {legacy.map((g,i)=> (
                <div key={i} className="rounded-lg p-3 border" style={{ borderColor: COLORS.border, background: COLORS.bg }}>
                  <div className="text-xs mb-1" style={{ color: COLORS.text }}>{g.name}</div>
                  <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}` }}>
                    <div className="h-full" style={{ width: `${g.progress}%`, background: COLORS.primary }} />
                  </div>
                  <div className="text-xs mt-1 text-right" style={{ color: COLORS.subt }}>{g.progress}%</div>
                </div>
              ))}
            </div>
          </DetailSquare>
          <DetailSquare title="Values & Alignment">
            <div className="grid grid-cols-2 gap-3">
              <MiniStat label="Purpose Score" value="9.2/10" />
              <MiniStat label="Fulfillment Index" value="8.7/10" />
              <MiniStat label="Alignment" value="Strong" />
              <MiniStat label="Legacy Draft" value="In Progress" />
            </div>
          </DetailSquare>
          <DetailSquare title="Next Milestones">
            <div className="grid grid-cols-2 gap-3">
              <MiniStat label="Foundation Audit" value="Q1" />
              <MiniStat label="Publication" value="Q3" />
              <MiniStat label="Charter Update" value="Q2" />
              <MiniStat label="Review" value="Q4" />
            </div>
          </DetailSquare>
          <DetailSquare title="Time Investment">
            <ResponsiveContainer>
              <BarChart data={[{k:"Foundation",v:12},{k:"Book",v:8},{k:"Charter",v:6}]}>
                <CartesianGrid stroke={COLORS.border} />
                <XAxis dataKey="k" />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="v" fill={COLORS.primary} radius={[8,8,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </DetailSquare>
          <DetailSquare title="Impact Vision">
            <div className="overflow-hidden text-sm p-2" style={{ color: COLORS.text }}>
              "Sustain long-term purpose beyond capital. Focus on stewardship and systems that outlive the operator."
            </div>
          </DetailSquare>
          <DetailSquare title="Legacy Metrics">
            <div className="grid grid-cols-2 gap-3">
              <MiniStat label="Years Active" value="18" />
              <MiniStat label="Lives Impacted" value="3k+" />
              <MiniStat label="Institutions" value="12" />
              <MiniStat label="Sustainability" value="High" />
            </div>
          </DetailSquare>
        </>
      );

    default:
      return null;
  }
}

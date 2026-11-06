
import React, { useMemo, useState } from "react";
import {
  LayoutDashboard, Users, CalendarDays, Headset, Ticket,
  Clock, AlertTriangle, ClipboardList, BarChart3, Settings,
  Bell, Plus, Download, CheckCircle2, XCircle, Menu, Save
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Roster Management", icon: CalendarDays },
  { label: "IT Team Availability", icon: Users },
  { label: "All IT Tickets", icon: Ticket },
  { label: "Employee Ticket Buckets", icon: Headset },
  { label: "Pending Acknowledgements", icon: Clock },
  { label: "Overdue Tickets", icon: AlertTriangle },
  { label: "Shift Handover", icon: ClipboardList },
  { label: "Reports & Analytics", icon: BarChart3 },
  { label: "Settings", icon: Settings }
];

const initialEmployees = [
  { id: 1, name: "Adimulam Venkata Sai Krishna", department: "IT Support", shift: "Afternoon", status: "Available", weekOffs: [] },
  { id: 2, name: "Sai Kiran", department: "IT Support", shift: "Afternoon", status: "Available", weekOffs: ["Saturday", "Sunday"] },
  { id: 3, name: "Mohd Shanawaz", department: "IT Support", shift: "Night", status: "Available", weekOffs: ["Saturday", "Sunday"] },
  { id: 4, name: "Duddy Santosh Kumar", department: "IT Support", shift: "Morning", status: "Available", weekOffs: ["Saturday", "Sunday"] },
  { id: 5, name: "Mohd Ayyub", department: "IT Support", shift: "Morning", status: "Available", weekOffs: ["Thursday", "Friday"] },
  { id: 6, name: "Mohd Shadab", department: "IT Support", shift: "Unassigned", status: "Available", weekOffs: ["Saturday", "Sunday"] },

  { id: 7, name: "Kiran", department: "Network", shift: "Unassigned", status: "Available", weekOffs: ["Saturday", "Sunday"] },
  { id: 8, name: "Vijay Bhaskar", department: "Network", shift: "Unassigned", status: "Available", weekOffs: ["Saturday", "Sunday"] },
  { id: 9, name: "Afzal Shaik", department: "Network", shift: "Unassigned", status: "Available", weekOffs: ["Saturday", "Sunday"] },
  { id: 10, name: "Padma", department: "Network", shift: "Unassigned", status: "Available", weekOffs: ["Saturday", "Sunday"] },
  { id: 11, name: "Charan", department: "Network", shift: "Unassigned", status: "Available", weekOffs: ["Saturday", "Sunday"] },

  { id: 12, name: "Srinivas Guttula", department: "Not Assigned", shift: "Night", status: "Available", weekOffs: ["Saturday", "Sunday"] },
  { id: 13, name: "Pramod", department: "Not Assigned", shift: "Night", status: "Available", weekOffs: ["Thursday", "Friday"] }
];

const initialTickets = [
  { id: "INC-1001", employee: "Mohd Shanawaz", issue: "Laptop not starting", category: "Hardware", priority: "High", status: "In Progress", created: "2026-11-04", acknowledged: true },
  { id: "INC-1002", employee: "Sai Kiran", issue: "VPN connection issue", category: "Network", priority: "Medium", status: "Open", created: "2026-11-05", acknowledged: false },
  { id: "INC-1003", employee: "Kiran", issue: "Unable to access email", category: "Software", priority: "High", status: "Open", created: "2026-11-01", acknowledged: false },
  { id: "INC-1004", employee: "Vijay Bhaskar", issue: "Keyboard replacement", category: "Hardware", priority: "Low", status: "Resolved", created: "2026-11-03", acknowledged: true },
  { id: "INC-1005", employee: "Afzal Shaik", issue: "Wi-Fi connectivity issue", category: "Network", priority: "High", status: "In Progress", created: "2026-10-30", acknowledged: true },
  { id: "INC-1006", employee: "Duddy Santosh Kumar", issue: "Software installation request", category: "Software", priority: "Medium", status: "Open", created: "2026-11-02", acknowledged: false },
  { id: "INC-1007", employee: "Mohd Ayyub", issue: "Desktop running slowly", category: "Hardware", priority: "Low", status: "Resolved", created: "2026-11-05", acknowledged: true }
];

const shifts = ["Morning", "Afternoon", "Night", "Unassigned"];
const departments = ["IT Support", "Network", "Not Assigned"];
const today = new Date().toISOString().slice(0, 10);

function Badge({ children }) {
  const styles = {
    Available: "bg-green-100 text-green-700",
    "On Leave": "bg-red-100 text-red-700",
    "Weekly Off": "bg-gray-100 text-gray-600",
    Open: "bg-blue-100 text-blue-700",
    "In Progress": "bg-amber-100 text-amber-700",
    Resolved: "bg-green-100 text-green-700",
    High: "bg-red-100 text-red-700",
    Medium: "bg-amber-100 text-amber-700",
    Low: "bg-gray-100 text-gray-600",
    Morning: "bg-blue-100 text-blue-700",
    Afternoon: "bg-purple-100 text-purple-700",
    Night: "bg-indigo-100 text-indigo-700",
    Unassigned: "bg-gray-100 text-gray-600"
  };

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${styles[children] || "bg-gray-100 text-gray-600"}`}>
      {children}
    </span>
  );
}

function StatCard({ title, value, subtitle, icon: Icon }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{title}</p>
        <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
          <Icon size={20} />
        </div>
      </div>
      <p className="mt-3 text-3xl font-bold text-gray-900">{value}</p>
      <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
    </div>
  );
}

function SectionTitle({ title, subtitle, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

export default function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [employees, setEmployees] = useState(initialEmployees);
  const [tickets, setTickets] = useState(initialTickets);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [shiftFilter, setShiftFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedDay, setSelectedDay] = useState(today);
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: "", department: "IT Support", shift: "Morning" });
  const [newTicket, setNewTicket] = useState({ employee: "", issue: "", category: "Hardware", priority: "Medium" });
  const [handoverNotes, setHandoverNotes] = useState([]);
  const [handoverText, setHandoverText] = useState("");
  const [settings, setSettings] = useState({
    company: "Solugenix",
    morning: "06:00 AM - 02:00 PM",
    afternoon: "02:00 PM - 10:00 PM",
    night: "10:00 PM - 06:00 AM"
  });
  const [mobileMenu, setMobileMenu] = useState(false);

  const filteredEmployees = useMemo(() => employees.filter(e => {
    const matchesSearch = `${e.name} ${e.department}`.toLowerCase().includes(search.toLowerCase());
    const matchesDept = departmentFilter === "All" || e.department === departmentFilter;
    const matchesShift = shiftFilter === "All" || e.shift === shiftFilter;
    const matchesStatus = statusFilter === "All" || e.status === statusFilter;
    return matchesSearch && matchesDept && matchesShift && matchesStatus;
  }), [employees, search, departmentFilter, shiftFilter, statusFilter]);

  const filteredTickets = useMemo(() => tickets.filter(t => {
    const matchesSearch = `${t.id} ${t.employee} ${t.issue}`.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  }), [tickets, search, statusFilter]);

  const availableCount = employees.filter(e => e.status === "Available").length;
  const leaveCount = employees.filter(e => e.status === "On Leave").length;
  const offCount = employees.filter(e => e.status === "Weekly Off").length;
  const openCount = tickets.filter(t => t.status === "Open").length;
  const overdueTickets = tickets.filter(t => t.status !== "Resolved" && t.created < today);
  const pendingTickets = tickets.filter(t => !t.acknowledged);

  const inputClass = "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
  const buttonClass = "inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700";

  const resetFilters = () => {
    setSearch("");
    setDepartmentFilter("All");
    setShiftFilter("All");
    setStatusFilter("All");
  };

  const updateTicket = (id, changes) => {
    setTickets(old => old.map(t => t.id === id ? { ...t, ...changes } : t));
  };

  const addEmployee = e => {
    e.preventDefault();
    if (!newEmployee.name.trim()) return;

    setEmployees(old => [...old, {
      id: Date.now(),
      ...newEmployee,
      status: "Available",
      weekOffs: []
    }]);

    setNewEmployee({ name: "", department: "IT Support", shift: "Morning" });
    setShowEmployeeForm(false);
  };

  const addTicket = e => {
    e.preventDefault();
    if (!newTicket.employee || !newTicket.issue.trim()) return;

    setTickets(old => [{
      id: `INC-${1000 + old.length + 1}`,
      ...newTicket,
      status: "Open",
      created: today,
      acknowledged: false
    }, ...old]);

    setNewTicket({ employee: "", issue: "", category: "Hardware", priority: "Medium" });
    setShowTicketForm(false);
  };

  const exportTickets = () => {
    const rows = [
      ["Ticket ID", "Employee", "Issue", "Category", "Priority", "Status", "Created"],
      ...filteredTickets.map(t => [t.id, t.employee, t.issue, t.category, t.priority, t.status, t.created])
    ];

    const csv = rows.map(row =>
      row.map(v => `"${String(v).replaceAll('"', '""')}"`).join(",")
    ).join("\n");

    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "solugenix-tickets.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const renderEmployeeTable = list => (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="w-full min-w-[700px] text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th className="px-5 py-4">Employee</th>
            <th className="px-5 py-4">Department</th>
            <th className="px-5 py-4">Shift</th>
            <th className="px-5 py-4">Weekly Off</th>
            <th className="px-5 py-4">Availability</th>
            <th className="px-5 py-4">Change Shift</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {list.map(e => (
            <tr key={e.id} className="hover:bg-gray-50">
              <td className="px-5 py-4 font-semibold text-gray-800">{e.name}</td>
              <td className="px-5 py-4 text-gray-600">{e.department}</td>
              <td className="px-5 py-4"><Badge>{e.shift}</Badge></td>
              <td className="px-5 py-4 text-xs text-gray-600">{e.weekOffs.join(", ") || "No fixed off"}</td>
              <td className="px-5 py-4"><Badge>{e.status}</Badge></td>
              <td className="px-5 py-4">
                <select className="rounded-md border border-gray-300 p-2 text-xs" value={e.shift} onChange={ev => setEmployees(old => old.map(x => x.id === e.id ? { ...x, shift: ev.target.value } : x))}>
                  {shifts.map(s => <option key={s}>{s}</option>)}
                </select>
              </td>
            </tr>
          ))}
          {list.length === 0 && <tr><td colSpan="6" className="p-8 text-center text-gray-500">No employees found.</td></tr>}
        </tbody>
      </table>
    </div>
  );

  const renderTicketTable = list => (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="w-full min-w-[850px] text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th className="px-5 py-4">Ticket ID</th>
            <th className="px-5 py-4">Employee</th>
            <th className="px-5 py-4">Issue</th>
            <th className="px-5 py-4">Category</th>
            <th className="px-5 py-4">Priority</th>
            <th className="px-5 py-4">Status</th>
            <th className="px-5 py-4">Acknowledgement</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {list.map(t => (
            <tr key={t.id} className="hover:bg-gray-50">
              <td className="px-5 py-4 font-semibold text-blue-700">{t.id}</td>
              <td className="px-5 py-4">{t.employee}</td>
              <td className="px-5 py-4">{t.issue}</td>
              <td className="px-5 py-4">{t.category}</td>
              <td className="px-5 py-4"><Badge>{t.priority}</Badge></td>
              <td className="px-5 py-4">
                <select className="rounded-md border border-gray-300 p-2 text-xs" value={t.status} onChange={e => updateTicket(t.id, { status: e.target.value })}>
                  {["Open", "In Progress", "Resolved"].map(s => <option key={s}>{s}</option>)}
                </select>
              </td>
              <td className="px-5 py-4">
                <button onClick={() => updateTicket(t.id, { acknowledged: !t.acknowledged })} className={t.acknowledged ? "text-green-700" : "text-amber-700"}>
                  {t.acknowledged ? "Acknowledged" : "Pending"}
                </button>
              </td>
            </tr>
          ))}
          {list.length === 0 && <tr><td colSpan="7" className="p-8 text-center text-gray-500">No tickets found.</td></tr>}
        </tbody>
      </table>
    </div>
  );

  const renderPage = () => {
    switch (activePage) {
      case "Dashboard":
        return (
          <>
            <SectionTitle title="Dashboard Overview" subtitle="Welcome to Solugenix IT operations dashboard." />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard title="Total Employees" value={employees.length} subtitle="Registered team members" icon={Users} />
              <StatCard title="Available Employees" value={availableCount} subtitle="Currently available" icon={CheckCircle2} />
              <StatCard title="Open Tickets" value={openCount} subtitle="Awaiting resolution" icon={Ticket} />
              <StatCard title="Overdue Tickets" value={overdueTickets.length} subtitle="Need attention" icon={AlertTriangle} />
            </div>
            <div className="mt-6 grid gap-6 xl:grid-cols-2">
              <div className="rounded-xl border border-gray-200 bg-white p-5">
                <h3 className="mb-4 font-bold">Team Availability</h3>
                {[["Available", availableCount], ["On Leave", leaveCount], ["Weekly Off", offCount]].map(([label, value]) => (
                  <div key={label} className="mb-4">
                    <div className="mb-1 flex justify-between text-sm"><span>{label}</span><strong>{value}</strong></div>
                    <div className="h-2 rounded-full bg-gray-100"><div className="h-2 rounded-full bg-blue-600" style={{ width: `${employees.length ? value / employees.length * 100 : 0}%` }} /></div>
                  </div>
                ))}
                <button onClick={() => setActivePage("IT Team Availability")} className="mt-2 text-sm font-semibold text-blue-600">View team availability →</button>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-5">
                <h3 className="mb-4 font-bold">Recent Tickets</h3>
                {tickets.slice(0, 5).map(t => (
                  <div key={t.id} className="flex items-center justify-between border-b border-gray-100 py-3 last:border-0">
                    <div><p className="text-sm font-semibold">{t.id} · {t.issue}</p><p className="text-xs text-gray-500">{t.employee}</p></div>
                    <Badge>{t.status}</Badge>
                  </div>
                ))}
                <button onClick={() => setActivePage("All IT Tickets")} className="mt-3 text-sm font-semibold text-blue-600">View all tickets →</button>
              </div>
            </div>
          </>
        );

      case "Roster Management":
        return (
          <>
            <SectionTitle title="Roster Management" subtitle="Manage employee shifts and team schedules." action={<button className={buttonClass} onClick={() => setShowEmployeeForm(true)}><Plus size={17} /> Add Employee</button>} />
            <div className="mb-5 grid gap-3 md:grid-cols-3">
              <select className={inputClass} value={departmentFilter} onChange={e => setDepartmentFilter(e.target.value)}><option value="All">All Departments</option>{departments.map(d => <option key={d}>{d}</option>)}</select>
              <select className={inputClass} value={shiftFilter} onChange={e => setShiftFilter(e.target.value)}><option value="All">All Shifts</option>{shifts.map(s => <option key={s}>{s}</option>)}</select>
              <select className={inputClass} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}><option value="All">All Availability</option>{["Available", "On Leave", "Weekly Off"].map(s => <option key={s}>{s}</option>)}</select>
            </div>
            {renderEmployeeTable(filteredEmployees)}
            {showEmployeeForm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                <form onSubmit={addEmployee} className="w-full max-w-md space-y-4 rounded-xl bg-white p-6 shadow-xl">
                  <h3 className="text-lg font-bold">Add Employee</h3>
                  <input className={inputClass} placeholder="Employee name" value={newEmployee.name} onChange={e => setNewEmployee({ ...newEmployee, name: e.target.value })} required />
                  <select className={inputClass} value={newEmployee.department} onChange={e => setNewEmployee({ ...newEmployee, department: e.target.value })}>{departments.map(d => <option key={d}>{d}</option>)}</select>
                  <select className={inputClass} value={newEmployee.shift} onChange={e => setNewEmployee({ ...newEmployee, shift: e.target.value })}>{shifts.map(s => <option key={s}>{s}</option>)}</select>
                  <div className="flex justify-end gap-2"><button type="button" onClick={() => setShowEmployeeForm(false)} className="rounded-lg border px-4 py-2">Cancel</button><button className={buttonClass}>Save Employee</button></div>
                </form>
              </div>
            )}
          </>
        );

      case "IT Team Availability": {
        const dayName = new Date(`${selectedDay}T12:00:00`).toLocaleDateString("en-US", { weekday: "long" });
        const availableToday = employees.filter(e => e.status === "Available" && !e.weekOffs.includes(dayName));
        const unavailableToday = employees.filter(e => e.status !== "Available" || e.weekOffs.includes(dayName));

        return (
          <>
            <SectionTitle title="IT Team Availability" subtitle={`Team availability for ${dayName}, ${selectedDay}`} action={<input type="date" className={inputClass + " max-w-48"} value={selectedDay} onChange={e => setSelectedDay(e.target.value)} />} />
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard title="Total Employees" value={employees.length} subtitle="All team members" icon={Users} />
              <StatCard title="Available Today" value={availableToday.length} subtitle="Available for work" icon={CheckCircle2} />
              <StatCard title="Unavailable Today" value={unavailableToday.length} subtitle="Weekly off or leave" icon={XCircle} />
            </div>
            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              {["Morning", "Afternoon", "Night", "Unassigned"].map(shift => {
                const members = employees.filter(e => e.shift === shift);
                return (
                  <div key={shift} className="rounded-xl border border-gray-200 bg-white p-5">
                    <div className="mb-4 flex items-center justify-between"><h3 className="font-bold">{shift} Shift</h3><Badge>{members.filter(e => availableToday.includes(e)).length} Available</Badge></div>
                    {members.map(e => (
                      <div key={e.id} className="flex items-center justify-between border-b border-gray-100 py-3 last:border-0">
                        <div><p className="text-sm font-semibold">{e.name}</p><p className="text-xs text-gray-500">{e.department}</p></div>
                        <Badge>{e.weekOffs.includes(dayName) ? "Weekly Off" : e.status}</Badge>
                      </div>
                    ))}
                    {members.length === 0 && <p className="text-sm text-gray-500">No employees assigned.</p>}
                  </div>
                );
              })}
            </div>
            <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="mb-4 font-bold">Unavailable Employees – {dayName}</h3>
              {unavailableToday.map(e => (
                <div key={e.id} className="flex justify-between border-b py-3 text-sm last:border-0"><span>{e.name} · {e.shift} Shift</span><Badge>{e.weekOffs.includes(dayName) ? "Weekly Off" : e.status}</Badge></div>
              ))}
              {unavailableToday.length === 0 && <p className="text-sm text-gray-500">Everyone is available today.</p>}
            </div>
          </>
        );
      }

      case "All IT Tickets":
        return (
          <>
            <SectionTitle title="All IT Tickets" subtitle="View and update IT support incidents." action={<><button onClick={exportTickets} className="mr-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold"><Download size={16} className="inline" /> Export</button><button className={buttonClass} onClick={() => setShowTicketForm(true)}><Plus size={17} /> Create Ticket</button></>} />
            <div className="mb-4 flex flex-wrap gap-3"><input className={inputClass + " max-w-sm"} placeholder="Search tickets..." value={search} onChange={e => setSearch(e.target.value)} /><select className={inputClass + " max-w-48"} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}><option value="All">All statuses</option>{["Open", "In Progress", "Resolved"].map(s => <option key={s}>{s}</option>)}</select></div>
            {renderTicketTable(filteredTickets)}
            {showTicketForm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                <form onSubmit={addTicket} className="w-full max-w-md space-y-4 rounded-xl bg-white p-6 shadow-xl">
                  <h3 className="text-lg font-bold">Create IT Ticket</h3>
                  <select className={inputClass} value={newTicket.employee} onChange={e => setNewTicket({ ...newTicket, employee: e.target.value })} required><option value="">Select employee</option>{employees.map(e => <option key={e.id}>{e.name}</option>)}</select>
                  <input className={inputClass} placeholder="Describe the issue" value={newTicket.issue} onChange={e => setNewTicket({ ...newTicket, issue: e.target.value })} required />
                  <select className={inputClass} value={newTicket.category} onChange={e => setNewTicket({ ...newTicket, category: e.target.value })}>{["Hardware", "Network", "Software"].map(c => <option key={c}>{c}</option>)}</select>
                  <select className={inputClass} value={newTicket.priority} onChange={e => setNewTicket({ ...newTicket, priority: e.target.value })}>{["Low", "Medium", "High"].map(p => <option key={p}>{p}</option>)}</select>
                  <div className="flex justify-end gap-2"><button type="button" onClick={() => setShowTicketForm(false)} className="rounded-lg border px-4 py-2">Cancel</button><button className={buttonClass}>Create Ticket</button></div>
                </form>
              </div>
            )}
          </>
        );

      case "Employee Ticket Buckets":
        return (
          <>
            <SectionTitle title="Employee Ticket Buckets" subtitle="See how many tickets are assigned to each employee." />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {employees.map(e => {
                const assigned = tickets.filter(t => t.employee === e.name);
                return (
                  <div key={e.id} className="rounded-xl border border-gray-200 bg-white p-5">
                    <div className="flex items-center justify-between"><h3 className="font-bold">{e.name}</h3><Badge>{e.department}</Badge></div>
                    <p className="mt-3 text-3xl font-bold">{assigned.length}</p><p className="text-xs text-gray-500">Assigned tickets</p>
                    <div className="mt-4 flex flex-wrap gap-3 text-xs"><span className="text-blue-700">{assigned.filter(t => t.status === "Open").length} Open</span><span className="text-amber-700">{assigned.filter(t => t.status === "In Progress").length} In Progress</span><span className="text-green-700">{assigned.filter(t => t.status === "Resolved").length} Resolved</span></div>
                  </div>
                );
              })}
            </div>
          </>
        );

      case "Pending Acknowledgements":
        return (
          <>
            <SectionTitle title="Pending Acknowledgements" subtitle="Tickets waiting for acknowledgement." />
            {renderTicketTable(tickets.filter(t => !t.acknowledged))}
          </>
        );

      case "Overdue Tickets":
        return (
          <>
            <SectionTitle title="Overdue Tickets" subtitle="Unresolved tickets created before today." />
            <div className="mb-5 grid gap-4 sm:grid-cols-2"><StatCard title="Overdue Tickets" value={overdueTickets.length} subtitle="Require follow-up" icon={AlertTriangle} /><StatCard title="High Priority Overdue" value={overdueTickets.filter(t => t.priority === "High").length} subtitle="High priority incidents" icon={Clock} /></div>
            {renderTicketTable(overdueTickets)}
          </>
        );

      case "Shift Handover":
        return (
          <>
            <SectionTitle title="Shift Handover" subtitle="Record important updates for the next shift." />
            <div className="max-w-3xl rounded-xl border border-gray-200 bg-white p-5">
              <label className="mb-2 block text-sm font-semibold">Handover notes</label>
              <textarea className={inputClass + " min-h-32"} placeholder="Enter pending issues, updates and follow-up actions..." value={handoverText} onChange={e => setHandoverText(e.target.value)} />
              <button className={buttonClass + " mt-3"} disabled={!handoverText.trim()} onClick={() => { setHandoverNotes(old => [{ id: Date.now(), text: handoverText, date: new Date().toLocaleString() }, ...old]); setHandoverText(""); }}><Save size={16} /> Save Handover</button>
            </div>
            <div className="mt-6 max-w-3xl space-y-3">
              <h3 className="font-bold">Handover History</h3>
              {handoverNotes.map(n => <div key={n.id} className="rounded-xl border border-gray-200 bg-white p-4"><p className="whitespace-pre-wrap text-sm">{n.text}</p><p className="mt-3 text-xs text-gray-500">{n.date}</p></div>)}
              {handoverNotes.length === 0 && <p className="text-sm text-gray-500">No handover notes saved yet.</p>}
            </div>
          </>
        );

      case "Reports & Analytics":
        return (
          <>
            <SectionTitle title="Reports & Analytics" subtitle="Employee and ticket performance overview." />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard title="Total Tickets" value={tickets.length} subtitle="All recorded tickets" icon={Ticket} />
              <StatCard title="Resolved Tickets" value={tickets.filter(t => t.status === "Resolved").length} subtitle="Successfully closed" icon={CheckCircle2} />
              <StatCard title="In Progress" value={tickets.filter(t => t.status === "In Progress").length} subtitle="Currently being worked on" icon={Clock} />
              <StatCard title="Pending Acknowledgement" value={pendingTickets.length} subtitle="Awaiting confirmation" icon={AlertTriangle} />
            </div>
            <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="mb-5 font-bold">Ticket Status Summary</h3>
              {["Open", "In Progress", "Resolved"].map(s => {
                const count = tickets.filter(t => t.status === s).length;
                return (
                  <div key={s} className="mb-5">
                    <div className="mb-2 flex justify-between text-sm"><span>{s}</span><strong>{count}</strong></div>
                    <div className="h-3 rounded-full bg-gray-100"><div className="h-3 rounded-full bg-blue-600" style={{ width: `${tickets.length ? count / tickets.length * 100 : 0}%` }} /></div>
                  </div>
                );
              })}
            </div>
            <button className={buttonClass + " mt-5"} onClick={exportTickets}><Download size={16} /> Download Ticket Report</button>
          </>
        );

      case "Settings":
        return (
          <>
            <SectionTitle title="Settings" subtitle="Configure your Solugenix dashboard." />
            <form onSubmit={e => { e.preventDefault(); alert("Settings saved for this demo session."); }} className="max-w-2xl space-y-5 rounded-xl border border-gray-200 bg-white p-6">
              <div><label className="mb-2 block text-sm font-semibold">Company name</label><input className={inputClass} value={settings.company} onChange={e => setSettings({ ...settings, company: e.target.value })} /></div>
              <div><label className="mb-2 block text-sm font-semibold">Morning shift</label><input className={inputClass} value={settings.morning} onChange={e => setSettings({ ...settings, morning: e.target.value })} /></div>
              <div><label className="mb-2 block text-sm font-semibold">Afternoon shift</label><input className={inputClass} value={settings.afternoon} onChange={e => setSettings({ ...settings, afternoon: e.target.value })} /></div>
              <div><label className="mb-2 block text-sm font-semibold">Night shift</label><input className={inputClass} value={settings.night} onChange={e => setSettings({ ...settings, night: e.target.value })} /></div>
              <button className={buttonClass}><Save size={16} /> Save Settings</button>
            </form>
          </>
        );

      default:
        return <p>Page not found.</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {mobileMenu && <button aria-label="Close menu" className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setMobileMenu(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-gray-200 bg-white transition-transform lg:translate-x-0 ${mobileMenu ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="border-b border-gray-100 px-6 py-6">
          <h1 className="text-2xl font-black tracking-wide text-blue-700">SOLUGENIX</h1>
          <p className="mt-1 text-xs text-gray-500">IT Operations Management</p>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          <p className="px-3 pb-3 text-xs font-bold uppercase tracking-wider text-gray-400">Main Menu</p>
          {navItems.map(({ label, icon: Icon }) => (
            <button key={label} onClick={() => { setActivePage(label); setMobileMenu(false); resetFilters(); }} className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium transition ${activePage === label ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`}>
              <Icon size={18} /><span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="border-t border-gray-100 p-4">
          <p className="text-xs text-gray-500">Solugenix IT Dashboard</p>
          <p className="mt-1 text-xs text-gray-400">Demo version</p>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-72">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-7">
          <div className="flex items-center gap-3">
            <button className="rounded-lg p-2 hover:bg-gray-100 lg:hidden" onClick={() => setMobileMenu(true)}><Menu size={21} /></button>
            <div><p className="text-sm font-bold text-gray-800">{activePage}</p><p className="text-xs text-gray-500">Solugenix / {activePage}</p></div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-gray-500 sm:block">{new Date().toLocaleDateString()}</span>
            <button className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100" title="Notifications"><Bell size={19} /><span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" /></button>
            <div className="flex items-center gap-2 border-l border-gray-200 pl-3"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">A</div><span className="hidden text-sm font-semibold sm:block">Admin</span></div>
          </div>
        </header>

        <main className="p-4 sm:p-7">
          {renderPage()}
          <footer className="mt-10 border-t border-gray-200 pt-5 text-center text-xs text-gray-400">© {new Date().getFullYear()} Solugenix · IT Operations Dashboard</footer>
        </main>
      </div>
    </div>
  );
}

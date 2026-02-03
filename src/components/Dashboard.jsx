import React, { useState, useEffect, useCallback } from "react";
import { CircularProgress, Box, Typography } from "@mui/material";
import axios from "axios";
import moment from "moment";
import { API_URL } from "../constants";
import "./Dashboard.css";

/* ---------------- STATUS CLASS ---------------- */
const getStatusClass = (status) => {
  switch (status) {
    case "Sanctioned":
      return "status-primary";
    case "On Priority":
      return "status-success";
    case "In Progress":
      return "status-warning";
    case "New":
      return "status-info";
    case "Close":
      return "status-error";
    default:
      return "";
  }
};

/* ---------------- DASHBOARD COMPONENT ---------------- */
const Dashboard = ({ leads, setLeads }) => {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchTime, setSearchTime] = useState(null);

  const [newLeads, setNewLeads] = useState([]);
  const [reminderLeads, setReminderLeads] = useState([]);
  const [upcomingReminders, setUpcomingReminders] = useState([]);

  const [tasks, setTasks] = useState([]);
  const [activeView, setActiveView] = useState("all");

  /* ---------------- FETCH ALL LEADS ---------------- */
  const fetchAllLeads = useCallback(async (user) => {
    if (!user) return;

    setLoading(true);
    try {
      const res = await axios.get(API_URL, {
        params: {
          userId: user._id,
          role: user.role,
          zone: user.zone,
          region: user.region,
        },
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setLeads(res.data);
    } catch (err) {
      console.error("Error fetching leads:", err);
    } finally {
      setLoading(false);
    }
  }, [setLeads]);

  /* ---------------- LOAD USER ---------------- */
  useEffect(() => {
    const storedUser = localStorage.getItem("employeeUser");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUser(user);
      fetchAllLeads(user);
    }
  }, [fetchAllLeads]);

  /* ---------------- FETCH TASKS ---------------- */
  useEffect(() => {
    if (!currentUser) return;

    axios
      .get(API_URL.replace("/leads", "/tasks"), {
        params: { assignedToId: currentUser._id },
      })
      .then((res) => setTasks(res.data))
      .catch(console.error);
  }, [currentUser]);

  /* ---------------- PROCESS LEADS ---------------- */
  useEffect(() => {
    // New Leads
    setNewLeads(
      leads.filter((lead) => !lead.callHistory || lead.callHistory.length === 0)
    );

    // Reminder Leads (Today only)
    const reminders = leads.filter(
      (lead) =>
        lead.reminderCallDate ||
        (lead.reminders && lead.reminders.some((r) => !r.done))
    );

    const todayReminders = reminders.filter((lead) => {
      const reminderDate =
        lead.reminderCallDate ||
        lead.reminders?.find((r) => !r.done)?.date;

      return reminderDate && moment(reminderDate).isSame(moment(), "day");
    });

    setReminderLeads(todayReminders);
    setUpcomingReminders(todayReminders);
  }, [leads]);

  /* ---------------- SEARCH ---------------- */
  const handleSearch = async () => {
    if (!currentUser) return;

    const startTime = performance.now();

    try {
      const res = await axios.get(API_URL, {
        params: {
          userId: currentUser._id,
          role: currentUser.role,
          zone: currentUser.zone,
          region: currentUser.region,
          searchTerm,
        },
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });

      setLeads(res.data);
      setSearchTime((performance.now() - startTime).toFixed(2));
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  /* ---------------- COUNTS ---------------- */
  const openTasksCount = tasks.filter((t) => t.status === "Open").length;

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading leads...</Typography>
      </Box>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <div style={{ padding: "20px" }}>
      {/* HEADER */}
      <h2 style={{ fontSize: "26px", fontWeight: "bold", color: "#360d4c" }}>
        {currentUser?.role} Lead Dashboard
      </h2>

      {/* SEARCH */}
      <div className="search-paper-fo">
        <input
          className="search-input-fo"
          placeholder="Search Lead ID, Name, Email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />

        <a href="/leads/new" className="btn-fo btn-warning-fo">
          + Create New Lead
        </a>

        {searchTime && (
          <span style={{ fontSize: "12px", color: "#666" }}>
            {searchTime} ms
          </span>
        )}
      </div>

      {/* MAIN GRID */}
      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        {/* LEFT TABLE */}
        <div style={{ flex: 2 }}>
          <div className="table-wrapper-fo">
            <table className="dashboard-table-fo">
              <thead>
                <tr>
                  <th>Lead ID</th>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Assigned</th>
                  <th>Location</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {/* ALL LEADS */}
                {activeView === "all" &&
                  leads.map((lead) => (
                    <tr key={lead._id}>
                      <td>{lead.leadID}</td>
                      <td>{lead.fullName}</td>
                      <td>{lead.mobileNumbers?.[0]}</td>
                      <td>
                        <span
                          className={`chip-fo ${getStatusClass(
                            lead.leadStatus
                          )}`}
                        >
                          {lead.leadStatus}
                        </span>
                      </td>
                      <td>{moment(lead.createdAt).format("DD MMM YYYY")}</td>
                      <td>{lead.assignedFO || "Unassigned"}</td>
                      <td>{lead.permanentLocation || "N/A"}</td>
                      <td>
                        <a
                          href={`/leads/${lead._id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-fo btn-view-fo"
                        >
                          View
                        </a>
                      </td>
                    </tr>
                  ))}

                {/* REMINDERS */}
                {activeView === "reminders" &&
                  reminderLeads.map((lead) => {
                    const reminderDate =
                      lead.reminderCallDate ||
                      lead.reminders?.find((r) => !r.done)?.date;

                    return (
                      <tr key={lead._id}>
                        <td>{lead.leadID}</td>
                        <td>{lead.fullName}</td>
                        <td>{lead.mobileNumbers?.[0]}</td>
                        <td>
                          <span className="chip-fo status-warning">
                            Reminder
                          </span>
                        </td>
                        <td>
                          {reminderDate
                            ? moment(reminderDate).format("DD MMM YYYY")
                            : "N/A"}
                        </td>
                        <td>{lead.assignedFO}</td>
                        <td>{lead.permanentLocation}</td>
                        <td>
                          <a
                            href={`/leads/${lead._id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-fo btn-primary-fo"
                          >
                            Open
                          </a>
                        </td>
                      </tr>
                    );
                  })}

                {/* TASKS */}
                {activeView === "tasks" &&
                  tasks
                    .filter((t) => t.status === "Open")
                    .map((task) => (
                      <tr key={task._id}>
                        <td colSpan="2">
                          <strong>{task.subject}</strong>
                          <br />
                          <small>{task.body}</small>
                        </td>
                        <td>{task.createdByName}</td>
                        <td>
                          <span className="chip-fo status-info">
                            {task.status}
                          </span>
                        </td>
                        <td>{moment(task.createdAt).format("DD MMM YYYY")}</td>
                        <td colSpan="3">
                          <a
                            href={`/leads/${task.leadId}`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-fo btn-warning-fo"
                          >
                            Open Lead
                          </a>
                        </td>
                      </tr>
                    ))}

                {/* NEW LEADS */}
                {activeView === "newLeads" &&
                  newLeads.map((lead) => (
                    <tr key={lead._id}>
                      <td>{lead.leadID}</td>
                      <td>{lead.fullName}</td>
                      <td>{lead.loanType || "N/A"}</td>
                      <td>
                        <span className="chip-fo status-success">New</span>
                      </td>
                      <td>{moment(lead.createdAt).format("DD MMM YYYY")}</td>
                      <td>{lead.assignedFO}</td>
                      <td>
                        {lead.zone} / {lead.region}
                      </td>
                      <td>
                        <a
                          href={`/leads/${lead._id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-fo btn-secondary-fo"
                        >
                          Open
                        </a>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div style={{ flex: 1 }}>
          <div className="tasks-sidebar">
            <h3>My Tasks</h3>
            <h4>Open Tasks ({openTasksCount})</h4>

            {tasks.filter((t) => t.status === "Open").map((task) => (
              <div key={task._id} className="task-item">
                <strong>{task.subject}</strong>
                <p>{task.body}</p>
                <small>{moment(task.createdAt).fromNow()}</small>
              </div>
            ))}

            <h4 style={{ marginTop: "20px" }}>Reminders Today</h4>
            {upcomingReminders.length > 0 ? (
              <div className="reminder-item blinking-reminder">
                <strong>
                  {upcomingReminders[0].leadID} -{" "}
                  {upcomingReminders[0].fullName}
                </strong>
                <p>
                  {moment(upcomingReminders[0].reminderCallDate).format(
                    "DD MMM YYYY HH:mm"
                  )}
                </p>
              </div>
            ) : (
              <p>No upcoming reminders</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

// import React, { useEffect, useState } from "react";
// import axios from "axios";

// function App() {
//   const [services, setServices] = useState([]);

//   useEffect(() => {
//     axios
//       .get("http://localhost:5000/api/services")
//       .then((res) => setServices(res.data))
//       .catch((err) => console.log(err));
//   }, []);

//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>Government Appointment Dashboard</h1>
//       <table border="1" cellPadding="10">
//         <thead>
//           <tr>
//             <th>Service</th>
//             <th>Total</th>
//             <th>Pending</th>
//             <th>Completed</th>
//           </tr>
//         </thead>
//         <tbody>
//           {services.map((s, i) => (
//             <tr key={i}>
//               <td>{s.serviceName}</td>
//               <td>{s.totalAppointments}</td>
//               <td>{s.pendingAppointments}</td>
//               <td>{s.completedAppointments}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default App;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Bar, Pie } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   ArcElement,
//   Tooltip,
//   Legend,
// } from "chart.js";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   ArcElement,
//   Tooltip,
//   Legend
// );

// function App() {
//   const [services, setServices] = useState([]);

//   useEffect(() => {
//     axios
//       .get("http://localhost:5000/api/appointments/dashboard") // use aggregated route
//       .then((res) => setServices(res.data))
//       .catch((err) => console.log(err));
//   }, []);

//   const serviceNames = services.map((s) => s.serviceName);
//   const totalAppointments = services.map((s) => s.totalAppointments);
//   const pendingAppointments = services.map((s) => s.pendingAppointments);
//   const completedAppointments = services.map((s) => s.completedAppointments);
//   const cancelledAppointments = services.map((s) => s.cancelledAppointments);

//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>Government Appointment Dashboard</h1>

//       {/* Table */}
//       <table border="1" cellPadding="10" style={{ marginBottom: "40px" }}>
//         <thead>
//           <tr>
//             <th>Service</th>
//             <th>Total</th>
//             <th>Pending</th>
//             <th>Completed</th>
//             <th>Cancelled</th>
//           </tr>
//         </thead>
//         <tbody>
//           {services.map((s, i) => (
//             <tr key={i}>
//               <td>{s.serviceName}</td>
//               <td>{s.totalAppointments}</td>
//               <td>{s.pendingAppointments}</td>
//               <td>{s.completedAppointments}</td>
//               <td>{s.cancelledAppointments}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Bar chart for total appointments per service */}
//       <h2>Total Appointments per Service</h2>
//       <Bar
//         data={{
//           labels: serviceNames,
//           datasets: [
//             {
//               label: "Total Appointments",
//               data: totalAppointments,
//               backgroundColor: "rgba(75, 192, 192, 0.6)",
//             },
//             {
//               label: "Pending",
//               data: pendingAppointments,
//               backgroundColor: "rgba(255, 206, 86, 0.6)",
//             },
//             {
//               label: "Completed",
//               data: completedAppointments,
//               backgroundColor: "rgba(54, 162, 235, 0.6)",
//             },
//             {
//               label: "Cancelled",
//               data: cancelledAppointments,
//               backgroundColor: "rgba(255, 99, 132, 0.6)",
//             },
//           ],
//         }}
//         options={{ responsive: true, plugins: { legend: { position: "top" } } }}
//       />

//       {/* Pie chart for total distribution */}
//       <h2>Overall Appointment Status Distribution</h2>
//       <Pie
//         data={{
//           labels: ["Pending", "Completed", "Cancelled"],
//           datasets: [
//             {
//               data: [
//                 pendingAppointments.reduce((a, b) => a + b, 0),
//                 completedAppointments.reduce((a, b) => a + b, 0),
//                 cancelledAppointments.reduce((a, b) => a + b, 0),
//               ],
//               backgroundColor: ["#ffce56", "#36a2eb", "#ff6384"],
//             },
//           ],
//         }}
//         options={{
//           responsive: true,
//           plugins: { legend: { position: "bottom" } },
//         }}
//       />
//     </div>
//   );
// }

// export default App;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

function App() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/appointments/dashboard")
      .then((res) => setServices(res.data))
      .catch((err) => console.log(err));
  }, []);

  const serviceNames = services.map((s) => s.serviceName);
  const totalAppointments = services.map((s) => s.totalAppointments);
  const pendingAppointments = services.map((s) => s.pendingAppointments);
  const completedAppointments = services.map((s) => s.completedAppointments);
  const cancelledAppointments = services.map((s) => s.cancelledAppointments);

  // Light blue theme colors
  const barColors = [
    "rgba(135, 206, 250, 0.7)", // light blue
    "rgba(173, 216, 230, 0.7)", // lighter blue
    "rgba(0, 191, 255, 0.7)", // deeper blue
    "rgba(176, 224, 230, 0.7)", // pale blue
  ];

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        background: "linear-gradient(to bottom, #e6f0ff, #ffffff)",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#1e3a8a" }}>
        Government Appointment Dashboard
      </h1>

      {/* Table */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "30px",
          backgroundColor: "#f0f8ff",
          boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#b0d4ff", color: "#003366" }}>
            <th style={{ padding: "12px", textAlign: "left" }}>Service</th>
            <th style={{ padding: "12px", textAlign: "center" }}>Total</th>
            <th style={{ padding: "12px", textAlign: "center" }}>Pending</th>
            <th style={{ padding: "12px", textAlign: "center" }}>Completed</th>
            <th style={{ padding: "12px", textAlign: "center" }}>Cancelled</th>
          </tr>
        </thead>
        <tbody>
          {services.map((s, i) => (
            <tr
              key={i}
              style={{
                backgroundColor: i % 2 === 0 ? "#ffffff" : "#e6f2ff",
                color: "#003366",
              }}
            >
              <td style={{ padding: "10px" }}>{s.serviceName}</td>
              <td style={{ textAlign: "center" }}>{s.totalAppointments}</td>
              <td style={{ textAlign: "center" }}>{s.pendingAppointments}</td>
              <td style={{ textAlign: "center" }}>{s.completedAppointments}</td>
              <td style={{ textAlign: "center" }}>{s.cancelledAppointments}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Bar chart container */}
      <div style={{ maxWidth: "700px", margin: "40px auto" }}>
        <h2 style={{ textAlign: "center", color: "#1e3a8a" }}>
          Total Appointments per Service
        </h2>
        <Bar
          data={{
            labels: serviceNames,
            datasets: [
              {
                label: "Total Appointments",
                data: totalAppointments,
                backgroundColor: barColors[0],
              },
              {
                label: "Pending",
                data: pendingAppointments,
                backgroundColor: barColors[1],
              },
              {
                label: "Completed",
                data: completedAppointments,
                backgroundColor: barColors[2],
              },
              {
                label: "Cancelled",
                data: cancelledAppointments,
                backgroundColor: barColors[3],
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "top" },
            },
          }}
        />
      </div>

      {/* Pie chart container */}
      <div style={{ maxWidth: "500px", margin: "40px auto" }}>
        <h2 style={{ textAlign: "center", color: "#1e3a8a" }}>
          Overall Appointment Status Distribution
        </h2>
        <Pie
          data={{
            labels: ["Pending", "Completed", "Cancelled"],
            datasets: [
              {
                data: [
                  pendingAppointments.reduce((a, b) => a + b, 0),
                  completedAppointments.reduce((a, b) => a + b, 0),
                  cancelledAppointments.reduce((a, b) => a + b, 0),
                ],
                backgroundColor: ["#add8e6", "#87cefa", "#b0e0e6"],
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: { legend: { position: "bottom" } },
          }}
        />
      </div>
    </div>
  );
}

export default App;

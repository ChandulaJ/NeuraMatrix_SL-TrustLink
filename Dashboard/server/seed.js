// const mongoose = require("mongoose");
// const Service = require("./models/Service");

// const MONGO_URI =
//   "mongodb+srv://nisalmicro:micro1234@microcluster.w872zhn.mongodb.net/dashboardDB?retryWrites=true&w=majority&appName=microcluster";

// const seedData = async () => {
//   try {
//     await mongoose.connect(MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("✅ Connected to MongoDB Atlas");

//     // Clear existing data
//     await Service.deleteMany({});
//     console.log("🗑️ Cleared old services");

//     // Insert dummy services
//     await Service.insertMany([
//       {
//         serviceName: "Passport Service",
//         totalAppointments: 120,
//         pendingAppointments: 30,
//         completedAppointments: 90,
//       },
//       {
//         serviceName: "Driver's License",
//         totalAppointments: 80,
//         pendingAppointments: 20,
//         completedAppointments: 60,
//       },
//       {
//         serviceName: "National ID",
//         totalAppointments: 200,
//         pendingAppointments: 50,
//         completedAppointments: 150,
//       },
//       {
//         serviceName: "Land Registration",
//         totalAppointments: 60,
//         pendingAppointments: 10,
//         completedAppointments: 50,
//       },
//     ]);

//     console.log("✅ Dummy services inserted successfully!");
//     mongoose.connection.close();
//   } catch (err) {
//     console.error("❌ Error seeding data:", err);
//     mongoose.connection.close();
//   }
// };

// seedData();

const mongoose = require("mongoose");
const Service = require("./models/Service");
const Analytics = require("./models/Analytics");
const Appointment = require("./models/Appointment");

const MONGO_URI =
  "mongodb+srv://nisalmicro:micro1234@microcluster.w872zhn.mongodb.net/dashboardDB?retryWrites=true&w=majority";

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB Atlas");

    // --- Clear existing data ---
    await Service.deleteMany({});
    await Appointment.deleteMany({});
    await Analytics.deleteMany({});
    console.log("🗑️ Cleared old data");

    // --- Insert Services and get inserted docs ---
    const services = await Service.insertMany([
      {
        serviceName: "Passport Service",
        totalAppointments: 120,
        pendingAppointments: 30,
        completedAppointments: 90,
      },
      {
        serviceName: "Driver's License",
        totalAppointments: 80,
        pendingAppointments: 20,
        completedAppointments: 60,
      },
      {
        serviceName: "National ID",
        totalAppointments: 200,
        pendingAppointments: 50,
        completedAppointments: 150,
      },
      {
        serviceName: "Land Registration",
        totalAppointments: 60,
        pendingAppointments: 10,
        completedAppointments: 50,
      },
    ]);
    console.log("✅ Services inserted");

    // --- Insert Appointments using ObjectId reference ---
    await Appointment.insertMany([
      {
        service: services.find((s) => s.serviceName === "Passport Service")._id,
        status: "completed",
        date: new Date(),
        customerName: "John Doe",
      },
      {
        service: services.find((s) => s.serviceName === "Driver's License")._id,
        status: "pending",
        date: new Date(),
        customerName: "Jane Smith",
      },
    ]);
    console.log("✅ Appointments inserted");

    // --- Insert Analytics ---
    await Analytics.insertMany([
      {
        serviceName: "Passport Service",
        peakHours: ["09:00-11:00", "14:00-16:00"],
        dailyLoad: [30, 45, 50, 40, 60],
        noShowRate: 0.1,
        avgProcessingTime: 25,
      },
      {
        serviceName: "Driver's License",
        peakHours: ["10:00-12:00", "15:00-17:00"],
        dailyLoad: [20, 25, 35, 30, 40],
        noShowRate: 0.05,
        avgProcessingTime: 30,
      },
      {
        serviceName: "National ID",
        peakHours: ["08:00-10:00", "13:00-15:00"],
        dailyLoad: [50, 60, 70, 65, 80],
        noShowRate: 0.08,
        avgProcessingTime: 20,
      },
      {
        serviceName: "Land Registration",
        peakHours: ["09:00-11:00"],
        dailyLoad: [10, 15, 20, 15, 25],
        noShowRate: 0.12,
        avgProcessingTime: 40,
      },
    ]);
    console.log("✅ Analytics inserted");

    mongoose.connection.close();
    console.log("✅ Seeding completed!");
  } catch (err) {
    console.error("❌ Error seeding data:", err);
    mongoose.connection.close();
  }
};

seedData();

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
const Appointment = require("./models/Appointment");

const MONGO_URI =
  "mongodb+srv://nisalmicro:micro1234@microcluster.w872zhn.mongodb.net/dashboardDB?retryWrites=true&w=majority";

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB Atlas");

    await Service.deleteMany({});
    await Appointment.deleteMany({});
    console.log("🗑️ Cleared old data");

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

    const appointments = [];
    services.forEach((service) => {
      for (let i = 1; i <= 5; i++) {
        appointments.push({
          service: service._id, // <--- must match schema
          customerName: `Customer ${service.serviceName} - ${i}`,
          date: new Date(2025, 7, i),
          status: i % 2 === 0 ? "completed" : "pending",
        });
      }
    });

    await Appointment.insertMany(appointments);
    console.log("✅ Appointments inserted");

    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error seeding data:", err);
    mongoose.connection.close();
  }
};

seedData();

import { prisma } from "./prisma";
import { Gender, Role } from "../../models/User";

export async function seedDummyUser() {
  const existingUser = await prisma.user.findUnique({
    where: { email: "dummyuser@example.com" },
  });

  if (!existingUser) {
    await prisma.user.create({
      data: {
        firstName: "Dummy",
        lastName: "User",
        email: "dummyuser@example.com",
        phoneNumber: "1234567890",
        gender: Gender.MALE,
        dateOfBirth: new Date("1990-01-01"),
        role: Role.CITIZEN,
        nationalId: "12345678901234",
      },
    });
    console.log("Dummy user created");
  } else {
    console.log("Dummy user already exists");
  }
}

export async function seedDummyDepartmentsAndServices() {
  // Departments to add
  const departments = [
    {
      name: "Sri Lankan Tourist Department",
      code: "TD",
      description: "Responsible for country tourism services",
      location: "Tourist Information Center, Colombo",
      services: [
        {
          name: "Tourist Visa Issuance",
          description: "Issuance of visas for tourists visiting Sri Lanka.",
          duration: 10, // minutes
          price: 50.0, // example fee in USD
          availableSlots: 100,
          requirements: ["Passport", "Passport-sized Photo", "Visa Application Form"],
          category: "Visa",
        },
        {
          name: "Business Registration",
          description: "Registration service for businesses in Sri Lanka.",
          duration: 30, // minutes
          price: 100.0, // example fee in USD
          availableSlots: 50,
          requirements: ["Business Plan", "NIC of Business Owner", "Proof of Address"],
          category: "Visa",
        },
        {
          name: "Tourist Attraction Information",
          description: "Provides information about tourist attractions in Sri Lanka.",
          duration: 5,
          price: 0.0,
          availableSlots: 500,
          requirements: [],
          category: "Information",
        },
        {
          name: "Tour Guide Registration",
          description: "Registration service for licensed tour guides.",
          duration: 15,
          price: 20.0,
          availableSlots: 50,
          requirements: ["National Identity Card (NIC)", "Passport", "Proof of Qualification"],
          category: "Registration",
        },
      ],
    },
    {
      name: "People Registration Department",
      code: "PRD",
      description: "Handles registration of national identities and vital events",
      location: "People Registration Office, Colombo 7",
      services: [
        {
          name: "National Identity Card Issuance",
          description: "Issues national identity cards to citizens.",
          duration: 20,
          price: 10.0,
          availableSlots: 200,
          requirements: ["Birth Certificate", "Proof of Residence", "Two Recent Photographs"],
          category: "Identification",
        },
        {
          name: "Birth Registration",
          description: "Registers births of citizens and issues birth certificates.",
          duration: 30,
          price: 0.0,
          availableSlots: 150,
          requirements: ["Medical Birth Report", "Parents' NICs", "Marriage Certificate (if applicable)"],
          category: "Vital Records",
        },
        {
          name: "Death Registration",
          description: "Registers deaths and issues death certificates.",
          duration: 30,
          price: 0.0,
          availableSlots: 150,
          requirements: ["Medical Death Certificate", "National Identity Card of Deceased", "Family Member NIC"],
          category: "Vital Records",
        },
      ],
    },
    {
      name: "Labour Department",
      code: "LD",
      description: "Oversees labour regulation and employment services",
      location: "Labour Department Office, Colombo 5",
      services: [
        {
          name: "Work Permit Issuance",
          description: "Issues work permits to foreign employees.",
          duration: 60,
          price: 100.0,
          availableSlots: 100,
          requirements: ["Passport", "Job Offer Letter", "Medical Certificate", "Police Clearance Certificate"],
          category: "Work Permit",
        },
        {
          name: "Labour Dispute Resolution",
          description: "Resolves disputes between employers and employees.",
          duration: 45,
          price: 0.0,
          availableSlots: 50,
          requirements: ["Employment Contract", "Complaint Letter", "Supporting Evidence"],
          category: "Dispute Resolution",
        },
        {
          name: "Employment Contract Registration",
          description: "Registers employment contracts for labour compliance.",
          duration: 30,
          price: 10.0,
          availableSlots: 100,
          requirements: ["Signed Employment Contract", "Business Registration Certificate", "Employer NIC"],
          category: "Contract Registration",
        },
      ],
    },
  ];

  for (const dept of departments) {
    let department = await prisma.department.findUnique({
      where: { code: dept.code },
    });

    if (!department) {
      department = await prisma.department.create({
        data: {
          name: dept.name,
          code: dept.code,
          description: dept.description,
          location: dept.location,
        },
      });
      console.log(`Department ${dept.name} created`);
    } else {
      console.log(`Department ${dept.name} already exists`);
    }

    for (const svc of dept.services) {
      const existingService = await prisma.service.findFirst({
        where: {
          name: svc.name,
          departmentId: department.id,
        },
      });

      if (!existingService) {
        await prisma.service.create({
          data: {
            name: svc.name,
            description: svc.description,
            duration: svc.duration,
            price: svc.price,
            availableSlots: svc.availableSlots,
            requirements: svc.requirements.length > 0 ? svc.requirements : null,
            category: svc.category,
            departmentId: department.id,
            status: "available",
          },
        });
        console.log(`Service '${svc.name}' created for ${dept.name}`);
      } else {
        console.log(`Service '${svc.name}' already exists for ${dept.name}`);
      }
    }
  }
}

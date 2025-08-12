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

export async function seedDummyDepartment() {
  const existingDepartment = await prisma.department.findUnique({
    where: { code: "ED" },
  });

  if (!existingDepartment) {
    await prisma.department.create({
      data: {
        name: "Emmigration Department",
        code: "ED",
        description: "This is an emigration department",
      },
    });
    console.log("Dummy department created");
  } else {
    console.log("Dummy department already exists");
  }
}

export async function seedDummyService() {
  // First find the department by code, because we need departmentId
  const department = await prisma.department.findUnique({
    where: { code: "ED" },
  });

  if (!department) {
    console.log("Department not found. Cannot create service.");
    return;
  }

  const existingService = await prisma.service.findFirst({
    where: {
      name: "Passport Renewal",
      departmentId: department.id,
    },
  });

  if (!existingService) {
    await prisma.service.create({
      data: {
        name: "Passport Renewal",
        description: "This service handles passport renewal applications.",
        departmentId: department.id,
      },
    });
    console.log("Dummy service created");
  } else {
    console.log("Dummy service already exists");
  }
}

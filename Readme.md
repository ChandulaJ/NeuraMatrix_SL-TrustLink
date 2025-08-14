npx prisma migrate dev --name init

migration - npx prisma migrate dev --schema=src/prisma/schema.prisma

export enum AppointmentStatus {
PENDING = "PENDING",
CONFIRMED = "CONFIRMED",
CANCELLED = "CANCELLED",
COMPLETED = "COMPLETED}
{
"id": 1,
"userId": 101,
"serviceId": 202,
"type": "IN_PERSON",
"status": "PENDING",
"scheduledAt": "2025-08-20T10:30:00.000Z",
"notes": "Customer requested online consultation via Zoom",
"createdAt": "2025-08-10T08:15:00.000Z",
"updatedAt": "2025-08-14T09:45:00.000Z",
"documents": [
{
"name": "NIC",
"url": "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
},
{
"name": "Passport",
"url": "https://file-examples.com/storage/fe1d3d1b6e3cfb0d16eecab/2017/10/file-sample_150kB.pdf"
},
{
"name": "Other",
"url": "https://www.learningcontainer.com/wp-content/uploads/2019/09/sample-pdf-file.pdf"
}
]
}

require("dotenv").config();

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({ log: ["error"] });

const boardingFees2026 = [
  {
    id: "boarding",
    name: "Boarding",
    description: "Boarding accommodation and meals for boarders.",
    amount: 25385,
    term1: 10000,
    term2: 10000,
    term3: 5385,
    mandatory: true
  },
  {
    id: "mi",
    name: "M&I",
    description: "Maintenance and improvement vote head.",
    amount: 2000,
    term1: 1000,
    term2: 1000,
    term3: 0,
    mandatory: true
  },
  {
    id: "lt-t",
    name: "LT&T",
    description: "Local travel and transport vote head.",
    amount: 1000,
    term1: 1000,
    term2: 0,
    term3: 0,
    mandatory: true
  },
  {
    id: "adm-cost",
    name: "ADM. Cost",
    description: "Administrative cost vote head.",
    amount: 2500,
    term1: 1000,
    term2: 1000,
    term3: 500,
    mandatory: true
  },
  {
    id: "ewc",
    name: "EWC",
    description: "Electricity, water and conservancy vote head.",
    amount: 4900,
    term1: 2000,
    term2: 2000,
    term3: 900,
    mandatory: true
  },
  {
    id: "activity",
    name: "Activity",
    description: "Student activity fee.",
    amount: 250,
    term1: 250,
    term2: 0,
    term3: 0,
    mandatory: true
  },
  {
    id: "p-emol",
    name: "P. Emol",
    description: "Personnel emoluments vote head.",
    amount: 4500,
    term1: 2000,
    term2: 2000,
    term3: 500,
    mandatory: true
  }
];

const paymentNotes = [
  "All fees must be paid on or before reporting day.",
  "Personal cheques are not accepted; use a bankers cheque where cheque payment is needed.",
  "Cheque account name: KINYUI BOYS SECONDARY SCHOOL.",
  "KCB account number: 1107262690, Tala Branch.",
  "M-Pesa PayBill business number: 522123.",
  "M-Pesa account number format: 30433KSTUDENTNAMEADMNO with no spacing, for example 30433KPETER1127.",
  "Fees once paid are not refundable."
];

const documentData = {
  feesBoardingDistributionPdf: "/documents/kinyui-boys-fees-structure-2026.pdf",
  feesBoardingPdfName: "Kinyui Boys Fees Structure 2026.pdf",
  feesBoardingPdfSize: 224177,
  feesBoardingPdfUploadDate: new Date("2026-01-01T00:00:00.000Z"),
  feesBoardingDescription: `Kinyui Boys High School 2026 boarding fee structure. Total annual boarding fees: KSh 40,535. ${paymentNotes.join(" ")}`,
  feesBoardingYear: 2026,
  feesBoardingTerm: "Annual",
  feesBoardingDistributionJson: boardingFees2026
};

const withTimeout = (promise, ms) =>
  Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`Timed out after ${ms / 1000}s while connecting to the database`)), ms);
    })
  ]);

async function main() {
  const existingDocument = await prisma.schoolDocument.findFirst();

  const document = existingDocument
    ? await prisma.schoolDocument.update({
        where: { id: existingDocument.id },
        data: documentData
      })
    : await prisma.schoolDocument.create({
        data: documentData
      });

  console.log(`Seeded Kinyui Boys 2026 boarding fees into SchoolDocument ID ${document.id}`);
}

withTimeout(main(), 25000)
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect().catch(() => {});
  });

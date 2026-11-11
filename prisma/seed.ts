import { PrismaClient, UrgencyLevel, VoicemailStatus, Department, type Prisma } from "../generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("Emptying database...");
  await prisma.voicemail.deleteMany();

  console.log("Seeding voicemails...");

  const voicemails: Prisma.VoicemailCreateInput[] = [
    {
      audioUrl: "https://example.com/audio/vm1.mp3",
      status: VoicemailStatus.PENDING,
      transcript: "Hi, this is Sarah Miller. I'm calling because my 5-year-old son, Leo, has a really high fever, it's 39.5, and he's started to get a bit of a rash on his chest. Please call me back as soon as you can on 0412 345 678.",
      summary: "Pediatric patient with high fever (39.5°C) and new rash.",
      department: Department.IMMUNE,
      priority: UrgencyLevel.HIGH,
      patientName: "Leo Miller",
      doctorName: null,
      medicalTags: ["Pediatrics", "Fever", "Rash"],
      assignedTo: null,
      resolvedAt: null,
    },
    {
      audioUrl: "https://example.com/audio/vm2.mp3",
      status: VoicemailStatus.PENDING,
      transcript: "Yeah, hello. This is Gary. Gary Thompson. I just... uh... I need to move my check-up. It was for Tuesday at 10, but I've got a plumbing emergency. Can we do Wednesday afternoon instead? Thanks.",
      summary: "Request to reschedule Tuesday appointment to Wednesday afternoon.",
      department: Department.GENERAL,
      priority: UrgencyLevel.LOW,
      patientName: "Gary Thompson",
      doctorName: null,
      medicalTags: ["Appointment", "Reschedule"],
      assignedTo: null,
      resolvedAt: null,
    },
    {
      audioUrl: "https://example.com/audio/vm3.mp3",
      status: VoicemailStatus.PENDING,
      transcript: "Hello, this is Mrs. Chen. I need to refill my blood pressure medicine. My doctor is Dr. Smith. Thank you.",
      summary: "Medication refill request for blood pressure.",
      department: Department.CARDIOVASCULAR,
      priority: UrgencyLevel.MEDIUM,
      patientName: "Mrs. Chen",
      doctorName: "Dr. Smith",
      medicalTags: ["Medication Refill", "Blood Pressure", "Cardiology"],
      assignedTo: null,
      resolvedAt: null,
    },
    {
      audioUrl: "https://example.com/audio/vm4.mp3",
      status: VoicemailStatus.PENDING,
      transcript: null,
      summary: null,
      department: Department.GENERAL,
      priority: UrgencyLevel.LOW,
      patientName: null,
      doctorName: null,
      medicalTags: [],
      assignedTo: null,
      resolvedAt: null,
    }
  ];

  for (const vm of voicemails) {
    await prisma.voicemail.create({ data: vm });
  }

  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
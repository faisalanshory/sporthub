import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
async function main() {
  const deleted = await db.sport.delete({ where: { id: "5067a2ab-cb51-4975-ab9b-acf896926f75" } });
  console.log("Deleted:", deleted.name);
  await db.$disconnect();
}
main().catch(console.error);

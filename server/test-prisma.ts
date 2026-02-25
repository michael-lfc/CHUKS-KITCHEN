import prisma from "./src/prisma/client.js";

async function main() {
  const foods = await prisma.food.findMany();
  console.log("Foods:", foods);
}

main()
  .then(() => {
    console.log("✅ Prisma test completed successfully");
    prisma.$disconnect();
  })
  .catch((err) => {
    console.error("❌ Prisma test failed:", err);
    prisma.$disconnect();
  });

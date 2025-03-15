import { prisma } from './prisma';

async function main() {
  try {
    // Try a simple query
    const userCount = await prisma.user.count();
    console.log('Connection successful! User count:', userCount);
    return true;
  } catch (e) {
    console.error('Failed to connect to database:', e);
    return false;
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
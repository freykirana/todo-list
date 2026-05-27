import prisma from '../config/db.js';

async function main() {
  console.log('Seeding database...');

  // Create categories
  const categories = [
    { nama_kategori: 'Development' },
    { nama_kategori: 'Design' },
    { nama_kategori: 'Documentation' },
    { nama_kategori: 'Testing' },
    { nama_kategori: 'Deployment' }
  ];

  for (const category of categories) {
    const created = await prisma.category.create({
      data: category
    }).catch(() => {
      // Skip if already exists
      return null;
    });
    if (created) {
      console.log(`Category created: ${created.nama_kategori}`);
    }
  }

  console.log('Database seeding completed!');
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

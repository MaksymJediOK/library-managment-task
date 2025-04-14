import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create genres
  const fiction = await prisma.genre.upsert({
    where: { name: 'Fiction' },
    update: {},
    create: { name: 'Fiction' },
  });

  const classic = await prisma.genre.upsert({
    where: { name: 'Classic' },
    update: {},
    create: { name: 'Classic' },
  });

  const fantasy = await prisma.genre.upsert({
    where: { name: 'Fantasy' },
    update: {},
    create: { name: 'Fantasy' },
  });

  const mystery = await prisma.genre.upsert({
    where: { name: 'Mystery' },
    update: {},
    create: { name: 'Mystery' },
  });

  // Create books
  const greatGatsby = await prisma.book.upsert({
    where: { isbn: '9780743273565' },
    update: {},
    create: {
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      isbn: '9780743273565',
      totalCopies: 3,
      description: 'A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.',
      genres: {
        create: [
          { genre: { connect: { id: fiction.id } } },
          { genre: { connect: { id: classic.id } } },
        ],
      },
    },
  });

  const harryPotter = await prisma.book.upsert({
    where: { isbn: '9780747532743' },
    update: {},
    create: {
      title: 'Harry Potter and the Philosopher\'s Stone',
      author: 'J.K. Rowling',
      isbn: '9780747532743',
      totalCopies: 5,
      description: 'The first book in the Harry Potter series.',
      genres: {
        create: [
          { genre: { connect: { id: fantasy.id } } },
        ],
      },
    },
  });

  const sherlockHolmes = await prisma.book.upsert({
    where: { isbn: '9780140439073' },
    update: {},
    create: {
      title: 'The Adventures of Sherlock Holmes',
      author: 'Arthur Conan Doyle',
      isbn: '9780140439073',
      totalCopies: 2,
      description: 'A collection of twelve short stories featuring Sherlock Holmes.',
      genres: {
        create: [
          { genre: { connect: { id: mystery.id } } },
          { genre: { connect: { id: classic.id } } },
        ],
      },
    },
  });

  // Create members
  const johnDoe = await prisma.member.upsert({
    where: { email: 'john.doe@example.com' },
    update: {},
    create: {
      memberId: 'M12345',
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      phoneNumber: '+1234567890',
    },
  });

  const janeSmith = await prisma.member.upsert({
    where: { email: 'jane.smith@example.com' },
    update: {},
    create: {
      memberId: 'M67890',
      fullName: 'Jane Smith',
      email: 'jane.smith@example.com',
      phoneNumber: '+0987654321',
    },
  });

  // Create some borrowings
  await prisma.borrowing.upsert({
    where: { id: 1 },
    update: {},
    create: {
      member: { connect: { id: johnDoe.id } },
      book: { connect: { id: greatGatsby.id } },
      borrowDate: new Date('2024-01-01'),
      returnDate: new Date('2024-01-15'),
    },
  });

  await prisma.borrowing.upsert({
    where: { id: 2 },
    update: {},
    create: {
      member: { connect: { id: janeSmith.id } },
      book: { connect: { id: harryPotter.id } },
      borrowDate: new Date('2024-02-01'),
      returnDate: null, // Currently borrowed
    },
  });

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
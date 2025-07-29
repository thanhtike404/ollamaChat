import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create sample products
  const products = [
    {
      name: 'MacBook Pro',
      description: 'Apple MacBook Pro 14-inch with M3 chip',
      price: 1999.99,
      category: 'Electronics',
      inStock: true
    },
    {
      name: 'Coffee Mug',
      description: 'Ceramic coffee mug with handle',
      price: 12.99,
      category: 'Kitchen',
      inStock: true
    },
    {
      name: 'Running Shoes',
      description: 'Nike Air Max running shoes',
      price: 129.99,
      category: 'Sports',
      inStock: false
    },
    {
      name: 'Wireless Headphones',
      description: 'Sony WH-1000XM4 noise-canceling headphones',
      price: 349.99,
      category: 'Electronics',
      inStock: true
    },
    {
      name: 'Yoga Mat',
      description: 'Non-slip yoga mat for exercise',
      price: 29.99,
      category: 'Sports',
      inStock: true
    }
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product
    });
  }

  // Create sample users
  const users = [
    {
      email: 'john@example.com',
      name: 'John Doe'
    },
    {
      email: 'jane@example.com',
      name: 'Jane Smith'
    }
  ];

  for (const user of users) {
    await prisma.user.create({
      data: user
    });
  }

  console.log('✅ Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
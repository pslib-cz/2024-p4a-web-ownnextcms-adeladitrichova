// prisma/seed.ts
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Create default categories
    const categories = await Promise.all([
        prisma.category.upsert({
            where: { name: 'Technology' },
            update: {},
            create: { name: 'Technology' },
        }),
        prisma.category.upsert({
            where: { name: 'Travel' },
            update: {},
            create: { name: 'Travel' },
        }),
        prisma.category.upsert({
            where: { name: 'Food' },
            update: {},
            create: { name: 'Food' },
        }),
    ]);

    // Create default tags
    const tags = await Promise.all([
        prisma.tag.upsert({
            where: { name: 'Web Development' },
            update: {},
            create: { name: 'Web Development' },
        }),
        prisma.tag.upsert({
            where: { name: 'Design' },
            update: {},
            create: { name: 'Design' },
        }),
        prisma.tag.upsert({
            where: { name: 'Tutorial' },
            update: {},
            create: { name: 'Tutorial' },
        }),
    ]);

    console.log({ categories, tags });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
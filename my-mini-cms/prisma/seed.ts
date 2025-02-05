// prisma/seed.ts
const { PrismaClient } = require('@prisma/client');
const prismaSeed = new PrismaClient();

async function main() {
    // Categories
    for (const category of ['Technology', 'Travel', 'Food', 'Lifestyle']) {
        await prismaSeed.category.upsert({
            where: { name: category },
            update: {},
            create: { name: category },
        });
    }

    // Tags
    for (const tag of ['Programming', 'Design', 'Tutorial', 'Review']) {
        await prismaSeed.tag.upsert({
            where: { name: tag },
            update: {},
            create: { name: tag },
        });
    }

    console.log('Seeding completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prismaSeed.$disconnect();
    });
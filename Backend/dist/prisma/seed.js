"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log("🌱 Starting Librello database seed...");
    // Seed default admin user
    const adminUser = await prisma.user.upsert({
        where: { email: "admin@librello.io" },
        update: {},
        create: {
            name: "Librello Master Admin",
            email: "admin@librello.io",
            role: "admin",
            status: "active",
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
        },
    });
    // Seed librarian user
    const librarianUser = await prisma.user.upsert({
        where: { email: "librarian@librello.io" },
        update: {},
        create: {
            name: "Eleanor Vance (Head Curator)",
            email: "librarian@librello.io",
            role: "librarian",
            status: "active",
            image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150",
        },
    });
    // Seed standard books catalog
    const sampleBooks = [
        {
            title: "Clean Code: A Handbook of Agile Software Craftsmanship",
            author: "Robert C. Martin",
            category: "Technology",
            description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code.",
            coverImage: "https://images.unsplash.com/photo-1532012164546-f432f2e3777a?w=600",
            fee: 4.99,
            status: "Published",
            stock: 5,
            requests: 12,
            librarianId: librarianUser.id,
            librarianEmail: librarianUser.email,
        },
        {
            title: "Designing Data-Intensive Applications",
            author: "Martin Kleppmann",
            category: "Technology",
            description: "Data is at the center of many challenges in system design today. Difficult issues need to be figured out, such as scalability, consistency, reliability, efficiency, and maintainability.",
            coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600",
            fee: 6.5,
            status: "Published",
            stock: 3,
            requests: 18,
            librarianId: librarianUser.id,
            librarianEmail: librarianUser.email,
        },
        {
            title: "The Midnight Library",
            author: "Matt Haig",
            category: "Fiction",
            description: "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.",
            coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600",
            fee: 3.5,
            status: "Published",
            stock: 8,
            requests: 25,
            librarianId: librarianUser.id,
            librarianEmail: librarianUser.email,
        },
        {
            title: "Atomic Habits",
            author: "James Clear",
            category: "Self-Help",
            description: "No matter your goals, Atomic Habits offers a proven framework for improving every day. James Clear reveals practical strategies that teach you exactly how to form good habits.",
            coverImage: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600",
            fee: 4.0,
            status: "Published",
            stock: 10,
            requests: 40,
            librarianId: librarianUser.id,
            librarianEmail: librarianUser.email,
        },
        {
            title: "Thinking, Fast and Slow",
            author: "Daniel Kahneman",
            category: "Psychology",
            description: "In the international bestseller, Daniel Kahneman, the renowned psychologist and winner of the Nobel Prize in Economics, takes us on a groundbreaking tour of the mind.",
            coverImage: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=600",
            fee: 5.25,
            status: "Published",
            stock: 4,
            requests: 9,
            librarianId: librarianUser.id,
            librarianEmail: librarianUser.email,
        },
    ];
    for (const book of sampleBooks) {
        const existing = await prisma.book.findFirst({
            where: { title: book.title },
        });
        if (!existing) {
            await prisma.book.create({ data: book });
        }
    }
    console.log("✅ Seed completed successfully!");
}
main()
    .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});

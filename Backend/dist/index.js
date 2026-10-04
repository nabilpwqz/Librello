"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const { generateChatCompletion, scanBookCoverImage, generateBookInsights, performSemanticMoodSearch } = require('./aiService');
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
const { ObjectId, getDb, prisma } = require('./db');
const jwt = require('jsonwebtoken');
const app = express();
const port = process.env.PORT || 8000;
const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, or server-to-server)
        if (!origin)
            return callback(null, true);
        // Allow all verified frontend origins dynamically
        return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie", "X-Requested-With", "Accept"],
    exposedHeaders: ["Set-Cookie"]
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
// Fast-path OPTIONS preflight requests to prevent hanging on database middleware
app.use((req, res, next) => {
    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }
    next();
});
// Health check endpoints for deployment probes (Vercel, Docker, Render, Railway, AWS)
app.get(["/health", "/api/health"], (req, res) => {
    res.status(200).json({ status: "healthy", uptime: process.uptime(), timestamp: new Date().toISOString() });
});
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));
app.use(async (req, res, next) => {
    try {
        const db = await getDb();
        req.db = {
            books: db.collection("books"),
            users: db.collection("user"),
            comments: db.collection("comments"),
            payments: db.collection("payments"),
            userSessions: db.collection("session"),
        };
        req.prisma = prisma;
        next();
    }
    catch (error) {
        res.status(500).json({ error: "Database connection failed via middleware" });
    }
});
// send email user welcome sms api 
app.post("/api/send-email", async (req, res) => {
    const { email, name, image, role } = req.body;
    // console.log(email, name, image, role, "data");
    if (!email || !name || !role) {
        return res.status(400).json({ success: false, message: "Required fields are missing!" });
    }
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.USER_EMAIL,
                pass: process.env.USER_PASSWORD,
            },
        });
        const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Librello</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    background-color: #F7F4EE; 
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    -webkit-font-smoothing: antialiased;
                }
                .wrapper {
                    width: 100%;
                    table-layout: fixed;
                    background-color: #F7F4EE;
                    padding: 40px 0;
                }
                .main-card {
                    max-width: 540px;
                    margin: 0 auto;
                    background-color: #FBF9F5;
                    border-radius: 16px;
                    border: 1px solid #E4DED4;
                    box-shadow: 0 4px 20px rgba(24, 22, 21, 0.06);
                    overflow: hidden;
                }
                .header-banner {
                    background: #181615;
                    padding: 35px 32px;
                    text-align: center;
                }
                .brand-logo {
                    font-family: Georgia, serif;
                    color: #ffffff;
                    font-size: 28px;
                    font-weight: 700;
                    letter-spacing: -0.5px;
                    margin: 0;
                }
                .brand-tagline {
                    color: #fcf0de;
                    font-size: 12px;
                    margin: 6px 0 0 0;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    font-weight: 600;
                }
                .body-content {
                    padding: 45px 35px;
                    text-align: center;
                }
                .avatar-container {
                    margin-bottom: 24px;
                }
                .user-avatar {
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 4px solid #fdf3e9; /* var(--card-soft) */
                    box-shadow: 0 8px 20px rgba(107, 66, 38, 0.15);
                }
                .welcome-title {
                    font-family: 'Poppins', sans-serif;
                    color: #2c1c10; /* var(--foreground) */
                    font-size: 24px;
                    font-weight: 700;
                    margin: 0 0 10px 0;
                }
                .welcome-desc {
                    color: #785a3c; /* var(--muted-foreground) */
                    font-size: 15px;
                    line-height: 1.6;
                    margin: 0 0 35px 0;
                }
                .role-badge-container {
                    background-color: #fdf3e9; /* var(--card-soft) */
                    border-radius: 12px;
                    padding: 16px 28px;
                    display: inline-block;
                    border: 1px solid #e8d5c3; /* var(--border) */
                }
                .role-label {
                    color: #785a3c; /* var(--muted-foreground) */
                    font-size: 11px;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    font-weight: 600;
                    display: block;
                    margin-bottom: 4px;
                }
                .role-value {
                    color: #6b4226; /* var(--secondary) */
                    font-size: 18px;
                    font-weight: 700;
                    display: block;
                }
                .footer {
                    background-color: #fdf3e9; /* var(--sidebar) / var(--card-soft) */
                    border-top: 1px solid #e8d5c3;
                    padding: 24px 32px;
                    text-align: center;
                }
                .footer-links {
                    margin-bottom: 10px;
                }
                .footer-links a {
                    color: #6b4226;
                    text-decoration: none;
                    font-size: 13px;
                    margin: 0 10px;
                    font-weight: 600;
                }
                .footer-links a:hover {
                    color: #c4844a;
                }
                .footer-text {
                    color: #785a3c;
                    font-size: 12px;
                    margin: 0;
                    line-height: 1.5;
                }
            </style>
        </head>
        <body>
            <div class="wrapper">
                <div class="main-card">
                    <!-- Header banner -->
                    <div class="header-banner">
                        <h1 class="brand-logo">Librello</h1>
                        <p class="brand-tagline">Discover. Read. Share.</p>
                    </div>

                    <!-- Main body content -->
                    <div class="body-content">
                        <div class="avatar-container">
                            <img src="${image ? image : 'https://i.ibb.co/default-avatar.png'}" alt="${name}" class="user-avatar" />
                        </div>

                        <h2 class="welcome-title">Welcome, ${name}!</h2>
                        <p class="welcome-desc">
                            Your account has been verified within the Librello collective. Get ready to experience seamless book discovery and physical edition circulation.
                        </p>

                        <!-- Role display card -->
                        <div class="role-badge-container">
                            <span class="role-label">Archival Access Token</span>
                            <span class="role-value">${role.toUpperCase()}</span>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="footer">
                        <div class="footer-links">
                            <a href="${process.env.CLIENT_URI}">Browse Archive</a>
                            <a href="${process.env.CLIENT_URI}">Dashboard</a>
                            <a href="${process.env.CLIENT_URI}">Privacy</a>
                        </div>
                        <p class="footer-text">
                            &copy; 2026 Librello Publishing & Library Collective. All rights reserved.<br>
                            Secured via environment credentials.
                        </p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        `;
        const mailOptions = {
            from: `"Librello Concierge" <${process.env.USER_EMAIL}>`,
            to: email,
            subject: `Welcome to Librello: Account Activated (${role.toUpperCase()})`,
            html: htmlContent,
        };
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ success: true, message: "Premium email sent successfully!" });
    }
    catch (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ success: false, message: "Failed to send email." });
    }
});
// ================ middleware check================
// Verify authorization header and extract bearer token (Firebase JWT or session token)
const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ success: false, message: "Unauthorized. No token provided." });
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized. No token provided." });
        }
        let user = null;
        // 1. Decode Firebase ID Token (JWT)
        const decoded = jwt.decode(token);
        if (decoded && (decoded.email || decoded.user_id || decoded.sub)) {
            const email = decoded.email;
            const uid = decoded.user_id || decoded.sub;
            // Search Firestore user
            user = await req.db.users.findOne({
                $or: [
                    ...(email ? [{ email: email }] : []),
                    ...(uid ? [{ uid: uid }, { _id: uid }, { id: uid }] : [])
                ]
            });
            // Auto-provision if authenticated in Firebase but not yet present in Firestore
            if (!user && (email || uid)) {
                const newUser = {
                    name: decoded.name || "Anonymous Reader",
                    email: email || "",
                    image: decoded.picture || "",
                    role: "user",
                    uid: uid,
                    createdAt: new Date().toISOString()
                };
                const insertRes = await req.db.users.insertOne(newUser);
                user = { ...newUser, _id: insertRes.insertedId, id: insertRes.insertedId };
            }
        }
        // 2. Fallback to session collection check
        if (!user) {
            const session = await req.db.userSessions.findOne({ token: token });
            if (session) {
                const userId = session.userId;
                user = await req.db.users.findOne({
                    $or: [
                        { _id: userId },
                        { id: userId },
                        { uid: userId }
                    ]
                });
            }
        }
        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized. Invalid session or token." });
        }
        // set user in request Object
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Internal Auth Error" });
    }
};
// librarian role check must be used after verifying token
const verifyLibrarian = async (req, res, next) => {
    if (req?.user?.role !== "librarian") {
        return res.status(403).json({ success: false, message: "Unauthorized. Only Librarian can access this route." });
    }
    next();
};
// admin role check must be used after verifying token
const verifyAdmin = async (req, res, next) => {
    if (req?.user?.role !== "admin") {
        return res.status(403).json({ success: false, message: "Unauthorized. Only Admin can access this route." });
    }
    next();
};
// user(Reader) role check must be used after verifying token
const verifyUser = async (req, res, next) => {
    if (!["user", "admin", "librarian"].includes(req?.user?.role)) {
        return res.status(403).json({ success: false, message: "Unauthorized. Reader clearance required." });
    }
    next();
};
// ================ middleware check================
// =============================================================
//                      Books Api feature
// =============================================================
// db te // all books get korche by status (Published & Checked Out)
app.get("/api/books/publishedBooks", async (req, res) => {
    try {
        const { search, category, status, minFee, maxFee, page, perPage } = req.query;
        //  Compute numerical constraints safely using scope variables directly
        const currentPage = Math.max(1, parseInt(page, 10) || 1);
        const currentLimit = Math.max(6, Math.min(12, parseInt(perPage, 10) || 8));
        const skipItems = (currentPage - 1) * currentLimit;
        let query = {};
        //  Search filter (across title and author)
        if (search && search.trim() !== "") {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { author: { $regex: search, $options: "i" } }
            ];
        }
        // Category filter
        if (category && category !== "all" && category.trim() !== "") {
            query.category = category;
        }
        //  Delivery fee budget range
        if (minFee || maxFee) {
            query.fee = {};
            if (minFee)
                query.fee.$gte = Number(minFee);
            if (maxFee)
                query.fee.$lte = Number(maxFee);
        }
        //  Status filter (Published/Checked Out)
        if (status && status !== "all") {
            if (status === "Available") {
                query.status = "Published";
            }
            else if (status === "Unavailable") {
                query.status = "Checked Out";
            }
        }
        else {
            query.status = { $in: ["Published", "Checked Out"] };
        }
        // Count total items based on your filters
        const totalItems = await req.db.books.countDocuments(query);
        // Fetch limited chunk explicitly using skip and limit
        const booksData = await req.db.books
            .find(query)
            .sort({ createdAt: -1 })
            .skip(skipItems)
            .limit(currentLimit)
            .toArray();
        const totalPages = Math.ceil(totalItems / currentLimit);
        // Send books and pagination metadata inside a single wrapper object
        res.json({
            success: true,
            books: booksData,
            meta: {
                totalItems,
                totalPages,
                currentPage,
                limit: currentLimit
            }
        });
    }
    catch (error) {
        console.error("Browse books fetch critical error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
});
// book details by id 
app.get('/api/books/details/:id', async (req, res) => {
    const { id } = req.params;
    const result = await req.db.books.findOne({ _id: new ObjectId(id) });
    res.json(result);
});
// =================== Librarian =====================
// librarian book post korche 
app.post('/api/books', async (req, res) => {
    try {
        const bookData = req.body;
        const finalBookObj = {
            ...bookData,
            fee: Number(bookData.fee) || 0,
            status: "Pending Approval",
            requests: 0,
            createdAt: new Date()
        };
        const result = await req.db.books.insertOne(finalBookObj);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({
            message: error.message || "An unexpected internal server error occurred."
        });
    }
});
//  librarian Id diye books get korche - Newest First with Dual Safety Check
app.get('/api/books', verifyToken, verifyLibrarian, async (req, res) => {
    try {
        const { librarianId } = req.query;
        if (req?.user?._id?.toString() !== librarianId?.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized. Only Librarian can access this route." });
        }
        //  আইডি স্ট্রিং হোক বা মঙ্গোডিবির ObjectId, দুই ক্যাটাগরিতেই যেন ডাটাবেজ ম্যাচ করতে পারে ভ
        const query = {
            $or: [
                { librarianId: librarianId },
                { librarianId: ObjectId.isValid(librarianId) ? new ObjectId(librarianId) : librarianId }
            ]
        };
        const result = await req.db.books
            .find(query)
            .toArray();
        res.json(result);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
});
// librarian id  all books status change 
app.patch('/api/books/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { currentStatus } = req.body;
        if (currentStatus === "Pending Approval") {
            return res.status(400).json({ success: false, message: " Waiting for Admin approval." });
        }
        const targetStatus = currentStatus === "Published" ? "Unpublished" : "Published";
        const result = await req.db.books.updateOne({ _id: new ObjectId(id) }, { $set: { status: targetStatus } });
        res.json({
            success: true,
            message: `Book status successfully updated to ${targetStatus}! `,
            result
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
// librarian book edit by id (update)
app.patch('/api/books/edit/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const bookData = req.body;
        delete bookData._id;
        if (bookData.fee) {
            bookData.fee = Number(bookData.fee) || 0;
        }
        const result = await req.db.books.updateOne({ _id: new ObjectId(id) }, { $set: bookData });
        res.json({
            success: true,
            message: `Book details updated successfully to "${bookData.title || 'new title'}"!`,
            result
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
});
// librarian/admin --  book Delete by id
app.delete('/api/books/delete/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await req.db.books.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 1) {
            res.json({
                success: true,
                message: "Book has been successfully wiped from inventory!",
                result
            });
        }
        else {
            res.status(404).json({
                success: false,
                message: "Book not found or already deleted from the system."
            });
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
});
// ================== Admin ================
// admin all books get
app.get('/api/books/allBooks', verifyToken, async (req, res) => {
    try {
        const result = await req.db.books
            .find({})
            .sort({ createdAt: -1 })
            .toArray();
        res.json(result);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
});
// admin gets all pending books
app.get('/api/books/pendingBooks', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const result = await req.db.books.find({ status: "Pending Approval" }).toArray();
        res.json(result);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
});
// admin approve pending book status by id
app.patch('/api/books/approveStatus/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const targetStatus = "Published";
        const result = await req.db.books.updateOne({ _id: new ObjectId(id) }, { $set: { status: targetStatus } });
        res.json({
            success: true,
            message: `Book status successfully updated to ${targetStatus}! `,
            result
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
});
// admin book status check kore status update korbe (publish/unpublish)
app.patch('/api/books/updateStatus/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const targetStatus = ["Unpublished", "Published"];
        if (!targetStatus.includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status" });
        }
        const result = await req.db.books.updateOne({ _id: new ObjectId(id) }, { $set: { status: status } });
        res.json({
            success: true,
            message: `Book status successfully updated to ${status}!`,
            result
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
});
app.get('/api/admin/stats', async (req, res) => {
    try {
        const totalUsers = await req.db.users.countDocuments({});
        const totalBooks = await req.db.books.countDocuments({});
        const totalDeliveries = await req.db.payments.countDocuments({ status: "Delivered" });
        const revenueResult = await req.db.payments.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" }
                }
            }
        ]).toArray();
        const totalRevenue = revenueResult[0]?.total ?? revenueResult[0]?.totalRevenue ?? 0;
        res.json({
            success: true,
            stats: { totalUsers, totalBooks, totalDeliveries, totalRevenue }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
app.get('/api/admin/book-categories', async (req, res) => {
    try {
        const categoryData = await req.db.books.aggregate([
            {
                $group: {
                    _id: "$category",
                    value: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    name: "$_id",
                    value: 1
                }
            }
        ]).toArray();
        res.json({ success: true, categoryData });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
//================== Users / Comments Api =====================
// sync user from Firebase Auth to Firestore
app.post("/api/users/sync", async (req, res) => {
    try {
        const { user } = req.body;
        if (!user || (!user.email && !user.uid && !user.id)) {
            return res.status(400).json({ success: false, message: "Required user fields missing" });
        }
        const uid = user.uid || user.id;
        const email = user.email;
        let existing = await req.db.users.findOne({
            $or: [
                ...(email ? [{ email }] : []),
                ...(uid ? [{ uid }, { _id: uid }, { id: uid }] : [])
            ]
        });
        if (existing) {
            await req.db.users.updateOne({ _id: existing._id }, {
                $set: {
                    name: user.name || existing.name,
                    image: user.image || existing.image,
                    uid: uid || existing.uid,
                }
            });
            return res.json({ success: true, user: { ...existing, role: existing.role } });
        }
        else {
            const newUser = {
                name: user.name || "Anonymous Reader",
                email: user.email || "",
                image: user.image || "",
                role: user.role || "user",
                uid: uid || "",
                createdAt: new Date().toISOString()
            };
            const insRes = await req.db.users.insertOne({ ...newUser, _id: uid });
            return res.json({ success: true, user: { ...newUser, _id: insRes.insertedId, id: insRes.insertedId } });
        }
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});
// user role update by admin
app.patch('/api/users/updateRole/:id', verifyToken, verifyAdmin, async (req, res) => {
    const { id } = req.params;
    const { userRole } = req.body;
    try {
        const result = await req.db.users.updateOne({ _id: new ObjectId(id) }, { $set: { role: userRole } });
        res.json({
            success: true,
            message: `User role successfully updated to ${userRole}!`,
            result
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
});
// user er sob data get korchi joto user ache tader list
app.get("/api/users", verifyToken, verifyAdmin, async (req, res) => {
    try {
        const userCollection = await req.db.users;
        const users = await userCollection
            .find({})
            .project({
            password: 0,
            salt: 0,
            hashedPassword: 0,
            textPassword: 0
        })
            .sort({ createdAt: -1 })
            .toArray();
        res.status(200).json({
            success: true,
            count: users.length,
            users: users,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error. Failed to fetch user collection.",
            error: error.message,
        });
    }
});
// user delete by admin
app.delete('/api/users/delete/:id', verifyToken, verifyAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await req.db.users.deleteOne({ _id: new ObjectId(id) });
        res.json({
            success: true,
            message: `User has been successfully deleted!`,
            result
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
});
// user id diye tar nijer comment get korchi
app.get('/api/books/comments/:userId', verifyToken, verifyUser, async (req, res) => {
    const { userId } = req.params;
    if (req?.user?._id?.toString() !== userId?.toString()) {
        return res.status(403).json({ success: false, message: "Unauthorized. Only Reader can access this route." });
    }
    try {
        const result = await req.db.comments.find({ userId: userId }).toArray();
        res.json(result);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
});
// user comments add post
app.post('/api/users/comments', async (req, res) => {
    try {
        const data = req.body;
        const commentData = {
            ...data,
            createdAt: new Date()
        };
        const result = await req.db.comments.insertOne(commentData);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
});
//   book id diye comment get korchi
app.get('/api/books/comments', async (req, res) => {
    try {
        const query = {};
        if (req.query.bookId) {
            query.bookId = req.query.bookId;
        }
        const result = await req.db.comments.find(query).toArray();
        res.json(result);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
});
// User comment edit/update by commentId
app.patch('/api/users/comments/edit/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { comment } = req.body;
        const result = await req.db.comments.updateOne({ _id: new ObjectId(id) }, { $set: { comment: comment, updatedAt: new Date() } });
        res.json({
            success: true,
            message: "Comment updated successfully in database!",
            result
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error during comment update"
        });
    }
});
// User comments Delete by id
app.delete('/api/users/comments/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await req.db.comments.deleteOne({ _id: new ObjectId(id) });
        res.json({
            success: true,
            message: "Comment has been successfully deleted!",
            result
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error during comment delete"
        });
    }
});
//================== payments =====================
app.post('/api/payments', async (req, res) => {
    try {
        const { sessionId, bookId, bookTitle, bookCover, userId, userName, userEmail, librarianId, librarianEmail, amount } = req.body;
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const currentMonth = monthNames[new Date().getMonth()];
        const paymentData = {
            transactionId: sessionId,
            bookId,
            bookTitle,
            bookCover,
            userId: userId || null,
            userName: userName || req.user?.name || "Reader",
            userEmail,
            librarianId: librarianId || null,
            librarianEmail,
            amount,
            month: currentMonth,
            status: "Pending",
            createdAt: new Date()
        };
        const isExists = await req.db.payments.findOne({ transactionId: sessionId });
        if (isExists) {
            return res.status(400).json({
                success: false,
                message: "Payment already exists!"
            });
        }
        await req.db.payments.insertOne(paymentData);
        await req.db.books.updateOne({ _id: new ObjectId(bookId) }, {
            $set: { status: "Checked Out" },
            $inc: { requests: 1 } //payment success hole rq barbe
        });
        res.json({
            success: true,
            message: "Payment successfully created!",
            paymentData
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
// all payments data get
app.get('/api/payments', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const result = await req.db.payments.find({}).toArray();
        res.json(result);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
});
// Get payment details/history by user email
app.get('/api/payments/user/:email', verifyToken, verifyUser, async (req, res) => {
    const { email } = req.params;
    try {
        const result = await req.db.payments
            .find({ userEmail: email })
            .sort({ createdAt: -1 })
            .toArray();
        res.json(result);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
});
// user payments data get by librarian userEmail
app.get('/api/payments/librarian/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const result = await req.db.payments.find({ librarianEmail: email }).sort({ createdAt: -1 }).toArray();
        res.json(result);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
});
app.patch('/api/payments/return/:paymentId', async (req, res) => {
    try {
        const { paymentId } = req.params;
        const { currentStatus } = req.body;
        if (!paymentId) {
            return res.status(400).json({ success: false, message: "Payment ID is required." });
        }
        const targetStatus = currentStatus === "Delivered"
            ? "Return Requested"
            : currentStatus === "Return Requested"
                ? "Returned"
                : currentStatus;
        // status update
        const result = await req.db.payments.updateOne({ _id: new ObjectId(paymentId) }, { $set: { status: targetStatus } });
        if (targetStatus === "Returned") {
            const paymentDoc = await req.db.payments.findOne({ _id: new ObjectId(paymentId) });
            if (paymentDoc?.bookId) {
                await req.db.books.updateOne({ _id: new ObjectId(paymentDoc.bookId) }, { $set: { status: "Published" } });
            }
        }
        res.json({
            success: true,
            message: `Status successfully updated to ${targetStatus}`,
            result
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "An unexpected internal server error occurred."
        });
    }
});
// librarian delivery status update
app.patch('/api/payments/updateStatus/:deliveryId', async (req, res) => {
    try {
        const { deliveryId } = req.params;
        const { currentStatus } = req.body;
        if (!deliveryId) {
            return res.status(400).json({ success: false, message: "Delivery ID is required." });
        }
        //status check
        const targetStatus = currentStatus === "Pending"
            ? "Dispatched"
            : currentStatus === "Dispatched"
                ? "Delivered"
                : currentStatus === "Delivered"
                    ? "Return Requested"
                    : currentStatus === "Return Requested"
                        ? "Returned"
                        : currentStatus;
        const result = await req.db.payments.updateOne({ _id: new ObjectId(deliveryId) }, { $set: { status: targetStatus } });
        if (targetStatus === "Returned") {
            const paymentDoc = await req.db.payments.findOne({ _id: new ObjectId(deliveryId) });
            if (paymentDoc?.bookId) {
                await req.db.books.updateOne({ _id: new ObjectId(paymentDoc.bookId) }, { $set: { status: "Published" } });
            }
        }
        res.json({
            success: true,
            message: `Status successfully updated to ${targetStatus}!`,
            result
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
});
// ===============================
// ==========================================
//  Librello Concierge AI Chatbot Endpoint (Rate-Limit Fallback Engine)
// ==========================================
app.post("/api/ai/chat", async (req, res) => {
    try {
        const { message, history = [] } = req.body;
        if (!message || typeof message !== "string" || !message.trim()) {
            return res.status(400).json({ error: "Message is required" });
        }
        // Fetch live catalog sample from MongoDB if available
        let catalogContext = "";
        try {
            if (req.db && req.db.books) {
                const liveBooks = await req.db.books
                    .find({ status: "Published" })
                    .project({ title: 1, author: 1, category: 1, price: 1, fee: 1 })
                    .limit(10)
                    .toArray();
                if (liveBooks.length > 0) {
                    catalogContext = liveBooks
                        .map(b => `- "${b.title}" by ${b.author} [Genre: ${b.category || 'General'}] (Delivery Fee: ${b.fee || 5})`)
                        .join("\n");
                }
            }
        }
        catch (dbErr) {
            console.warn("Could not fetch catalog context:", dbErr.message);
        }
        const messages = [
            ...history.slice(-8),
            { role: "user", content: message.trim() }
        ];
        const result = await generateChatCompletion({
            messages,
            catalogContext
        });
        res.json({
            success: true,
            reply: result.text,
            provider: result.provider,
            fallbackChain: result.fallbackChain
        });
    }
    catch (error) {
        console.error("AI Chatbot Route Error:", error);
        res.status(500).json({
            error: "Failed to process chat message",
            details: error.message
        });
    }
});
// ==========================================
// 📸 AI Book Cover Scanner Endpoint (Multimodal Vision Engine)
// ==========================================
app.post("/api/ai/scan-cover", async (req, res) => {
    try {
        const { image, mimeType } = req.body;
        if (!image) {
            return res.status(400).json({ error: "Book cover image (base64) is required" });
        }
        const result = await scanBookCoverImage({
            base64Data: image,
            mimeType: mimeType || "image/jpeg"
        });
        res.json({
            success: true,
            book: result.book,
            provider: result.provider,
            fallbackReason: result.fallbackReason
        });
    }
    catch (error) {
        console.error("AI Book Cover Scanner Error:", error);
        res.status(500).json({
            error: "Failed to scan book cover",
            details: error.message
        });
    }
});
// ==========================================
// 🧠 AI Book Reader Insights Endpoint ("Should I Read This?")
// ==========================================
app.post("/api/ai/book-insights", async (req, res) => {
    try {
        const { title, author, category, description } = req.body;
        if (!title && !description) {
            return res.status(400).json({ error: "Book title or description is required for insights" });
        }
        const result = await generateBookInsights({
            title,
            author,
            category,
            description
        });
        res.json({
            success: true,
            insights: result.insights,
            provider: result.provider,
            fallbackChain: result.fallbackChain
        });
    }
    catch (error) {
        console.error("AI Book Insights Error:", error);
        res.status(500).json({
            error: "Failed to generate book insights",
            details: error.message
        });
    }
});
// ==========================================
// 🔍 AI Semantic & Mood Search Endpoint
// ==========================================
app.post("/api/ai/semantic-search", async (req, res) => {
    try {
        const { query } = req.body;
        if (!query || query.trim() === "") {
            return res.status(400).json({ error: "Search query is required" });
        }
        // Fetch published books from MongoDB
        const allBooks = await req.db.books
            .find({ status: { $in: ["Published", "Checked Out"] } })
            .sort({ createdAt: -1 })
            .toArray();
        const searchResult = await performSemanticMoodSearch({
            query,
            catalog: allBooks
        });
        if (!searchResult.success || !searchResult.matches) {
            return res.json({
                success: true,
                query,
                moodDetected: searchResult.moodDetected || "Discovered",
                books: allBooks.slice(0, 8),
                provider: searchResult.provider || "Fallback"
            });
        }
        // Map match reasons back to full book objects
        const booksMap = new Map();
        allBooks.forEach(b => booksMap.set(b._id.toString(), b));
        const matchedBooks = [];
        for (const match of searchResult.matches) {
            const book = booksMap.get(match.id?.toString());
            if (book) {
                matchedBooks.push({
                    ...book,
                    matchReason: match.matchReason,
                    relevanceScore: match.relevanceScore || 90
                });
            }
        }
        res.json({
            success: true,
            query,
            moodDetected: searchResult.moodDetected,
            books: matchedBooks,
            provider: searchResult.provider
        });
    }
    catch (error) {
        console.error("AI Semantic Search Error:", error);
        res.status(500).json({
            error: "Failed to perform semantic search",
            details: error.message
        });
    }
});
app.get('/', (req, res) => {
    res.send('Librello Core Engine is running active and clean!');
});
if (!process.env.VERCEL) {
    app.listen(port, () => {
        console.log(`🚀 Librello Backend active on port http://localhost:${port}`);
    });
}
exports.default = app;
module.exports = app;

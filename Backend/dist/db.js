"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaCollection = exports.prisma = void 0;
exports.ObjectId = ObjectId;
exports.getDb = getDb;
const client_1 = require("@prisma/client");
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../.env") });
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../../.env") });
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), ".env") });
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), "../.env") });
exports.prisma = global.prisma ||
    new client_1.PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });
if (process.env.NODE_ENV !== "production") {
    global.prisma = exports.prisma;
}
// ObjectId compatibility shim for legacy MongoDB ID representations
function ObjectId(id) {
    const strId = id ? (typeof id === "object" && id.toString ? id.toString() : String(id)) : "";
    if (this instanceof ObjectId) {
        return strId;
    }
    return strId;
}
ObjectId.isValid = (id) => {
    return typeof id === "string" ? id.trim().length > 0 : Boolean(id);
};
// Map collection names to Prisma model delegates
function getModelDelegate(colName) {
    const name = colName.toLowerCase();
    if (name === "books" || name === "book")
        return exports.prisma.book;
    if (name === "users" || name === "user")
        return exports.prisma.user;
    if (name === "comments" || name === "comment")
        return exports.prisma.comment;
    if (name === "payments" || name === "payment")
        return exports.prisma.payment;
    if (name === "session" || name === "sessions" || name === "usersessions")
        return exports.prisma.session;
    return null;
}
const MODEL_FIELDS = {
    books: ["id", "title", "author", "category", "description", "coverImage", "cover", "fee", "status", "librarianId", "librarianName", "librarianEmail", "librarianImage", "stock", "requests", "rating", "createdAt", "updatedAt"],
    users: ["id", "uid", "name", "email", "image", "role", "status", "phone", "address", "createdAt", "updatedAt"],
    comments: ["id", "bookId", "userId", "userName", "userEmail", "userImage", "rating", "comment", "bookTitle", "bookImage", "role", "createdAt"],
    payments: ["id", "transactionId", "userEmail", "userName", "userId", "bookId", "bookTitle", "bookImage", "bookCover", "amount", "status", "deliveryStatus", "deliveryAddress", "librarianId", "librarianEmail", "month", "returnDate", "createdAt", "updatedAt"],
    sessions: ["id", "token", "userId", "expiresAt", "createdAt"],
};
function sanitizeModelData(colName, data) {
    const normName = colName.toLowerCase().replace(/s$/, "");
    const key = normName === "user" ? "users" : normName === "book" ? "books" : normName === "comment" ? "comments" : normName === "payment" ? "payments" : normName === "session" ? "sessions" : colName.toLowerCase();
    const allowed = MODEL_FIELDS[key];
    const cleaned = { ...data };
    // Map aliases
    if (cleaned.cover && !cleaned.coverImage)
        cleaned.coverImage = cleaned.cover;
    if (cleaned.coverImage && !cleaned.cover)
        cleaned.cover = cleaned.coverImage;
    if (cleaned.bookCover && !cleaned.bookImage)
        cleaned.bookImage = cleaned.bookCover;
    if (cleaned.bookImage && !cleaned.bookCover)
        cleaned.bookCover = cleaned.bookImage;
    if (cleaned.sessionId && !cleaned.transactionId)
        cleaned.transactionId = cleaned.sessionId;
    // Foreign key safety: If empty string, remove
    if (cleaned.userId === "")
        delete cleaned.userId;
    if (cleaned.librarianId === "")
        delete cleaned.librarianId;
    // Number conversions
    if (cleaned.fee !== undefined)
        cleaned.fee = Number(cleaned.fee) || 0;
    if (cleaned.amount !== undefined)
        cleaned.amount = Number(cleaned.amount) || 0;
    if (cleaned.stock !== undefined)
        cleaned.stock = Number(cleaned.stock) || 1;
    if (cleaned.requests !== undefined)
        cleaned.requests = Number(cleaned.requests) || 0;
    if (cleaned.rating !== undefined)
        cleaned.rating = Number(cleaned.rating) || 0;
    // Date coercions
    if (cleaned.createdAt && typeof cleaned.createdAt === "string")
        cleaned.createdAt = new Date(cleaned.createdAt);
    if (cleaned.updatedAt && typeof cleaned.updatedAt === "string")
        cleaned.updatedAt = new Date(cleaned.updatedAt);
    if (allowed) {
        const result = {};
        for (const k of allowed) {
            if (cleaned[k] !== undefined) {
                result[k] = cleaned[k];
            }
        }
        return result;
    }
    return cleaned;
}
// Helper to normalize document fields from Prisma to legacy-compatible objects
function normalizeDoc(item) {
    if (!item || typeof item !== "object")
        return item;
    const doc = { ...item };
    if (doc.id && !doc._id) {
        doc._id = doc.id;
    }
    if (doc.coverImage && !doc.cover) {
        doc.cover = doc.coverImage;
    }
    else if (doc.cover && !doc.coverImage) {
        doc.coverImage = doc.cover;
    }
    if (doc.bookCover && !doc.bookImage) {
        doc.bookImage = doc.bookCover;
    }
    else if (doc.bookImage && !doc.bookCover) {
        doc.bookCover = doc.bookImage;
    }
    return doc;
}
// Build Prisma 'where' clause from MongoDB-style query filters
function buildPrismaWhere(filter = {}) {
    if (!filter || Object.keys(filter).length === 0)
        return {};
    const where = {};
    for (const [key, val] of Object.entries(filter)) {
        // Normalize _id / id
        const targetKey = key === "_id" ? "id" : key;
        if (key === "$or" && Array.isArray(val)) {
            where.OR = val.map((item) => buildPrismaWhere(item));
            continue;
        }
        if (key === "$and" && Array.isArray(val)) {
            where.AND = val.map((item) => buildPrismaWhere(item));
            continue;
        }
        if (val instanceof RegExp) {
            where[targetKey] = { contains: val.source, mode: "insensitive" };
            continue;
        }
        if (typeof val === "object" && val !== null) {
            if (val.$regex !== undefined) {
                where[targetKey] = {
                    contains: String(val.$regex),
                    mode: val.$options === "i" ? "insensitive" : "default",
                };
            }
            else if (val.$in && Array.isArray(val.$in)) {
                where[targetKey] = { in: val.$in };
            }
            else if (val.$ne !== undefined) {
                where[targetKey] = { not: val.$ne };
            }
            else if (val.$gt !== undefined || val.$gte !== undefined || val.$lt !== undefined || val.$lte !== undefined) {
                where[targetKey] = {};
                if (val.$gt !== undefined)
                    where[targetKey].gt = Number(val.$gt);
                if (val.$gte !== undefined)
                    where[targetKey].gte = Number(val.$gte);
                if (val.$lt !== undefined)
                    where[targetKey].lt = Number(val.$lt);
                if (val.$lte !== undefined)
                    where[targetKey].lte = Number(val.$lte);
            }
            else {
                where[targetKey] = val;
            }
        }
        else {
            where[targetKey] = val;
        }
    }
    return where;
}
// Build Prisma 'orderBy' from MongoDB-style sort specification
function buildPrismaOrderBy(sortBy) {
    if (!sortBy || Object.keys(sortBy).length === 0)
        return [{ createdAt: "desc" }];
    return Object.entries(sortBy).map(([k, v]) => {
        const key = k === "_id" ? "id" : k;
        const direction = v === 1 || v === "asc" ? "asc" : "desc";
        return { [key]: direction };
    });
}
class PrismaCollection {
    colName;
    delegate;
    constructor(colName) {
        this.colName = colName;
        this.delegate = getModelDelegate(colName);
    }
    async findOne(filter = {}) {
        try {
            if (!this.delegate)
                return null;
            const where = buildPrismaWhere(filter);
            const item = await this.delegate.findFirst({ where });
            return item ? normalizeDoc(item) : null;
        }
        catch (err) {
            console.error(`Error in findOne on ${this.colName}:`, err);
            return null;
        }
    }
    find(filter = {}) {
        let orderBy;
        let skipCount;
        let limitCount;
        let projectedFields = null;
        const cursor = {
            project: (fields) => {
                projectedFields = fields;
                return cursor;
            },
            sort: (sortBy) => {
                orderBy = buildPrismaOrderBy(sortBy);
                return cursor;
            },
            skip: (n) => {
                if (typeof n === "number" && n >= 0)
                    skipCount = n;
                return cursor;
            },
            limit: (n) => {
                if (typeof n === "number" && n > 0)
                    limitCount = n;
                return cursor;
            },
            toArray: async () => {
                try {
                    if (!this.delegate)
                        return [];
                    const where = buildPrismaWhere(filter);
                    const results = await this.delegate.findMany({
                        where,
                        orderBy,
                        skip: skipCount,
                        take: limitCount,
                    });
                    let normalized = results.map(normalizeDoc);
                    if (projectedFields) {
                        normalized = normalized.map((item) => {
                            const copy = { ...item };
                            for (const [k, v] of Object.entries(projectedFields)) {
                                if (v === 0)
                                    delete copy[k];
                            }
                            return copy;
                        });
                    }
                    return normalized;
                }
                catch (err) {
                    console.error(`Error in find on ${this.colName}:`, err);
                    return [];
                }
            },
        };
        return cursor;
    }
    async countDocuments(filter = {}) {
        try {
            if (!this.delegate)
                return 0;
            const where = buildPrismaWhere(filter);
            return await this.delegate.count({ where });
        }
        catch (err) {
            console.error(`Error in countDocuments on ${this.colName}:`, err);
            return 0;
        }
    }
    async insertOne(data) {
        try {
            if (!this.delegate) {
                throw new Error(`Model delegate not found for collection: ${this.colName}`);
            }
            const cleaned = sanitizeModelData(this.colName, data);
            const explicitId = cleaned._id || cleaned.id;
            delete cleaned._id;
            if (!explicitId)
                delete cleaned.id;
            const created = await this.delegate.create({
                data: cleaned,
            });
            return { acknowledged: true, insertedId: created.id };
        }
        catch (err) {
            console.error(`Error inserting into ${this.colName}:`, err);
            throw err;
        }
    }
    async updateOne(filter, update) {
        try {
            if (!this.delegate)
                return { acknowledged: false, modifiedCount: 0, matchedCount: 0 };
            const target = await this.findOne(filter);
            if (!target) {
                return { acknowledged: true, modifiedCount: 0, matchedCount: 0 };
            }
            const rawUpdates = {};
            if (update.$set) {
                Object.assign(rawUpdates, update.$set);
            }
            if (update.$inc) {
                for (const [k, incVal] of Object.entries(update.$inc)) {
                    rawUpdates[k] = { increment: Number(incVal) };
                }
            }
            if (!update.$set && !update.$inc) {
                Object.assign(rawUpdates, update);
            }
            delete rawUpdates._id;
            delete rawUpdates.id;
            // Handle increment fields separately from scalar sanitization if any
            const incFields = {};
            const scalarFields = {};
            for (const [k, v] of Object.entries(rawUpdates)) {
                if (v && typeof v === "object" && v.increment !== undefined) {
                    incFields[k] = v;
                }
                else {
                    scalarFields[k] = v;
                }
            }
            const sanitizedScalars = sanitizeModelData(this.colName, scalarFields);
            delete sanitizedScalars.id;
            delete sanitizedScalars._id;
            const finalData = { ...sanitizedScalars, ...incFields };
            await this.delegate.update({
                where: { id: target.id },
                data: finalData,
            });
            return { acknowledged: true, modifiedCount: 1, matchedCount: 1 };
        }
        catch (err) {
            console.error(`Error updating in ${this.colName}:`, err);
            throw err;
        }
    }
    async deleteOne(filter) {
        try {
            if (!this.delegate)
                return { acknowledged: false, deletedCount: 0 };
            const target = await this.findOne(filter);
            if (!target) {
                return { acknowledged: true, deletedCount: 0 };
            }
            await this.delegate.delete({
                where: { id: target.id },
            });
            return { acknowledged: true, deletedCount: 1 };
        }
        catch (err) {
            console.error(`Error deleting from ${this.colName}:`, err);
            throw err;
        }
    }
    aggregate(pipeline) {
        return {
            toArray: async () => {
                try {
                    // Fast-path: Check for common dashboard aggregation pipelines
                    const col = this.colName.toLowerCase();
                    // 1. Total revenue on payments: [{ $group: { _id: null, totalRevenue: { $sum: "$amount" } } }]
                    if (col === "payments" || col === "payment") {
                        const sumResult = await exports.prisma.payment.aggregate({
                            _sum: { amount: true },
                        });
                        const total = sumResult._sum.amount || 0;
                        return [{ _id: null, total: total, totalRevenue: total }];
                    }
                    // 2. Book categories: [{ $group: { _id: "$category", count: { $sum: 1 } } }]
                    if (col === "books" || col === "book") {
                        const groups = await exports.prisma.book.groupBy({
                            by: ["category"],
                            _count: { id: true },
                        });
                        return groups.map((g) => ({
                            _id: g.category,
                            name: g.category,
                            count: g._count.id,
                            value: g._count.id,
                        }));
                    }
                    // Fallback: general in-memory pipeline over findMany
                    let items = await this.delegate.findMany();
                    items = items.map(normalizeDoc);
                    for (const stage of pipeline) {
                        if (stage.$match) {
                            items = items.filter((item) => {
                                for (const [k, v] of Object.entries(stage.$match)) {
                                    if (item[k] !== v)
                                        return false;
                                }
                                return true;
                            });
                        }
                    }
                    return items;
                }
                catch (err) {
                    console.error(`Error in aggregate on ${this.colName}:`, err);
                    return [];
                }
            },
        };
    }
}
exports.PrismaCollection = PrismaCollection;
async function getDb() {
    return {
        collection: (name) => new PrismaCollection(name),
    };
}
exports.default = { prisma: exports.prisma, getDb, ObjectId };

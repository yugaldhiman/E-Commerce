require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose
    .connect(process.env.DATABASE_URL, {})
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB Connection Error:", err));

// Ensure Upload Folder Exists
const uploadFolder = path.join(__dirname, "upload/images");
if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
}

// Multer Storage
const storage = multer.diskStorage({
    destination: uploadFolder,
    filename: (req, file, cb) => {
        cb(
            null,
            `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
        );
    },
});
const upload = multer({ storage });

// Serve Images
app.use("/images", express.static(uploadFolder));

// Counter Schema for Auto-Increment ID
const counterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: -1 },
});
const Counter = mongoose.model("Counter", counterSchema);

// Product Schema
const productSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    new_price: { type: Number, required: true },
    old_price: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    available: { type: Boolean, default: true },
});
const Product = mongoose.model("Product", productSchema);

// API Routes
app.get("/", (req, res) => res.send("Express App is Running"));

// Upload Image API
app.post("/upload", upload.single("product"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: 0, message: "No file uploaded or wrong key" });
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;

    res.json({
        success: true,
        image_url: imageUrl,
    });
});


// Add Product API with Auto-Increment ID
app.post("/addproduct", async (req, res) => {
    try {
        const counter = await Counter.findByIdAndUpdate(
            {
                _id: "product_id",
            },
            {
                $inc: { seq: 1 },
            },
            {
                new: true,
                upsert: true,
            }
        );

        const newProduct = new Product({
            id: counter.seq,
            ...req.body,
        });

        await newProduct.save();
        res.json({ success: true, message: "Product added successfully" });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ success: false, message: "Error adding product" });
    }
});

// Remove Product API
app.post("/removeproduct", async (req, res) => {
    try {
        await Product.findOneAndDelete({ id: req.body.id });
        res.json({ success: true, message: "Product removed successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error removing product" });
    }
});

// Get All Products API
app.get("/allproducts", async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res
            .status(500)
            .json({ success: false, message: "Error fetching products" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

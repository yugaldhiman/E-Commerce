// // const port = 4000;
// const express = require('express');
// const app = express();
// const mongoose = require('mongoose');
// const jwt = require('jsonwebtoken');
// const multer = require('multer');
// const path = require('path');
// const cors = require('cors');
// const { type } = require('os');
// const { log } = require('console');

// app.use(express.json());
// require('dotenv').config();
// const PORT = process.env.PORT || 4000;
// app.use(cors());

// // Database connection with mongoDB
// // mongoose.connect('mongodb+srv://yugaldhiman14:14051999@cluster0.cmagfnz.mongodb.net/e-commerce');
// mongoose.connect(process.env.DATABASE_URL);

// //  Api creation
// app.get('/', (req, res) => {
//     res.send('Express App is Running')
// })

// //  Image Storage Ingine
// const storage = multer.diskStorage({
//     destination: './upload/images',
//     filename: (req, file, cb) => {
//         return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
//     }
// })
// const upload = multer({ storage: storage })

// //  creating Upload Endpoint for images
// app.use('/images', express.static(path.join(__dirname, 'upload/images')));


// app.post('/upload', upload.single('product'), (req, res) => {
//     // console.log("Received File:", req.file);
//     if (!req.file) {
//         return res.status(400).json({
//             success: 0,
//             message: "No file uploaded or wrong key"
//         });
//     }
//     res.json({
//         success: 1,
//         image_url: `http://localhost:${PORT}/images/${req.file.filename}`
//     })
// })

// //  shecma for Creating products
// const Product = mongoose.model('product', {
//     id: {
//         type: Number,
//         required: true,
//     },
//     name: {
//         type: String,
//         required: true,
//     },
//     image: {
//         type: String,
//         required: true,
//     },
//     category: {
//         type: String,
//         required: true,
//     },
//     new_price: {
//         type: Number,
//         required: true,
//     },
//     old_price: {
//         type: Number,
//         required: true,
//     },
//     date: {
//         type: Date,
//         default: Date.now,
//     },
//     available: {
//         type: Boolean,
//         default: true,
//     }
// })

// app.post('/addproduct', async (req, res) => {
//     let products = await Product.find({});
//     let id;
//     if (products.length > 0) {
//         let last_product_array = products.slice(-1);
//         let last_product = last_product_array[0]
//         id = last_product.id + 1;
//     }
//     else {
//         id = 1;
//     }
//     const product = new Product({
//         id: id,
//         name: req.body.name,
//         image: req.body.image,
//         category: req.body.category,
//         new_price: req.body.new_price,
//         old_price: req.body.old_price,
//     })
//     console.log(product);
//     await product.save();
//     console.log('Save');
//     res.json({
//         success: true,
//         name: req.body.name,
//     })
// })

// // Creating API For deleting Products
// app.post('/removeproduct', async (req, res) => {
//     await Product.findOneAndDelete({ id: req.body.id });
//     console.log('removed');
//     res.json({
//         success: true,
//         name: req.body.name,
//     })
// })


// //  Creating API for getting all products
// app.get('/allproducts', async (req, res) => {
//     let product = await Product.find({})
//     console.log('all Products fetched');
//     res.send(product);
// })


// app.listen(PORT, (error) => {
//     if (!error) {
//         console.log('server running on port =', PORT);
//     }
//     else {
//         console.log('Error :', error);

//     }
// })



require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 4000;

// Database connection
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected ✅'))
    .catch((err) => console.log('MongoDB Connection Error ❌', err));

app.get('/', (req, res) => {
    res.send('Express App is Running');
});

// Image Storage Engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage: storage });

app.use('/images', express.static(path.join(__dirname, 'upload/images')));

app.post('/upload', upload.single('product'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: 0, message: "No file uploaded" });
    }
    res.json({ success: 1, image_url: `http://localhost:${PORT}/images/${req.file.filename}` });
});

const Product = mongoose.model('Product', {
    name: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    new_price: { type: Number, required: true },
    old_price: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    available: { type: Boolean, default: true }
});

app.post('/addproduct', async (req, res) => {
    const product = new Product(req.body);
    await product.save();
    res.json({ success: true, name: req.body.name });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

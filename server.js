const express = require('express');
const path = require('path'); // Path module import ✅
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const MongoStore = require('connect-mongo');

// MongoDB URI
const uri = "mongodb+srv://mdashikurrahman50000:uel4Zcf5Rkj1DtU9@cluster0.dasvi.mongodb.net/Money-Tracker?retryWrites=true&w=majority";
const client = new MongoClient(uri);

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('public'));

async function start() {
    try {
        await client.connect();
        console.log("Connected to MongoDB!");

        const db = client.db("Money-Tracker");
        const transactionsCollection = db.collection("transactions");

        // 1️⃣ **Root Route**
        // Root Route: index.html ফাইল দেখানো হবে
        app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, 'index.html'));
        });



        // 2️⃣ **সকল ট্রানজেকশন দেখানোর API**
        app.get('/transactions', async (req, res) => {
            const transactions = await transactionsCollection.find({}).toArray();
            res.json(transactions);
        });



        // 3️⃣ **টাকা যোগ করার API**

        /* 👉 ব্যাকএন্ড (Node.js) - API তৈরি করে, যাতে ফ্রন্টএন্ড ডাটা পাঠাতে পারে।
           👉 ফ্রন্টএন্ড (HTML, JS) - fetch API দিয়ে ব্যাকএন্ডে ডাটা পাঠায়।
           👉 ব্যাকএন্ড (Node.js, Express.js) - সেই ডাটা ডাটাবেজে (MongoDB, MySQL) সংরক্ষণ করে। */
        
        app.post('/add-money', async (req, res) => {
            // add-money নামে API route তৈরি করা হয়েছে।
            const { text, amount } = req.body;
            // ফ্রন্টএন্ড fetch API দিয়ে text এবং amount পাঠিয়েছে।
            if (!text || !amount) return res.status(400).json({ message: "Invalid input" });
            await transactionsCollection.insertOne({ text, amount: parseFloat(amount), type: "income" });
            // transactionsCollection এবং insertOne দিয়ে MongoDB এ ডাটা স্টোর করা হয়েছে। "transactions" হল কালেকশনের নাম।
            // text, amount এবং type হল ডাটা ফিল্ড।
            res.json({ message: "Money added successfully" });
        });

        // 4️⃣ **টাকা কমানোর API**
        app.post('/minus-money', async (req, res) => {
            const { text, amount } = req.body;
            if (!text || !amount) return res.status(400).json({ message: "Invalid input" });

            await transactionsCollection.insertOne({ text, amount: parseFloat(amount), type: "expense" });
            res.json({ message: "Money deducted successfully" });
        });

        // 5️⃣ **সকল ডাটা মুছে ফেলার API**
        app.delete('/clear-all', async (req, res) => {
            await transactionsCollection.deleteMany({});
            res.json({ message: "All transactions cleared!" });
        });

        // Server Start
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });

    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

// Start the server
start();

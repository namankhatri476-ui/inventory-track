const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

/* ===============================
   DATABASE CONNECTION
================================ */
mongoose.connect("mongodb://localhost:27017/PrinterTracker")
    .then(() => console.log("✅ Connected to PrinterTracker DB"))
    .catch(err => console.log("❌ Mongo Error:", err));

/* ===============================
   SCHEMAS
================================ */

// MODEL
const modelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: String,
    description: String
}, { timestamps: true });

// SERIAL
const serialSchema = new mongoose.Schema({
    modelId: { type: mongoose.Schema.Types.ObjectId, ref: "Model" },
    value: { type: String, unique: true },
    status: { type: String, default: "Available" }
}, { timestamps: true });

// DISPATCH
const dispatchSchema = new mongoose.Schema({
    serialNumberId: { type: mongoose.Schema.Types.ObjectId, ref: "Serial" },
    customerName: String,
    shippingAddress: String,
    dispatchedBy: String,
    dispatchDate: { type: Date, default: Date.now }
});

const Model = mongoose.model("Model", modelSchema);
const Serial = mongoose.model("Serial", serialSchema);
const Dispatch = mongoose.model("Dispatch", dispatchSchema);

/* ===============================
   ROUTES
================================ */

// ================= MODELS =================

// GET all models + stock count
app.get("/api/models", async (req, res) => {
    const models = await Model.find();

    const modelsWithStock = await Promise.all(
        models.map(async (m) => {
            const stockCount = await Serial.countDocuments({
                modelId: m._id,
                status: "Available"
            });
            return { ...m.toObject(), stockCount };
        })
    );

    res.json(modelsWithStock);
});

// ADD model
app.post("/api/models", async (req, res) => {
    const model = await Model.create(req.body);
    res.json(model);
});

// ================= SERIALS =================

// GET serials
app.get("/api/serials", async (req, res) => {
    const serials = await Serial.find();
    res.json(serials);
});

// ADD serial
app.post("/api/serials", async (req, res) => {
    try {
        const serial = await Serial.create({
            modelId: req.body.modelId,
            value: req.body.value
        });
        res.json(serial);
    } catch (err) {
        res.status(400).json({ message: "Serial already exists" });
    }
});

// ================= DISPATCH =================

// GET dispatches
app.get("/api/dispatches", async (req, res) => {
    const dispatches = await Dispatch.find();
    res.json(dispatches);
});

// ADD dispatch
app.post("/api/dispatches", async (req, res) => {

    const { serialId, customer, address, user } = req.body;

    // Update serial status
    await Serial.findByIdAndUpdate(serialId, { status: "Dispatched" });

    const dispatch = await Dispatch.create({
        serialNumberId: serialId,
        customerName: customer,
        shippingAddress: address,
        dispatchedBy: user
    });

    res.json(dispatch);
});

/* ===============================
   SERVER
================================ */

app.listen(5000, () => {
    console.log("🚀 API running on http://localhost:5000");
});

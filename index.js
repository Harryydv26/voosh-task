const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { Schema } = mongoose;
var cors = require("cors");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
// const port = process.env.PORT || 3000;
const secretKey = "your-secret-key"; // You should keep this secure in production

// MongoDB configuration
mongoose.connect("mongodb+srv://user:user@cluster0.fikcu7r.mongodb.net/voosh", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// User schema
const UserSchema = new Schema({
  name: { type: String, required: true },
  phone_number: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", UserSchema);

// Order schema
const OrderSchema = new Schema({
  user_id: { type: mongoose.Types.ObjectId, required: true },
  sub_total: { type: Number, required: true },
  phone_number: { type: String, required: true },
});

const Order = mongoose.model("Order", OrderSchema);

// Middleware to check if the request has a valid JWT token
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Authorization token missing" });
  }
  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid authorization token" });
  }
};

// Register a new user
app.post("/add-user", async (req, res) => {
  console.log("signup");
  const { name, phone_number, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    name,
    phone_number,
    password: hashedPassword,
  });
  try {
    const resp = await user.save();
    res.json({
      message: "User created successfully",
      user_id: resp._doc._id,
      name: resp._doc.name,
      phoneNumber: resp._doc.phone_number,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create user" });
  }
});

// Login an existing user
app.post("/login-user", async (req, res) => {
  console.log("login");

  const { phone_number, password } = req.body;
  try {
    const user = await User.findOne({ phone_number });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid phone number or password" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ message: "Invalid phone number or password" });
    }
    const token = jwt.sign({ user_id: user._id }, secretKey);
    res.status(200).json({
      token: token,
      msg: "user authentication successful",
      user: {
        user_id: user._doc._id,
        name: user._doc.name,
        phoneNumber: user._doc.phone_number,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to login user" });
  }
});
app.get("/", (req, res) => {
  res.send("hello");
});
app.post("/add-order", async (req, res) => {
  console.log("add order");

  const { user_id, sub_total, phone_number } = req.body;
  try {
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const order = new Order({
      user_id,
      sub_total,
      phone_number,
    });
    const result = await order.save();
    res.json({order_id : result._doc._id,
    sub_total:sub_total});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create order" });
  }
});

app.get("/get-order", async (req, res) => {
  console.log("get order");

  const { user_id } = req.query;
  try {
    const orders = await Order.find({"user_id":user_id});
    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }
    res.json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to retrieve orders" });
  }
});

app.listen(8000, () => {
  console.log("Server Is up and running");
});

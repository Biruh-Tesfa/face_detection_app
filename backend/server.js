require("dotenv").config();

const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const knex = require("knex");

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required.");
}

const db = knex({
  client: "pg",
  connection: process.env.DATABASE_URL,
});

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
  })
);
app.use(express.json());

app.get("/health", async (_req, res) => {
  try {
    await db.raw("SELECT 1");
    res.status(200).json({ status: "ok" });
  } catch {
    res.status(503).json({ status: "database unavailable" });
  }
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await db.transaction(async (trx) => {
      const hash = await bcrypt.hash(password, 10);

      const [login] = await trx("login")
        .insert({ email, hash })
        .returning("email");

      const [createdUser] = await trx("users")
        .insert({
          name,
          email: login.email,
          joined: new Date(),
        })
        .returning("*");

      return createdUser;
    });

    res.json(user);
  } catch {
    res.status(400).json("unable to register");
  }
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [login] = await db("login")
      .select("email", "hash")
      .where("email", email);

    if (!login || !(await bcrypt.compare(password, login.hash))) {
      return res.status(400).json("wrong credentials");
    }

    const [user] = await db("users").select("*").where("email", email);
    res.json(user);
  } catch {
    res.status(400).json("wrong credentials");
  }
});

app.get("/profile/:id", async (req, res) => {
  try {
    const [user] = await db("users").select("*").where("id", req.params.id);

    if (!user) return res.status(404).json("no such user");
    res.json(user);
  } catch {
    res.status(400).json("unable to get user");
  }
});

app.put("/image", async (req, res) => {
  try {
    const [user] = await db("users")
      .where("id", req.body.id)
      .increment("entrie", 1)
      .returning("entrie");

    if (!user) return res.status(404).json("no such user");
    res.json(user.entrie);
  } catch {
    res.status(400).json("no such user");
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`API running on port ${port}`);
});
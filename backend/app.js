const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { MongoClient } = require("mongodb");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const mongoUrl = "mongodb://mongo:27017";
const client = new MongoClient(mongoUrl);
let messagesCollection;

app.use(express.static("/app/frontend")); // serve static frontend

io.on("connection", (socket) => {
  console.log("🔌 New client connected");

  socket.on("message", async (msg) => {
    console.log("📩 Message received:", msg);
    await messagesCollection.insertOne({ msg });
    io.emit("message", msg); // broadcast to all
  });
});

async function start() {
  await client.connect();
  messagesCollection = client.db("chatapp").collection("messages");
  server.listen(3000, () => console.log("🚀 Server running on port 3000"));
}

start();

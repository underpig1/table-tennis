const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const child_process = require("child_process");
const path = require("path");
const { key } = require("./public_key.js");
const { networkInterfaces } = require("os");

const root = path.resolve(__dirname, "..");
app.use(express.static(root));

var ipv4 = networkInterfaces()["Wi-Fi"].filter((n) => n.family == "IPv4")[0].address;
const code = key.apply(ipv4, key.encode);
console.log(code);

app.get("/", function (req, res, next) {
    res.sendFile("/views/index.html", { root: root });
});

io.on("connection", (socket) => {
    console.log("user connected");
    socket.emit("join-code", code);
    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
    socket.on("orientation", () => null);
});

server.listen(8000, "0.0.0.0", () => {
    console.log("listening on *:8000");
    child_process.exec(`explorer "http://${ipv4}:8000"`);
});
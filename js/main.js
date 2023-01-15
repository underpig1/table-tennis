const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const child_process = require("child_process");
const path = require("path");

const root = path.resolve(__dirname, "..");
app.use(express.static(root));

app.get("/", function (req, res, next) {
    res.sendFile("/views/controller.html", { root: root });
});

io.on("connection", (socket) => {
    console.log("user connected");
    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});

server.listen(8000, "0.0.0.0", () => {
    console.log("listening on *:8000");
    child_process.exec('explorer "http://%COMPUTERNAME%:8000"');
});
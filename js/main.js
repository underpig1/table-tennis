const express = require("express");
const app = express();
const https = require("https");
const { Server } = require("socket.io");
const child_process = require("child_process");
const path = require("path");
const { key } = require("./public_key.js");
const { networkInterfaces } = require("os");
const fs = require("fs");

const signed_key = fs.readFileSync(__dirname + "/../certs/selfsigned.key");
const signed_cert = fs.readFileSync(__dirname + "/../certs/selfsigned.crt");

const server = https.createServer({ key: signed_key, cert: signed_cert }, app);
const io = new Server(server);

const root = path.resolve(__dirname, "..");
app.use(express.static(root));

var ipv4 = networkInterfaces()["Wi-Fi"].filter((n) => n.family == "IPv4")[0].address;
const code = key.apply(ipv4, key.encode);
console.log(code);

app.get("/", function (req, res, next) {
    res.sendFile("/views/index.html", { root: root });
});

var clients = [];

const sfsearch = (socket) => clients.findIndex((c) => c.socket == socket);
const ssearch = (socket) => clients.filter((c) => c.socket == socket)[0];
const scale_vec = (vec, scalar) => {
    return { x: vec.x*scalar, y: vec.y*scalar, z: vec.z*scalar };
}
const add_vec = (vec, operand) => {
    return { x: vec.x + operand.x, y: vec.y + operand.y, z: vec.z + operand.z };
}

io.on("connection", (socket) => {
    socket.emit("join-code", code);
    socket.emit("request-role");
    socket.on("access-role", (role) => clients.push({ id: clients.length, socket: socket, role: role, data: {} }));
    socket.on("disconnect", () => clients.splice(sfsearch(socket), 1));
    socket.on("motion", (e) => {
        var client = ssearch(socket);

        if (client.data.hasOwnProperty("acceleration")) {
            client.data.previous.acceleration = JSON.parse(JSON.stringify(client.data.acceleration));
            client.data.previous.velocity = JSON.parse(JSON.stringify(client.data.velocity));
            client.data.previous.position = JSON.parse(JSON.stringify(client.data.position));
        }
        
        client.data.acceleration = e.acceleration;
        client.data.interval = e.interval*1000;

        if (client.data.hasOwnProperty("previous")) {
            client.data.velocity = scale_vec(client.data.acceleration, client.data.interval);
            client.data.position = add_vec(client.data.previous.position, add_vec(scale_vec(client.data.previous.velocity, client.data.interval), scale_vec(client.data.acceleration, 0.5*(client.data.interval**2))));
        }

        // s=ut+1/2at^2
    });
    socket.on("orientation", (e) => {
        var client = ssearch(socket);
        client.data.orientation = { alpha: e.alpha, beta: e.beta, gamma: e.gamma };
        client.data.rotation = { x: e.beta, y: e.gamma, z: e.alpha };
        // alpha: z/yaw, beta: x/pitch, gamma: y/roll
    });
});

server.listen(8000, "0.0.0.0", () => {
    console.log("listening on *:8000");
    child_process.exec(`explorer "https://underpig1.github.io/table-tennis/views/index.html?ip=${ipv4}"`);
});
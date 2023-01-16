const socket = io();

const join_code = document.getElementById("join-code");

socket.on("join-code", (code) => join_code.innerText = code);
socket.on("request-role", () => socket.emit("access-role", "host"));
socket.on("location", (c) => console.log(c));
socket.on("rotation", (c) => console.log(c));
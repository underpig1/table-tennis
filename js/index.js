const socket = io();

const join_code = document.getElementById("join-code");

socket.on("join-code", (code) => join_code.innerText = code);
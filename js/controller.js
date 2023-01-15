var socket;

const refrate = 1 / 60;

function join() {
    const code = prompt("Enter join code:");
    socket = io(`https://${key.kmap(code, key.decode)}:8000`);
}

function request_perms() {
    DeviceMotionEvent.requestPermission().then(response => {
        if (response == "granted") {
            window.addEventListener("deviceorientation", (e) => socket.emit("orientation", e));
            window.addEventListener("devicemotion", (e) => socket.emit("motion", e));
        }
    });
}

request_perms();
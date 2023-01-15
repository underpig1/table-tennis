var socket;

const refrate = 1 / 60;

function join(p = "Enter join code:") {
    const code = prompt(p);
    try {
        if (!key.validate(code)) throw new Error("Invalid key");
        else socket = io(`https://${key.apply(code, key.decode)}:8000`);
    }
    catch {
        join("Invalid join code. Try again:");
    }
}

join();

function request_perms() {
    DeviceMotionEvent.requestPermission().then(response => {
        if (response == "granted") {
            window.addEventListener("deviceorientation", (e) => socket.emit("orientation", e));
            window.addEventListener("devicemotion", (e) => socket.emit("motion", e));
        }
    });
}
var socket;

function join(p = "Enter join code:") {
    const code = prompt(p);
    if (code != null) {
        try {
            if (!key.validate(code)) throw "Invalid key";
            else {
                socket = io(`http://${key.apply(code, key.decode)}:8000`);
                if (!socket.connected) throw "No connection";
            }
            connect();
        }
        catch (error) {
            join("Invalid join code. Make sure you're connected to the same wifi network and try again:");
        }
    }
}

join();

function request_perms() {
    DeviceMotionEvent.requestPermission().then(response => {
        if (response == "granted") {
            window.addEventListener("deviceorientation", (e) => {
                if (socket) socket.emit("orientation", e);
            });
            window.addEventListener("devicemotion", (e) => {
                if (socket) socket.emit("motion", e);
            });
        }
    });
}

function connect() {
    socket.on("request-role", () => socket.emit("access-role", "controller"));
}
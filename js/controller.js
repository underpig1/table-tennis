var socket;

const refrate = 1 / 60;

function join(p = "Enter join code:") {
    const code = prompt(p);
    if (code != null) {
        try {
            if (!key.validate(code)) throw "Invalid key";
            else {
                socket = io(`http://${key.apply(code, key.decode)}:8000`);
                if (!socket.connected) throw "No connection";
            }
            alert("Connected!");
        }
        catch (error) {
            alert(error.message);
            join("Invalid join code. Make sure you're connected to the same wifi network and try again:");
        }
    }
}

window.addEventListener("error", (e) => alert(`${e.type}: ${e.message}`));

join();

function request_perms() {
    DeviceMotionEvent.requestPermission().then(response => {
        if (response == "granted") {
            window.addEventListener("deviceorientation", (e) => socket.emit("orientation", e));
            window.addEventListener("devicemotion", (e) => socket.emit("motion", e));
        }
    });
}
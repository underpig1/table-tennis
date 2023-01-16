

function request_perms() {
    DeviceMotionEvent.requestPermission().then(response => {
        if (response == "granted") {
            window.addEventListener("deviceorientation", (e) => socket.emit("orientation", e));
            window.addEventListener("devicemotion", (e) => socket.emit("motion", e));
        }
    });
}
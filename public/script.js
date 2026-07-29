//verbinden met Socket.IO server
const socket = io();

//ontvang live MQTT data
socket.on("telemetry", (data) => {
    console.log("Nieuwe data", data);

    document.getElementById("status").innerHTML = data.status;
    document.getElementById("gas").innerHTML = data.gas;
    document.getElementById("bar").value = data.gas;
    document.getElementById("pot").innerHTML = data.potVal;
    document.getElementById("angle").innerHTML = data.angle + "°";
    document.getElementById("pulse").innerHTML = data.pulse + " us";
    document.getElementById("vooruit").innerHTML = data.vooruit ? "Aan" : "Uit";
    document.getElementById("achteruit").innerHTML = data.achteruit ? "Aan" : "Uit";
});

//Verbinding status
socket.on("connect", () => {
    console.log("Verbonden met dashboard server");
});

socket.on("disconnect", () => {
    console.log("Verbinding met dashboard server verbroken");
});
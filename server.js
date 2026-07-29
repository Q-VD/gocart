require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mqtt = require("mqtt");


const app = express();

const server = http.createServer(app);

const io = new Server(server);


// Website bestanden
app.use(express.static("public"));


// =====================
// MQTT VERBINDING
// =====================

const mqttClient = mqtt.connect(
    process.env.MQTT_URL,
    {
        username: process.env.MQTT_USER,
        password: process.env.MQTT_PASSWORD
    }
);

mqttClient.on("connect", () => {

    console.log("MQTT verbonden!");

    mqttClient.subscribe(
        "gocart/telemetry",
        (error) => {

            if(error){
                console.log("Subscribe fout:", error);
            }
            else{
                console.log("Luisteren naar gocart/telemetry");
            }

        }
    );

});

// MQTT bericht ontvangen

mqttClient.on("message", (topic, message) => {

    const data = JSON.parse(
        message.toString()
    );


    console.log(data);


    // stuur data naar website
    io.emit(
        "telemetry",
        data
    );

});

mqttClient.on("error", (error) => {
    console.log("MQTT fout:", error.message);
});

mqttClient.on("offline", () => {
    console.log("MQTT offline");
});

mqttClient.on("reconnect", () => {
    console.log("MQTT opnieuw verbinden...");
});

// =====================
// SERVER START
// =====================

const PORT = process.env.PORT || 3000;


server.listen(PORT, "0.0.0.0", () => {
    console.log(`Website draait op poort ${PORT}`);
});
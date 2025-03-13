import React, { useEffect, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import mqtt from "mqtt";

export default function MqttPublisher() {
    const [client, setClient] = useState(null);
    const [message, setMessage] = useState("");
    const [subscribed, setSubscribed] = useState(false);
    const [generatedText, setGeneratedText] = useState("");

    const [error, setError] = useState(null);
    const [prompt, setPrompt] = useState("");

    const generateText = async () => {
        try {
            const genAI = new GoogleGenerativeAI("AIzaSyBKwJeu9X-EHPFrdMJ_iXY7PSKOxQ7dEoA");
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            // const prompt = "";
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = await response.text();
            setGeneratedText(text);
        } catch (err) {
            setError(`Error generating text: ${err.message}`);
        }
    };

    useEffect(() => {
        const mqttClient = mqtt.connect("ws://localhost:1884");
        setClient(mqttClient);
        mqttClient.on("connect", () => {
            console.log("Connected to MQTT broker");
            mqttClient.subscribe("test_sensor_data", (err) => {
                if (err) {
                    console.error("Subscribe error:", err);
                } else {
                    setSubscribed(true);
                }
            });
        });
        mqttClient.on("message", (topic, payload) => {
            if (topic === "test_sensor_data") {
                setMessage(payload.toString());
            }
        });
        mqttClient.on("error", (err) => {
            console.error("Connection error: ", err);
            mqttClient.end();
        });
        mqttClient.on("reconnect", () => {
            console.log("Reconnecting...");
        });
        mqttClient.on("offline", () => {
            console.log("Client is offline");
        });
        return () => {
            if (mqttClient) {
                mqttClient.end();
            }
        };
    }, []);

    const publishMessage = () => {
        if (client) {
            const topic = "test_sensor_data";
            const payload = "Hello from React!";
            client.publish(topic, payload, { qos: 0, retain: false }, (error) => {
                if (error) {
                    console.error("Publish error:", error);
                } else {
                    console.log("Message published:", payload);
                }
            });
        } else {
            console.log("Client not connected");
        }
    };

    return (
        <>
            <div
                style={{
                    alignItems: "center",
                    justifyContent: "center",
                    display: "flex",
                    alignContent: "center",
                    marginTop: "50px",
                }}
            >
                {/* <div>MQTT Publisher</div> */}
                {/* <button onClick={publishMessage}>Publish MQTT Message</button> */}
                <input onChange={(e) => setPrompt(e.target.value)}></input>
                <button onClick={generateText}>Generate Text</button>
                {/* 
                {error && <p style={{ color: "red" }}>{error}</p>}
                {generatedText && <p>{generatedText}</p>} */}
            </div>{" "}
            <div
                style={{
                    alignItems: "center",
                    justifyContent: "center",
                    display: "flex",
                    alignContent: "center",
                    marginTop: "50px",
                }}
            >
                <strong>generatedText:</strong> {generatedText}
            </div>
        </>
    );
}

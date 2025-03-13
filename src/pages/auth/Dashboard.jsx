import React, { useEffect, useState } from "react";
import { XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Area, AreaChart } from "recharts";
import axios from "axios";
import { Box, Grid, Typography } from "@mui/material";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

export default function Dashboard() {
    const [data, setData] = useState([]);
    const [temp, setTemp] = useState(0);
    const [lux, setLux] = useState(0);
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

    useEffect(() => {
        fetchTemperature(); // Initial fetch
        const interval = setInterval(() => {
            fetchTemperature(); // Fetch temperature from weather API every hour
        }, 3600000); // 3600000 milliseconds = 1 hour

        return () => clearInterval(interval);
    }, []);

    const fetchTemperature = async () => {
        try {
            const apiKey = "a5a3648c47396213a2b0ba9cfe159914";
            const lat = "15.117";
            const lon = "104.903";
            const res = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
            );
            setTemp(res.data.main.temp.toFixed(1));
        } catch (error) {
            console.error("Error fetching temperature data", error);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setLux((Math.random() * 500 + 300).toFixed(1));
            setCurrentTime(new Date().toLocaleTimeString());
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await axios.get("http://localhost:5001/sensor-data/api/power_meter");
                const transformedData = [];
                for (let i = 0; i < res.data.length; i++) {
                    const item = res.data[i];
                    const timestamp = convertTimestamp(item.timestamp); // Convert timestamp to formatted date
                    if (i > 0) {
                        const prevItem = res.data[i - 1];
                        const prevTimestamp = new Date(prevItem.timestamp * 1000);
                        const currTimestamp = new Date(item.timestamp * 1000);
                        const hoursDiff = (currTimestamp - prevTimestamp) / (1000 * 60 * 60); // Convert ms to hours
                        const energyWh = prevItem.power_watts * hoursDiff;
                        transformedData.push({
                            ...item,
                            timestamp,
                            energyWh: energyWh / 1000,
                        });
                    } else {
                        transformedData.push({
                            ...item,
                            timestamp,
                            energyWh: 0,
                        });
                    }
                }
                setData(transformedData);
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };

        const interval = setInterval(() => {
            getData();
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const convertTimestamp = (timestamp) => {
        if (typeof timestamp !== "number") {
            return null;
        }
        const date = new Date(timestamp);

        const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}/${date.getFullYear()} ${date.getHours().toString().padStart(2, "0")}:${date
            .getMinutes()
            .toString()
            .padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;

        return formattedDate;
    };

    const cardStyle = (size) => ({
        overflow: "hidden",
        height: size ? size : "auto",
        padding: "20px",
        background: "white",
        borderRadius: "5px",
        boxShadow: `rgba(149, 157, 165, 0.2) 0px 8px 24px;`,
    });

    const renderTooltipContent = (tooltipData) => {
        if (tooltipData && tooltipData.active && tooltipData.payload && tooltipData.payload.length) {
            const { timestamp, power_watts } = tooltipData.payload[0].payload;
            const dateString = timestamp;
            const dateParts = dateString.split(" ");
            const date = dateParts[0].split("/");
            const time = dateParts[1];
            const dateObject = new Date(
                date[2],
                date[1] - 1,
                date[0],
                time.split(":")[0],
                time.split(":")[1],
                time.split(":")[2]
            );
            return (
                <div
                    className="custom-tooltip"
                    style={{ backgroundColor: "#fff", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
                >
                    <p>{`Time: ${dateObject.toLocaleTimeString("en-GB", { hour12: false })}`}</p>
                    <p>{`Power (watt): ${power_watts}`}</p>
                </div>
            );
        }
        return null;
    };
    const popupSize = "110px";

    const calculateEnergyKWh = (data) => {
        return data.reduce((acc, item, index) => {
            if (index === 0) return acc;
            const prevItem = data[index - 1];
            const prevTimestamp = new Date(prevItem.timestamp).getTime();
            const currTimestamp = new Date(item.timestamp).getTime();
            if (isNaN(prevTimestamp) || isNaN(currTimestamp)) {
                return acc;
            }
            const hoursDiff = (currTimestamp - prevTimestamp) / (1000 * 60 * 60); // Convert ms to hours
            const energyWh = prevItem.power_watts * hoursDiff;
            if (isNaN(energyWh)) {
                return acc;
            }
            return acc + energyWh / 1000;
        }, 0);
    };

    const totalEnergyKWh = data && calculateEnergyKWh(data);

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
                <Box sx={cardStyle(popupSize)}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <ElectricBoltIcon sx={{ marginRight: 1 }} color="warning" /> Total Energy Consumption
                    </Box>
                    <Typography variant="h5" align="center" mt={2} sx={{ color: "orange" }}>
                        {totalEnergyKWh.toFixed(4)} kWh
                    </Typography>
                </Box>
            </Grid>
            <Grid item xs={12} md={3}>
                <Box sx={cardStyle(popupSize)}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <ThermostatIcon sx={{ marginRight: 1 }} color="error" /> Temperature
                    </Box>
                    <Typography variant="h5" align="center" mt={2} sx={{ color: "red" }}>
                        {temp} °C
                    </Typography>
                </Box>
            </Grid>
            <Grid item xs={12} md={3}>
                <Box sx={cardStyle(popupSize)}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <WbSunnyIcon sx={{ marginRight: 1 }} color="primary" /> Room Lux
                    </Box>
                    <Typography variant="h5" align="center" mt={2} sx={{ color: "#1976D2" }}>
                        {lux} lx
                    </Typography>
                </Box>
            </Grid>
            <Grid item xs={12} md={3}>
                <Box sx={cardStyle(popupSize)}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <AccessTimeIcon sx={{ marginRight: 1 }} color="secondary" /> Current Time
                    </Box>
                    <Typography variant="h5" align="center" mt={2} sx={{ color: "#9C27B0" }}>
                        {currentTime}
                    </Typography>
                </Box>
            </Grid>
            <Grid item xs={12}>
                <Box sx={cardStyle()}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box>
                            <Box>Energy Consumption (watt)</Box>
                            <Box sx={{ fontSize: "12px", color: "gray", marginBottom: "30px" }}>
                                Total energy usage displayed in watt (watt)
                            </Box>
                        </Box>
                    </Box>
                    {data && (
                        <ResponsiveContainer height={400}>
                            <AreaChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="timestamp"
                                    tick={{ fontSize: 12 }}
                                    tickFormatter={(timestamp = "") => {
                                        const dateString = timestamp;
                                        const dateParts = dateString.split(" ");
                                        const date = dateParts[0].split("/");
                                        const time = dateParts[1];
                                        const dateObject = new Date(
                                            date[2],
                                            date[1] - 1,
                                            date[0],
                                            time.split(":")[0],
                                            time.split(":")[1],
                                            time.split(":")[2]
                                        );
                                        return dateObject.toLocaleTimeString("en-GB", { hour12: false });
                                    }}
                                />
                                <YAxis
                                    label={{ value: "(watt)", angle: -90, dx: -10, fontSize: 12 }}
                                    tick={{ fontSize: 12 }}
                                />
                                <Tooltip content={renderTooltipContent} />
                                <Area
                                    type="monotone"
                                    dataKey="power_watts"
                                    stroke="grey"
                                    fill="green"
                                    fillOpacity={0.5}
                                />{" "}
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </Box>
            </Grid>
            {/* <Temp /> */}
        </Grid>
    );
}

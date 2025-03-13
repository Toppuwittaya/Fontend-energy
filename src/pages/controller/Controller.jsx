import { useEffect, useState } from "react";
import { Typography, Box, Grid, Switch, TextField, IconButton, Modal, Button } from "@mui/material";
import LightbulbOutlinedIcon from "@mui/icons-material/Lightbulb";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";
import HomeFloorPlan from "../HomeFloorPlan";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
function ControlRegisters({ registerValues, setRegisterValues }) {
    // const [masterSwitch, setMasterSwitch] = useState(false);

    const [openModal, setOpenModal] = useState(false);
    const [currentRegisterIndex, setCurrentRegisterIndex] = useState(null);
    const [data, setData] = useState("");
    const [timeInputs, setTimeInputs] = useState([{ start: "", end: "" }]);
    const [mode, setMode] = useState("manual");

    const getData = async () => {
        try {
            const response = await axios.get("http://localhost:5001/coil-actions/all-coil-actions");
            setData(response.data);
        } catch (error) {
            console.error("Error writing register:", error);
        }
    };

    // const writeRegister = async (address, values) => {
    //     try {
    //         const response = await axios.post("http://192.168.126.33:5001/coil-actions/write-registers", {
    //             address: 0,
    //             values,
    //         });
    //         console.log(response.data.message);
    //     } catch (error) {
    //         console.error("Error writing register:", error);
    //     }
    // };

    const handleToggleData = async (index) => {
        try {
            const response = await axios.put(`http://localhost:5001/coil-actions/update-coil-action/${index}`, {
                action: !data[index].action,
            });
            getData();
            console.log(response.data.message);
        } catch (error) {
            console.error("Error writing register:", error);
        }
    };

    // const handleToggle = (index) => {
    //     const updatedValues = [...registerValues];
    //     updatedValues[index] = updatedValues[index] === 0 ? 1 : 0;
    //     setRegisterValues(updatedValues);
    //     writeRegister(0, updatedValues);
    // };

    // const handleMasterSwitch = (event) => {
    //     const newState = event.target.checked;
    //     setMasterSwitch(newState);
    //     const newRegisterValues = registerValues.map(() => (newState ? 1 : 0));
    //     setRegisterValues(newRegisterValues);
    //     newRegisterValues.forEach((value, index) => writeRegister(index, value));
    // };

    const handleOpenModal = (index) => {
        setTimeInputs(data[index].scheduledDates[0] ? data[index].scheduledDates : [{ start: "", end: "" }]);
        setCurrentRegisterIndex(index);
        if (data) {
            setMode(data[index].mode);
        }

        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    // const handleRegisterValueChange = (event) => {
    //     const newValue = parseInt(event.target.value, 10) || 0;
    //     writeRegister(currentRegisterIndex, newValue);
    //     setOpenModal(false);
    // };

    const handleAddTimeInput = () => {
        setTimeInputs([...timeInputs, { start: "", end: "" }]);
    };

    const handleRemoveTimeInput = (index) => {
        const newTimeInputs = timeInputs.filter((_, i) => i !== index);
        setTimeInputs(newTimeInputs);
    };

    const handleTimeInputChange = (index, field, value) => {
        const newTimeInputs = [...timeInputs];
        const date = new Date();
        const [hours, minutes] = value.split(":");
        date.setHours(hours);
        date.setMinutes(minutes);
        newTimeInputs[index][field] = date.toISOString();
        setTimeInputs(newTimeInputs);
    };

    const rooms = data
        ? [
              { x: 20, y: 100, width: 200, height: 100, label: "A", light: !!data[0].action },
              { x: 220, y: 100, width: 100, height: 100, label: "B", light: !!data[1].action },
              { x: 320, y: 100, width: 120, height: 100, label: "C", light: !!data[2].action },
              { x: 320, y: 0, width: 120, height: 100, label: "D", light: !!data[3].action },
              { x: 440, y: 100, width: 120, height: 200, label: "E", light: !!data[4].action },
          ]
        : [];

    const onSubmit = async (event) => {
        event.preventDefault();
        const body = {
            mode: mode,
            scheduledDates: timeInputs,
            action: data[currentRegisterIndex].action,
        };

        try {
            const res = await axios.put(
                `http://localhost:5001/coil-actions/update-coil-action/${currentRegisterIndex}`,
                body
            );
            console.log(res);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getData();
        const interval = setInterval(getData, 2000);
        return () => clearInterval(interval);
    }, []);

    console.log(timeInputs);

    return (
        <Grid container spacing={3} p={2}>
            <Grid item xs={12} md={4} align="center">
                <Box
                    sx={{
                        border: "1px solid lightgrey",
                        p: 3,
                        maxWidth: "400px",
                        borderRadius: "10px",
                        boxShadow: `rgba(149, 157, 165, 0.2) 0px 8px 24px;`,
                        background: "rgba(255,255,255,0.9)",
                    }}
                >
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="h6" gutterBottom>
                            Control Panel
                        </Typography>
                        {/* <Switch
                            checked={masterSwitch}
                            onChange={handleMasterSwitch}
                            color="primary"
                            inputProps={{ "aria-label": "Master switch" }}
                        /> */}
                    </Box>
                    {data.length > 0 ? (
                        <Box>
                            {data.map((value, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        mb: 2,
                                    }}
                                >
                                    <Typography sx={{ mr: 2 }}>
                                        <LightbulbOutlinedIcon
                                            color={value ? "warning" : "disabled"}
                                            sx={{ marginRight: 2 }}
                                        />
                                        {`วงจรแสงสว่างห้อง ${getLetter(index + 1)}`}
                                    </Typography>
                                    {value.mode === "manual" ? (
                                        <Switch
                                            checked={!!value.action}
                                            onChange={() => handleToggleData(index)}
                                            color="primary"
                                        />
                                    ) : (
                                        <Box
                                            sx={{
                                                border: "1px solid green",
                                                borderRadius: "50px",
                                                padding: "3px 6px",
                                                background: "#65a87b",
                                                color: "white",
                                            }}
                                        >
                                            Time mode
                                        </Box>
                                    )}
                                    <IconButton onClick={() => handleOpenModal(index)}>
                                        <MoreVertIcon />
                                    </IconButton>
                                </Box>
                            ))}
                        </Box>
                    ) : (
                        <>ไม่พบการเชื่อมต่อ</>
                    )}
                </Box>
            </Grid>
            <Grid item xs={12} md={8}>
                <Box
                    sx={{
                        bgcolor: "white",
                        display: "flex",
                        justifyContent: "center",
                        borderRadius: "10px",
                        boxShadow: `rgba(149, 157, 165, 0.2) 0px 8px 24px;`,
                        background: "rgba(255,255,255,0.9)",
                        border: "1px solid lightgrey",
                        p: 2,
                    }}
                >
                    <Box sx={{ display: "block" }}>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                marginBottom: 60,
                            }}
                        >
                            Floor Plan Home I/O
                        </div>
                        <Box>
                            <HomeFloorPlan rooms={rooms} />
                        </Box>
                    </Box>
                </Box>
            </Grid>

            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
                sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
            >
                <Box
                    sx={{
                        width: "600px",
                        bgcolor: "white",
                        borderRadius: "8px",
                        p: 3,
                        boxShadow: 24,
                    }}
                >
                    <form onSubmit={onSubmit}>
                        <Box sx={{ display: "flex ", justifyContent: "space-between" }}>
                            <Typography id="modal-title" variant="h6" component="h3" gutterBottom mb={3}>
                                Set Time
                            </Typography>
                            <Switch
                                checked={mode === "date"}
                                onChange={() => setMode(mode === "date" ? "manual" : "date")}
                                color="primary"
                                inputProps={{ "aria-label": "Master switch" }}
                            />
                        </Box>

                        {timeInputs.map((input, index) => (
                            <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                <TextField
                                    label="Start"
                                    type="time"
                                    fullWidth
                                    value={
                                        input.start
                                            ? new Date(input.start).toLocaleTimeString("en-GB", {
                                                  hour: "2-digit",
                                                  minute: "2-digit",
                                              })
                                            : ""
                                    }
                                    onChange={(e) => handleTimeInputChange(index, "start", e.target.value)}
                                    sx={{ mr: 2 }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    required
                                />
                                <TextField
                                    label="End"
                                    type="time"
                                    fullWidth
                                    value={
                                        input.end
                                            ? new Date(input.end).toLocaleTimeString("en-GB", {
                                                  hour: "2-digit",
                                                  minute: "2-digit",
                                              })
                                            : ""
                                    }
                                    onChange={(e) => handleTimeInputChange(index, "end", e.target.value)}
                                    sx={{ mr: 2 }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    required
                                />

                                <IconButton
                                    onClick={() => handleRemoveTimeInput(index)}
                                    color="error"
                                    disabled={index === 0}
                                >
                                    <DeleteOutlineIcon color={index === 0 ? "detail" : "error"} />
                                </IconButton>
                            </Box>
                        ))}

                        <Button
                            variant="outlined"
                            color="success"
                            onClick={handleAddTimeInput}
                            sx={{ mt: 2, width: "100%" }}
                        >
                            Add Time
                        </Button>

                        <Button type="submit" variant="contained" sx={{ mt: 2, width: "100%" }}>
                            Submit
                        </Button>

                        <Button
                            variant="outlined"
                            onClick={handleCloseModal}
                            color="error"
                            sx={{ mt: 2, width: "100%" }}
                        >
                            Close
                        </Button>
                    </form>
                </Box>
            </Modal>
        </Grid>
    );
}

export default ControlRegisters;
const getLetter = (num) => {
    if (num < 1 || num > 26) return "Invalid input";
    return String.fromCharCode(64 + num);
};

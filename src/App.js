import { useEffect, useState } from "react";
import Container from "./components/Layout/Container";
import Layout from "./components/Layout/Layout";
import Sidebar from "./components/Layout/Sidebar";
import Login from "./pages/auth/Login";
import Router from "./routes/routes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { Modal, Box, Typography, Button } from "@mui/material";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

function App() {
    const [auth, setAuth] = useState(true);
    const [alarm, setAlarm] = useState(false);
    const [state, setState] = useState(false);
    const [registerValues, setRegisterValues] = useState([]);

    useEffect(() => {
        const getAlarm = async () => {
            try {
                const response = await axios(`http://localhost:5001/alarm-status`);
                const data = response.data;
                if (data.alarm && !alarm) {
                    setAlarm(data.alarm);
                    setState(data.alarm);
                } else if (!data.alarm && alarm) {
                    setAlarm(data.alarm);
                    setState(data.alarm);
                }
            } catch (error) {}
        };

        const interval = setInterval(getAlarm, 2000);
        return () => clearInterval(interval);
    }, [alarm]);

    const handleCloseAlarmPopup = () => {
        setState(false);
    };

    return (
        <BrowserRouter>
            {!auth ? (
                <Routes>
                    <Route path="/" element={<Login />}></Route>
                    <Route path="*" element={<>loading</>}></Route>
                </Routes>
            ) : (
                <Layout>
                    <Sidebar />
                    <Container>
                        <Router registerValues={registerValues} setRegisterValues={setRegisterValues} />
                    </Container>
                </Layout>
            )}

            {/* Alarm Popup */}
            <Modal
                open={state}
                onClose={handleCloseAlarmPopup}
                aria-labelledby="alarm-modal-title"
                aria-describedby="alarm-modal-description"
                sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
            >
                <Box
                    sx={{
                        width: "300px",
                        bgcolor: "white",
                        borderRadius: "8px",
                        p: 3,
                        boxShadow: 24,
                        textAlign: "center",
                    }}
                >
                    <WarningAmberOutlinedIcon sx={{ width: "50px", height: "50px" }} color="warning" />
                    <Typography id="alarm-modal-title" variant="h6" component="h2" gutterBottom>
                        แจ้งเตือน
                    </Typography>
                    <Typography id="alarm-modal-description" sx={{ mb: 2 }}>
                        เกิดเหตุเพลิงไหม้ที่ห้อง A
                    </Typography>
                    <Button variant="contained" color="error" onClick={handleCloseAlarmPopup}>
                        ปิด
                    </Button>
                </Box>
            </Modal>
        </BrowserRouter>
    );
}

export default App;

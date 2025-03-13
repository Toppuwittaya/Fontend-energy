import React from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "../pages/auth/Dashboard";
import ControlRegisters from "../pages/controller/Controller";
import AiChat from "../pages/AiChat";

export default function Router({ registerValues, setRegisterValues }) {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
                path="/control"
                element={<ControlRegisters registerValues={registerValues} setRegisterValues={setRegisterValues} />}
            />
            <Route path="/ai-chat" element={<AiChat />} />
        </Routes>
    );
}

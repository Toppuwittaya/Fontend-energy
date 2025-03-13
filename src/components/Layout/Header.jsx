import { Box } from "@mui/material";
import React from "react";

export default function Header() {
    return (
        <Box
            sx={{
                bgcolor: "white",
                padding: 2,
                borderBottom: "0.5px solid lightgrey",
                boxShadow: ` rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px`,
                overflow: "hidden",
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <img src="./images/logo.png" width={25} alt="" />
                <Box sx={{ fontSize: "14px", color: "green" }}>SMART BUILDING</Box>
            </Box>
        </Box>
    );
}

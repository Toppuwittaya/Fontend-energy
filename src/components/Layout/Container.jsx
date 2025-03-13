import { Box } from "@mui/material";
import React from "react";
import Header from "./Header";

export default function Container({ children }) {
    return (
        <Box
            sx={{
                background: "#F6F7FB",
                zIndex: 1,
                borderLeft: "0.5px solid lightgrey",
                overflow: "hidden",
                width: "100%",
            }}
        >
            <Box sx={{ width: "100%", height: "100vh", overflow: "auto" }}>
                <Header />
                <Box sx={{ p: 2 }}>{children}</Box>
            </Box>
        </Box>
    );
}

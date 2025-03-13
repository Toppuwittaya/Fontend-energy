import { Box } from "@mui/material";
import React from "react";

export default function Layout({ children }) {
    return <Box style={{ display: "flex", height: "100vh" }}>{children}</Box>;
}

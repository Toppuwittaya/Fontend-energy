import { Box } from "@mui/material";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import ToggleOnOutlinedIcon from "@mui/icons-material/ToggleOnOutlined";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
export default function Sidebar() {
    const sidebarWidth = 280;
    const location = useLocation();
    const menu = [
        { name: "dashboard", link: "dashboard", icon: <GridViewOutlinedIcon fontSize="small" /> },
        { name: "control", link: "control", icon: <ToggleOnOutlinedIcon fontSize="small" /> },
        { name: "AI Chat", link: "ai-chat", icon: <SmartToyOutlinedIcon fontSize="small" /> },
    ];

    return (
        <Box
            sx={{
                p: 2,
                display: { xs: "none", md: "block" },
                width: sidebarWidth,
                background: "white",
                zIndex: 1,
            }}
        >
            <Box
                sx={{
                    p: 1.5,
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "10px",
                    boxShadow: `rgba(99, 99, 99, 0.2) 0px 1px 5px 0px`,

                    gap: "15px",
                }}
            >
                <AccountCircleOutlinedIcon fontSize="small" sx={{ color: "grey" }} />
                <Box
                    sx={{
                        fontSize: "12px",
                        overflow: "hidden",
                    }}
                >
                    user
                </Box>
            </Box>

            <Box sx={{ marginTop: "30px", p: 0 }}>
                {menu &&
                    menu.map((item, index) => (
                        <Link
                            to={`/${item.link}`}
                            style={{ textDecoration: "none", color: "inherit", marginTop: index > 0 && "5px" }}
                            key={index}
                        >
                            <Box
                                sx={{
                                    marginTop: index > 0 ? 0.5 : 0,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1.2,
                                    borderRadius: "5px",
                                    padding: "8px",
                                    transition: "background-color 0.3s ease",
                                    backgroundColor: location.pathname === `/${item.link}` ? "#EBECF0" : "inherit",
                                    color: location.pathname === `/${item.link}` ? "green" : "inherit",
                                    "&:hover": {
                                        color: "green",
                                        backgroundColor: "#EBECF0",
                                        cursor: "pointer",
                                    },
                                }}
                            >
                                {item.icon && item.icon}
                                <Box sx={{ fontSize: "12px" }}>{item.name}</Box>
                            </Box>
                        </Link>
                    ))}
                {/* <Link to="/dashboard" style={{ textDecoration: "none", color: "inherit" }}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.2,
                            borderRadius: "5px",
                            padding: "8px",
                            transition: "background-color 0.3s ease",
                            backgroundColor: location.pathname === "/dashboard" ? "#e3e3e3" : "inherit",
                            color: location.pathname === "/dashboard" ? "green" : "inherit",
                            "&:hover": {
                                color: "green",
                                backgroundColor: "#e3e3e3",
                                cursor: "pointer",
                            },
                        }}
                    >
                        <GridViewOutlinedIcon fontSize="small" />
                        <Box sx={{ fontSize: "12px" }}>Dashboard</Box>
                    </Box>
                </Link> */}
            </Box>
        </Box>
    );
}

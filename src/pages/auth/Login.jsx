import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Container,
    TextField,
    Button,
    Grid,
    Box,
    InputAdornment,
    FormControlLabel,
    Checkbox,
    Typography,
    ThemeProvider,
} from "@mui/material";
import axios from "axios";
import { api } from "../../config/api";
import AlertSnack from "../../components/Alert/AlertSnack";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { theme } from "../../theme/theme";

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    const [openAlert, setOpenAlert] = useState(false);
    const [message, setMessage] = useState("");

    const handleAlert = (message, status) => {
        setOpenAlert(true);
        setMessage({ status: status, name: message });
    };

    const handleRememberMeChange = (e) => {
        setRememberMe(e.target.checked);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await axios.post(api.login, {
                username,
                password,
            });
            if (rememberMe) {
                localStorage.setItem("rememberedUser", JSON.stringify({ username, password }));
            } else {
                localStorage.removeItem("rememberedUser");
            }
            navigate("/dashboard", { replace: true });
        } catch (error) {
            handleAlert(error.response?.data || error.code, "error");
            console.error("Error logging in:", error);
        }
    };

    useEffect(() => {
        const rememberedUser = localStorage.getItem("rememberedUser");
        if (rememberedUser) {
            const { username, password } = JSON.parse(rememberedUser);
            setUsername(username);
            setPassword(password);
            setRememberMe(true);
        }
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="sm" style={{ height: "100vh" }}>
                <Grid
                    container
                    spacing={2}
                    p={3}
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    style={{ minHeight: "100%" }}
                >
                    <Grid item xs={12}>
                        <Box
                            sx={{
                                padding: "30px 30px",
                                bgcolor: "white",
                                borderRadius: "5px",
                                boxShadow: `rgba(0, 0, 0, 0.24) 0px 3px 8px`,
                            }}
                        >
                            <Typography variant="h5" align="left" color="primary">
                                SIGN UP
                            </Typography>
                            <Typography variant="body2" marginBottom={2} align="left" color="secondary">
                                smart monitoring system
                            </Typography>
                            <form onSubmit={handleLogin}>
                                <TextField
                                    required
                                    size="small"
                                    type="text"
                                    placeholder="username"
                                    variant="outlined"
                                    fullWidth
                                    margin="dense"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <AccountCircleOutlinedIcon color="primary" />
                                            </InputAdornment>
                                        ),
                                        sx: {
                                            borderRadius: "30px",
                                        },
                                    }}
                                />
                                <TextField
                                    required
                                    size="small"
                                    type="password"
                                    placeholder="password"
                                    variant="outlined"
                                    fullWidth
                                    margin="dense"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockOutlinedIcon color="primary" />
                                            </InputAdornment>
                                        ),
                                        sx: {
                                            borderRadius: "30px",
                                        },
                                    }}
                                />
                                <Box sx={{ padding: "0 10px" }}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                size="small"
                                                checked={rememberMe}
                                                onChange={handleRememberMeChange}
                                            />
                                        }
                                        label={
                                            <span style={{ color: theme.palette.secondary.main, fontSize: "14px" }}>
                                                remember me
                                            </span>
                                        }
                                    />
                                </Box>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="success"
                                    fullWidth
                                    style={{ marginTop: "10px", borderRadius: "0px" }}
                                >
                                    Login In
                                </Button>
                            </form>
                        </Box>
                    </Grid>
                </Grid>
                <AlertSnack open={openAlert} message={message} setOpen={setOpenAlert} />
            </Container>
        </ThemeProvider>
    );
};

export default Login;

import React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const AlertSnack = ({ open, setOpen, message }) => {
    return (
        <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={() => setOpen(false)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
            <MuiAlert
                elevation={6}
                variant="standard"
                severity={message.status === "success" || "error"}
                onClose={() => setOpen(false)}
            >
                {message.name}
            </MuiAlert>
        </Snackbar>
    );
};

export default AlertSnack;

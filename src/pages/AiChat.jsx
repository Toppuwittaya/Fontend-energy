import React, { useState } from "react";
import axios from "axios";
import { Box, Button, TextField, Typography } from "@mui/material";

export default function AiChat() {
    const [prompt, setPrompt] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post("http://localhost:5001/generate/generate", { prompt });
            const cleanedResponse = res.data.response.replace(/<think>|<\/think>/g, "");
            setResponse(cleanedResponse);
        } catch (err) {
            console.error("Error generating response:", err);
            setResponse("Error generating response");
        }
        setLoading(false);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                AI Chat
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    fullWidth
                    required
                    multiline
                    rows={4}
                    sx={{ mb: 2, background: "white" }}
                />
                <Button type="submit" variant="contained" color="success" disabled={loading}>
                    {loading ? "Generating..." : "send propmt"}
                </Button>
            </form>
            {response && (
                <Box sx={{ mt: 3 }}>
                    <Typography variant="h6">Response:</Typography>
                    <Typography variant="body1">{response}</Typography>
                </Box>
            )}
        </Box>
    );
}

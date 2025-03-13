import { useEffect, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function Temp() {
    const [generatedText, setGeneratedText] = useState(""); // For generated text
    const prompt =
        "ฉันต้องการควบคุมอุณหภูมิแอร์ภายใน ด้วยการเปรียบเทียบเซ็นเซอร์อุณหภูมิภายนอกห้อง ตอนนี้อุณหภูมิภายนอก 25 องศา แอร์ควรปรับอูณภูมิเป็นเท่าไหร่และ mode อะไร ฉันต้องการคำตอบในรูปแบบ json เท่านั้น รูปแบบการตอบ {temp:'',mode:'',active:'' } สำหรับ active เป็นการสั่งเปิด/ปิดแอร์ หากอุณหภูมิภายนอกต่ำสามารถปิดแอร์ก็ได้"; // Replace with your desired prompt

    const generateText = async () => {
        try {
            const genAI = new GoogleGenerativeAI("AIzaSyBKwJeu9X-EHPFrdMJ_iXY7PSKOxQ7dEoA");
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = await response.text();

            setGeneratedText(text);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        generateText();
    }, []);

    return <div>Temp</div>;
}

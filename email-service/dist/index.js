"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const EmailService_1 = require("./EmailService");
const app = (0, express_1.default)();
const emailService = new EmailService_1.EmailService();
app.use(express_1.default.json());
app.post('/send-email', async (req, res) => {
    const payload = req.body;
    const status = await emailService.sendEmail(payload);
    res.json({ status });
});
app.get('/status/:id', (req, res) => {
    const status = emailService.getStatus(req.params.id);
    res.json({ status });
});
app.listen(3000, () => console.log('✅ Server running on http://localhost:3000'));

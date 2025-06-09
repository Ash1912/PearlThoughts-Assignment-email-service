import express, { Request, Response } from 'express';
import { EmailService } from './EmailService';
import { EmailPayload } from './types';

const app = express();
const emailService = new EmailService();

app.use(express.json());

app.post('/send-email', async (req: Request, res: Response) => {
  const payload: EmailPayload = req.body;
  const status = await emailService.sendEmail(payload);
  res.json({ status });
});

app.get('/status/:id', (req: Request, res: Response) => {
  const status = emailService.getStatus(req.params.id);
  res.json({ status });
});

app.listen(3000, () => console.log('✅ Server running on http://localhost:3000'));

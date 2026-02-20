import express from 'express';
import { type Request, type Response } from 'express';


const app = express();
app.get('/', (req: Request, res: Response) => {
  res.status(200).type('text/plain').send('Hello World!');
});

app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).send("OK")
});

const port = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Listening on ${port}`);
})

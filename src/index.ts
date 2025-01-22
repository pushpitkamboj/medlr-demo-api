import express, { Application, Request, Response, NextFunction } from 'express';
import userRouter from './routes/user';
import medicineRouter from './routes/medicine';
import pharmacyRouter from './routes/pharmacy';
import errorHandler from './middleware/errorHnadler';

const app: Application = express();

const PORT = 3000;

// Middleware
app.use(express.json());

// Error Handler middleware
app.use(errorHandler)

//routes
app.use("/user", userRouter)
app.use("/medicine", medicineRouter)
app.use("/pharmacy", pharmacyRouter)

// default Route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, welcome to demo api of medlr');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

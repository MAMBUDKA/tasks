import express from 'express';
import cors from 'cors';
import productsRouter from './routes/products.js';
import customersRouter from './routes/customers.js';
import { errorHandler } from './middleware/errorHandler.js';
import { seed } from './seed.js';

const app = express();
app.use(cors());
app.use(express.json());
seed();

app.use('/products', productsRouter);
app.use('/customers', customersRouter);
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 4000;
app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
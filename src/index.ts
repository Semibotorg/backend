import 'reflect-metadata';
import { config } from 'dotenv';
config();
import express from 'express';
import cors from 'cors';
import { MainRoutes } from './api/v1/routes';

const PORT = process.env.PORT;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/api/v1', MainRoutes);

app.listen(PORT, () => console.log(`Application started at [${PORT}] port`));

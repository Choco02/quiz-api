import express from 'express';
import { router } from './routes';

import pino from 'pino-http';
const logger = pino();

const app = express();

app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(router);

export { app };

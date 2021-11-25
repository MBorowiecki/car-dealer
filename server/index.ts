import express, { Request, Response } from "express";
import next from "next";
import mongoose from 'mongoose';
import dbConfig from './config/db';

import carManufacturerRouter from './routes/carManufacturers';
import carsRouter from './routes/cars';
import enginesRouter from './routes/engines';
import userRouter from './routes/users';

import carManufacturers from './carManufacturers';

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 5000;

(async () => {
  try {
    await app.prepare();
    const server = express();
    server.use(express.json());
    mongoose.connect(`mongodb+srv://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}/${dbConfig.database}?retryWrites=true&w=majority`);

    server.use('/api/car-manufacturers', carManufacturerRouter);
    server.use('/api/cars', carsRouter);
    server.use('/api/engines', enginesRouter);
    server.use('/api/users', userRouter);

    carManufacturers();

    server.all("*", (req: Request, res: Response) => {
      return handle(req, res);
    });
    server.listen(port, (err?: any) => {
      if (err) throw err;
      console.log(`> Ready on localhost:${port} - env ${process.env.NODE_ENV}`);
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
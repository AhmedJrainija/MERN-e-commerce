import express, { Application} from 'express'
import adminRouter from './5-routes/admin.routes.js';
import cookieParser from 'cookie-parser';
import { errorHandler } from './6-middlewares/error handler.js';
import clientRouter from './5-routes/client.routes.js';
import helmet from "helmet";
import cors from "cors";
import { findProducts } from './3-controllers/client.controller.js';


const app: Application = express();




//Middlewares:
app.use(express.json());

app.use(helmet());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use('/products',express.static('public/products'));    //<img src:`http://localhost:3000/products/${pictureName}`>



//Main Page:
app.get('/', findProducts)

//Admin:
app.use('/admin', adminRouter);

//Client:
app.use('/', clientRouter);



//Error Handling Middleware
app.use(errorHandler);



export default app;
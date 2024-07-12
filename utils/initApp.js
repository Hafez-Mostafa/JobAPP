import cors from 'cors';
import path from 'path'
import dotenv from 'dotenv';

dotenv.config({path:path.resolve('config/.env')});

import AppError from '../utils/AppError.js';
import  {globalErrorHandling}  from '../utils/errorHandling.js';
import  connectionDB  from '../db/connectionDB.js';
import * as  routes from '../src/modules/index.routes.js';


const initApp = (app,express) => {

    



// Configure CORS
const corsConfig = {
    origin: "*",
    credentials: true, 
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
};
app.use(cors(corsConfig));
app.options("", cors(corsConfig));
connectionDB()
app.use(express())
app.use(express.json());


app.use('/users',routes.userRoutr)
app.use('/company',routes.companyRoutr)
app.use('/jobs',routes.jobRoutr)




app.get('/', (req, res, next) => {
    res.status(200).send('Job App!');
});

app.get('*', (req, res,next) =>{
    return next(new AppError(`Invalid URL : ${req.originalUrl}`,404))
})

app.use(globalErrorHandling);

const PORT =  process.env.PORT||3000
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}!`))



}


export default initApp
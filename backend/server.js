// const express=require("express");
// const cors=require("cors");
// const pinohttp=require('pino-http')
// const logger=require("./src/config/logger")
// global.logger=logger;
// const connectDB = require("./connection/connectDB");
// require('dotenv').config();
// const router=require("./routes/router");
// const cookieParser=require("cookie-parser");
// const app=express();
// app.disable('x-powered-by');

// app.use(cors({
    
//     origin:process.env.FRONTEND_URL || 'http://localhost:5173',
//     credentials:true
// }));
// app.use(express.json());
// app.use(pinohttp({logger}));
// app.use(cookieParser());
// app.use('/api',router);



// const startServer = async () => {
//     await connectDB();
//     app.listen(process.env.PORT || 3000, () => {
//         console.log(`Server is running on port ${process.env.PORT || 3000}`);
//     });
// };

// startServer();

const app = require("./app");
const connectDB = require("./connection/connectDB");

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("DB connection failed:", err.message));
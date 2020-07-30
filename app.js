const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const compression =  require('compression')
const path = require('path')

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

const userRouter = require("./routes/userRoutes");
const postRouter = require("./routes/postRoutes");
const profileRouter = require("./routes/profileRoutes");

// 1) GLOBAL MIDDLEWARE
app.use(helmet());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json({ limit: "10kb" }));

app.use(mongoSanitize());

app.use(xss());

app.use(compression())

// SERVING STATIC FILES
app.use(express.static(`${__dirname}/public`));

// 2) ROUTE
app.use("/api/v1/users", userRouter);
app.use("/api/v1/profile", profileRouter);
app.use("/api/v1/posts", postRouter);

if(process.env.NODE_ENV ===  'production'){
 app.use(express.static('client/build'));

 app.get('*', (req,res) => {
   res.sendFile(path.resolve(__dirname,'client','build','index.html'))
 })

}

// app.all("*", (req, res, next) => {
//   next(new AppError(`Can't find ${req.originalUrl} on the Server.`, 404));
// });



app.use(globalErrorHandler);
module.exports = app;

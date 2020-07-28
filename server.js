const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const app = require("./app");

// DATABASE CONNECTION

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

// console.log(`DB: ${DB}`);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`DB connection SUCCESSFUL!!`);
  });

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`App Running at port ${port}... `);
});

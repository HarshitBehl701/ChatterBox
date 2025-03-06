import mongoose from "mongoose";

type DBConnection = typeof mongoose.connection;

const dbString = process.env.DB_STRING  || "";

mongoose.connect(dbString).then(() =>  {
    console.log('Database  connection successfull');
});

const db: DBConnection = mongoose.connection;

export default db;
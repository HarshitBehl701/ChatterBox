const express =  require('express');
const  cors  =  require('cors');
const app  =   express();
require('dotenv').config();
const db  = require('./config/db');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cors({origin: "*"}))  //allowing all domains to access  this server



app.listen(process.env.PORT);
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());


require('dotenv').config({
  path: './config/index.env',
});

// MongoDB 
const connectDB = require('./config/db');
connectDB()



app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'))
app.use(cors({
origin:["http://localhost:4200", "http://127.0.0.1:4200"],
credentials:true
}));

app.use(morgan('dev'));


// routes
app.use('/api/user/', require('./routes/access'));
app.use('/api/category/', require('./routes/category.route'));
app.use('/api/product/', require('./routes/product.route'));

app.get('/', (req, res) => {
  res.send('test route => home page');
});

// Page Not founded
app.use((req, res) => {
    res.status(404).json({
        msg: 'Page not founded'
    });
});


const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
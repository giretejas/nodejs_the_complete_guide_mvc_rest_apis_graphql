const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

// require Routes modules
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

dotenv.config(); //config .env to access environment variables

const app = express();     //calling express createApplication()
const port = process.env.PORT;
const hostname = process.env.HOSTNAME;

// middlewares for parse incoming request payloads
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// middleware for use serving statics files 
app.use(express.static(path.join(__dirname, 'public')));

// middlewares for Routes 
// Express routes modules created in Routes folder
app.use('/product', adminRoutes);  // this allows to only path starts with /admin
app.use(shopRoutes);   // this allows with path /*

// Handling 404 Page not found 
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

app.listen(port, hostname, () => {
    console.log(`App is running on port ${port}`);
});
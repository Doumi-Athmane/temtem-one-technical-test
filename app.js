const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('./helpers/authentication.js');
const usersRoutes = require('./routes/users.js');
const productsRoutes = require('./routes/products.js');
const storesRoutes = require('./routes/stores.js');


const app = express();

app.use(bodyParser.json());


app.use('/api/users', usersRoutes); //Users routes
app.use('/api/products',authenticate, productsRoutes); //Products routes
app.use('/api/stores', storesRoutes); //Stores routes


app.use((req, res) => {
    res.json({ message: 'Votre requête a bien été reçue !' });
});

module.exports = app;
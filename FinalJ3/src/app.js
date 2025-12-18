require('dotenv').config();
const express = require('express');
const passport = require('passport');
const AppDataSource = require('./config/data-source');
const errorHandler = require('./middlewares/error.middleware');
const ApiError = require('./utils/ApiError');

const authRoutes = require('./routes/auth.routes');
const ticketRoutes = require('./routes/ticket.routes');

require('./config/passport');

const app = express();

app.use(express.json());
app.use(passport.initialize());

app.use('/auth', authRoutes);
app.use('/tickets', ticketRoutes);

app.use((req, res, next) => {
    next(new ApiError(404, 'Not Found'));
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
    .then(() => {
        console.log('Data Source has been initialized!');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Error during Data Source initialization:', err);
    });

module.exports = app;

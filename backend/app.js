const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes.js');
const candidateRoutes = require('./routes/candidateRoutes.js');



dotenv.config();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files from uploads folder

const port = process.env.PORT;

app.use('/api/auth', authRoutes);
app.use('/api/candidate', candidateRoutes);
main().then(() => {
    console.log("Successfully Connected to Database");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(process.env.MONGO_URL);
};

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
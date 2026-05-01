const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const { spawn, spawnSync } = require('child_process');
const fs = require('fs');
const net = require('net');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes.js');
const candidateRoutes = require('./routes/candidateRoutes.js');
const jobRoutes = require('./routes/jobRoutes.js');
const applicationRoutes = require('./routes/applicationRoutes.js');
const aiRank = require('./routes/aiRank.js');
const interviewRoutes = require('./routes/interviewRoutes.js');
const aiInterviewRoute = require('./routes/aiInterviewRoute.js');
const dashboardRoutes = require('./routes/dashBoardRoutes.js');
const finalScoreRoutes = require('./routes/finalScoreRoutes.js');
const fullFeedbackRoutes = require('./routes/fullFeedbackRoutes.js')
const emailRoutes = require('./routes/emailRoutes.js');
const User = require('./models/User.js');

// ⭐ NEW
const testRoutes = require("./routes/testRoutes.js");
const mailRoutes = require("./routes/mailRoutes.js");

dotenv.config();

const mongoUrl = new URL(process.env.MONGO_URL);
const mongoHost = mongoUrl.hostname;
const mongoPort = Number(mongoUrl.port || 27017);
const isLocalMongoHost = ['127.0.0.1', 'localhost', '::1'].includes(mongoHost);
const mongoDataPath = path.join(__dirname, 'mongo-data');

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function isPortOpen(host, port) {
    return new Promise((resolve) => {
        const socket = net.createConnection({ host, port });

        const finish = (isOpen) => {
            socket.removeAllListeners();
            socket.destroy();
            resolve(isOpen);
        };

        socket.setTimeout(1000);
        socket.once('connect', () => finish(true));
        socket.once('timeout', () => finish(false));
        socket.once('error', () => finish(false));
    });
}

function resolveMongodExecutable() {
    const configuredPath = process.env.MONGOD_PATH || process.env.MONGOD_BIN;

    if (configuredPath && fs.existsSync(configuredPath)) {
        return configuredPath;
    }

    const whereResult = spawnSync('where', ['mongod'], { encoding: 'utf8' });
    if (whereResult.status === 0) {
        const candidate = whereResult.stdout
            .split(/\r?\n/)
            .map((line) => line.trim())
            .find(Boolean);

        if (candidate && fs.existsSync(candidate)) {
            return candidate;
        }
    }

    const commonWindowsPaths = [
        'C:\\Program Files\\MongoDB\\Server\\8.0\\bin\\mongod.exe',
        'C:\\Program Files\\MongoDB\\Server\\7.0\\bin\\mongod.exe',
        'C:\\Program Files\\MongoDB\\Server\\6.0\\bin\\mongod.exe',
    ];

    return commonWindowsPaths.find((candidate) => fs.existsSync(candidate)) || null;
}

async function waitForMongoConnection(host, port, timeoutMs = 30000) {
    const deadline = Date.now() + timeoutMs;

    while (Date.now() < deadline) {
        if (await isPortOpen(host, port)) {
            return;
        }

        await delay(1000);
    }

    throw new Error(`MongoDB did not become ready on ${host}:${port} within ${timeoutMs}ms`);
}

async function ensureLocalMongoServer() {
    if (!isLocalMongoHost || await isPortOpen(mongoHost, mongoPort)) {
        return;
    }

    const mongodExecutable = resolveMongodExecutable();
    if (!mongodExecutable) {
        throw new Error('MongoDB is not running locally, and the mongod executable was not found.');
    }

    fs.mkdirSync(mongoDataPath, { recursive: true });

    const mongodArgs = [
        '--dbpath', mongoDataPath,
        '--bind_ip', mongoHost,
        '--port', String(mongoPort),
        '--setParameter', 'diagnosticDataCollectionEnabled=false',
        '--logpath', path.join(mongoDataPath, 'mongod.log'),
        '--logappend',
    ];

    console.log('MongoDB is not running locally. Starting bundled MongoDB server...');
    const child = spawn(mongodExecutable, mongodArgs, {
        detached: true,
        stdio: 'ignore',
        windowsHide: true,
    });

    child.unref();
    await waitForMongoConnection(mongoHost, mongoPort);
    console.log('Local MongoDB server is ready.');
}

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files from uploads folder

const port = process.env.PORT;

app.use('/api/auth', authRoutes);
app.use('/api/candidate', candidateRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/ai', aiRank);
app.use('/api/interviews', interviewRoutes);
app.use("/api/ai-interview", aiInterviewRoute);
app.use("/api/tests", testRoutes); // ⭐ NEW
app.use("/api/mail", mailRoutes);  // ⭐ NEW
app.use("/api/dashboard", dashboardRoutes);
app.use("/api", finalScoreRoutes);
app.use("/api/ai/full-feedback", fullFeedbackRoutes);
app.use("/api/mail", emailRoutes);


// connect to mongoDB
async function main() {
    await ensureLocalMongoServer();
    await mongoose.connect(process.env.MONGO_URL);
    await dropLegacyUserNameIndex();
};

async function dropLegacyUserNameIndex() {
    try {
        const indexes = await User.collection.indexes();
        const legacyNameIndex = indexes.find((index) => index.name === 'name_1');

        if (legacyNameIndex) {
            await User.collection.dropIndex('name_1');
            console.log('Dropped legacy unique index on users.name');
        }
    } catch (error) {
        console.log('Skipping legacy user index cleanup:', error.message);
    }
}

app.get('/', (req, res) => {
    res.send('Hello World!');
});

async function startServer() {
    try {
        await main();
        console.log('Successfully Connected to Database');

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error.message);
        process.exit(1);
    }
}

startServer();
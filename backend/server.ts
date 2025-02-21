import express from "express";
import cors from "cors";
import { sequelize } from "./helpers/db";
import Config from "./config/default.json";
import routes from "./routes";
import projectRoutes from './routes';
import projectAssignmentRoutes from './routes';
import BugRoutes from './routes';

const app = express();

app.use(cors({
    origin: '*',
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type, Authorization',
}));

app.use(express.json());

app.use('/', routes);
app.use('/api', projectRoutes);
app.use('/api', projectAssignmentRoutes);
app.use('/api', BugRoutes);

async function startserver() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        await sequelize.sync();
        console.log('Database synced successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
    app.listen(Config.port, () => {
        console.log(`Server is running on port ${Config.port}`);
    });
}

startserver();

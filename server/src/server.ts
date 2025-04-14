import express from 'express';
import path from "path";
import { fileURLToPath } from 'url';
import cors from 'cors';
import sequelize from './config/connection.js';
import routes from './routes/index.js'; // Make sure this is a .ts file
//import { initModels } from './models/index.js';
import buyinRoutes from './routes/api/buyin-routes.js';
import matchupRoutes from './routes/api/matchup-routes.js';
import betRoutes from './routes/api/bet-routes.js';
import payoutRoutes from './routes/api/payout-routes.js';
import sideBetRoutes from './routes/api/sidebet-routes.js';
import cookieParser from 'cookie-parser';

const forceDatabaseRefresh = false;
const app = express();
const PORT = process.env.PORT || 3000;

// Needed because you're using ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// DB Model Initialization
//const models = initModels(sequelize);

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/api', routes); // ✅ Only mount API routes under /api
app.use('/api', buyinRoutes);
app.use('/api', matchupRoutes);
app.use('/api', betRoutes);
app.use('/api', payoutRoutes);
app.use('/api', sideBetRoutes);


// Static File Serving
const clientBuildPath = path.join(__dirname, "../../client/dist");
app.use(express.static(clientBuildPath));

// Fallback route for SPA (React Router)
app.get("*", (_, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

// Sync DB + Start Server
sequelize.sync({ force: forceDatabaseRefresh }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
});


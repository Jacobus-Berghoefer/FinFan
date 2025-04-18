import express from 'express';
import path from "path";
import { fileURLToPath } from 'url';
import cors from 'cors';
import sequelize from './config/connection.js';
import routes from './routes/index.js'; // Make sure this is a .ts file
//import { initModels } from './models/index.js';
import cookieParser from 'cookie-parser';

const forceDatabaseRefresh = false;
const app = express();
const PORT = process.env.PORT || 3000;

// Needed because you're using ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientBuildPath = path.join(__dirname, "../../client/dist");

// DB Model Initialization
//const models = initModels(sequelize);

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend port
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use('/api', routes); 

//app.use(express.static(clientBuildPath));
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(clientBuildPath));
  app.get("*", (_, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
}

// Fallback route for SPA (React Router)
//app.get("*", (_, res) => {
//  res.sendFile(path.join(clientBuildPath, "index.html"));
//});

// Sync DB + Start Server
sequelize.sync({ force: forceDatabaseRefresh }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
});


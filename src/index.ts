import express from "express";
import { apiRouter } from "./routes/api"; // Changed to named import
import { DatabaseService } from "./services/DatabaseService";
import { DatabaseDataStore } from "./stores/sqldb/DatabaseDataStore"; // Import DatabaseDataStore

const app = express();
const PORT = process.env.PORT || 3000;
const DATABASE_PATH =
  process.env.DATABASE_PATH || "./src/data/game_asset_server.db"; // Use the same default as DatabaseDataStore

app.use(express.json());

// Initialize DatabaseDataStore and DatabaseService
const databaseDataStore = new DatabaseDataStore(DATABASE_PATH);
const databaseService = new DatabaseService(databaseDataStore);

// API Routes - Pass databaseService to the router if needed, or ensure controllers use it
// For now, assuming controllers directly import/instantiate DatabaseService or it's handled via dependency injection
// If apiRouter needs databaseService, it should be passed here or configured within api.ts
app.use("/api", apiRouter(databaseService)); // Call apiRouter with databaseService

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

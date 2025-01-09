import app from "./app";
import { config } from "./config/envConfig";
import { appDatabase } from "./config/database";
import logger from "./config/winstonLoggerConfig";

const startServer = async () => {
    try {
        const db = await appDatabase.initialize();
        if (db) {
            logger.info("Database connection has been established successfully.");
        }

        app.listen(config.PORT, () => {
            logger.info(`Server is running at PORT: ${config.PORT}`);
        });
    } catch (error) {
        console.error("Error starting server:", error);
        process.exit(1); // Exit the process on critical error
    }
};

startServer();

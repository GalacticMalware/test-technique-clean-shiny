import dotenv from "dotenv";
dotenv.config();

import { createServer } from "http";
import { app } from "./app/app";
import { logger } from "./utils/logger";

const PORT = String(process.env.PORT || '3000');
const server = createServer(app);

server.listen(parseInt(PORT), () => {
  logger.info(`Server running on port ${PORT}`);
});

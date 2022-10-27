import app from "./app";
import config from "./utils/config";

app.listen(config.server.port, () => {
  console.log(`listening on port: ${config.server.port || 3001}`);
});

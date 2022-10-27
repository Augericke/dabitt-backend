import app from "./app";
import config from "./utils/config";

app.listen(config.server.port || 3001, () => {
  console.log(`listening on port: ${config.server.port || 3001}`);
});

import app from "./app";
import config from "./utils/config";

app.listen(config.server.port, () => {
  console.log(
    `Server is running at http://${config.server.hostname}:${config.server.port}`,
  );
});

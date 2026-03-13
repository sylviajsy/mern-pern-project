const app = require("./app");
const PORT = process.env.PORT || 8000;

// console.log that your server is up and running
app.listen(PORT, () => {
  console.log(`Hola, Server listening on ${PORT}`);
});

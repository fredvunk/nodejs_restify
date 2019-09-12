const restify = require("restify");
const mongoose = require("mongoose");
const config = require("./config");
const rjwt = require("restify-jwt-community");
const m2s = require('mongoose-to-swagger');
const food = mongoose.model('food', {
  name: string
});
const swaggerSchema = m2s(food);
console.log(swaggerSchema);

const server = restify.createServer();

// Middleware
server.use(restify.plugins.bodyParser());

// Protect Routes
// server.use(rjwt({ secret: config.JWT_SECRET }).unless({ path: ['/auth'] }));

server.listen(config.PORT, () => {
  mongoose.set("useFindAndModify", false);
  mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true
  });
});

const db = mongoose.connection;

db.on("error", err => console.log(err));

db.once("open", () => {
  require("./routes/customers")(server);
  require("./routes/users")(server);
  require("./routes/foods")(server);
  console.log(`Server started on port ${config.PORT}`);
});
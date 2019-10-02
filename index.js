const restify = require("restify");
const mongoose = require("mongoose");
const config = require("./config");
const rjwt = require("restify-jwt-community");
const corsMiddleware = require("restify-cors-middleware");
// const cors = require("cors");

const server = restify.createServer();

const cors = corsMiddleware({
  origins: ["*"],
  allowHeaders: ["Authorization"],
  exposeHeaders: ["Authorization"]
})

// Middleware

server.use(restify.plugins.bodyParser());

server.pre(cors.preflight);
server.use(cors.actual);
// server.use(cors());

// Protect Routes
// server.use(rjwt({
//   secret: config.JWT_SECRET
// }).unless({
//   path: ['/auth']
// }));

// console.log(process.env.MONGO_ATLAS_PW)

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
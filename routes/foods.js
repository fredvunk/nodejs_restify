const errors = require("restify-errors");
const rjwt = require("restify-jwt-community");
const Food = require("../models/Food");
const config = require("../config");

module.exports = server => {
  // Get food

  server.get("/foods", async (req, res, next) => {
    try {
      const food = await Food.find({});
      res.send(food);
      next();
    } catch (err) {
      return next(new errors.InvalidContentError(err));
    }
  });

  // Post food
  server.post(
    "/foods",
    // rjwt({ secret: config.JWT_SECRET }),
    async (req, res, next) => {
      // Check for JSON
      if (!req.is("application/json")) {
        return next(
          new errors.InvalidContentError("Expects 'application/json'")
        );
      }

      const { name, price } = req.body;

      const food = new Food({
        name,
        price
      });

      try {
        const newFood = await food.save();
        res.send(201);
        next();
      } catch (err) {
        return next(new errors.InternalError(err.message));
      }
    }
  );

  // Get food by ID

  server.get("/foods/:id", async (req, res, next) => {
    try {
      const food = await Food.findById(req.params.id);
      res.send(food);
      next();
    } catch (err) {
      return next(
        new errors.ResourceNotFoundError(
          `There is no food with the id of ${req.params.id}`
        )
      );
    }
  });

  // Update Food
  server.put(
    "/foods/:id",
    // rjwt({ secret: config.JWT_SECRET }),
    async (req, res, next) => {
      // Check for JSON
      if (!req.is("application/json")) {
        return next(
          new errors.InvalidContentError("Expects 'application/json'")
        );
      }

      try {
        const food = await Food.findOneAndUpdate(
          {
            _id: req.params.id
          },
          req.body
        );
        res.send(200);
        next();
      } catch (err) {
        return next(
          new errors.ResourceNotFoundError(
            `There is no food with the id of ${req.params.id}`
          )
        );
      }
    }
  );

  // Delete Food
  server.del(
    "/foods/:id",
    // rjwt({
    //  secret: config.JWT_SECRET
    //  }),
    async (req, res, next) => {
      try {
        const food = await Food.findOneAndRemove({
          _id: req.params.id
        });
        res.send(204);
        next();
      } catch (err) {
        return next(
          new errors.ResourceNotFoundError(
            `There is no food with the id of ${req.params.id}`
          )
        );
      }
    }
  );
};

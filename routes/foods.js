const errors = require("restify-errors");
const rjwt = require("restify-jwt-community");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
const auth = require("../auth");
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
    // auth,
    rjwt({
      secret: config.JWT_SECRET
    }),
    async (req, res, next) => {
      // Check for JSON
      if (!req.is("application/json")) {
        return next(
          new errors.InvalidContentError("Expects 'application/json'")
        );
      }

      const {
        name,
        price
      } = req.body;

      const food = new Food({
        name,
        price
      });

      try {
        const newFood = await food.save();
        res.send(200, "Successfully added food");
        next();
      } catch (err) {
        return next(new errors.BadRequestError(err.message));
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
    rjwt({
      secret: config.JWT_SECRET
    }),
    async (req, res, next) => {
      // Check for JSON
      if (!req.is("application/json")) {
        return next(
          new errors.InvalidContentError("Expects 'application/json'")
        );
      }

      try {
        const food = await Food.findOneAndUpdate({
            _id: req.params.id
          },
          req.body
        );
        res.send(200, "Updating food successful");
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
    rjwt({
      secret: config.JWT_SECRET
    }),
    async (req, res, next) => {
      try {
        const food = await Food.findOneAndRemove({
          _id: req.params.id
        });
        res.send('Deleted food successfully');
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
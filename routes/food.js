const errors = require("restify-errors");
const rjwt = require("restify-jwt-community");
const Food = require("../models/Food");
const config = require("../config");

module.exports = server => {
    // Get food

    server.get("/food", async (req, res, next) => {
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
        "/food",
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
};
const mongoose = require("mongoose");
const timestamp = require("mongoose-timestamp");

const FoodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        default: 0
    }
});

FoodSchema.plugin(timestamp);

const Food = mongoose.model("Food", FoodSchema);
module.exports = Food;
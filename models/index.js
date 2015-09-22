var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/mongo_zoo");

module.exports.Animal = require("./animal");
module.exports.Zoo = require("./zoo");
const mongoose = require("mongoose");

const photoSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    imageURL: {type:String, required: true}
});
module.exports = mongoose.model("Photo",photoSchema);
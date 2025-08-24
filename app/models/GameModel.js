const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let CardSchema = new Schema({
    GameName: {
        type: String,
        require: true
    },
    Cards: [{
        type: String,
        require: true
    }],
    CardsAxe:[{
        type: String,
        require: true
    }],
    CardsAllies:[{
        type: String,
        require: true
    }],
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 60 * 6 // 6 heures en secondes
  }
   
});

module.exports = mongoose.model("Card", CardSchema);
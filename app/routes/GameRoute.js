module.exports = (server,corsConfig) => {
    const GameController = require("../controllers/GameController");
    const cors = require('cors');

    server.post("/game/new", cors(corsConfig), GameController.CreateNewGame);
    server.get("/game/getCard/:gameid", cors(corsConfig),GameController.GetCards);
    server.post("/game/play/:gameid",cors(corsConfig),GameController.Play)
    
}
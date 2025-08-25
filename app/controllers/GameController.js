const Game = require("../models/GameModel");
//carte commandement gris x1, carte de commandement verte x2
const ListCard = [
    "air-power-fr",
    "armor-assault-fr",
    "artillery-bombard-fr",
    "assault-left-fr",
    "assault-left-fr",
    "assault-center-fr",
    "assault-center-fr",
    "assault-right-fr",
    "assault-right-fr",
    "attack-left-fr",
    "attack-left-fr",
    "attack-center-fr",
    "attack-center-fr",
    "attack-right-fr",
    "attack-right-fr",
    "barrage-fr",
    "behind-enemy-lines-fr",
    "close-assault-fr",
    "dig-in-fr",
    "direct-hq-fr",
    "firefight-fr",
    "general-advance-fr",
    "infantry-assault-fr",
    "medics-fr",
    "move-out-fr",
    "pincer-move-fr",
    "probe-left-fr",
    "probe-left-fr",
    "probe-center-fr",
    "probe-center-fr",
    "probe-right-fr",
    "probe-right-fr",
    "recon-left-fr",
    "recon-left-fr",
    "recon-center-fr",
    "recon-center-fr",  
    "recon-right-fr",  
    "recon-right-fr",
    "their-finest-hour-fr"
]
function getCard(list){
  
  if (list.length === 0) return null; // sécurité si la liste est vide

  const index = Math.floor(Math.random() * list.length); // index aléatoire
  const card = list[index]; // élément choisi
  list.splice(index, 1); // retire l'élément de la liste
  return card;
}
function getMultipleCard(list, count) {
  const results = [];
  for (let i = 0; i < count && list.length > 0; i++) {
    results.push(getCard(list));
  }
  return results;
}
exports.CreateNewGame = (req,res)=>{
    let list = [...ListCard];
    let CardsAxe = getMultipleCard(list,6)
    let CardsAllies = getMultipleCard(list,6)
    
    let newGame = new Game({GameName:req.body.gamename,Cards:ListCard,CardsAxe:CardsAxe,CardsAllies:CardsAllies,Graveyard:[],createdAt:new Date().getTime()});
    newGame.save((error, game) => {
        if (error ) {
          res.status(401);   
          res.json({ message: "Requête invalide" });
        } else {
          res.json(game)
        }
      });
}

exports.GetCards = (req,res)=>{
  Game.findOne({GameName:req.params.gameid},(error,game)=>{
    if (error ) {
      res.status(401);   
      res.json({ message: "Requête invalide" });
    } else {
      res.json(game)
    }})
}

exports.Play = (req,res)=>{
  Game.findOne({GameName:req.params.gameid},(error,game)=>{
    if (error ) {
      res.status(401);   
      res.json({ message: "Requête invalide" });
    } else {
      if(game && (game.Cards || game.Graveyard )){
      
        let Cards = game.Cards
        let Graveyard = game.Graveyard;
        if(game.Cards.length <= 0){
          Cards = game.Graveyard
          Graveyard = [];

        } 
        
        
        let newCard = getCard(Cards)
        let CardsAxe = game.CardsAxe
        let CardsAllies = game.CardsAllies
        if(req.body.userPlay === "Axe"){
          Graveyard.push(CardsAxe[req.body.RemoveCardIndex]); 
          CardsAxe[req.body.RemoveCardIndex] = newCard
           
        }else{
          Graveyard.push(CardsAllies[req.body.RemoveCardIndex])
          CardsAllies[req.body.RemoveCardIndex] = newCard
        }
        Game.findOneAndUpdate({GameName:req.params.gameid},{Cards:Cards,CardsAxe:CardsAxe, CardsAllies:CardsAllies,Graveyard:Graveyard}, { new: true },(error, newgame) => {
          if (error) {
            res.status(401);   
            res.json({ message: "Requête invalide" });
          } else {
            res.json(newgame)
          }})
      }
    }
  })
}




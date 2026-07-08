import { doRolls } from "./doRolls.mjs";

let text = 
`{
    "Stormtrooper": {
        "Models": 4, 
        "AttackDice":"w", 
        "DefenseDice":"r"
    }, 
    "B1 Battle Droid": {
        "Models": 6, 
        "AttackDice":"w", 
        "DefenseDice":"w"
    }
}`

const units = JSON.parse(text);

const stormtrooper = units.Stormtrooper;
const battledroid = units["B1 Battle Droid"];

const StormtrooperAttack = stormtrooper.Models + stormtrooper.AttackDice;
const StormtrooperDefense = stormtrooper.Models + stormtrooper.DefenseDice;

const BattleDroidAttack = battledroid.Models + battledroid.AttackDice;
const BattleDroidDefense = battledroid.Models + battledroid.DefenseDice;

// 0 is storms, 1 is b1s
let gameState = 0
if (gameState == 0) {
    const rollArray = doRolls('a', StormtrooperAttack);
    rollArray.forEach(item => console.log(item));
}
/*while (stormtrooper.Models > 0 || battledroid.Models > 0){
    if (gameState == 0) {
        const rollArray = doRolls('a', StormtrooperAttack);
        rollArray.forEach(item => console.log(item));
    }
}*/


//console.log("Commence Stormtrooper Attack Rolls:");
//doRolls('a', StormtrooperAttack);
//console.log("Commence Battle Droid Defense Rolls:");
//doRolls('d', BattleDroidAttack);
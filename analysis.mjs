import { doRolls } from "./doRolls.mjs";

let text = 
`{
    "Stormtrooper": {
        "Models": 4, 
        "AttackDice":"w", 
        "DefenseDice":"r"
    }, 
    "B1 Battle Droids": {
        "Models": 6, 
        "AttackDice":"w", 
        "DefenseDice":"w"
    }
}`

const units = JSON.parse(text);

const StormtrooperAttack = units.Stormtrooper.Models + units.Stormtrooper.AttackDice;
const StormtrooperDefense = units.Stormtrooper.Models + units.Stormtrooper.DefenseDice;

const BattleDroidAttack = units["B1 Battle Droids"].Models + units["B1 Battle Droids"].AttackDice;
const BattleDroidDefense = units["B1 Battle Droids"].Models + units["B1 Battle Droids"].DefenseDice;

console.log("Commence Stormtrooper Attack Rolls:")
doRolls('a', StormtrooperAttack);
console.log("Commence Battle Droid Defense Rolls:");
doRolls('d', BattleDroidAttack);
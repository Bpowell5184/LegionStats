import { doRolls } from "./doRolls.mjs";
import { setTimeout } from "timers/promises";

let text = 
`{
    "Stormtrooper": {
        "Models": 4, 
        "AttackDice":"w", 
        "DefenseDice":"r",
        "SurgeAttack": "h",
        "SurgeDefense": "n"
    }, 
    "B1 Battle Droid": {
        "Models": 6, 
        "AttackDice":"w", 
        "DefenseDice":"w",
        "SurgeAttack": "n",
        "SurgeDefense": "n"
    }
}`

const units = JSON.parse(text);
const stormtrooper = units.Stormtrooper;
const battledroid = units["B1 Battle Droid"];
const StormtrooperAttack = stormtrooper.Models + stormtrooper.AttackDice;
const BattleDroidAttack = battledroid.Models + battledroid.AttackDice;

// 0 is storms, 1 is b1s
let gameState = 0
let rollArray = [];
if (gameState == 0) {
    rollArray = doRolls('a', StormtrooperAttack);
    await setTimeout(1000); // 1 second 
    console.log(`Roll Array is ${rollArray}`);
    const paint = convertPaint(rollArray, stormtrooper.SurgeAttack, "a");
    await setTimeout(1000);
    console.log(`Paint amount is ${paint}`);

    const BattleDroidDefense = paint + battledroid.DefenseDice;
    rollArray = doRolls('d', BattleDroidDefense);
    await setTimeout(1000);
    console.log(`Roll Array is ${rollArray}`);
    const paintb1 = convertPaint(rollArray, battledroid.SurgeDefense, "d");
    await setTimeout(1000);
    console.log(`Paint amount is ${paintb1}`);
    await setTimeout(1000);
    let wounds = calculateWounds(paint, paintb1)
    console.log(`Wounds suffered are: ${wounds}`)
    stormtrooper.Models = stormtrooper.Models - wounds;
    console.log(`New Model Count is: ${stormtrooper.Models}`);
}

function convertPaint(rolls, surgeProfile, rollType){
    let paint = -1;
    if (rollType === "a") paint = convertAttackPaint(rolls, surgeProfile);
    else if (rollType === "d") paint = convertDefensePaint(rolls, surgeProfile);
    else console.log("Invalid Roll Type (Must be Attack or Defense)");
    return paint;
}

function convertAttackPaint(rolls, surgeProfile){
    let paint = 0;
    for (let step = 0; step < rolls.length; step++){
        if (rolls[step] == "Hit" || rolls[step] == "Crit"){
            paint++;
        } else if (rolls[step] == "Surge" && surgeProfile !== "n"){
            paint++;
        }
    }
    return paint;  
}

function convertDefensePaint(rolls, surgeProfile){
    let paint = 0;
    for (let step = 0; step < rolls.length; step++){
        if (rolls[step] == "Block"){
            paint++;
        } else if(rolls[step] == "Surge" && surgeProfile === "b"){
            paint++;
        }
    } 
    return paint; 
}

function calculateWounds(attackPaint, defendingPaint){
    return attackPaint - defendingPaint < 0 ? 0 : attackPaint - defendingPaint;
}
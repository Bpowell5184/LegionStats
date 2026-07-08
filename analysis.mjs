import { doRolls } from "./doRolls.mjs";
import { setTimeout } from "timers/promises";
import fs from 'node:fs';

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

const waitTime = 10 // 1000 = 1 second

let currentRun = 0;
const numberOfRuns = 5;

while (currentRun < numberOfRuns){
    const units = JSON.parse(text);
    const stormtrooper = units.Stormtrooper;
    const battledroid = units["B1 Battle Droid"];
    const fileLocation = createFileNum();
    doRun(fileLocation, stormtrooper, battledroid, units);
    currentRun++;
}



async function doRun(fileLocation, unitOne, unitTwo, units){
    // 0 is storms, 1 is b1s
    let gameState = 0
    let rollArray = [];
    while (unitOne.Models > 0 && unitTwo.Models > 0){
        if (gameState == 0){
            writeToFile("Stormtroopers are attacking!", fileLocation);
            const unitOneAttack = unitOne.Models + unitOne.AttackDice;
            rollArray = doRolls('a', unitOneAttack);
            await setTimeout(waitTime);
            writeToFile(`Roll Array is ${rollArray}`, fileLocation);
            const paint = convertPaint(rollArray, unitOne.SurgeAttack, "a");
            await setTimeout(waitTime);
            writeToFile(`Paint amount is ${paint}`, fileLocation);

            const unitTwoDefense = paint + unitTwo.DefenseDice;
            rollArray = doRolls('d', unitTwoDefense);
            await setTimeout(waitTime);
            writeToFile(`Roll Array is ${rollArray}`, fileLocation);
            const paintb1 = convertPaint(rollArray, unitTwo.SurgeDefense, "d");
            await setTimeout(waitTime);
            writeToFile(`Paint amount is ${paintb1}`, fileLocation);
            await setTimeout(waitTime);
            let wounds = calculateWounds(paint, paintb1)
            writeToFile(`Wounds suffered are: ${wounds}`, fileLocation);
            unitTwo.Models = unitTwo.Models - wounds;
            writeToFile(`New Model Count is: ${unitTwo.Models}`, fileLocation);
            gameState = 1;
        } else if (gameState == 1){
            writeToFile("Battle Droids are attacking!", fileLocation);
            const unitTwoAttack = unitTwo.Models + unitTwo.AttackDice;
            rollArray = doRolls('a', unitTwoAttack);
            await setTimeout(waitTime);
            writeToFile(`Roll Array is ${rollArray}`, fileLocation);
            const paint = convertPaint(rollArray, unitTwo.SurgeAttack, "a");
            await setTimeout(waitTime);
            writeToFile(`Paint amount is ${paint}`, fileLocation);

            const unitOneDefense = paint + unitOne.DefenseDice;
            rollArray = doRolls('d', unitOneDefense);
            await setTimeout(waitTime);
            writeToFile(`Roll Array is ${rollArray}`, fileLocation);
            const paintstorm = convertPaint(rollArray, unitOne.SurgeDefense, "d");
            await setTimeout(waitTime);
            writeToFile(`Paint amount is ${paintstorm}`, fileLocation);
            await setTimeout(waitTime);
            let wounds = calculateWounds(paint, paintstorm)
            writeToFile(`Wounds suffered are: ${wounds}`, fileLocation);
            unitOne.Models = unitOne.Models - wounds;
            writeToFile(`New Model Count is: ${unitOne.Models}`, fileLocation);
            gameState = 0;
        }
    }

    console.log("Game concluded!");
    if (unitOne.Models <= 0){
        console.log("Battle droids Win!");
        writeToFile(`Battle Droids Win!`, fileLocation);
    } else if (unitTwo.Models <= 0){
        console.log("Stormtroopers Win!");
        writeToFile(`Stormtroopers Win!`, fileLocation);
    } else {
        console.log("Draw!");
        writeToFile(`Draw!`, fileLocation);
    }
}

function writeToFile(message, location){
    fs.appendFile(`./logs/battle_${location}`, message+'\n', err => {
        if (err) {
            console.error(err);
        } else {

        }
    });
}

function createFileNum(){
    const numbers = fs.readdirSync('./logs', { withFileTypes: true })
    .filter(e => e.isFile())
    .map(e => e.name.match(/_(\d+)$/))
    .filter(match => match != null)
    .map(match => Number(match[1]));

    const max = numbers.length ? Math.max(...numbers) : -1;
    return max+1;
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
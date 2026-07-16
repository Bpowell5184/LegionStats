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

const waitTime = 0 // 1000 = 1 second

let unitOneWins = 0;
let unitTwoWins = 0;

const unitOneName = "Stormtrooper";
const unitTwoName = "B1 Battle Droid";

let currentRun = 0;
const numberOfRuns = 100000;

const numLogs = 10;

const logNum = 10;

const basefileNum = createFileNum();
let fileLocation = basefileNum;

while (currentRun < numberOfRuns){
    const units = JSON.parse(text);
    const unitOne = getUnit(units, unitOneName);
    const unitTwo = getUnit(units, unitTwoName);
    fileLocation++;
    if (currentRun % (numberOfRuns/logNum) == 0) doRunLog(fileLocation, unitOne, unitTwo, units);
    else doRun(fileLocation, unitOne, unitTwo, units);
    currentRun++;
}

const totalMatches = unitOneWins + unitTwoWins;
console.log(`${unitOneName} Winrate: ${unitOneWins/totalMatches}`);
console.log(`${unitTwoName} Winrate: ${unitTwoWins/totalMatches}`);

function doRun(fileLocation, unitOne, unitTwo, units){
    // 0 is storms, 1 is b1s
    let gameState = 0
    let rollArray = [];
    while (unitOne.Models > 0 && unitTwo.Models > 0){
        if (gameState == 0){
            const unitOneAttack = unitOne.Models + unitOne.AttackDice;
            rollArray = doRolls('a', unitOneAttack);
            const unitOnePaint = convertPaint(rollArray, unitOne.SurgeAttack, "a");
            const unitTwoDefense = unitOnePaint + unitTwo.DefenseDice;
            rollArray = doRolls('d', unitTwoDefense);
            const unitTwoPaint = convertPaint(rollArray, unitTwo.SurgeDefense, "d");
            let wounds = calculateWounds(unitOnePaint, unitTwoPaint);
            unitTwo.Models = unitTwo.Models - wounds;
            gameState = 1;
        } else if (gameState == 1){
            const unitTwoAttack = unitTwo.Models + unitTwo.AttackDice;
            rollArray = doRolls('a', unitTwoAttack);
            const unitTwoPaint = convertPaint(rollArray, unitTwo.SurgeAttack, "a");
            const unitOneDefense = unitTwoPaint + unitOne.DefenseDice;
            rollArray = doRolls('d', unitOneDefense);
            const unitOnePaint = convertPaint(rollArray, unitOne.SurgeDefense, "d");
            let wounds = calculateWounds(unitTwoPaint, unitOnePaint)
            unitOne.Models = unitOne.Models - wounds;
            gameState = 0;
        }
    }

    if (unitOne.Models <= 0){
        unitTwoWins++;
    } else if (unitTwo.Models <= 0){
        unitOneWins++;
    }
}

function doRunLog(fileLocation, unitOne, unitTwo, units){
    // 0 is storms, 1 is b1s
    let gameState = 0
    let rollArray = [];
    while (unitOne.Models > 0 && unitTwo.Models > 0){
        if (gameState == 0){
            writeToFile(`${unitOne.name} are attacking!`, fileLocation);
            const unitOneAttack = unitOne.Models + unitOne.AttackDice;
            rollArray = doRolls('a', unitOneAttack);
            writeToFile(`Roll Array is ${rollArray}`, fileLocation);
            const unitOnePaint = convertPaint(rollArray, unitOne.SurgeAttack, "a");
            writeToFile(`Paint amount is ${unitOnePaint}`, fileLocation);
            const unitTwoDefense = unitOnePaint + unitTwo.DefenseDice;
            rollArray = doRolls('d', unitTwoDefense);
            writeToFile(`Roll Array is ${rollArray}`, fileLocation);
            const unitTwoPaint = convertPaint(rollArray, unitTwo.SurgeDefense, "d");
            writeToFile(`Paint amount is ${unitTwoPaint}`, fileLocation);
            let wounds = calculateWounds(unitOnePaint, unitTwoPaint);
            writeToFile(`Wounds suffered are: ${wounds}`, fileLocation);
            unitTwo.Models = unitTwo.Models - wounds;
            writeToFile(`New Model Count is: ${unitTwo.Models}`, fileLocation);
            gameState = 1;
        } else if (gameState == 1){
            writeToFile(`${unitTwo.name} are attacking!`, fileLocation);
            const unitTwoAttack = unitTwo.Models + unitTwo.AttackDice;
            rollArray = doRolls('a', unitTwoAttack);
            writeToFile(`Roll Array is ${rollArray}`, fileLocation);
            const unitTwoPaint = convertPaint(rollArray, unitTwo.SurgeAttack, "a");
            writeToFile(`Paint amount is ${unitTwoPaint}`, fileLocation);
            const unitOneDefense = unitTwoPaint + unitOne.DefenseDice;
            rollArray = doRolls('d', unitOneDefense);
            writeToFile(`Roll Array is ${rollArray}`, fileLocation);
            const unitOnePaint = convertPaint(rollArray, unitOne.SurgeDefense, "d");
            writeToFile(`Paint amount is ${unitOnePaint}`, fileLocation);
            let wounds = calculateWounds(unitTwoPaint, unitOnePaint)
            writeToFile(`Wounds suffered are: ${wounds}`, fileLocation);
            unitOne.Models = unitOne.Models - wounds;
            writeToFile(`New Model Count is: ${unitOne.Models}`, fileLocation);
            gameState = 0;
        }
    }
    if (unitOne.Models <= 0){
        writeToFile(`Battle Droids Win!`, fileLocation);
        unitTwoWins++;
    } else if (unitTwo.Models <= 0){
        writeToFile(`Stormtroopers Win!`, fileLocation);
        unitOneWins++;
    } else {
        writeToFile(`Draw!`, fileLocation);
    }
}

function getUnit(units, name){
    return { name, ...units[name] };
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
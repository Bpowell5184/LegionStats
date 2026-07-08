function doRolls(rollType, dice){
    const roll = translateDicePool(dice.split(","));
    if (rollType.toLowerCase() === "a"){
        for (let step = 0; step < roll.length; step++){
            rollAttack(roll[step]);
        }
    } else if (rollType.toLowerCase() == "d") {
        for (let step = 0; step < roll.length; step++){
            rollDefense(roll[step]);
        }
    }
}

function translateDicePool(rollList){
    const result = [];
    for (let step = 0; step < rollList.length; step++){
        const number = rollList[step].slice(0, -1);
        for (let i = 0; i < number; i++){
            result.push(rollList[step].slice(-1));
        }
    }
    return result;
}

function rollDxDice(sides){
    return 1 + Math.floor(Math.random() * sides);
}

function rollDefense(dice){
    const result = rollDxDice(6);
    if (result == 1) console.log("Surge");
    else {
        switch (dice.toLowerCase()){
            case 'r':
                if (result <= 4) console.log("Block");
                else console.log("Blank");
                break;
            case 'w':
                if (result == 2) console.log("Block");
                else console.log("Blank");
        }
    }
}

function rollAttack(dice){
    const result = rollDxDice(8);
    if (result == 1) console.log("Crit");
    else if (result == 7) console.log("Surge");
    else {
        switch (dice.toLowerCase()){
            case 'r':
                if (result <= 6) console.log("Hit");
                else console.log("Blank");
                break;
            case 'b':
                if (result <= 4) console.log("Hit");
                else console.log("Blank");
                break;
            case 'w':
                if (result === 2) console.log("Hit"); 
                else console.log("Blank");
                break;
        }
    }
}

export {doRolls};
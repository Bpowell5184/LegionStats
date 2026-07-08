function doRolls(rollType, dice){
    const roll = translateDicePool(dice.split(","));
    const rollArray = [];
    if (rollType.toLowerCase() === "a"){
        for (let step = 0; step < roll.length; step++){
            rollArray.push(rollAttack(roll[step]));
        }
    } else if (rollType.toLowerCase() == "d") {
        for (let step = 0; step < roll.length; step++){
            rollArray.push(rollDefense(roll[step]));
        }
    }
    return rollArray;
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
    const rollArray = [];
    const result = rollDxDice(6);
    if (result == 1) rollArray.push("Surge");
    else {
        switch (dice.toLowerCase()){
            case 'r':
                if (result <= 4) rollArray.push("Block");
                else rollArray.push("Blank");
                break;
            case 'w':
                if (result == 2) rollArray.push("Block");
                else rollArray.push("Blank");
        }
    }
    return rollArray;
}

function rollAttack(dice){
    const rollArray = [];
    const result = rollDxDice(8);
    if (result == 1) rollArray.push("Crit");
    else if (result == 7) rollArray.push("Surge");
    else {
        switch (dice.toLowerCase()){
            case 'r':
                if (result <= 6) rollArray.push("Hit");
                else rollArray.push("Blank");
                break;
            case 'b':
                if (result <= 4) rollArray.push("Hit");
                else rollArray.push("Blank");
                break;
            case 'w':
                if (result === 2) rollArray.push("Hit");
                else rollArray.push("Blank");
                break;
        }
    }
    return rollArray;
}

export {doRolls};
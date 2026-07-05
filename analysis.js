(function () {
    "use strict";

    const attackDice = "4w";
    doRolls('a', attackDice);
})();

function doRolls(rollType, dice){
    const roll = translateDicePool(dice.split(","));
    if (rollType.toLowerCase() === "a"){
        for (let step = 0; step < roll.length; step++){
            rollAttack(roll[step]);
        }
    } else {

    }
}

function translateDicePool(rollList){
    const result = [];
    for (let step = 0; step < rollList.length; step++){
        number = rollList[step].slice(0, -1);
        for (let i = 0; i < number; i++){
            result.push(rollList[step].slice(-1));
        }
    }
    return result;
}

function rollAttack(dice){
    sides = 8;
    result = 1 + Math.floor(Math.random() * sides);
    switch (dice.toLowerCase()){
        case 'r':
            if (result === 1){
                console.log("Crit");
            } else if (result <= 6){
                console.log("Hit");
            } else if (result === 7){
                console.log("Surge");
            } else {
                console.log("Blank");
            }
            break;
        case 'b':
            if (result === 1){
                console.log("Crit");
            } else if (result <= 4){
                console.log("Hit");
            } else if (result === 7){
                console.log("Surge");
            } else {
                console.log("Blank");
            }
            break;
        case 'w':
            if (result === 1){
                console.log("Crit");
            } else if (result === 2){
                console.log("Hit");
            } else if (result === 7){
                console.log("Surge");
            } else {
                console.log("Blank");
            }
            break;
    }
}
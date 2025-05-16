// https://www.geeksforgeeks.org/find-all-combinations-that-adds-upto-given-number-2/
// This site gave the base line formula for calculating all of the combinations. 

//https://smoothiegames.itch.io/endless-abyss
//go check out this game ^ 
//the dev helped with some coding advice.
let boxesAmountText = document.getElementById("boxes")
let guessAmountText = document.getElementById("guesses")
let SUCCESSText = document.getElementById("SUCCESS")
let boxesButton = document.getElementById("boxesButton")
let printArrayButton = document.getElementById("arrayButton")
let guessesButton = document.getElementById("guessesButton")
let boxInteger = 0
let guessInteger = 0
let bigLoopPermutaions = 0
let finalProbablity = 0
let loopCombinationsProb = [];
let loopCombinations = [];
let numOfCombinations = [];
let bigLoopCombinationsIndexes = [];
let absolute = "https://docs.google.com/presentation/d/1mCYoEoATJvJ7WIX0fb7eTLYwE6M0r7sQHqDZlG06YVo/present?token=AC4w5Vh3zGFTWL2HPCKvC7_6Jh7TnhRu_A:1604875742839&includes_info_params=1&eisi=COjZvoSE9OwCFQXOOgcd95EAeg#slide=id.ga8c6825146_0_14"

//button to enter the number of boxes
boxesButton.onclick = () => {
    setNumberOfBoxes();
};

//diagnostic button
printArrayButton.onclick = () => {
    loopCombinations = []; loopCombinationsProb = []; bigLoopCombinationsIndexes = []; bigLoopPermutaions = 0; finalProbablity = 0;
    findCombinations(boxInteger)
    //console.table(loopCombinations)
    intFindBigLoops()
    //console.table(bigLoopCombinationsIndexes)
    calcCombinationNumInt()
    //console.table(loopCombinationsProb)
    //console.log(loopCombinations.length)
    findTotalProb()
    findFinalProb()
    //console.log(finalProbablity)
};

//button to enter the number of guesses
guessesButton.onclick = () => {
    setNumberOfGuesses();
};

//promts you for the number of boxes after clicking the "change number of boxes" button. 
function setNumberOfBoxes() {
    const numBoxes = prompt("Input requested number boxes.");
    if (!numBoxes) {
        setNumberOfBoxes(); 
    } else {
        localStorage.setItem("boxes", numBoxes);
        intCheck(numBoxes);
        boxesAmountText.textContent = `The amount of boxes is ${numBoxes}`;
    }
}

//promts you for the number of guesses after clicking the "change number of guesses" button. 
function setNumberOfGuesses() {
    const numGuesses = prompt("Input requested number guesses.");
    if (!numGuesses) {
        setNumberOfGuesses(); 
    } else {
        localStorage.setItem("guesses", numGuesses);
        intCheckGuesses(numGuesses);
        guessAmountText.textContent = `The amount of guesses is ${numGuesses}`;
    }
}

//Checks if the number of boxes is an Integer
function intCheck(x) {
    x = Number(x);
    if ((Number.isInteger(x)) && (x < 101) && (x > 0)) {
        boxInteger = x;
    } else {
        alert("Thats not an acceptable value. (only positve integers are allowed that are less than 100)");
        setNumberOfBoxes(); 
        localStorage.setItem("boxes", 0);
        boxesAmountText.textContent = `The amount of boxes is ${numBoxes}`;
    }
}

//Checks if the number of guessses is an Integer
function intCheckGuesses(x) {
    x = Number(x);
    if ((Number.isInteger(x)) && (x < 101) && (x > 0)) {
        guessInteger = x;
    } else {
        alert("Thats not an acceptable value. (only positve integers are allowed that are less than 100)");
        setNumberOfGuesses(); 
        localStorage.setItem("guesses", 0);
        guessAmountText.textContent = `The amount of boxes is ${numGuesses}`;
    }
}

//initiates the function to calculate all the combinations of loop lengths
function findCombinations(x) {
    currentCombination = [];
    calcLoops(currentCombination, 0, x, x);
}

//function to calculate all the combinations of loop lengths
function calcLoops(currentCombination, combinationsNum, tempBoxInt, remainingBoxes) {
    if (remainingBoxes < 0) { 
        return;
    }
    if (remainingBoxes == 0) {
        currentCombination.length=combinationsNum
        let loopPush= []
        for (let l=0; l<currentCombination.length; l++) {
            loopPush.push(currentCombination[l])
        }
        loopCombinations.push([loopPush])
        return;
    }
    let previousLoopValue = (combinationsNum == 0) ? 1 : currentCombination[combinationsNum-1]
    for (let n=previousLoopValue; n<=tempBoxInt; n++) {
        currentCombination[combinationsNum]=n
        calcLoops(currentCombination, combinationsNum+1, tempBoxInt, (remainingBoxes - n));
    }
};

function intFindBigLoops () {
    for (let x=0; x<loopCombinations.length; x++) {
        findBigLoops(loopCombinations[x],x)
    }
}

function findBigLoops (testComboTransfer, index) {
    let testCombo = testComboTransfer[0]
    if (testCombo[testCombo.length-1] > guessInteger) {
        bigLoopCombinationsIndexes.push(index)
    }
}

//initiastes the function to calculate the number of permutaions of each pattern of loops.
function calcCombinationNumInt() {
    for (let x=0; x<bigLoopCombinationsIndexes.length; x++) {
        calcCombinationNum(loopCombinations[bigLoopCombinationsIndexes[x]])
    }
}

//function to calculate the number of permutaions of each pattern of loops.
function calcCombinationNum(loopComboNumTransfer) {
    let loopComboNum = loopComboNumTransfer[0]
    let tempComboNum = 1
    let tempDupeVal = 1
    let remainingBoxes = boxInteger
    let dupelessCombo = removeDupes(loopComboNum)
    for (let x=0; x<dupelessCombo.length; x++)/*gets all the array indexes */ {
        for (let n=1; n<=(findValAmount(loopComboNum, dupelessCombo[x])); n++)/*finds the amount of loops with a certain length| */ {
            tempDupeVal = tempDupeVal * ((nPr(remainingBoxes,dupelessCombo[x]))/(dupelessCombo[x]*n))
            remainingBoxes = remainingBoxes - dupelessCombo[x]
        }
        tempComboNum = tempComboNum * tempDupeVal
        tempDupeVal = 1
    }
    loopCombinationsProb.push(tempComboNum)
}

//finds the amount of a given loop length in the combination
function findValAmount (loopComboNum, num) {
    return loopComboNum.filter(Number => Number === num).length
}

//returns a copy of the combination given, but without any duplicate values
function removeDupes (loopComboNum) {
    return [...new Set(loopComboNum)]
}

//javascript representaion of the permutaion function.
function nPr (n,r) {
    return (factorialize(n)/(factorialize(n-r)))
}

//javascript representation of the factorial symobol "!"
function factorialize(x) {
    let semiFac = 1
    for (let n=1; n<=x; n++) {
        semiFac = semiFac*n
    }
    return semiFac
}

function findTotalProb() {
    for (let b=0; b<loopCombinationsProb.length; b++) {
        bigLoopPermutaions = bigLoopPermutaions + loopCombinationsProb[b]
    }
}

function findFinalProb() {
    finalProbablity = 1 - (bigLoopPermutaions/(factorialize(boxInteger)))
    SUCCESSText.textContent = `Your Chance Of Success Is: ${finalProbablity*100}%!!!`;
}

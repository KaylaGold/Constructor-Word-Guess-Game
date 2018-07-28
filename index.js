let Word = require("./Word.js");
let inquirer = require("inquirer");


//Add color for the console
let clc = require('cli-color');

let incorrect = clc.red;
let correct = clc.green;
let again = clc.yellow;
let disney = clc.bgMagenta;
let text = clc.magenta;
let text2 = clc.cyanBright;

//npm figlet package to style terminal
let figlet = require('figlet');

figlet('Word-Guess-Game!', function (err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data)

});

let wordBank = [
    'mickey', 'cinderella', 'pinocchio', 'belle', 'beast', 'ariel', 'mulan',
    'olaf', 'goofey'
];

let guesses;
let pickedWords;
let word;
let pickedWord;

function init() {
    pickedWords = [];
    console.log(disney("Hello, and Welcome to Word-Guess Disney!"));
    console.log(disney("Input any key letter to begin. Get more than 15 wrong and you lose."));
    console.log(text("------------------------------------------"));
    playGame();
}

function playGame() {
    pickedWord = "";
    guesses = 15;
    if (pickedWords.length < wordBank.length) {
        pickedWord = getWord();
    } else {

        console.log("You know a lot about your favorite Disney characters!");
        continuePrompt();
    }
    if (pickedWord) {
        word = new Word(pickedWord);
        word.makeLetters();
        makeGuess();
    }
}

function getWord() {
    let rand = Math.floor(Math.random() * wordBank.length);
    let randomWord = wordBank[rand];
    if (pickedWords.indexOf(randomWord) === -1) {
        pickedWords.push(randomWord);
        return randomWord;
    } else {
        return getWord();
    }
}

function makeGuess() {
    let checker = [];
    inquirer.prompt([
        {
            name: "guessedLetter",
            message: word.update() +
                "\nGuess a letter!" +
                "\nGuesses Left: " + guesses
        }
    ])
        .then(data => {
            word.letters.forEach(letter => {
                letter.checkLetter(data.guessedLetter);
                checker.push(letter.getCharacter());
            });
            if (guesses > 0 && checker.indexOf("_") !== -1) {
                guesses--;
                if (guesses === 0) {
                    console.log(incorrect("YOU RAN OUT OF GUESSES! GAME OVER."));
                    continuePrompt();
                } else {
                    makeGuess();
                }
            } else {
                console.log(correct("CONGRATULATIONS! YOU GOT THE WORD!"));
                console.log(word.update());
                playGame();
            }
        });
}

function continuePrompt() {
    inquirer.prompt([
        {
            name: "continue",
            type: "list",
            message: "Would you like to play again?",
            choices: ["Yes", "No"]
        }
    ])
        .then(data => {
            if (data.continue === "Yes") {
                init();
            } else {
                console.log("Thanks for playing!");
            }
        });
}

init();
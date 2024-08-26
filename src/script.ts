const paises: string[] = ["Brasil", "Argentina", "Canada", "Japao", "Franca", "Alemanha", "Espanha", "Italia", "Mexico", "Australia"];
const animais: string[] = ["Elefante", "Cachorro", "Gato", "Leao", "Tigre", "Girafa", "Cavalo", "Urso", "Coelho", "Rato"];
const comidas: string[] = ["Pizza", "Hamburguer", "Sorvete", "Chocolate", "Maca", "Banana", "Arroz", "Feijao", "Pao", "Salada"];

let selectedWord: string = "";
let count: number = 0;

//confirmar duvida do nodelist
function defineOptionButton(): NodeListOf<HTMLButtonElement> {
    return document.querySelectorAll(".buttonOption button");
}

function resetGame(): void {
    clearCanvas();
    drawHangManStructure();
    resetConfigurations();
}

function clearCanvas(): void {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const context = canvas.getContext("2d");
    if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }
}

function resetConfigurations(): void {
    selectedWord = "";
    count = 0;

    const dashesWordElement = document.getElementById('dashesWord');
    const buttonLettersElement = document.getElementById('buttonLetters');
    const titleElement = document.getElementById('title');

    if (dashesWordElement) dashesWordElement.innerHTML = '';
    if (buttonLettersElement) buttonLettersElement.innerHTML = '';
    if (titleElement) titleElement.style.display = 'block';

    (document.querySelector(".animais") as HTMLButtonElement).disabled = false;
    (document.querySelector(".paises") as HTMLButtonElement).disabled = false;
    (document.querySelector(".comidas") as HTMLButtonElement).disabled = false;

    const optionButtons = defineOptionButton();
    console.log("Option Button: ", optionButtons);

    optionButtons.forEach(button => {
        button.style.backgroundColor = "";
        button.style.color = "";
    });
}

function newGame(): void {
    document.getElementById('newGame')?.addEventListener('click', resetGame);
}

function drawHangManStructure(): void {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const context = canvas.getContext("2d");

    if (context) {
        context.lineWidth = 2;
        context.lineCap = 'round';

        // height
        context.beginPath();
        context.moveTo(50, 125);
        context.lineTo(50, 50);
        context.strokeStyle = "#000";
        context.stroke();

        // upper horizontal line
        context.beginPath();
        context.moveTo(45, 50);
        context.lineTo(85, 50);
        context.strokeStyle = "#000";
        context.stroke();

        // pin
        context.beginPath();
        context.moveTo(85, 50);
        context.lineTo(85, 65);
        context.strokeStyle = "#000";
        context.stroke();

        // ground
        context.beginPath();
        context.moveTo(45, 125);
        context.lineTo(55, 125);
        context.strokeStyle = "#000";
        context.stroke();

        // detail
        context.beginPath();
        context.moveTo(50, 60);
        context.lineTo(60, 50);
        context.strokeStyle = "#000";
        context.stroke();
    }
}

window.onload = function () {
    drawHangManStructure();
    newGame();
}

function selectCategory(category: string): void {
    let categoryArray: string[];

    switch (category) {
        case 'paises':
            categoryArray = paises;
            break;
        case 'animais':
            categoryArray = animais;
            break;
        case 'comidas':
            categoryArray = comidas;
            break;
        default:
            return; // Caso a categoria seja inválida
    }

    WordSelection(categoryArray);
    dashingWord();
    hideTitle();
    disableOptions();
    createKeyboard();
}

function WordSelection(categoryArray: string[]): void {
    selectedWord = selectRandomWord(categoryArray);
    selectedWord = selectedWord.toUpperCase();
}

function dashingWord(): void {
    const dashesWordElement = document.getElementById('dashesWord');
    if (dashesWordElement) {
        let displayItem = selectedWord.replace(/./g, '<span class="dashes">_</span>');
        dashesWordElement.innerHTML = displayItem;
    }
}

function hideTitle(): void {
    const titleElement = document.getElementById('title');
    if (titleElement) titleElement.style.display = 'none';
}

function disableOptions(): void {
    document.getElementById("buttonOption")?.addEventListener("click", function () {
        (document.querySelector(".animais") as HTMLButtonElement).disabled = true;
        (document.querySelector(".paises") as HTMLButtonElement).disabled = true;
        (document.querySelector(".comidas") as HTMLButtonElement).disabled = true;
    });
}

function createKeyboard(): void {
    const buttonContainer = document.getElementById("buttonLetters");
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    if (buttonContainer) {
        fixingMargins(buttonContainer);

        alphabet.split("").forEach(letter => {
            const button = document.createElement("button");
            button.textContent = letter;
            button.classList.add("button");
            button.addEventListener("click", () => {
                button.disabled = true;
                checkLetters(letter);
                changeColorSelected(button);
            });
            buttonContainer.appendChild(button);
        });
    }
}

function fixingMargins(buttonContainer: HTMLElement): void {
    const titleElement = document.getElementById('title');
    const buttonOptionElement = document.getElementById('buttonOption');
    if (titleElement) titleElement.style.margin = 'none';
    if (buttonOptionElement) buttonOptionElement.style.margin = 'none';
    buttonContainer.style.margin = '2vh 0 0vh';
}

function selectRandomWord(array: string[]): string {
    const index = Math.floor(Math.random() * array.length);
    return array[index];
}

function changeColorSelected(button: HTMLButtonElement): void {
    button.style.backgroundColor = "lightblue";
    button.style.color = "black";
}

function checkLetters(letter: string): void {
    const charWord = selectedWord.split("");
    let i: number = 0;
    let updateDisplay: string = "";
    let letterFound: boolean = false;

    const dashesWordElement = document.getElementById('dashesWord');

    if (dashesWordElement) {
        for (i = 0; i < selectedWord.length; i++) {
            if (charWord[i] === letter) {
                updateDisplay += `<span class="dashes">${letter}</span>`;
                letterFound = true;
            } else {
                updateDisplay += dashesWordElement.children[i].outerHTML;
            }
        }

        if (letterFound) {
            dashesWordElement.innerHTML = updateDisplay;
            if (!updateDisplay.includes('_')) {
                alert("Parabéns!");
            }
        } else {
            count++;
            if (count > 6) {
                alert(`Você perdeu! A palavra era: ${selectedWord}`);
            } else {
                drawStickMan(count);
            }
        }
    }
}

function drawStickMan(count: number): void {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const context = canvas.getContext("2d");

    if (context) {
        context.lineWidth = 2;
        context.lineCap = 'round';

        switch (count) {
            case 1:
                // head
                context.beginPath();
                context.arc(85, 73, 7, 0, 2 * Math.PI, false);
                context.strokeStyle = '#000';
                context.stroke();
                break;

            case 2:
                // body
                context.beginPath();
                context.moveTo(85, 80);
                context.lineTo(85, 100);
                context.strokeStyle = "#000";
                context.stroke();
                break;

            case 3:
                // right arm
                context.beginPath();
                context.moveTo(85, 87);
                context.lineTo(95, 97);
                context.strokeStyle = "#000";
                context.stroke();
                break;

            case 4:
                // left arm
                context.beginPath();
                context.moveTo(85, 87);
                context.lineTo(75, 97);
                context.strokeStyle = "#000";
                context.stroke();
                break;

            case 5:
                // right leg
                context.beginPath();
                context.moveTo(85, 100);
                context.lineTo(95, 110);
                context.strokeStyle = "#000";
                context.stroke();
                break;

            case 6:
                // left leg
                context.beginPath();
                context.moveTo(85, 100);
                context.lineTo(75, 110);
                context.strokeStyle = "#000";
                context.stroke();
                break;
        }
    }
}

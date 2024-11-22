const unitLength = 20;
const boxColor = 150;
const strokeColor = 50;
let columns; /* To be determined by window width */
let rows;    /* To be determined by window height */
let currentBoard;
let nextBoard;
let fr = 10;
let slider;

function setup() {
    /* Set the canvas to be under the element #canvas*/
    const canvas = createCanvas(windowWidth - 50, windowHeight - 350);
    canvas.parent(document.querySelector('#canvas'));

    /*Calculate the number of columns and rows */
    columns = floor(width / unitLength);
    rows = floor(height / unitLength);

    /*Making both currentBoard and nextBoard 2-dimensional matrix that has (columns * rows) boxes. */
    currentBoard = [];
    nextBoard = [];
    for (let i = 0; i < columns; i++) {
        currentBoard[i] = [];
        nextBoard[i] = []
    }
    // slider = createSlider(1, 100, fr, 1);
    // slider.style('width', '300px');
    frameRate(fr);
    textSize(20);
    textAlign(CENTER);
    text(frameCount, width / 2, height / 2);


    // Now both currentBoard and nextBoard are array of array of undefined values.
    init();  // Set the initial values of the currentBoard and nextBoard
}

/**
* Initialize/reset the board state
*/
function init() {
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            currentBoard[i][j] = 0;
            nextBoard[i][j] = 0;
        }
    }
}

function init_random() {
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            currentBoard[i][j] = Math.floor(Math.random() * 2); // <- Math.floor( Math.radom())
            //nextBoard[i][j] = Math.floor(Math.random() * 1);
            // if (currentBoard[i][j] < Math.floor(Math.random() * 10)) {
            //     fill(boxColor);
            // } else {
            //     fill(255);
            // }
            // stroke(strokeColor);
            // rect(i * unitLength, j * unitLength, unitLength, unitLength);
        }
    }
}



function draw() {
    console.log(fr);
    background(255);
    generate();
    frameRate(fr);
    text(frameCount, width / 2, height / 2);
    // let val = slider.value();
    // frameRate(val);
    // console.log(val);


    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            if (currentBoard[i][j] == 1) {
                if (isChangedColor) {
                    fill(newColor);
                } else {
                    fill(boxColor);
                }
            } else {
                fill(255);
            }
            stroke(strokeColor);
            rect(i * unitLength, j * unitLength, unitLength, unitLength);
        }
    }


}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }

function generate() {
    //Loop over every single box on the board
    for (let x = 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {
            // Count all living members in the Moore neighborhood(8 boxes surrounding)
            let neighbors = 0;
            for (let i of [-1, 0, 1]) {
                for (let j of [-1, 0, 1]) {
                    if (i == 0 && j == 0) {
                        // the cell itself is not its own neighbor
                        continue;
                    }
                    // The modulo operator is crucial for wrapping on the edge
                    neighbors += currentBoard[(x + i + columns) % columns][(y + j + rows) % rows];
                }
            }

            // Rules of Life
            if (currentBoard[x][y] == 1 && neighbors < 2) {
                // Die of Loneliness
                nextBoard[x][y] = 0;
            } else if (currentBoard[x][y] == 1 && neighbors > 3) {
                // Die of Overpopulation
                nextBoard[x][y] = 0;
            } else if (currentBoard[x][y] == 0 && neighbors == 3) {
                // New life due to Reproduction
                nextBoard[x][y] = 1;
            } else {
                // Stasis
                nextBoard[x][y] = currentBoard[x][y];
            }
        }
    }

    // Swap the nextBoard to be the current Board
    [currentBoard, nextBoard] = [nextBoard, currentBoard];
}

// **
//  * When mouse is dragged
//  */
function mouseDragged() {
    /**
     * If the mouse coordinate is outside the board
     */
    if (mouseX > unitLength * columns || mouseY > unitLength * rows) {
        return;
    }
    const x = Math.floor(mouseX / unitLength);
    const y = Math.floor(mouseY / unitLength);
    currentBoard[x][y] = 1;
    fill(boxColor);
    stroke(strokeColor);
    rect(x * unitLength, y * unitLength, unitLength, unitLength);
}

// function mouseDragged() {
//     /**
//      * If the mouse coordinate is outside the board
//      */
//     // colorMode(HSL);
//     // noStroke();
//     // var colors = [];
//     // var newColor = color(random(360), random(100), random(100));

//     if (mouseX > unitLength * columns || mouseY > unitLength * rows) {
//         return;
//     }

//     // colors.push(newColor);
//     const x = Math.floor(mouseX / unitLength);
//     const y = Math.floor(mouseY / unitLength);
//     currentBoard[x][y] = 1;
//     fill(random(colors));
//     fill(boxColor);
//     stroke(strokeColor);
//     rect(x * unitLength, y * unitLength, unitLength, unitLength);
// }

/**
 * When mouse is pressed
 */
function mousePressed() {
    if (mouseX > unitLength * columns || mouseY > unitLength * rows) {
        return;
    }
    noLoop();
    mouseDragged();
}

/**
 * When mouse is released
 */
// function mouseReleased() {
// loop();
// }

let isChangedColor = false;
let newColor;


window.addEventListener("load", () => {

    const element1 = document.getElementById("start");
    element1.addEventListener("click", () => {
        loop();
        //button.mousePressed(changeBG);
        // if (element.innerText == "Start") {
        //     loop();
        //     element.innerText = "Stop"
        // } else if (element.innerText == "Stop") {
        //     noLoop();
        //     element.innerText = "Start"
        // }


    })

    const element2 = document.getElementById("stop");
    element2.addEventListener("click", () => {
        noLoop();
    })

    const element3 = document.getElementById("clear");
    element3.addEventListener("click", () => {
        init();
        loop();
        noLoop();
    })


    const element4 = document.getElementById("ran");
    element4.addEventListener("click", () => {
        init_random();
        loop();
        noLoop();

    })


    const element5 = document.getElementById("multcolor");
    element5.addEventListener("click", () => {
        //noStroke();
        //colorMode(HSL);
        //var colors = [];
        newColor = color(random(360), random(100), random(100));
        isChangedColor = true;
        //colors.push(newColor);
        //fill(random(colors));
        //loop();
        //noLoop();

    })

    const element6 = document.getElementById("speed");
    element6.addEventListener("change", () => {
       fr = parseInt(document.getElementById("speed").value);
    })
})




const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const resolution = 25;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const COLS = Math.floor(canvas.width / resolution);
const ROWS = Math.floor(canvas.height / resolution);

function buildGrid() {
    return new Array(COLS).fill(null)
        .map(() => new Array(ROWS).fill(null)
            .map(() => Math.random() > 0.9 ? 1 : 0))

}
let grid = buildGrid()

function drawGrid(grid) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let col = 0; col < grid.length; col++) {
        for (let row = 0; row < grid[col].length; row++) {
            const cell = grid[col][row];
            ctx.beginPath();
            ctx.rect(col * resolution, row * resolution, resolution, resolution);
            ctx.fillStyle = cell ? '#00ff00' : '#111';
            ctx.fill();
            ctx.strokeStyle = '#222';
            ctx.stroke();
        }
    }
}

function countNeighbors(grid, x, y) {
    let sum = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const col = (x + i + COLS) % COLS;
            const row = (y + j + ROWS) % ROWS;
            sum += grid[col][row];
        }
    }
    sum -= grid[x][y];
    return sum;
}

function nextGen(grid) {
    const nextGrid = grid.map(arr => [...arr]);
    for (let col = 0; col < grid.length; col++) {
        for (let row = 0; row < grid[col].length; row++) {
            const cell = grid[col][row];
            const neighbors = countNeighbors(grid, col, row);

            if (cell === 1 && (neighbors < 2 || neighbors > 3)) {
                nextGrid[col][row] = 0;
            } else if (cell === 0 && neighbors === 3) {
                nextGrid[col][row] = 1;
            }
        }
    }
    return nextGrid;
}

function update() {
    grid = nextGen(grid);
    drawGrid(grid);
    requestAnimationFrame(update);
}

drawGrid(grid);
requestAnimationFrame(update);
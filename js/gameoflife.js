function seed() {
  return Array.from(arguments);
}

function same([x, y], [j, k]) {
  return arguments[0][0] === arguments[1][0] && arguments[0][1] === arguments[1][1];
}

// The game state to search for `cell` is passed as the `this` value of the function.
function contains(cell) {
  for (let i=0; i<this.length; i++) {
    if(this[i][0] === cell[0] && this[i][1] === cell[1])
      return true;
  }
  return false;
}

const printCell = (cell, state) => {
  return contains.call(state, cell) ? "\u25A3" : "\u25A2";
};

const corners = (state = []) => {
  let corners = {
    topRight: [0,0],
    bottomLeft: [0,0]
  };
  
  if (state.length) {
    let xAxis = [];
    let yAxis = [];

    state.forEach(element => {
      let [x,y] = element;
      xAxis.push(x);
      yAxis.push(y);
    });
    let minX = Math.min(...xAxis);
    let maxX = Math.max(...xAxis);
    let minY = Math.min(...yAxis);
    let maxY = Math.max(...yAxis);

    corners.topRight = [maxX, maxY];
    corners.bottomLeft = [minX, minY];
  }
  
  return corners;
};

const printCells = (state) => {
  let printed = "";
  const limits = corners(state);
  let [maxX, maxY] = limits.topRight;
  let [minX, minY] = limits.bottomLeft;

  for(let j=maxY; j>=minY; j--){
    let row = [];

    for(let i=minX; i<=maxX; i++){
      row.push(printCell([i, j], state));
    }
    printed += row.join(" ") + "\n";
  }

  return printed;
};

const getNeighborsOf = ([x, y]) => {
  return [
    [x-1, y+1], [x, y+1], [x+1, y+1], [x-1, y],
    [x+1, y], [x-1, y-1], [x, y-1], [x+1, y-1]
  ];
};

const getLivingNeighbors = (cell, state) => {
  return getNeighborsOf(cell).filter(element => contains.bind(state)(element));
};

const willBeAlive = (cell, state) => {
  const aliveNeighbors = getLivingNeighbors(cell, state);
  return aliveNeighbors.length === 3 || (contains.call(state, cell) && aliveNeighbors.length === 2);
};

const calculateNext = (state) => {
  const limits = corners(state);
  let minX = limits.bottomLeft[0] - 1;
  let maxX = limits.topRight[0] + 1;
  let minY = limits.bottomLeft[1] - 1;
  let maxY = limits.topRight[1] + 1;
  let futureState = [];

  for(let j=maxY; j>=minY; j--){
    for(let i=minX; i<=maxX; i++){
      if(willBeAlive([i, j], state)){
        futureState.push([i, j]);
      }  
    }
  }

  return futureState;
};

const iterate = (state, iterations) => {};

const main = (pattern, iterations) => {};

const startPatterns = {
    rpentomino: [
      [3, 2],
      [2, 3],
      [3, 3],
      [3, 4],
      [4, 4]
    ],
    glider: [
      [-2, -2],
      [-1, -2],
      [-2, -1],
      [-1, -1],
      [1, 1],
      [2, 1],
      [3, 1],
      [3, 2],
      [2, 3]
    ],
    square: [
      [1, 1],
      [2, 1],
      [1, 2],
      [2, 2]
    ]
  };
  
  const [pattern, iterations] = process.argv.slice(2);
  const runAsScript = require.main === module;
  
  if (runAsScript) {
    if (startPatterns[pattern] && !isNaN(parseInt(iterations))) {
      main(pattern, parseInt(iterations));
    } else {
      console.log("Usage: node js/gameoflife.js rpentomino 50");
    }
  }
  
  exports.seed = seed;
  exports.same = same;
  exports.contains = contains;
  exports.getNeighborsOf = getNeighborsOf;
  exports.getLivingNeighbors = getLivingNeighbors;
  exports.willBeAlive = willBeAlive;
  exports.corners = corners;
  exports.calculateNext = calculateNext;
  exports.printCell = printCell;
  exports.printCells = printCells;
  exports.startPatterns = startPatterns;
  exports.iterate = iterate;
  exports.main = main;
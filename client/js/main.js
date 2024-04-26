//import Circle from "./circle.js";
//import Line from "./line.js";
//import Node from "./node.js";
//import Edge from "./edge.js";
//import Puzzle from "./puzzle.js";
//import EdgeSolution from "./edge_solution.js";

var puzzle = new Puzzle(null);
var edges = [];
var listeners = [];

// Launches app

document.addEventListener("readystatechange",(event) => {
    if(event.target.readyState === "complete"){
        initApp();
    }
});

const initApp = () => {
    console.log('App launched EBarbe')

    const canvas = document.getElementById('myCanvas');
    canvas.width = 5000;
    canvas.height = 5000;
    

    const nrow = 10;
    const ncol = 10;
    const puzzles = 3;
    const nedges = 20;
    document.getElementById("NewPuzzle").addEventListener (
        'click', 
        function() {           // anonyme Funktion
            createNewPuzzle(nrow,ncol,puzzles,nedges);
        }, 
        false
     );
 
    document.getElementById("Reset").addEventListener (
        'click', 
        function() {           // anonyme Funktion
            resetPuzzle(edges);  
        }, 
        false
     );
    document.getElementById("Solution").addEventListener (
        'click', 
        function() {           // anonyme Funktion
            showSolution(puzzle);  
        }, 
        false
     );

    };

const createNewPuzzle = (nrow,ncol) => {
    console.log("Create New Puzzle");
    const canvas = document.getElementById("myCanvas");
    canvas.replaceWith(canvas.cloneNode(true));
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    const puzzles = document.getElementById("npuzzle").value;
    console.log(document.getElementById("npuzzle").value);
    const nedges = document.getElementById("nedges").value
    var nodeMatrix = []
    for(let i = 0; i < nrow+puzzles; i++){
        var row = []
        for(let j = 0; j < ncol+puzzles;j++){
            row.push(0);
        }
        nodeMatrix.push(row);
    }

    puzzle = mergeMultiplePusszles(nodeMatrix, nrow,ncol,nedges,puzzles);
    var nodes = []
    for(let i = 0; i < puzzle.getNodeMatrix().length; i++){
        for(let j = 0; j < puzzle.getNodeMatrix()[i].length; j++){
            if(puzzle.getNodeMatrix()[i][j] > 0){
                const node = new Node(nodes.length, puzzle.getNodeMatrix()[i][j],i+1,j+1);
                node.setGame();
                node.updateNodeWithOffsets(0,0,0)
                nodes.push(node);
            }
        }
    }

    var nMatrix = []
    for(let i = 0; i < puzzle.getNodeMatrix().length + 2; i++){
        var row = []
        for(let j = 0; j < puzzle.getNodeMatrix()[0].length + 2; j++){
            var found = false;
            for(let n=0; n<nodes.length; n++){
                if(nodes[n].getRow()-1 == i && nodes[n].getColumn()-1 == j){
                    row.push(nodes[n]);
                    found = true;
                    break;
                }
            }
            if(!found){
                row.push(null);
            }
        }
        nMatrix.push(row)
    }
    edges = findEdges(nodes,nMatrix)
    buildField(nodes,edges)
    console.log("Solution: ", puzzle.solution);

}

const resetPuzzle = () => {
    console.log("Reset Puzzle");
    const canvas = document.getElementById("myCanvas")
    canvas.replaceWith(canvas.cloneNode(true));
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    var nodes = []
    for(let i = 0; i < puzzle.getNodeMatrix().length; i++){
        for(let j = 0; j < puzzle.getNodeMatrix()[i].length; j++){
            if(puzzle.getNodeMatrix()[i][j] > 0){
                const node = new Node(nodes.length, puzzle.getNodeMatrix()[i][j],i+1,j+1);
                node.setGame();
                node.updateNodeWithOffsets(0,0,0)
                nodes.push(node);
            }
        }
    }
    for(let e = 0; e < edges.length; e++){
        edges[e].line.click_count = 0;
    }
    buildField(nodes,edges)

}

const showSolution = () => {
    console.log("Show Solution");
    const canvas = document.getElementById("myCanvas")
    canvas.replaceWith(canvas.cloneNode(true));
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    for(let e = 0; e < edges.length; e++){
        //console.log(edges[e].edge_solution);
        if(edges[e].edge_solution != null){
            edges[e].getLine().click_count = edges[e].edge_solution.val;
            drawLine(edges[e].line);
        }
        //console.log("Draw line for: ", edges[e].getLine())
    }
    var nodes = []
    for(let i = 0; i < puzzle.getNodeMatrix().length; i++){
        for(let j = 0; j < puzzle.getNodeMatrix()[i].length; j++){
            if(puzzle.getNodeMatrix()[i][j] > 0){
                const node = new Node(nodes.length, puzzle.getNodeMatrix()[i][j],i+1,j+1);
                node.setGame();
                node.updateNodeWithOffsets(0,0,0)
                nodes.push(node);
            }
        }
    }
    //buildField(nodes,edges)
}


const randn_bm = (min, max, skew) => {
    let u = 0, v = 0;
    while(u === 0) u = Math.random() //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random()
    let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v )
    
    num = num / 10.0 + 0.5 // Translate to 0 -> 1
    if (num > 1 || num < 0) 
      num = randn_bm(min, max, skew) // resample between 0 and 1 if out of range
    
    else{
      num = Math.pow(num, skew) // Skew
      num *= max - min // Stretch to fill range
      num += min // offset to min
    }
    return num
  }

const mergeMultiplePusszles = (nodeMatrix, nrows, ncols, nedges, n_puzzle) => {
    var puzzles = [];
    
    var r = 1;
    var c = 1;

    const puzz_cols = 1;
    const puzz_rows = 1;
    const ncols_per_puzzle = Math.floor(ncols / puzz_cols);
    const row_per_puzzle = Math.floor(nrows / puzz_rows);

    for(let p = 0; p < n_puzzle; p++){
        console.log("new puzzle: ", p)
        var curr_node_matrix = []
        for(let i = 0; i < row_per_puzzle; i++){
            var row = []
            for(let j = 0; j < ncols_per_puzzle;j++){
                row.push(0);
            }
            curr_node_matrix.push(row);
        }
        var new_puzz = createRandomPath(curr_node_matrix,row_per_puzzle,ncols_per_puzzle,nedges);
        console.log("new puzzle: ", new_puzz)
        new_puzz.puzz_c = (p%puzz_cols);
        new_puzz.puzz_r = Math.floor((p/puzz_cols));
        puzzles.push(new_puzz);
    }

    var nodes = []
    
    var puzzle = puzzles[0];

    for(let i = 1; i < puzzles.length; i++){
        puzzle = mergeTwoPuzzle(puzzle,puzzles[i],(i-1) % 4)
    }
    puzzle = makeAllTwoOdd(puzzle);
    return puzzle;
}

const helperMakeOdd = (puzzle, new_point,from_point) => {
    console.log("Helper Odd p1:  ", new_point, " p2: ", from_point)
    var found = false;
    var change_r = 0;
    var change_c = 2;
    var pot_path = [];
    while(new_point[1] + change_c < puzzle.getNodeMatrix()[0].length && !found && new_point[1] + change_c != from_point[1]){
        if(puzzle.getNodeMatrix()[new_point[0]][new_point[1] + change_c] > 0){
            puzzle.getNodeMatrix()[new_point[0]][new_point[1] + change_c] += 1;
            puzzle.getNodeMatrix()[new_point[0]][new_point[1]] += 1;
            puzzle.solution.push(new EdgeSolution([new_point[0],new_point[1] + change_c],[new_point[0],new_point[1]],1))
            found = true;
            console.log("New edge between: ", new_point[0],new_point[1], " and ", new_point[0] + change_r, new_point[1] + change_c, 1)
            for(let j=0; j < pot_path.length; j++){
                puzzle.getNodeMatrix()[pot_path[j][0]][pot_path[j][1]] = -1;
            }
            return puzzle;
            break;
        }
        if(puzzle.getNodeMatrix()[new_point[0]][new_point[1] + change_c] == -1 || new_point[1] + change_c == from_point[1] && new_point[0] + change_r == from_point[0]){
            return null;
            break;
        }
        pot_path.push([new_point[0] + change_r, new_point[1] + change_c])
        change_c += 2;
    }
    var change_r = -1;
    var change_c = 1;
    pot_path = [];
    while(new_point[1] + change_c < puzzle.getNodeMatrix()[0].length && new_point[0] + change_r >= 0 && !found && new_point[1] + change_c == from_point[1] && new_point[0] + change_r == from_point[0]){
        if(puzzle.getNodeMatrix()[new_point[0]+change_r][new_point[1] + change_c] > 0){
            puzzle.getNodeMatrix()[new_point[0]+change_r][new_point[1] + change_c] += 1;
            puzzle.getNodeMatrix()[new_point[0]][new_point[1]] += 1;
            puzzle.solution.push(new EdgeSolution([new_point[0]+change_r,new_point[1] + change_c],[new_point[0],new_point[1]],1))
            found = true;
            for(let j=0; j < pot_path.length; j++){
                puzzle.getNodeMatrix()[pot_path[j][0]][pot_path[j][1]] = -1;
            }
            console.log("New edge between: ", new_point[0],new_point[1], " and ", new_point[0] + change_r, new_point[1] + change_c,1)
            return puzzle;
            break;
        }
        if(puzzle.getNodeMatrix()[new_point[0]][new_point[1] + change_c] == -1 || new_point[1] + change_c == from_point[1] && new_point[0] + change_r == from_point[0]){
            return null;
            break;
        }
        pot_path.push([new_point[0] + change_r, new_point[1] + change_c])
        change_r--;
        change_c++;
    }
    var change_r = -1;
    var change_c = -1;
    pot_path = [];
    while(new_point[1] + change_c >= 0 && new_point[0] + change_r >= 0 && !found && new_point[1] + change_c != from_point[1] && new_point[0] + change_r != from_point[0]){
        if(puzzle.getNodeMatrix()[new_point[0]+change_r][new_point[1] + change_c] > 0){
            puzzle.getNodeMatrix()[new_point[0]+change_r][new_point[1] + change_c] += 1;
            puzzle.getNodeMatrix()[new_point[0]][new_point[1]] += 1;
            puzzle.solution.push(new EdgeSolution([new_point[0]+change_r,new_point[1] + change_c],[new_point[0],new_point[1]],1))
            found = true;
            for(let j=0; j < pot_path.length; j++){
                puzzle.getNodeMatrix()[pot_path[j][0]][pot_path[j][1]] = -1;
            }
            console.log("New edge between: ", new_point[0],new_point[1], " and ", new_point[0] + change_r, new_point[1] + change_c,1)
            return puzzle;
            break;
        }
        if(puzzle.getNodeMatrix()[new_point[0]][new_point[1] + change_c] == -1 || new_point[1] + change_c == from_point[1] && new_point[0] + change_r == from_point[0]){
            return null;
            break;
        }
        pot_path.push([new_point[0] + change_r, new_point[1] + change_c])
        change_r--;
        change_c++;
    }
    var change_r = 0;
    var change_c = -2;
    pot_path = [];
    while(new_point[1] + change_c >= 0 && new_point[0] + change_r >= 0 && !found && new_point[1] + change_c != from_point[1] && new_point[0] + change_r != from_point[0]){
        if(puzzle.getNodeMatrix()[new_point[0]+change_r][new_point[1] + change_c] > 0){
            puzzle.getNodeMatrix()[new_point[0]+change_r][new_point[1] + change_c] += 1;
            puzzle.getNodeMatrix()[new_point[0]][new_point[1]] += 1;
            puzzle.solution.push(new EdgeSolution([new_point[0]+change_r,new_point[1] + change_c],[new_point[0],new_point[1]],1))
            found = true;
            for(let j=0; j < pot_path.length; j++){
                puzzle.getNodeMatrix()[pot_path[j][0]][pot_path[j][1]] = -1;
            }
            console.log("New edge between: ", new_point[0],new_point[1], " and ", new_point[0] + change_r, new_point[1] + change_c,1)
            return puzzle;
            break;
        }
        if(puzzle.getNodeMatrix()[new_point[0]][new_point[1] + change_c] == -1 || new_point[1] + change_c == from_point[1] && new_point[0] + change_r == from_point[0]){
            return null;
            break;
        }
        pot_path.push([new_point[0] + change_r, new_point[1] + change_c])
        change_c-=2;
    }
    var change_r = 1;
    var change_c = -1;
    pot_path = [];
    while(new_point[1] + change_c >= 0 && new_point[0] + change_r < puzzle.getNodeMatrix().length && !found && new_point[1] + change_c != from_point[1] && new_point[0] + change_r != from_point[0]){
        if(puzzle.getNodeMatrix()[new_point[0]+change_r][new_point[1] + change_c] > 0){
            puzzle.getNodeMatrix()[new_point[0]+change_r][new_point[1] + change_c] += 1;
            puzzle.getNodeMatrix()[new_point[0]][new_point[1]] += 1;
            puzzle.solution.push(new EdgeSolution([new_point[0]+change_r,new_point[1] + change_c],[new_point[0],new_point[1]],1))
            found = true;
            for(let j=0; j < pot_path.length; j++){
                puzzle.getNodeMatrix()[pot_path[j][0]][pot_path[j][1]] = -1;
            }
            console.log("New edge between: ", new_point[0],new_point[1], " and ", new_point[0] + change_r, new_point[1] + change_c,1)
            return puzzle;
            break;
        }
        if(puzzle.getNodeMatrix()[new_point[0]][new_point[1] + change_c] == -1 || new_point[1] + change_c == from_point[1] && new_point[0] + change_r == from_point[0]){
            return null;
            break;
        }
        pot_path.push([new_point[0] + change_r, new_point[1] + change_c])
        change_r++;
        change_c--;
    }
    var change_r = 1;
    var change_c = 1;
    pot_path = [];
    while(new_point[1] + change_c < puzzle.getNodeMatrix()[new_point[0]].length && new_point[0] + change_r < puzzle.getNodeMatrix().length && !found && new_point[1] + change_c != from_point[1] && new_point[0] + change_r != from_point[0]){
        if(puzzle.getNodeMatrix()[new_point[0]+change_r][new_point[1] + change_c] > 0){
            puzzle.getNodeMatrix()[new_point[0]+change_r][new_point[1] + change_c] += 1;
            puzzle.getNodeMatrix()[new_point[0]][new_point[1]] += 1;
            found = true;
            for(let j=0; j < pot_path.length; j++){
                puzzle.getNodeMatrix()[pot_path[j][0]][pot_path[j][1]] = -1;
            }
            puzzle.solution.push(new EdgeSolution([new_point[0]+change_r,new_point[1] + change_c],[new_point[0],new_point[1]],1))
            console.log("New edge between: ", new_point[0],new_point[1], " and ", new_point[0] + change_r, new_point[1] + change_c,1)
            return puzzle;
            break;
        }
        if(puzzle.getNodeMatrix()[new_point[0]][new_point[1] + change_c] == -1 || new_point[1] + change_c == from_point[1] && new_point[0] + change_r == from_point[0]){
            return null;
            break;
        }
        pot_path.push([new_point[0] + change_r, new_point[1] + change_c])
        change_r++;
        change_c++;
    }
    return null;
}

const makeAllTwoOdd = (puzzle) => {
    const puzz_copy = puzzle.getNodeMatrix();
    console.log("make all two odd")
    var points = []
    for(let i = 0; i < puzzle.getNodeMatrix().length; i++){
        for(let j = 0; j < puzzle.getNodeMatrix()[i].length;j++){
            if(puzz_copy[i][j] == 2){
                points.push([i,j]);
                var found = false;
                var change_c = 2;
                var change_r = 0;
                //console.log("New edge between: ", i,j, " and ", i + change_r, j + change_c)
                while(j + change_c < puzzle.getNodeMatrix()[i].length && !found){
                    if(puzzle.getNodeMatrix()[i][j + change_c] == 0){
                        const tmp = helperMakeOdd(puzzle,[i+change_r, j+change_c], [i,j])
                        if(tmp != null){
                            puzzle = tmp;
                        }
                        puzzle.getNodeMatrix()[i][j + change_c]++;
                        puzzle.getNodeMatrix()[i][j]++;
                        puzzle.solution.push(new EdgeSolution([i,j + change_c],[i,j],1))
                        found = true;
                        console.log("New edge between: ", i,j, " and ", i + change_r, j + change_c,1)
                        break;
                    }
                    if(puzzle.getNodeMatrix()[i][j + change_c] != 0){
                        break;
                    }
                    change_c += 2;
                }
                var change_c = 1;
                var change_r = -1;
                while(i + change_r > -1 && j + change_c < puzzle.getNodeMatrix()[i].length && !found){
                    if(puzzle.getNodeMatrix()[i + change_r][j + change_c] == 0){
                        const tmp = helperMakeOdd(puzzle,[i+change_r, j+change_c], [i,j])
                        if(tmp != null){
                            puzzle = tmp;
                        }
                        puzzle.getNodeMatrix()[i + change_r][j + change_c]++;
                        puzzle.getNodeMatrix()[i][j]++;
                        puzzle.solution.push(new EdgeSolution([i+change_r,j + change_c],[i,j],1))
                        found = true;
                        console.log("New edge between: ", i,j, " and ", i + change_r, j + change_c,1)
                        break;
                    }
                    if(puzzle.getNodeMatrix()[i + change_r][j + change_c] != 0){
                        break;
                    }
                    change_r--;
                    change_c++;
                }
                var change_c = -1;
                var change_r = -1;
                while(i + change_r > -1 && j + change_c > -1 && !found){
                    if(puzzle.getNodeMatrix()[i + change_r][j + change_c] == 0){
                        const tmp = helperMakeOdd(puzzle,[i+change_r, j+change_c], [i,j])
                        if(tmp != null){
                            puzzle = tmp;
                        }
                        puzzle.getNodeMatrix()[i + change_r][j + change_c]++;
                        puzzle.getNodeMatrix()[i][j]++;
                        puzzle.solution.push(new EdgeSolution([i+change_r,j + change_c],[i,j],1))
                        found = true;
                        console.log("New edge between: ", i,j, " and ", i + change_r, j + change_c,1)
                        break;
                    }
                    if(puzzle.getNodeMatrix()[i + change_r][j + change_c] != 0){
                        break;
                    }
                    change_r--;
                    change_c--;
                }
                var change_c = -2;
                var change_r = 0;
                while(i + change_r > -1 && j + change_c > -1 && !found){
                    if(puzzle.getNodeMatrix()[i + change_r][j + change_c] == 0 ){
                        const tmp = helperMakeOdd(puzzle,[i+change_r, j+change_c], [i,j])
                        if(tmp != null){
                            puzzle = tmp;
                        }
                        puzzle.getNodeMatrix()[i + change_r][j + change_c]++;
                        puzzle.getNodeMatrix()[i][j]++;
                        puzzle.solution.push(new EdgeSolution([i+change_r,j + change_c],[i,j],1))
                        found = true;
                        console.log("New edge between: ", i,j, " and ", i + change_r, j + change_c,1)
                        break;
                    }
                    if(puzzle.getNodeMatrix()[i + change_r][j + change_c] != 0){
                        break;
                    }
                    change_c-=2;
                }
                var change_c = -1;
                var change_r = 1;
                while(i + change_r < puzzle.getNodeMatrix().length && j + change_c > -1 && !found){
                    if(puzzle.getNodeMatrix()[i + change_r][j + change_c] == 0){
                        const tmp = helperMakeOdd(puzzle,[i+change_r, j+change_r], [i,j])
                        if(tmp != null){
                            puzzle = tmp;
                        }
                        puzzle.getNodeMatrix()[i + change_r][j + change_c]++;
                        puzzle.getNodeMatrix()[i][j]++;
                        puzzle.solution.push(new EdgeSolution([i+change_r,j + change_c],[i,j],1))
                        found = true;
                        console.log("New edge between: ", i,j, " and ", i + change_r, j + change_c,1)
                        break;
                    }
                    if(puzzle.getNodeMatrix()[i + change_r][j + change_c] != 0){
                        break;
                    }
                    change_c--;
                    change_r++;
                }
                var change_c = 1;
                var change_r = 1;
                while(i + change_r < puzzle.getNodeMatrix().length && j + change_c < puzzle.getNodeMatrix()[i].length && !found){
                    if(puzzle.getNodeMatrix()[i + change_r][j + change_c] == 0){
                        const tmp = helperMakeOdd(puzzle,[i+change_r, j+change_r], [i,j])
                        if(tmp != null){
                            puzzle = tmp;
                        }
                        puzzle.getNodeMatrix()[i + change_r][j + change_c]++;
                        puzzle.getNodeMatrix()[i][j]++;
                        puzzle.solution.push(new EdgeSolution([i+change_r,j + change_c],[i,j],1))
                        found = true;
                        console.log("New edge between: ", i,j, " and ", i + change_r, j + change_c,1)
                    }
                    if(puzzle.getNodeMatrix()[i + change_r][j + change_c] != 0){
                        break;
                    }
                    change_c++;
                    change_r++;
                }
            }
        }
    }
    return puzzle;
}

const mergeTwoPuzzle = (puzzle1,puzzle2, case_id) => {
    var point_p1 = [];
    var point_p2 = [];
    var r_mult = 0;
    var c_mult = 0;
    if(case_id == 0){
        // puzz1 -- puzz2
        //point_p1 = puzzle1.getUpperRightEntry();
        point_p1 = puzzle1.getMostRightEntry();
        //point_p2 = puzzle2.getUpperLeftEntry();
        point_p2 = puzzle2.getMostLeftEntry();
        c_mult = 1;
    }
    else if(case_id == 1){
        //puzz2 -- puzz1
        var short = puzzle1;
        puzzle1 = puzzle2;
        puzzle2 = short;
        point_p1 = puzzle1.getMostRightEntry();
        point_p2 = puzzle2.getMostLeftEntry();

        c_mult = 1;
    }
    else if(case_id == 2){
        //puzz1
        //  |
        //puzz2
        point_p1 = puzzle1.getMostUpperEntry();
        point_p2 = puzzle2.getMostLowerEntry();
        r_mult = 1;
    }
    else if(case_id == 3){
        //puzz2
        //  |
        //puzz1
        var short = puzzle1;
        puzzle1 = puzzle2;
        puzzle2 = short;
        point_p1 = puzzle1.getMostUpperEntry();
        point_p2 = puzzle2.getMostLowerEntry();
        r_mult = 1;
    }
    else if(case_id == 4){
        point_p1 = puzzle1.getUpperRightEntry();
        point_p2 = puzzle2.getLowerLeftEntry();
        r_mult = 1;
        c_mult = 1;
    }
    else if(case_id == 5){
        var short = puzzle1;
        puzzle1 = puzzle2;
        puzzle2 = short;
        point_p1 = puzzle1.getUpperRightEntry();
        point_p2 = puzzle2.getLowerLeftEntry();
        r_mult = 1;
        c_mult = 1;
    }
    const move_r = (point_p2[0] + (r_mult * puzzle1.getNodeMatrix().length)) - (point_p1[0]);
    const move_c = (point_p2[1] + (c_mult * puzzle1.getNodeMatrix()[0].length)) - (point_p1[1]);
    const min_r = Math.min(puzzle1.getMostLowerEntry()[0], ((r_mult * puzzle1.getNodeMatrix().length) + puzzle2.getMostLowerEntry()[0]) - move_r);
    const max_r = Math.max(puzzle1.getMostUpperEntry()[0], ((r_mult * puzzle1.getNodeMatrix().length) + puzzle2.getMostUpperEntry()[0]) - move_r);

    const min_c = Math.min(puzzle1.getMostLeftEntry()[1],  ((c_mult * puzzle1.getNodeMatrix()[0].length)+puzzle2.getMostLeftEntry()[1]) - move_c);
    const max_c = Math.max(puzzle1.getMostRightEntry()[1], ((c_mult * puzzle1.getNodeMatrix()[0].length)+puzzle2.getMostRightEntry()[1]) -move_c);
    
    const new_matrix_rows = (max_r - min_r) + 1;
    const new_matrix_cols = (max_c - min_c) + 1;
    var r_off = 0;
    var c_off = 0;

    if(min_r < 0){
        r_off = new_matrix_rows - puzzle1.getNodeMatrix().length;
    }
    if(min_c < 0){
        c_off = new_matrix_cols - puzzle1.getNodeMatrix()[0].length;
    }
    var new_matrix = [];

    for(let i = 0; i <= new_matrix_rows; i++){
        var row = [];
        for(let j=0; j <= new_matrix_cols; j++){
            row.push(0);
        }
        new_matrix.push(row);
    }
    for(let i=0; i < puzzle1.getNodeMatrix().length; i++){
        for(let j = 0; j < puzzle1.getNodeMatrix()[i].length; j++){
            new_matrix[i + (c_mult * r_off)][j + (r_mult * c_off)] = puzzle1.getNodeMatrix()[i][j];
        }
    }
    var new_sol = []
    for(let e = 0; e < puzzle1.solution.length; e++){
        puzzle1.solution[e].move(c_mult * r_off, r_mult * c_off);
        new_sol.push(puzzle1.solution[e]);
    }
    for(let i = 0; i < puzzle2.getNodeMatrix().length; i++){
        for(let j = 0; j < puzzle2.getNodeMatrix()[i].length; j++){
            if(puzzle2.getNodeMatrix()[i][j] > 0){
                    const r = i + (puzzle1.getNodeMatrix().length * r_mult) + (r_off * c_mult) - move_r;
                    const c = j + (puzzle1.getNodeMatrix()[0].length * c_mult) + (c_off * r_mult) - move_c;
                    new_matrix[r][c] = new_matrix[r][c] + puzzle2.getNodeMatrix()[i][j];
            }
        }
    }
    for(let e = 0; e < puzzle2.solution.length; e++){
        puzzle2.solution[e].move(
            (puzzle1.getNodeMatrix().length * r_mult) + (r_off * c_mult) - move_r,
            (puzzle1.getNodeMatrix()[0].length * c_mult) + (c_off * r_mult) - move_c
        );
        new_sol.push(puzzle2.solution[e]);
    }

    var puzzle = new Puzzle(new_matrix);
    puzzle.solution = new_sol;
    return puzzle;
}

const createRandomPath = (nodeMatrix, nrows,ncols, nedges) => {
    var edge_sol = [];
    var r = Math.floor(Math.random() * nrows);
    var c = Math.floor(Math.random() * ncols);
    if(r % 2 == 0 && c % 2 == 1){
        c++;
        if(c >= ncols){
            c = c - 2;
        }
    }
    if(r % 2 == 1 && c % 2 == 0){
        c++;
        if(c >= ncols){
            c = c - 2;
        }
    }
    var path = [[r,c]];
    var blocked_path = []
    for(let i = 0; i < nrows; i++){
        row = []
        for(let j = 0; j < ncols; j++){
            row.push(0)
        }
        blocked_path.push(row)
    }
    var edges = []

    for(let i=0; i<  nrows * ncols; i++){
        var row = []
        for(let j=0;j < nrows * ncols; j++){
            row.push(0)
        }
        edges.push(row)
    }
    
    var back_path_count = 1;
    var last_change_r = -1;
    var last_change_c = -5;
    for(let e = 0; e < nedges; e++){
        var r_change = 0;
        var c_change = 0;
        var c_mult = 1;
        var edge_idx = r * ncols + c;
        var new_edge_idx = 0;
        var possible_directions = [0,0,0,0,0,0];
        var count = 0;

        while(r_change == 0 && c_change == 0 && count < 6){
            var rand = Math.floor(Math.random() * (5 - count));
            if(rand == 0 && possible_directions[rand] == 0){
                r_change = 0;
                c_change = 2;
                possible_directions[rand] = 1;
            }
            else if(rand == 1 && possible_directions[rand] == 0){
                r_change = -1;
                c_change = 1;
                possible_directions[rand] = 1;
            }
            else if(rand == 2 && possible_directions[rand] == 0){
                r_change = -1;
                c_change = -1;
                possible_directions[rand] = 1;
            }
            else if(rand == 3 && possible_directions[rand] == 0){
                r_change = 0;
                c_change = -2;
                possible_directions[rand] = 1;
            }
            else if(rand == 4 && possible_directions[rand] == 0){
                r_change = 1;
                c_change = -1;
                possible_directions[rand] = 1;
            }
            else if(rand == 5 && possible_directions[rand] == 0){
                r_change = 1;
                c_change = 1;
                possible_directions[rand] = 1;
            }
            if(r_change + r >= nrows || r_change + r < 0){
                r_change = 0;
                c_change = 0;
            }
            else if(c_change + c >= ncols || c_change + c < 0){
                r_change = 0;
                c_change = 0;
            }
            new_edge_idx = ((r_change + r) * ncols) + c_change + c;
            if(edges[new_edge_idx][edge_idx] > 0){
                r_change = 0;
                c_change = 0;
            }
            else if(blocked_path[r_change + r][ c_change + c] != 0){
                //console.log("trying to get through blocked path: ", r_change + r, c_change + c, nodeMatrix[r_change + r][c_change + c])
                r_change = 0;
                c_change = 0;
            }
            else if((r_change + r) == path[path.length - 1][0] && (c_change + c) == path[path.length - 1][1]){
                r_change = 0;
                c_change = 0;
            }
            else if(nodeMatrix[r_change + r][c_change + c] <= -1){
                //console.log("trying to get trough long edge: ", r_change + r,c_change + c,nodeMatrix[r][c])
                r_change = 0;
                c_change = 0;
            }
            count++;
        }
        if(count == 6){
            blocked_path[r][c] = 1;
            r = path[path.length - back_path_count][0]
            c = path[path.length - back_path_count][1]
            /*while(nodeMatrix[r][c] == -1){
                back_path_count ++;
                if(back_path_count > path.length){
                    break;
                }
                r = path[path.length - back_path_count][0]
                c = path[path.length - back_path_count][1]
            }*/
            back_path_count ++;
            if(back_path_count > path.length){
                break;
            }
            e--;
            count = 0;
        }
        else{
            count = 0;
            const new_r = r_change + r;
            const new_c = c_change + c;
            new_edge_idx = (new_r * ncols) + new_c

            edges[edge_idx][new_edge_idx]++;
            edges[new_edge_idx][edge_idx]++;
            edge_idx = new_edge_idx;

            if(last_change_c > -3 && back_path_count == 1 && last_change_c == c_change && last_change_r == r_change && !(nodeMatrix[r][c] > 2)){
                var path_length = 1;
                var not_poss = false;
                while (nodeMatrix[r - (r_change * path_length)][c - (c_change * path_length)] == -1){ 
                    //console.log("path length add")
                    if(r - (r_change * path_length) < 0 || r - (r_change * path_length) >= nodeMatrix.length || (c_change * path_length) < 0 || (c_change * path_length) >= nodeMatrix[0].length){
                        not_poss = true;
                        break;
                    }
                    path_length++;
                }
                //console.log("Long edge path length: ", path_length)
                if(!not_poss){
                    const off = nodeMatrix[r][c]
                    nodeMatrix[r][c] = -1;
                    blocked_path[r][c] = 1;
                    nodeMatrix[r - (r_change  * path_length)][c - (c_change*path_length)] = nodeMatrix[r - (r_change  * path_length)][c - (c_change*path_length)]  - off;
                    nodeMatrix[r - (r_change  * path_length)][c - (c_change*path_length)] ++;
                    nodeMatrix[r + r_change][c + c_change]++;
                    var val = 1;
                    //console.log("new long edge between: ", r - (r_change  * path_length), c - (c_change*path_length), " and ", r + r_change, c + c_change)
                    //console.log("Field ",r,c, " is now blocked: ", nodeMatrix[r][c])
                    const rand = Math.random();
                    if(rand < (1/2)){
                        nodeMatrix[r - (r_change  * path_length)][c - (c_change*path_length)]++;
                        nodeMatrix[r + r_change][c + c_change]++;
                        val++;
                        //console.log("is double edge")
                    }
                    const ed = new EdgeSolution([r - (r_change  * path_length),c - (c_change*path_length)],[r + r_change,c + c_change],val)
                    console.log("New edge between: ", r - (r_change  * path_length),c - (c_change*path_length), " and ", r + r_change,c + c_change,val)
                    edge_sol[edge_sol.length - 1] = ed
                    back_path_count = 1;
                    const idx = path.indexOf([r,c]);
                    path.splice(idx)
                    r = new_r;
                    c = new_c;
                    path.push([new_r,new_c]);
                    last_change_c = c_change;
                    last_change_r = r_change;
                }
            }
            else{
                nodeMatrix[r][c]++;
                nodeMatrix[new_r][new_c]++;
                var val = 1;
                //console.log("new edge between: ", r, c, " and ", new_r, new_c)
                const rand = Math.random();
                if(rand < (1/2)){
                    nodeMatrix[r][c]++;
                    nodeMatrix[new_r][new_c]++;
                    val ++;
                    //console.log("is double edge")
                }
                const ed = new EdgeSolution([r,c],[new_r,new_c],val)
                edge_sol.push(ed)
                back_path_count = 1;
                r = new_r;
                c = new_c;
                path.push([new_r,new_c]);
                last_change_c = c_change;
                last_change_r = r_change;
            }
        }
    }

   const puzz = new Puzzle(nodeMatrix);
   puzz.solution = edge_sol;
   const min_r = puzz.getMostLowerEntry()[0];
   const max_r = puzz.getMostUpperEntry()[0];
   const min_c = puzz.getMostLeftEntry()[1];
   const max_c = puzz.getMostRightEntry()[1];
   const new_r = max_r - min_r;
   const new_c = max_c - min_c;

   var new_m = [];
   for(let i=0; i<=new_r;i++){
    var row = [];
    for(let j=0;j<=new_c;j++){
        row.push(puzz.getNodeMatrix()[i + min_r][j + min_c]);
    }
    new_m.push(row);
   }
   var new_sol = [];
   for(let e = 0; e < puzz.solution.length; e++){
        puzz.solution[e].move(-min_r,-min_c);
        new_sol.push(puzz.solution[e]);
    }
   const final_p = new Puzzle(new_m);
   final_p.solution = new_sol;
   return final_p;
}

const findEdges = (nodes, nodeMatrix) => {
    const nrow = nodeMatrix.length;
    const ncol = nodeMatrix[0].length;
    var edges = []
    for(let n =0; n < nodes.length; n++){
        const nr = nodes[n].getRow();
        const nc = nodes[n].getColumn();
        var r = nr;
        var c = nc;
        while(r < nrow && c < ncol){
            if(nodeMatrix[r][c] != null){
                console.log()
                const ed = new Edge(nodes[n],nodeMatrix[r][c]);
                for(let s=0; s < puzzle.solution.length;s++){
                    if(puzzle.solution[s].p1[0] +1 == nodes[n].getRow() && puzzle.solution[s].p1[1]+1 == nodes[n].getColumn()){
                        if(puzzle.solution[s].p2[0]+1 == nodeMatrix[r][c].getRow() && puzzle.solution[s].p2[1]+1 == nodeMatrix[r][c].getColumn()){
                            ed.edge_solution = puzzle.solution[s];
                            console.log("Found Edge Solution 1342: ", ed)
                        }
                    }
                    if(puzzle.solution[s].p2[0]+1 == nodes[n].getRow() && puzzle.solution[s].p2[1]+1 == nodes[n].getColumn()){
                        if(puzzle.solution[s].p1[0]+1 == nodeMatrix[r][c].getRow() && puzzle.solution[s].p1[1]+1 == nodeMatrix[r][c].getColumn()){
                            ed.edge_solution = puzzle.solution[s];
                            console.log("Found Edge Solution 1348: ", ed)
                        }
                    }
                }

                edges.push(ed)
                nodes[n].edges.push(edges[edges.length - 1]);
                nodeMatrix[r][c].edges.push([edges.length - 1]);
                break;
            }
            c++;
            r++;
        }
        r = nr-1;
        c = nc;
        while(c < ncol){
            if(nodeMatrix[r][c] != null){
                //edges.push(new Edge(nodes[n],nodeMatrix[r][c]))
                const ed = new Edge(nodes[n],nodeMatrix[r][c])
                for(let s=0; s < puzzle.solution.length;s++){
                    if(puzzle.solution[s].p1[0]+1 == nodes[n].getRow() && puzzle.solution[s].p1[1]+1 == nodes[n].getColumn()){
                        if(puzzle.solution[s].p2[0]+1 == nodeMatrix[r][c].getRow() && puzzle.solution[s].p2[1]+1 == nodeMatrix[r][c].getColumn()){
                            ed.edge_solution = puzzle.solution[s];
                            console.log("Found Edge Solution 1371: ", ed)
                        }
                    }
                    if(puzzle.solution[s].p2[0]+1 == nodes[n].getRow() && puzzle.solution[s].p2[1]+1 == nodes[n].getColumn()){
                        if(puzzle.solution[s].p1[0]+1 == nodeMatrix[r][c].getRow() && puzzle.solution[s].p1[1]+1 == nodeMatrix[r][c].getColumn()){
                            ed.edge_solution = puzzle.solution[s];
                            console.log("Found Edge Solution 1377: ", ed)
                        }
                    }
                }
                edges.push(ed);
                break;
            }
            c++
        }
        r = nr-2;
        c = nc;
        while(r > -1 && c < ncol ){
            if(nodeMatrix[r][c] != null){
                //edges.push(new Edge(nodeMatrix[r][c],nodes[n]))
                const ed = new Edge(nodeMatrix[r][c],nodes[n]);
                for(let s=0; s < puzzle.solution.length;s++){
                    if(puzzle.solution[s].p1[0]+1 == nodes[n].getRow() && puzzle.solution[s].p1[1]+1 == nodes[n].getColumn()){
                        if(puzzle.solution[s].p2[0]+1 == nodeMatrix[r][c].getRow() && puzzle.solution[s].p2[1]+1 == nodeMatrix[r][c].getColumn()){
                            ed.edge_solution = puzzle.solution[s];
                            console.log("Found Edge Solution 1396: ", ed)
                        }
                    }
                    if(puzzle.solution[s].p2[0]+1 == nodes[n].getRow() && puzzle.solution[s].p2[1]+1 == nodes[n].getColumn()){
                        if(puzzle.solution[s].p1[0]+1 == nodeMatrix[r][c].getRow() && puzzle.solution[s].p1[1]+1 == nodeMatrix[r][c].getColumn()){
                            ed.edge_solution = puzzle.solution[s];
                            console.log("Found Edge Solution 1402: ", ed)
                        }
                    }
                }
                edges.push(ed);
                break;
            }
            c++;
            r--;
        }
    }
    for(let e1 = 0; e1< edges.length;e1++ ){
        var l1 = edges[e1].getLine();
        var m = l1.getM();
        var c = l1.getC();
        for(let e2 = e1 +1; e2 < edges.length; e2++)
        {
            var l2 = edges[e2].getLine();
            var a = l2.getM();
            var b = l2.getC();
            if(m != a){
                var x = (c-b)/(a-m)
                var y = (m * x) + c
                if(
                isNumberBetween(x,l1.getStartX(),l1.getEndX()) &&
                isNumberBetween(x,l2.getStartX(),l2.getEndX()) &&
                isNumberBetween(y,l1.getStartY(),l1.getEndY()) &&
                isNumberBetween(y,l2.getStartY(),l2.getEndY())){
                    edges[e1].addEdgeToPotentialCut(e2);
                    edges[e2].addEdgeToPotentialCut(e1);
                    l1.addCuttingLine(l2);
                    l2.addCuttingLine(l1);
                }
            }
        }
    }
    return edges;
}

const isNumberBetween = (x,b1,b2) =>{
    const min = Math.min(b1,b2);
    const max = Math.max(b1,b2);
    if(x >= min && x <= max){
        return true;
    }
    else{
        return false;
    }
}

const buildField = (nodes,edges) =>{
    for(let n = 0; n < nodes.length; n++){
        //buildCircle(nodes[n].getCircle());
    }
    for(let e = 0; e < edges.length; e++){
        buildLine(edges[e].getLine());
    }
}

const buildLine = (line) => {
    const canvas = document.getElementById('myCanvas');
    const context = canvas.getContext('2d');
    const new_line = new Path2D();
    context.lineWidth = 5;
    //new_line.beginPath(); // Start a new path
    new_line.moveTo(line.getStartX(), line.getStartY()); // Move the pen to (30, 50)
    new_line.lineTo(line.getEndX(), line.getEndY()); // Draw a line to (150, 100)
    //context.strokeStyle = "black"
    //context.stroke(new_line); // Render the path
    context.strokeStyle = "black";
    context.lineWidth = 15;
    context.stroke(new_line); 
    context.lineWidth = 15;
    context.strokeStyle = "white";
    context.stroke(new_line);
    canvas.addEventListener('click', function(event) {
        const coords = relMouseCoords(event,canvas);
        const x = coords.x
        const y = coords.y
        if (checkIfClickOnLine(line,x,y)){
            if (line.getClickCount() % 3 == 2 || line.getClickCount() == -1){
                line.clicked(false);
                context.lineWidth = 15;
                context.strokeStyle = "white";
                context.stroke(new_line);
            }
            else if(line.getClickCount() % 3 == 0 && !checkIfLinesCut(line)) {
                line.clicked(false);
                context.lineWidth = 5;
                context.strokeStyle = "black";
                context.stroke(new_line);
            }
            else if(!checkIfLinesCut(line)){
                line.clicked(false);
                context.strokeStyle = "black";
                context.lineWidth = 15;
                context.stroke(new_line); 
                const  white_line = new Path2D();
                context.lineWidth = 5;
                white_line.moveTo(line.getStartX(), line.getStartY()); // Move the pen to (30, 50)
                white_line.lineTo(line.getEndX(), line.getEndY()); // Draw a line to (150, 100)
                context.strokeStyle = "white";
                context.stroke(white_line);

            }
            else if(checkIfLinesCut(line)){
                console.error("Lines are interferring.")
            }
        }
    },false)
}

const drawLine = (line) => {
    const canvas = document.getElementById('myCanvas');
    const context = canvas.getContext('2d');
    const new_line = new Path2D();
    context.lineWidth = 5;
    //new_line.beginPath(); // Start a new path
    new_line.moveTo(line.getStartX(), line.getStartY()); // Move the pen to (30, 50)
    new_line.lineTo(line.getEndX(), line.getEndY()); // Draw a line to (150, 100)
    //context.strokeStyle = "black"
    //context.stroke(new_line); // Render the path
    context.strokeStyle = "black";
    context.lineWidth = 15;
    context.stroke(new_line); 
    context.lineWidth = 15;
    context.strokeStyle = "white";
    context.stroke(new_line);
    if (line.getClickCount() == 0 ){
        line.clicked(true);
        context.lineWidth = 15;
        context.strokeStyle = "white";
        context.stroke(new_line);
    }
    else if(line.getClickCount() == 1) {
        line.clicked(true);
        context.lineWidth = 5;
        context.strokeStyle = "black";
        context.stroke(new_line);
    }
    else {
        line.clicked(true);
        context.strokeStyle = "black";
        context.lineWidth = 15;
        context.stroke(new_line); 
        const  white_line = new Path2D();
        context.lineWidth = 5;
        white_line.moveTo(line.getStartX(), line.getStartY()); // Move the pen to (30, 50)
        white_line.lineTo(line.getEndX(), line.getEndY()); // Draw a line to (150, 100)
        context.strokeStyle = "white";
        context.stroke(white_line);

    }
}

const checkIfLinesCut = (line) => {
    for(let l = 0; l < line.getCuttingLines().length; l++){
        if(line.getCuttingLines()[l].getClickCount() % 3 != 0){
            return true;
            break;
        }
    }
    return false;
}

const checkIfClickOnLine = (line,clickedX,clickedY) => {
    var a = (line.n * line.n) + 1
    var b = -2 * (((line.n * line.n) + 1)*line._startX)
    var c =  (((line.n * line.n) + 1) * (line._startX * line._startX) ) - 100
    var x1 = Mitternachtsformel(a,b,c,true)
    var y1 = line.n * x1 + line.d
    var c1 = y1 - (x1 * line.m) 
    var x2 = Mitternachtsformel(a,b,c,false)
    var y2 = line.n * x2 + line.d
    var c2 = y2 - (x2 * line.m)

    var minC = Math.min(c1,c2);
    var maxC = Math.max(c1,c2);

    x2 = line._endY - ((line._endX) * line.n)
    var minD = Math.min(line.d,x2);
    var maxD = Math.max(line.d,x2);

    var clickC = clickedY - (line.m * clickedX);
    var clickD = clickedY - (line.n * clickedX);

    if(line.n == Infinity){
        minC = line._startX
        maxC = line._endX
        clickC = clickedX
        minD = line._startY - 10
        maxD = line._startY + 10
        clickD = clickedY
    }

    var first = false;
    var sec = false;

    if(clickC > minC && clickC < maxC){
        first = true;
    }
    if(clickD > minD && clickD < maxD){
        sec = true;
    }
    //if(clickedX > minX && clickedX < maxX){
      //  x = true;
    //}
    //if(clickedY > minY && clickedY < maxY){
        //y = true;
    //}
    //const dist = Math.sqrt((diffX * diffX) + (diffY * diffY));
    //if(x && y){
      //  return true
    //}
    //else{
      //  return false
    //}
    if(first && sec){
        return true
    }
    else{
        return false
    }
}
const Mitternachtsformel = (a,b,c, isPlus) => {
    if(isPlus){
        const res = (-b + Math.sqrt((b * b) - (4 * a * c))) / (2 * a)
        return res
    }
    else{
        const res = (-b - Math.sqrt((b * b) - (4 * a * c))) / (2 * a)
        return res
    }
}

function relMouseCoords(event, currentElement){
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    //var currentElement = this;

    do{
        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    }
    while(currentElement = currentElement.offsetParent)

    canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY;

    return {x:canvasX, y:canvasY}
}
//import Circle from "./circle.js";
class Node{
    constructor(node_id,number, row, column){
        this.node_id = node_id
        this.neighbours = []
        this.row = row;
        this.column = column;
        this.number = number;
        this.num_edges = 0;
        //this.circle = new Circle();
        //this.setCircle();
        //this.fill_style = 'white';
        //this.buildCircle();
        this.edges = []
        this.is_game = false;
        this.puzzle_group = 0;
    }
    addNeighbour(node){
        this.neighbours.push(node_id)
    }
    getNodeId(){
        return this.node_id
    }
    getNeighbours(){
        return this.neighbours
    }
    getRow(){
        return this.row
    }
    getColumn(){
        return this.column
    }
    getNumber(){
        return this.number
    }
    incrementEdges(){
        this.num_edges ++;
    }

    changeEdges(i,reset){
        if(reset){
            console.log("reset", i)
            this.num_edges = 0;
            this.checkEdgesAndNumber();
        }
        else{
            this.num_edges = this.num_edges + i;
            if(this.is_game){
                this.checkEdgesAndNumber();
            }
        }
    }
    isGame(){
        return this.is_game
    }
    setGame(){
        this.is_game = true;
        this.num_edges = 0;
    }
    getEdges(){
        return this.num_edges
    }
    setCircle(){
        this.circle.setId(this.number);
        this.circle.setX(this.column * 50 - 25);
        this.circle.setY((this.row-1) * 75 + 25);
        this.circle.setRadius(20);
        this.circle.setRow(this.row);
        this.circle.setColumn(this.column);
    }
    getCircle(){
        return this.circle;
    }
    checkEdgesAndNumber(){
        console.log("num_edges", this.num_edges)
        if(this.num_edges == this.number){
            this.fill_style = 'green';
        }
        else if(this.num_edges < this.number){
            this.fill_style = 'white';
        }
        else{
            this.fill_style = 'red';
        }
        this.buildCircle()
    }

    buildCircle(){
        const canvas = document.getElementById("myCanvas")
        const context = canvas.getContext('2d');
        const new_circ = new Path2D();
        const radius = this.circle.getRadius();
        context.fillStyle = this.fill_style;
        context.strokeStyle = 'black';
        new_circ.arc(this.circle.getX(), this.circle.getY(), 20, 0, 2 * Math.PI);
        context.fill(new_circ);
        context.lineWidth = 1;
        context.stroke(new_circ);
        context.fillStyle = 'black';
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(this.getNumber(),this.circle.getX(),this.circle.getY());
        //context.fillText(this.edges,this.circle.getX(),this.circle.getY());
    }
    updateNodeWithOffsets(row_offset, col_offset,puzzle_group){
        this.row = this.row + row_offset;
        this.column = this.column + col_offset;
        this.circle = new Circle();
        this.setCircle();
        if(puzzle_group % 4 == 0){
            this.fill_style = 'white';
        }
        else if(puzzle_group % 4 == 1){
            this.fill_style = 'blue';
        }
        else if(puzzle_group % 4 == 2){
            this.fill_style = 'red';
        }
        else if(puzzle_group % 4 == 3){
            this.fill_style = 'orange';
        }
        this.buildCircle();
    }
}
//import Node from "./node.js";
//import Line from "./line.js";
class Edge{
    constructor(node1,node2){
        this.node1 = node1;
        this.node2 = node2;
        this.line = new Line();
        this.setLine();
        this.potentialCut = [];
        this.num = 0;
        this.edge_solution = null;
    }
    getNode1(){
        return this.node1;
    }
    getNode2(){
        return this.node2
    }
    setLine(){
        if(this.node1.getRow() == this.node2.getRow()){
            this.line.setStartX(this.node1.getCircle().getX() + (this.node1.getCircle().getRadius()-0));
            this.line.setEndX(this.node2.getCircle().getX() - (this.node2.getCircle().getRadius()-0));
            this.line.setEndY(this.node2.getCircle().getY());
            this.line.setStartY(this.node1.getCircle().getY());
        }
        else if(this.node1.getColumn() < this.node2.getColumn()){
            this.line.setStartX(this.node1.getCircle().getX() + ((Math.cos(0.98)) * (this.node1.getCircle().getRadius()-0)));
            this.line.setStartY(this.node1.getCircle().getY() + ((Math.sin(0.98)) * (this.node1.getCircle().getRadius()-0)));
            this.line.setEndX(this.node2.getCircle().getX() - ((Math.cos(0.98)) * (this.node2.getCircle().getRadius()-0)));
            this.line.setEndY(this.node2.getCircle().getY() - ((Math.sin(0.98)) * (this.node2.getCircle().getRadius()-0)));
        }
        else{
            this.line.setStartX(this.node1.getCircle().getX() - ((1-Math.cos(0.98)) * (this.node1.getCircle().getRadius()-0)));
            this.line.setStartY(this.node1.getCircle().getY() + ((Math.sin(0.98)) * (this.node1.getCircle().getRadius()-0)));
            this.line.setEndX(this.node2.getCircle().getX() + ((Math.cos(0.98)) * (this.node2.getCircle().getRadius()-0)));
            this.line.setEndY(this.node2.getCircle().getY() - ((Math.sin(0.98)) * (this.node2.getCircle().getRadius()-0)));
        }
        this.line.setMandN();
        this.line.setCandD();
        this.line.setEdge(this)
    }
    getLine(){
        return this.line
    }
    addEdgeToPotentialCut(edge){
        this.potentialCut.push(edge)
    }
    getPotentialCut(){
        return this.potentialCut()
    }
    
}
class Line{
    constructor(){
        this._id = null;
        this._startX = null;
        this._startY = null;
        this._endX = null;
        this._endY = null;
        this.click_count = 0;
        this.m = 0;
        this.n = 0;
        this.c = 0;
        this.d = 0;
        this.edge = null;
        this.cuttingLines = []; 
    }
    getId(){
        return this._id;
    }
    setId(_id){
        this._id = _id;
    }
    getStartX(){
        return this._startX;
    }
    getStartY(){
        return this._startY;
    }
    setStartX(startX){
        this._startX = startX;
    }
    setStartY(startY){
        this._startY = startY;
    }
    getEndX(){
        return this._endX;
    }
    getEndY(){
        return this._endY;
    }
    setEndX(endX){
        this._endX = endX;
    }
    setEndY(endY){
        this._endY = endY;
    }
    clicked(reset){
        var change_val = 0;
        if(reset){
            //this.click_count--;
            if (this.click_count % 3 == 0){
                if(this.click_count > 0){
                    change_val = 0;
                }
            }
            if (this.click_count % 3 == 1){
                change_val = -1;
            }
            if (this.click_count % 3 == 2){
                change_val = -2;
            }
            this.edge.getNode1().changeEdges(0,true);
            this.edge.getNode2().changeEdges(0,true);
            this.click_count = 0;
        }
        else{
            this.click_count ++;
            if (this.click_count % 3 == 0){
                if(this.click_count > 0){
                    change_val = -2;
                }
            }
            if (this.click_count % 3 == 1){
                change_val = 1;
            }
            if (this.click_count % 3 == 2){
                change_val = 1;
            }
            if(this.click_count > 0){
                this.edge.getNode1().changeEdges(change_val,reset);
                this.edge.getNode2().changeEdges(change_val,reset);
            }
        }
        console.log("Click: ", this.click_count)
    }
    getClickCount(){
        return this.click_count;
    }
    setMandN(){
        this.m = (this._endY - this._startY) / (this._endX - this._startX)
        this.n = -(this.m)
        if(this.m == 0){
            this.n = Infinity
        }
    }
    getM(){
        return this.m
    }
    getN(){
        return this.n
    }
    setCandD(){
        this.c = this._startY - (this._startX * this.m)
        this.d = this._startY - (this._startX * this.n)
    }
    getC(){
        return this.c
    }
    getD(){
        return this.d
    }
    setEdge(edge){
        this.edge = edge
    }
    getEdge(){
        return this.edge
    }
    addCuttingLine(line){
        this.cuttingLines.push(line);
    }
    getCuttingLines(){
        return this.cuttingLines;
    }
}
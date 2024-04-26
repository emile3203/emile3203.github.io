class Circle{
    constructor(){
        this._id = null;
        this._radius = null;
        this._x = null;
        this._y = null;
        this._edges = null;
        this.click_count = 0;
        this.row = null;
        this.column = null;
    }
    getId(){
        return this._id;
    }
    setId(id){
        this._id = id;
    }
    getRadius(){
        return this._radius;
    }
    setRadius(radius){
        this._radius = radius;
    }
    getX(){
        return this._x;
    }
    setX(x){
        this._x = x;
    }
    getY(){
        return this._y;
    }
    setY(y){
        this._y = y;
    }
    getEdges(){
        return this._edges;
    }
    setEdges(edges){
        this._edges = edges;
    }
    clicked(){
        this.click_count ++;
    }
    getClickCount(){
        return this.click_count;
    }
    setRow(row){
        this.row = row
    }
    setColumn(col){
        this.column = col
    }
    getRow(){
        return this.row
    }
    getColumn(){
        return this.column
    }
}
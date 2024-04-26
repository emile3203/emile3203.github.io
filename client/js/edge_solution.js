class EdgeSolution{
    constructor(p1,p2,val){
        this.p1 = p1;
        this.p2 = p2;
        this.val = val;
    }
    move(r,c){
        this.p1 = [this.p1[0] + r, this.p1[1] + c]
        this.p2 = [this.p2[0] + r, this.p2[1] + c]
    }
}
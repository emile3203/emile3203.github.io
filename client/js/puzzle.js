class Puzzle{
    constructor(node_matrix){
        //this.puzzle_id = puzzle_id
        if(node_matrix != null){
            this.node_matrix = node_matrix;
            this.rows = node_matrix.length;
            this.columns = node_matrix[0].length;
            this.upper_right_entry = [];
            this.upper_left_entry = [];
            this.lower_right_entry = [];
            this.lower_left_entry = [];
            this.most_left_entry = [];
            this.most_right_entry = [];
            this.most_upper_entry = [];
            this.most_lower_entry = [];
            this.setEntries();
            this.c_offset = 0;
            this.r_offset = 0;
            this.puzz_c = 0;
            this.puzz_r = 0;
            this.solution = [];
        }
    }
    getCOffset(){
        return this.c_offset;
    }
    getROffset(){
        return this.r_offset;
    }
    setCOffset(c_offset){
        this.c_offset = c_offset;
    }
    setROffset(r_offset){
        this.r_offset = r_offset;
    }
    getNodeMatrix(){
        return this.node_matrix;
    }
    getRows(){
        return this.rows;
    }
    getColumns(){
        return this.columns;
    }
    getUpperRightEntry(){
        return this.upper_right_entry;
    }
    getUpperLeftEntry(){
        return this.upper_left_entry;
    }
    getLowerRightEntry(){
        return this.lower_right_entry;
    }
    getLowerLeftEntry(){
        return this.lower_left_entry;
    }
    getMostLeftEntry(){
        return this.most_left_entry;
    }
    getMostRightEntry(){
        return this.most_right_entry;
    }
    getMostUpperEntry(){
        return this.most_upper_entry;
    }
    getMostLowerEntry(){
        return this.most_lower_entry;
    }

    setEntries(){
        var lower_right_entry = [];
        var lower_right_dist = Infinity;
        var lower_left_entry = [];
        var lower_left_dist = Infinity;
        var upper_right_entry = [];
        var upper_right_dist = Infinity;
        var upper_left_entry = [];
        var upper_left_dist = Infinity;
        var most_left_dist = Infinity;
        var most_left_entry = [];
        var most_right_dist = Infinity;
        var most_right_entry = [];
        var most_upper_dist = Infinity;
        var most_upper_entry = [];
        var most_lower_dist = Infinity;
        var most_lower_entry = [];

        for(let i = 0; i < this.rows; i++)
        {
            for(let j = 0; j < this.columns; j++){
                if(this.node_matrix[i][j] > 0){
                    var dist = this.euclidDistance([i,j],[0,this.columns-1]);
                    if(dist < lower_right_dist){
                        lower_right_dist = dist;
                        lower_right_entry = [i,j];
                    }
                    dist = this.euclidDistance([i,j],[0,0]);
                    if(dist < lower_left_dist){
                        lower_left_dist = dist;
                        lower_left_entry = [i,j];
                    }
                    dist = this.euclidDistance([i,j],[this.rows - 1,0]);
                    if(dist < upper_left_dist){
                        upper_left_dist = dist;
                        upper_left_entry = [i,j];
                    }
                    dist = this.euclidDistance([i,j],[this.rows - 1,this.columns - 1]);
                    if(dist < upper_right_dist){
                        upper_right_dist = dist;
                        upper_right_entry = [i,j];
                    }
                    dist = this.euclidDistance([i,j],[i,0])
                    if(dist < most_left_dist){
                        most_left_dist = dist;
                        most_left_entry = [i,j];
                    }
                    dist = this.euclidDistance([i,j],[i,this.columns-1])
                    if(dist < most_right_dist){
                        most_right_dist = dist;
                        most_right_entry = [i,j];
                    }
                    dist = this.euclidDistance([i,j],[this.rows-1,j])
                    if(dist < most_upper_dist){
                        most_upper_dist = dist;
                        most_upper_entry = [i,j];
                    }
                    dist = this.euclidDistance([i,j],[0,j])
                    if(dist < most_lower_dist){
                        most_lower_dist = dist;
                        most_lower_entry = [i,j];
                    }
                }
            }
        }
        this.upper_right_entry = upper_right_entry;
        this.upper_left_entry = upper_left_entry;
        this.lower_right_entry = lower_right_entry;
        this.lower_left_entry = lower_left_entry;
        this.most_left_entry = most_left_entry;
        this.most_right_entry = most_right_entry;
        this.most_upper_entry = most_upper_entry;
        this.most_lower_entry = most_lower_entry;
        
    }

    euclidDistance(p1,p2){
        const d = Math.sqrt(((p1[0] - p2[0])*(p1[0] - p2[0]))+((p1[1] - p2[1])*(p1[1] - p2[1])))
        return d
    }
    
}

class Run {
    constructor(id=0, totalLanes= 0, lanes = [], type) {
        this.id = id++;
        this.totalLanes = totalLanes; 
        this.numLanes = {"SP": 2, "S1": 2, "S2": 2, "S4": 4}
        this.lanes = lanes;
        this.type = type; // whether SP, S1, S2, or S4
        
    }

    addLane() {
        if (this.totalLanes - this.numLanes[type] > 0) {
            this.lanes.push(lane);
            this.totalLanes += 1;
        } 
        
    }

 }

 module.exports = class Project {
    constructor(arg) {
        console.log(arg);
    }
}

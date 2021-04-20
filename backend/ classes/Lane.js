class Lane {
    constructor(id=0, totalLaneReads=0, samples=[], type) {
        this.id = id++; // identify each lane by a unique id
        this.totalLaneReads = totalLaneReads; // current number of reads in lane
        this.samples = samples; // array of samples to be loaded on a lane
        this.readCapacity = {"SP": [350, 400], "S1": [800,900], "S2": [1800, 1900], "S4": [2400, 2600]}; // ranges for each type of flowcell
        this.type = type; //this.readCapacity[type] to find range of read capacity
        this.filled = false; //whether total number of reads has reached minimum capacity
    }
    
    addSample (sample) {
        if(this.readCapacity[type][1] - this.totalLaneReads >= sample.readsRequested) { // if lane's read capacity hasn't exceeded, add sample to array
            this.samples.push(sample); 
            this.totalLaneReads += sample.readsRequested; // add sample's reads to total reads on lane
        } 
        

    }
}


module.exports = class Project {
    constructor(arg) {
        console.log(arg);
    }
}

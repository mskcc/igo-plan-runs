const ID = require('./uniqueId');

class Run {
    constructor(type, runLength, projects=[]) {
        this.id = ID(); //unique id 
        this.lanes = []; // array of lanes
        this.type = type; // whether SP, S1, S2, or S4
        this.runLength = runLength; // read length
        this.projects = projects
        this.totalReads = 0;
        this.isValid = false;
        this.totalLanes = 0; // current number of filled lanes in run
        this.readCapacity = {'SP':[700,800], 'S1': [1600, 1800], 'S2': [3600, 3800], 'S4': [9000, 10000]}
        this.laneCapacity = {'SP':[350,400], 'S1': [800, 900], 'S2': [1800, 1900], 'S4': [2400, 2600]}
    }

    getTotalLanes() {
        const numLanes = {"SP": 2, "S1": 2, "S2": 2, "S4": 4}
        return numLanes[this.type];
    }

    getCapacity() {
        return this.readCapacity[this.type];
    }

    getLaneCapacity() {
        return this.laneCapacity[this.type];
    }
    
    addLane(lane) {
        if (this.getTotalLanes() - this.totalLanes > 0) { 
//if lane capacity has space for at least 1 more, add lane to run
            this.lanes.push(lane);
            this.totalLanes += 1;
        } 
        
    }

    checkRunLengths() {
        for(let sample of this.lanes) {
            if(sample.runLength !== this.runLength) {
                let sampleIndex = this.lanes.indexOf(sample)
                this.lanes.splice(spliceIndex, 1);
            } else {
                continue;
            }
        }
    }

 }

 module.exports = {
     Run
 }

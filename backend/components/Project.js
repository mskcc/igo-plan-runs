// http://plvpipetrack1.mskcc.org:8099/pages/viewpage.action?pageId=25595196

class Project {
    constructor (requestId, runLength, recipe, requestName) {
        this.requestId = requestId; 
        this.runLength = runLength; 
        this.recipe = recipe; // correlates with project
        this.requestName = requestName;
    }
    userLibrary(lane){
        if(this.requestId == otherSample.requestId) {
            lane.push(this);
        }
    }
    canBeSplit(lane){
        for (let sample of lane.samples) {
            if(this.recipe.includes("IDT_Exome") && sample.recipe.includes("IDT_Exome")) {
                lane.push(this)
            }
        }
       
    }
}

module.exports = {
    Project
}

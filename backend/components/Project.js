// http://plvpipetrack1.mskcc.org:8099/pages/viewpage.action?pageId=25595196

class Project {
    constructor (requestId, runLength, samples = [], recipe, requestName) {
        this.requestId = requestId; 
        this.runLength = runLength; // one project same runlength
        this.samples = samples;
        this.recipe = recipe; // correlates with project, same project = same recipe
        this.requestName = requestName;
        this.totalReads = 0
    }

    addSample(sample) {
        this.samples.push(sample);
    }

    addSampleReads() {
        for (let sample of this.samples) {
            this.totalReads += parseInt(sample.readsRequested)
        }
    }

    getProjectReads() { // adds up all reads requested for all samples in project instance
        let reads = 0;
        for(let sample of this.samples) {
            this.reads += parseInt(sample.readsRequested);
        }
        return reads;
        
    }
    
    isUserLibrary(){ //if sample belongs to user library (request Name is investigator prepared libraries), own lane or run
        if(this.requestName.includes("Investigator")) { 
           return true;  
        } else {
            return false;
        }
    }
    canBeSplit(){ //if sample is WES and can be split across multiple lanes/runs
        //only whole exome can be split
        if(this.recipe.includes("IDT_Exome")) {
            return true;
        } else {
            return false;
        }
        
    }


}

module.exports = {
    Project
}

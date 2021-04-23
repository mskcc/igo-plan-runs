// http://plvpipetrack1.mskcc.org:8099/pages/viewpage.action?pageId=25595196

class Project {
    constructor (requestId, runLength, samples = [], recipe, requestName) {
        this.requestId = requestId; 
        this.runLength = runLength; // one project same runlength
        this.samples = samples;
        this.recipe = recipe; // correlates with project, same project = same recipe
        this.requestName = requestName;
        this.userLibrary = false;
        this.wes = false;
    }

    
    isUserLibrary(){
        if(this.requestName.includes("Investigator")) {
            this.userLibrary = true;   
        }
    }
    canBeSplit(){
        //only whole exome can be split
        if(this.recipe.includes("IDT_Exome")) {
            this.wes = true;
        }
        
    }


}

module.exports = {
    Project
}

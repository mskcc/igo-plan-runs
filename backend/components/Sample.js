// http://plvpipetrack1.mskcc.org:8099/pages/viewpage.action?pageId=25595196


class Sample {
    constructor(sampleId, barcodeSeq=[], recipe, runLength, readsRequested, library, project, sampleConcentration, concentrationUnit) {
        this.sampleId = sampleId;
        this.barcodeSeq = barcodeSeq; // should be an array bc captured pools have arrays of barcode seqs
        this.recipe = recipe;
        this.runLength = runLength; // read length
        this.readsRequested = readsRequested;
        this.library = library; //requestName
        this.project = project // requestId
        this.sampleConcentration = sampleConcentration;
        this.concentrationUnit = concentrationUnit;
    }
    
    poolByReadLength(run) { //
        if(this.runLength == run.runLength){
            for(let lane of run.lanes) {
                if (!lane.filled && this.library == lane.library) {
                    lane.addSample(this);
                }
            }
        }
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
    Sample
}
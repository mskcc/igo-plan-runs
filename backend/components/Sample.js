// http://plvpipetrack1.mskcc.org:8099/pages/viewpage.action?pageId=25595196


class Sample {
    constructor(sampleId, barcodeSeq, recipe, runLength, readsRequested, library, project, sampleConcentration, concentrationUnit) {
        this.sampleId = sampleId;
        this.barcodeSeq = barcodeSeq;
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


}


module.exports = {
    Sample
}
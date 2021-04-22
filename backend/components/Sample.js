// http://plvpipetrack1.mskcc.org:8099/pages/viewpage.action?pageId=25595196


class Sample {
    constructor(sampleId, sampleConcentration, wellPos, barcodeSeq, tumor, runLength, requestName, readsRequested) {
        this.sampleId = sampleId;
        this.sampleConcentration = sampleConcentration;
        this.wellPos = wellPos; 
        this.barcodeSeq = barcodeSeq;
        this.tumor = tumor;
        this.runLength = runLength; // read length
        this.readsRequested = readsRequested;
        this.library = library; //requestName
        this.project = project // requestId
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
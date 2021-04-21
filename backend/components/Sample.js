// http://plvpipetrack1.mskcc.org:8099/pages/viewpage.action?pageId=25595196


class Sample {
    constructor(sampleId, sampleConcentration, wellPos, barcodeSeq, tumor, runLength, readsRequested) {
        this.sampleId = sampleId;
        this.sampleConcentration = sampleConcentration;
        this.wellPos = wellPos; 
        this.barcodeSeq = barcodeSeq;
        this.tumor = tumor;
        this.runLength = runLength;
        this.readsRequested = readsRequested;
    }
   
    poolByReadLength(lane) { //
        for(let sample of lane.samples) {
            if (sample.runLength == this.runLength) {
                lane.addSample(this);
            } else {
                continue;
            }
        }
    }


}


module.exports = {
    Sample
}
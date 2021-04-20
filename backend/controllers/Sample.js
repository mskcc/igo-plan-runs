// http://plvpipetrack1.mskcc.org:8099/pages/viewpage.action?pageId=25595196


class Sample {
    constructor(sampleId, wellPos, barcodeSeq, tumor, readNum, runLength, readsRequested) {
        this.sampleId = sampleId;
        this.wellPos = wellPos; 
        this.barcodeSeq = barcodeSeq;
        this.tumor = tumor;
        this.readNum = readNum;
        this.runLength = runLength;
        this.readsRequested = readsRequested;
    }
    noIndexCollision = (lane) => { // if lane does not include barcode seqs that are the same, push sample to lane
        if (!lane.includes(this.barcodeSeq)) {
            lane.push(this);
        }
    }
    poolByReadLength = (lane) => { // 
        for(let sample of lane) {
            if (this.runLength == sample.runLength){
                lane.push(this);
            }
        }
    }


}


module.exports = class Sample {
    constructor(arg) {
        console.log(arg);
    }
}
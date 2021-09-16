const { logger } = require('../winston');

// define class of individual samples

class sample{
    constructor(poolID, sampleID, recipe, requestID, RequestName, sampleConc, units, volume, barcodeSeq, runLength, readsRequest, readsRemaining){
        this.poolID = poolID; // if doesn't exist, show as undefined
        this.sampleID = sampleID;
        this.recipe = recipe;
        this.requestID = requestID;
        if(RequestName.includes("Investigator Prepared") ){
            this.isUser = true;
        }else{
            this.isUser = false;
        }
        this.sampleConc = sampleConc;
        this.units = units;
        this.volume = volume;
        this.barcodeSeq = barcodeSeq;
        this.runLength = runLength;
        this.readsRequest = Number(readsRequest);
        this.readsRemaining = readsRemaining;
    }

}

// class of pooled samples

class pooledSample{
    //calculate totalreads from list of samples
    getTotalReads(listOfSamples) {
        var totalReads = 0;
        for(let i = 0; i < listOfSamples.length; i++){
            totalReads = totalReads + listOfSamples[i].readsRequest;
        }
        return totalReads;
    }
    ifcontainNormal(listOfSamples){
        let contain = false;
        for(let i = 0; i < listOfSamples.length; i++){
            if (listOfSamples[i].sampleID.includes("NORMAL")){
                contain = true;
                break;
            }
        }
        return contain;
    }
    createBarcodeList(listOfSamples){
        var barcodeList = [];
        for(let i = 0; i < listOfSamples.length; i++){
            if(listOfSamples[i].sampleID.includes("NORMAL")){
                barcodeList.unshift(listOfSamples[i].barcodeSeq);
            }else{
                barcodeList.push(listOfSamples[i].barcodeSeq);
            }
        }
        return barcodeList;
    }

    filterSample(sample) {
        return sample.runLength !== undefined;
    }

    constructor(listOfSamples){ 
        this.readsRequest = this.getTotalReads(listOfSamples);
        this.containNormal = this.ifcontainNormal(listOfSamples);
        
        const representativeSample = listOfSamples.filter(this.filterSample)[0];

        this.poolID = representativeSample.poolID;
        this.recipe = representativeSample.recipe;
        this.isUser = representativeSample.isUser;
        this.runLength = representativeSample.runLength;
        this.barcodeSeq = this.createBarcodeList(listOfSamples);
    }
}

module.exports = {sample, pooledSample}; 
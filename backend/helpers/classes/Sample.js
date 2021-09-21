const { logger } = require('../winston');

/**
 * Class that represents a sample object.
 * 
 * @param {string} poolID This will equal to undefined if it is an individual sample, information coming from pool
 * @param {string} sampleID Information comes from sampelId
 * @param {string} recipe Information comes from recipe
 * @param {string} requestID Information comes from requestId
 * @param {boolean} isUser Information comes from requestName
 * @param {number} sampleConc Information comes from altConcentration
 * @param {string} units Information comes from concentrationUnits
 * @param {number} volume Information comes from volume
 * @param {string} barcodeSeq Information comes from barcodeSeq
 * @param {string} runLength Information comes from runTypoe
 * @param {number} readsRequest Information comes from readNum
 * @param {number} readsRemaining Information comes from remainingReads
 * 
 */
class Sample{
    constructor(poolID, sampleID, recipe, requestID, RequestName, sampleConc, units, volume, barcodeSeq, runLength, readsRequest, readsRemaining){
        this.poolID = poolID;
        this.sampleID = sampleID;
        this.recipe = recipe;
        this.requestID = requestID;
        if(RequestName.includes("Investigator Prepared") ){
            this.isUser = true;
        }else{
            this.isUser = false;
        }
        this.sampleConc = Number(sampleConc);
        this.units = units;
        this.volume = Number(volume);
        this.barcodeSeq = barcodeSeq;
        this.runLength = runLength;
        this.readsRequest = Number(readsRequest);
        this.readsRemaining = Number(readsRemaining);
        this.groupID = 0;
    }

}

/**
 * Class that represents pooled samples which means samples that have poolID with it. 
 *     Each PooledSample object will represent one pool.
 * 
 * @param {Array} listOfSamples An array of Sample objects.
 * 
 */
class PooledSample{
    constructor(listOfSamples){ 
        this.readsRequest = this.getTotalReads(listOfSamples);
        this.containNormal = this.ifContainNormal(listOfSamples);
        this.barcodeSeq = this.createBarcodeList(listOfSamples);

        const representativeSample = listOfSamples.filter(this.filterSample)[0];

        this.poolID = representativeSample.poolID;
        this.recipe = representativeSample.recipe;
        this.isUser = representativeSample.isUser;
        this.runLength = representativeSample.runLength;
        this.groupID = 0;
        }
    /**
     * Calculate totalreads from an array of Sample objects which is the PooledSample class input
     * 
     * @param {Array} listOfSamples An array of Sample objects.
     * @returns {number} total reads number for all the samples in the array 
     * 
     */
    getTotalReads(listOfSamples) {
        var totalReads = 0;
        for(let i = 0; i < listOfSamples.length; i++){
            totalReads = totalReads + listOfSamples[i].readsRequest;
        }
        return totalReads;
    }
    /**
     * Check whether there is poolednormal sample existing within an array of Sample objects which is the PooledSample class input
     * 
     * @param {Array} listOfSamples An array of Sample objects.
     * @returns {boolean} whether the pool contains the poolednormal
     * 
     */
    ifContainNormal(listOfSamples){
        let contain = false;
        for(let i = 0; i < listOfSamples.length; i++){
            if (listOfSamples[i].sampleID.includes("NORMAL")){
                contain = true;
                break;
            }
        }
        return contain;
    }
    /**
     * Generate an array of barcodeSeq that contains all the barcodeSeq from an array of Sample objects which is the PooledSample 
     *     class input. If poolednoraml exists, the first item of the array will be the barcode for the poolednormal sample. Not
     *     consider the situation when one pool contain more than one pooled normal.
     *     
     * @param {Array} listOfSamples An array of Sample objects.
     * @returns {Array} An array of barcode.
     * 
     */
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
    /**
     * Get rid of the samples that is a pooled normal
     * 
     * @param {Array} listOfSamples An array of Sample objects.
     * @returns array of samples that have runLength infor with it.
     */
    filterSample(listOfSamples) {
        return listOfSamples.runLength !== undefined;
    }

}

module.exports = {Sample, PooledSample}; 
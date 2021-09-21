const { logger } = require('./winston');
const {Sample, PooledSample} = require('./classes/Sample');

/**
 * Create Sample object from LIMS information
 * 
 * @param {Object} sampleMap Object contains sample information from LIMS with key value pair format
 * @returns  Sample object 
 */
exports.createSampleObject = function(sampleMap) {
    var sampleObject = new Sample(sampleMap['pool'], sampleMap['sampleId'],sampleMap['recipe'],sampleMap['requestId'],sampleMap['requestName'],
    sampleMap['altConcentration'],sampleMap['concentrationUnits'],sampleMap['volume'],sampleMap['barcodeSeq'],sampleMap['runType'],
    sampleMap['readNum'],sampleMap['remainingReads']);
    return sampleObject;
}

/**
 * create sampleList by merging pooledsamples from sample object list
 * 
 * @param {Array} sampleObjectList Sample object list
 * @returns sampleList that merged samples with poolID into PooledSample with the Sample object first and PooledSample in the last
 */
exports.createSampleList = function(sampleObjectList){
    var sampleList = [];
    const samplePoolList = new Map();
    for (let i = 0; i < sampleObjectList.length; i++){
        if(sampleObjectList[i].poolID === undefined){
            sampleList.push(sampleObjectList[i]);
        }else{
            if(samplePoolList.has(sampleObjectList[i].poolID)){
                var temp = samplePoolList.get(sampleObjectList[i].poolID)
                temp.push(sampleObjectList[i]);
                samplePoolList.set(sampleObjectList[i].poolID,temp)
            }else{
                samplePoolList.set(sampleObjectList[i].poolID, [sampleObjectList[i]]);
            }
        }
    }
    for (const value of samplePoolList.values()){
        var pooledSampleObject = new PooledSample(value);
        sampleList.push(pooledSampleObject);
    }   
    return(sampleList);
}

/**
 * group samples by run type and return a map with runLength as key and sample list as value
 * 
 * @param {Array} sampleObjectList array of Sample/PooledSample Objects
 * @returns a map with runLength as key and sample list as value
 */
exports.groupSampleByRunType = function(sampleObjectList){
    const runTypeList = new Map();
    for (let i = 0; i < sampleObjectList.length; i++){
        if(runTypeList.has(sampleObjectList[i].runLength)){
            runTypeList.get(sampleObjectList[i].runLength).push(sampleObjectList[i]);
        }else{
            runTypeList.set(sampleObjectList[i].runLength, [sampleObjectList[i]]);
        }
    }  
    return(runTypeList);
}

/**
 * barcode collison checking between two barcodes by given length and number of mismatch allowed
 * 
 * @param {string} seq1 barcode
 * @param {string} seq2 barcode
 * @param {number} length length that want to perform the collison checking
 * @param {number} numOfMismatch number of mismatch allowed
 * @returns true if collision happens under situation of certain number of mismatch allowed
 */
function barcodeCollision(seq1, seq2, length, numOfMismatch){
    var seq1_frag = seq1.substr(0,length);
    var seq2_frag = seq2.substr(0,length);
    var mismatch1 = 0;
    var mismatch2 = 0;
    if (seq1.includes('-')){
        for (let i = 0; i < seq1_frag.indexOf('-'); i++){
            if (seq1_frag[i] != seq2_frag[i]){
                mismatch1 = mismatch1 + 1;
            }
        }
        for (let i = seq1_frag.indexOf('-'); i < seq1_frag.length; i++){
            if (seq1_frag[i] != seq2_frag[i]){
                mismatch2 = mismatch2 + 1;
            }
        }
    } else{
        for (let i = 0; i < length; i++){
            if (seq1_frag[i] != seq2_frag[i]){
                mismatch1 = mismatch1 + 1;
            }
        }
    }               
    if (mismatch1 <= numOfMismatch * 2 && mismatch2 <= numOfMismatch * 2){
        return true;
    } else{
        return false;
    }

}

/**
 * barcode collison checking between two list of barcodes by given length and number of mismatch allowed
 * 
 * @param {Array or string} seqList1 list of barcode or individual barcode
 * @param {Array or string} seqList2 list of barcode or individual barcode
 * @param {number} numOfMismatch number of mismatch allowed
 * @returns true if collision happens under situation of certain number of mismatch allowed
 */
function listBarcodeCollision(seqList1, seqList2, numOfMismatch){
    //merge single barcode/list barcode into one array
    var emptyList = [];
    emptyList.push(seqList1, seqList2);
    var newSeqList = emptyList.flat();
    //get minimum barcode length
    var minLength = 30;
    for (let i = 0; i < newSeqList.length; i++){
        if(newSeqList[i].length < minLength){
            minLength = newSeqList[i].length;
        }
    }
    //check barcode collision one by one
    for(let i = 0; i < newSeqList.length - 1; i++){
        for(let j = i + 1; j < newSeqList.length; j++){
            if (barcodeCollision(newSeqList[i], newSeqList[j], minLength, numOfMismatch)){
                return true;
            }
        }
    }
    return false;
}

/**
 * calculate total reads from a list of samples
 * 
 * @param {Array} listOfSamples array of Sample/PooledSample objects
 * @returns total reads from the list of samples/PooledSamples
 */
function getTotalReads(listOfSamples) {
    var totalReadsNum = 0;
    for(let i = 0; i < listOfSamples.length; i++){
        totalReadsNum = totalReadsNum + listOfSamples[i].readsRequest;
    }
    return totalReadsNum;
}

/**
 * Check barcode of pools that contain pool normal(not tested yet)
 * 
 * @param {PooledSample} pool1 PooledSample object
 * @param {PooledSample} pool2 PooledSample object
 * @param {Number} numOfMismatch number of mismatch allowed
 * @returns true if the collision happened cause by non-poolnormal sample within the pool
 */
function checkPoolNormal(pool1, pool2, numOfMismatch){
    var minLength = 30;
    for (let i = 0; i < pool1.barcodeSeq.length; i++){
        if(pool1.barcodeSeq[i].length < minLength){
            minLength = pool1.barcodeSeq[i].length ;
        }
    }
    for (let i = 0; i < pool2.barcodeSeq.length; i++){
        if(pool2.barcodeSeq[i].length < minLength){
            minLength = pool2.barcodeSeq[i].length ;
        }
    }
    for (let i = 0; i < pool1.barcodeSeq.length; i++){
        for (let j = 0; j < pool2.barcodeSeq.length; j++){
            if (barcodeCollision(pool1.barcodeSeq[i], pool2.barcodeSeq[j],minLength,numOfMismatch) && !(i == 0 && j == 0)){
                return true;
            }
        }
    }
    return false;
}

/**
 * Check whether barcode collison happens between two samples
 * 
 * @param {Sample} sample1 Sample/PooledSample object
 * @param {Sample} sample2 Sample/PooledSample object
 * @param {Number} numOfMismatch number of mismatch allowed
 * @returns true for collision happens
 */
function sampleBarcodeCollision(sample1, sample2, numOfMismatch){
    if (sample1.poolID !== undefined && sample2.poolID !== undefined 
    && sample1.containNormal && sample2.containNormal){
            return checkPoolNormal(sample1, sample2, numOfMismatch);
    }else{
        return listBarcodeCollision(sample1.barcodeSeq, sample2.barcodeSeq, numOfMismatch);
    }
}

/**
 * seperating samples into different groups based on barcode
 * 
 * @param {Array} sampleList array of Sample Objects
 * @returns Array of barcode groups, the last item of the array is the samples that can go with any other samples
 */
exports.getCollisionGroup = function(sampleList){
    var freeList = sampleList.concat();
    var groupList = [];
    var collisionListPool = [];
    var collisionListLib = [];
     //function to sort collisionList by collision times
    function makeSortedCollisionList(collisionList1){
        var collisionMap = new Map();
        for(let i = 0; i < collisionList1.length; i++){
            let count = 0;
            for(let j = 0; j < collisionList1.length; j++){ 
                if((i != j) && (sampleBarcodeCollision(collisionList1[i], collisionList1[j],0))){
                    count = count + 1;
                }
            }
            collisionMap.set(collisionList1[i], count);
        }    
        const collisionMapSorted = new Map([...collisionMap.entries()].sort((a, b) => b[1] - a[1]));
        var collisionListSorted1 = [];
        for (const key of collisionMapSorted.keys()){
            collisionListSorted1.push(key);
        } 
        return collisionListSorted1;
    }

    function sortSamplesByProject(collisionListLibrary) {
        var projectMap = new Map();
        for (let i = 0; i < collisionListLibrary.length; i++){
            if (projectMap.has(collisionListLibrary[i].requestId)){
                projectMap.get(collisionListLibrary[i].requestId).push(collisionListLibrary[i]);
            }else{
                projectMap.set(collisionListLibrary[i].requestId, [collisionListLibrary[i]]);
            }
        }
        const projectMapSorted = new Map([...projectMap.entries()].sort());
        var collisionListLibrarySorted = [];
        for (const value of projectMapSorted.values()){
            for (let i = 0; i < value.length; i++){
                collisionListLibrarySorted.push(value[i]);
            }
        }
        return collisionListLibrarySorted;
        
    }

    // seperate the samples into freeList and collisionList based on barcode
    for(let i = 0; i < sampleList.length; i++){
        for(let j = 0; j < sampleList.length; j++){
            let collision = false;
            if((i != j) && (sampleBarcodeCollision(sampleList[i], sampleList[j],0))){
                    //remove the sample with collision barcode from freeList
                    for(let m = 0; m < freeList.length; m++){ 
                        if (freeList[m] === sampleList[i]) { 
                            freeList.splice(m, 1); 
                        }
                    }
                    //then push the sample with collision barcode into collisionListPool/collisionLib
                    if(sampleList[i].poolID === undefined){
                        collisionListLib.push(sampleList[i]);
                    }else{
                        collisionListPool.push(sampleList[i]);
                    }
                    
                    break;
            }
        }
    }
    //create groupList based on sortedcollisonlist(based on collision times)
    var collisionListLibSorted = sortSamplesByProject(collisionListLib);
    var collisionPoolSorted = makeSortedCollisionList(collisionListPool);
    var collisionListSorted = collisionListLibSorted.concat(collisionPoolSorted);
    for (let i = 0; i < collisionListSorted.length; i++){
        if (groupList.length != 0){
            for (let x = 0; x < groupList.length; x++){
                var add = true;
                for(let y = 0; y < groupList[x].length; y++){
                    if(sampleBarcodeCollision(collisionListSorted[i], groupList[x][y],0)){
                        add = false;
                        break;
                    }
                }
                if(add == true){
                    groupList[x].push(collisionListSorted[i]);
                    break;
                }
            }
            if(add == false){
                groupList.push([collisionListSorted[i]]);
            }
        }else{
            groupList.push([collisionListSorted[i]]);
        }

    }
    groupList.push(freeList);
    return groupList;
}



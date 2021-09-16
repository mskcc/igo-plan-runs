const { logger } = require('./winston');
const {sample, pooledSample} = require('./classes/Sample');

//function to create sample object from testcase file(LIMS request)
exports.createSampleObject = function(sampleMap) {
    var sampleObject = new sample(sampleMap['pool'], sampleMap['sampleId'],sampleMap['recipe'],sampleMap['requestId'],sampleMap['requestName'],
    sampleMap['altConcentration'],sampleMap['concentrationUnits'],sampleMap['volume'],sampleMap['barcodeSeq'],sampleMap['runType'],
    sampleMap['readNum'],sampleMap['remainingReads']);
    return sampleObject;
}
//function to create sampleList by merging pooledsamples from sample object list
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
        var pooledSampleObject = new pooledSample(value);
        sampleList.push(pooledSampleObject);
    }   
    return(sampleList);
}
//group samples by run type and return a map
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

// function for barcode checking between two samples
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

//function for list barcode checking
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

//function to calculates total reads from a list of samples
function getTotalReads(listOfSamples) {
    var totalReadsNum = 0;
    for(let i = 0; i < listOfSamples.length; i++){
        totalReadsNum = totalReadsNum + listOfSamples[i].readsRequest;
    }
    return totalReadsNum;
}

//function for checking barcode of pools that contain pool normal(not tested yet)
//return false if collison caused by pool normal
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
//function for checking whether barcode collison happens between two samples
function sampleBarcodeCollision(sample1, sample2, numOfMismatch){
    if (sample1.poolID !== undefined && sample2.poolID !== undefined 
    && sample1.containNormal == true && sample2.containNormal == true){
            return checkPoolNormal(sample1, sample2, numOfMismatch);
    }else{
        return listBarcodeCollision(sample1.barcodeSeq, sample2.barcodeSeq, numOfMismatch);
    }
}


// function for seperating samples into different groups based on barcode
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



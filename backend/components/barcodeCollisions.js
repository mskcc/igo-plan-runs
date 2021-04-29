


function noIndexCollision(samples){ // if lane does not include barcode seqs that are the same, push sample to lane
    let barcodes = []
    let minLength = 0;
    let duplicates = [];
    for (let sample of samples) {
        if (minLength < sample.barcodeSeq.length) {
            minLength = sample.barcodeSeq.length;
        }
    }
    for(let sample of samples) {
        barcodes.push(sample.barcodeSeq);
    }
    barcodes.sort((a,b) => a-b);
    let i =0; 
    let j = 1;
    while(i<barcodes.length) {
        if(barcodes[i].slice(0, minLength) != barcodes[j].slice(0, minLength)) {
            i += 1;
            j += 1;
        } else {
            duplicates.push(barcodes[j]);
            barcodes.splice(j, 1);
        }
    }
    return [barcodes, duplicates];
    
}

module.exports = {
    noIndexCollision
}

//samples = run array
// some samples - list of other samples (captured normal) with, word Pool in pool column
// cannot group catpure by project. WES and capture = same as project 
//  capture - pool has many projects, consider capture as, has pool id is capture, can 
// be broken up by project

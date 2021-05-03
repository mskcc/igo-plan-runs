const { Lane } = require("./Lane");
const { Sample } = require("./Sample");


/**
 * splits samples according to barcode collisions 
 * @param  {Array} samples  input array of samples in run
 * @param  {Number} numLanes number of lanes in run
 * @param  {Number} capacity capacity of flow cell
 * @return {Array}  array of lanes with distinct barcode seqs 
 */

function splitBarcodes(samples, numLanes, capacity) {
    let freq = {}
    let ans = {}
    let remaining = [];
    let minLength = samples[0].barcodeSeq.length;
    for(let sample of samples) {
        if(minLength > sample.barcodeSeq.length) {
            minLength = sample.barcodeSeq.length;
        }
    }
    
    for(let i = 0; i < samples.length; i++) {
        let fragment = samples[i].barcodeSeq.substring(0, minLength);
        if(fragment in freq) {
            if (freq[fragment] + 1 > numLanes) {
                remaining.push(samples[i]);
                break;
            }
        }
        if(fragment in freq ) {
            freq[fragment] += 1;
           
            
        } else {
            freq[fragment] = 1;
            
        }
        console.log("freq", freq);
        
        
        if(freq[fragment]in ans) {
            
            ans[freq[fragment]].push(samples[i])
            

        } else {
            
                ans[freq[fragment]] = [samples[i]];
            
           
        }
    }

    let lanes = [];
    for (let samples of Object.values(ans)) {
        let totalReads = capacity;
        for(let sample of samples) {
            totalReads -= sample.readsRequested;
        }
        if(totalReads < 0) {
            let excludedSample = samples.pop()
            remaining.push(excludedSample);  
        }
        let lane = new Lane()
    }
    
    return [Object.values(ans), remaining];
}


let sample1 = new Sample(1, "", "ACTAGC", "123", "PE150", 200, "ABC", "ABC", 120, "nM");
let sample2 = new Sample(2, "", "ACTAGC-GCTACD", "123", "PE150", 200, "ABC", "ABC", 120, "nM")
let sample3 = new Sample(3, "", "ACTAGT", "123", "PE150", 200, "ABC", "ABC", 120, "nM")
let sample4 = new Sample(4, "", "ACTAGT-ACTTCA", "123", "PE150", 200, "ABC", "ABC", 120, "nM")
let sample5 = new Sample(5, "", "ACTAGA", "123", "PE150", 200, "ABC", "ABC", 120, "nM")
let sample6 = new Sample(6, "", "ACTAGC", "123", "PE150", 200, "ABC", "ABC", 120, "nM");
console.log(splitBarcodes([sample1, sample2, sample3, sample4, sample5, sample6], 2, 400))

module.exports = {
    splitBarcodes
}


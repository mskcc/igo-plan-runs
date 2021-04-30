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
    let minLength = samples[0].barcodeSeq.length;
    for(let sample of samples) {
        if(minLength > sample.barcodeSeq.length) {
            minLength = sample.barcodeSeq.length;
        }
    }
    for(let i = 0; i < samples.length; i++) {
        if(samples[i].barcodeSeq.substring(0, minLength) in freq) {
            if (freq[samples[i].barcodeSeq.substring(0, minLength)] + 1 > numLanes) {
                console.log("too many collisions");
            }
        }
        if(samples[i].barcodeSeq.substring(0, minLength) in freq) {
            freq[samples[i].barcodeSeq.substring(0, minLength)] += 1;
        } else {
            freq[samples[i].barcodeSeq.substring(0, minLength)] = 1;
        }
        console.log("freq", freq);
        if(freq[samples[i].barcodeSeq.substring(0, minLength)] in ans) {
            ans[freq[samples[i].barcodeSeq.substring(0, minLength)]].push(samples[i])
        } else {
            ans[freq[samples[i].barcodeSeq.substring(0, minLength)]] = [samples[i]];
        }
    }

    return Object.values(ans);
}


let sample1 = new Sample(1, "", "ACTAGC", "123", "PE150", 200, "ABC", "ABC", 120, "nM");
let sample2 = new Sample(2, "", "ACTAGC-GCTACD", "123", "PE150", 200, "ABC", "ABC", 120, "nM")
let sample3 = new Sample(3, "", "ACTAGT", "123", "PE150", 200, "ABC", "ABC", 120, "nM")
let sample4 = new Sample(4, "", "ACTAGT-ACTTCA", "123", "PE150", 200, "ABC", "ABC", 120, "nM")

console.log(splitBarcodes([sample1, sample2, sample3, sample4], 2, 400))
module.exports = {
    splitBarcodes
}


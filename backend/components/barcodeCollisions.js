const { Lane } = require("./Lane");
const { Run } = require("./Run");
const { Sample } = require("./Sample");


/**
 * splits samples according to barcode collisions 
 * @param  {Object} run  takes in Run object
 * @return {Object} returns object with run in runs array and remaining in remaining array
 */

function splitBarcodes(run) {
    const numLanes = run.getTotalLanes();
    const maxCapacity = run.getLaneCapacity()[1];
    const minCapacity = run.getLaneCapacity()[0];

    let ans = {}
    let remaining = [];
    let samples = run.projects;
    let minLength = samples[0].barcodeSeq.length;
    for(let sample of samples) {
        if(minLength > sample.barcodeSeq.length) {
            minLength = sample.barcodeSeq.length;
        }
    }

    let freq = {}
    
    for(let i = 0; i < samples.length; i++) {
        let fragment = samples[i].barcodeSeq.substring(0, minLength);
        if(samples[i].pool.includes("Pool")) {
            fragment = samples[i].barcodeSeq;
        }
        
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

    let res = {"Runs": [], "Remaining": []}
    for (let samples of Object.values(ans)) {
        samples.sort((a,b)=> b-a); 
        let totalReads = maxCapacity;
        for(let sample of samples) {
            totalReads -= sample.readsRequested;
           
        }
        if(totalReads < 0) {
            let excludedSample = samples.pop()
            remaining.push(excludedSample);  
        }
        

        let lane = new Lane([], run.type, "ABC");
        for(let sample of samples) {
            if(sample.requestId == lane.project) {
                lane.samples.push(sample);
            }
        }
        run.lanes.push(lane);
        
    }

    for(let sample of run.lanes) {
        console.log("lane", sample);
    }
    

    res["Runs"].push(run);
    res["Remaining"] = remaining;
   console.log("remaining", res["Remaining"]);
   console.log(res);
    return res;
}


let sample1 = new Sample(1, "", "ACTAGC", "123", "PE150", 200, "ABC", "ABC", 120, "nM");
let sample2 = new Sample(2, "", "ACTAGC-GCTACD", "123", "PE150", 200, "ABC", "ABC", 120, "nM")
let sample3 = new Sample(3, "", "ACTAGT", "123", "PE150", 150, "ABC", "ABC", 120, "nM")
let sample4 = new Sample(4, "", "ACTAGT-ACTTCA", "123", "PE150", 200, "ABC", "ABC", 120, "nM")
let sample5 = new Sample(5, "Pool", "ACTAGG", "123", "PE150", 75, "ABC", "ABC", 120, "nM")
let sample6 = new Sample(6, "Pool", "ACTAGG", "123", "PE150", 200, "ABC", "ABC", 120, "nM");

let run1 = new Run("SP", "PE150", [sample1, sample2, sample3, sample4, sample5, sample6])
console.log(splitBarcodes(run1));

module.exports = {
    splitBarcodes
}


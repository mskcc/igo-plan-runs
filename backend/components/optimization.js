const { Run } = require('./Run');



const optimizeLanes = (samples) => {

}

const optimizeRemaining = (samples) => {

}



const optimizeRuns = (samples) => {
    const costs = {'SP': 1, 'S1': 2, 'S2': 3, 'S4': 4}
    let numRuns = 4;
    const capacity = {'SP':[700,800], 'S1': [1600, 1800], 'S2': [3600, 3800], 'S4': [9000, 10000]}
    let res = [];

    function backtrack(remaining, subarray, start, targetRange) {
        if (remaining == 0) {
            res.push(subarray);
            return;
        } else if(remaining < 0) {
            return;
        }
        for(let i = start; i < samples.length; i++) {
            subarray.push(samples[i]);
            backtrack(remaining-samples[i].readsRequested, subarray, i, targetRange);
            subarray.pop()
        }
    }
    backtrack(7000, [], 0,[9000, 10000] );
    return res;
}

console.log(knapsack([{"sample": 1, "readsRequested": 3000}, {"sample": 2, "readsRequested": 2000},
{"sample": 2, "readsRequested": 2000}]));

module.exports = {
   optimizeRuns
}



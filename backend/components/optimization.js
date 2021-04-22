import { Run } from "./Run";

const optimizeRuns = (samples) => {
    let runs = [0] * samples.length;
    //resulting runs array will assign a run to each sample
    let runLengths = samples.map(sample => {
        return sample.runType
    })
    maxRunLength = "";
    maxRunLengthCount = 0
    runLengthMap = new Map();
    for (let runLength of runLengths) {
        if (runLengthMap.has(runLength)) {
            runLengthMap[runLength]++;
        } else {
            runLengthMap.set(runLength, 0);
        }
    }
    for(let [key, value] of runLengths.entries()) {
        if(value > maxRunLengthCount) {
            maxRunLengthCount = value;
            maxRunLength = key;
        }

    }
    runs[0] = new Run('S4', maxRunLength)

    for(let i = 0; i  < samples.length; i++) {
        
    }
    // samples.splice(sampleIndex, 1) when 
}

const optimizeLanes = (samples) => {

}

const optimizeRemaining = (samples) => {

}

const flowcells = {'SP': 1, 'S1': 2, 'S2': 3, 'S4': 4}

// def combinationSum(samples, readCapacity):
//     res = []
    
//     def backtrack(rem, sub, start):
//         if rem == 0:
//             res.append(list(sub))
//             return
//         elif rem < 0:
//             return 
//         for i in range(start, len(candidates)):
//             sub.append(candidates[i])
//             backtrack(rem- candidates[i], sub, i)
//             sub.pop()
        
        
//     backtrack(target, [], 0)
//     return res
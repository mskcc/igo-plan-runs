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
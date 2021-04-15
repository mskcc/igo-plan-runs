// #2 requirement, pooling together samples of same read length
// return map with keys equal to read length, and values are arrays of samples with matching read length

function poolSameRunLength(samples) {
    let map = {}
    let runLengths = []
    for (let sample of samples) {
      runLengths.push(sample.runType);
    }
    let runLengthSet = new Set(runLengths);
    runLengthSet.forEach(run => {
      map[run] = []
    })
    for (let sample of samples) {
      map[sample.runType].push(sample);
    }
    return map;
  }
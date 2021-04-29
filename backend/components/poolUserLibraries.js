function poolUserLibraries(projects) {
    let readCount = 0
    let res = []
    for(let project of projects) {
      let runLength = project.runLength;
      if(project.isUserLibrary()) {
          for(let sample of project.samples) {
            readCount += sample.readsRequested;
          }
        
      if(readCount < 800) {
        let run = new Run(null, 0,'SP', runLength);
        run.totalReads += readCount;
        run.projects.push(project);
        res.push(run)
        
      }
      else if (readCount < 1800) {
        let run = new Run(null, 0, 'S1', runLength);
        run.totalReads += readCount;
        run.projects.push(project);
        res.push(run)
        
      } else if (readCount < 3800) {
        let run = new Run(null, 0, 'S2', runLength);
        run.totalReads += readCount;
        run.projects.push(project);
        res.push(run);
        
      } else {
        let run = new Run(null, 0, 'S4', runLength);
        run.totalReads += readCount;
        run.projects.push(project);
        res.push(run);
      }
    }

    }
    return res;
  }

module.exports = {
    poolUserLibraries
}
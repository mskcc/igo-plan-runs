const { getCollisionGroup, groupSampleByRunType } = require('./planRunsUtil');


export const rePlan = (params) => {
    let sampleForRePlan = [];
    let sampleLeft = [];


    params.forEach(element => {
        if (element.isIncluded === true){
            element.groupID = "";
            sampleForRePlan.push(element);
        }else{
            element.groupID = "";
            sampleLeft.push(element);
        }
        
    });
    var runTypeResult = new Map();
    var runTypeGroup = groupSampleByRunType(sampleForRePlan);
      for (const key of runTypeGroup.keys()){
        runTypeResult.set(key, getCollisionGroup(runTypeGroup.get(key)));
      }
      var runTypeResultList = [];
      for (const runLengthGroup of runTypeResult.values()){
        runLengthGroup.forEach((sampleList, index) => { 
          sampleList.forEach((element) => {
            element.groupID = index + 1;
            runTypeResultList.push(element);
          })
        });
    }

    let rePlanResult = runTypeResultList.concat(sampleLeft);
    return rePlanResult;

}


const { planRuns } = require('./runPlannerFinal');
const { splitBarcodes }  = require('./barcodeCollisions');
// const { poolUserLibraries } = require('./poolUserLibraries');
const { poolSameProject, poolSameRunLength, poolSameLibrary } = require('./PoolFunctions')

const fs = require('fs');

let raw = fs.readFileSync('./samples.json');
let data  = JSON.parse(raw);

function mainRunPlanner(samples) {
    let result = {"Runs": [], "Lanes": [], "Remaining" : []};
    let input = poolSameRunLength(poolSameProject(samples));
    // console.log(input);
    let runs;
    let processedRunsByBarcodes = [];
    for(let [runLength, projects] of Object.entries(input)) {
        runs = planRuns(projects, runLength)['Runs'];
        console.log(runs);
        let rem = planRuns(projects, runLength)["Remaining"];
        console.log(rem);
        result["Remaining"].push(planRuns(projects,runLength)['Remaining']);
        for(let run of runs) {
            processedRunsByBarcodes.push(splitBarcodes(run));
        }
    }
    console.log("processed", processedRunsByBarcodes);
    // console.log(runs);
    for(let pool of processedRunsByBarcodes) {
        for(let run of pool['Runs']) {
            result['Runs'].push(run);
        }
    }


    return result;


}

console.log("main", mainRunPlanner(data));
// console.log("pool", poolSameRunLength(poolSameProject(data)));


// main {
//     Runs: [
//       Run {
//         id: 'v8346dbsj',
//         lanes: [Array],
//         type: 'S4',
//         runLength: 'PE150',
//         projects: [Array],
//         totalReads: 0,
//         isValid: false,
//         totalLanes: 0,
//         readCapacity: [Object],
//         laneCapacity: [Object]
//       },
//       Run {
//         id: 'ti30m0gkd',
//         lanes: [Array],
//         type: 'S4',
//         runLength: 'PE150',
//         projects: [Array],
//         totalReads: 0,
//         isValid: false,
//         totalLanes: 0,
//         readCapacity: [Object],
//         laneCapacity: [Object]
//       },
//       Run {
//         id: 'lxs4res40',
//         lanes: [Array],
//         type: 'S2',
//         runLength: 'PE150',
//         projects: [Array],
//         totalReads: 0,
//         isValid: false,
//         totalLanes: 0,
//         readCapacity: [Object],
//         laneCapacity: [Object]
//       },
//       Run {
//         id: 'f4utaod24',
//         lanes: [Array],
//         type: 'SP',
//         runLength: 'PE100',
//         projects: [Array],
//         totalReads: 0,
//         isValid: false,
//         totalLanes: 0,
//         readCapacity: [Object],
//         laneCapacity: [Object]
//       }
//     ],
//     Lanes: [],
//     Remaining: [
//       [ [Project] ],
//       [],
//       [ [Project], [Project], [Project], [Project] ],
//       [ [Project], [Project], [Project], [Project] ]
//     ]
//   }
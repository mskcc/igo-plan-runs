

function plan(samples) {
    let capacities = [800, 1800, 3800, 10000];
    let runs = ['SP', 'S1', 'S2', 'S4'];
    let ranges = [100, 200, 200, 1000];
    let totalReads = samples.reduce((acc, ele) => {
      return acc + ele;
    }, 0);
    function findWeight(totalReads) {
      let weight = 0;
      let run = ''
      let range = 0;
      for(let i = 0; i< capacities.length; i++) {
        if (totalReads >= capacities[i]) {
          weight = capacities[i]
          run = runs[i]
          range = ranges[i]
        }
      }
      return [weight, run, range];
    }
    let weight = findWeight(totalReads)[0];
    let run = findWeight(totalReads)[1];
    let range = findWeight(totalReads)[2];
    
    function bins(samples, total, weight, run, range){
    samples.sort((a,b) => b-a);    
      let rem = weight;
      let res = [];
      let used = []
        let i = 0;
        let j = 0;
      if(total < 700) {
          return res;
      } else {
          while(total > 100) {
              rem -= samples[i];
              i += 1;
            used.push(samples[i]);
              samples.splice(i, 1);
              console.log('rem1', rem);
              console.log('samples', samples);
              if (rem >= 0 && rem <= range) {
                  res.push(run);
              } else if(rem < 0) {
                  i += 1;
                  res.concat(bins(samples, total-rem, findWeight(total-rem)[0], findWeight(total-rem)[1], findWeight(total-rem)[2]));
              }
          }
        // for(let i =0; i < samples.length; i++) {
        //     if (rem >= samples[i]) {
        //       rem = rem-samples[i];
        //       samples.splice(i, 1)
        //       console.log('rem1', rem);
        //       console.log('samples', samples);
        //     } else if(rem>=0 && rem <= range) {
        //       res.push(run);
              
        //     } else {
        //         res.concat(bins(samples, total-rem, findWeight(total-rem)[0], findWeight(total-rem)[1], findWeight(total-rem)[2]));
        //     }
        //   }
      }
      
      
    }
    console.log(bins(samples, totalReads, weight, run, range)); 
    
  }
  
//   console.log(plan([1000, 400, 800, 450, 300]))

  function binPacking(arr) { //takes in 
    let capacities = [800, 1800, 3800, 10000];
    let runs = ['SP', 'S1', 'S2', 'S4'];
    let ranges = [100, 200, 200, 1000];
    let totalReads = arr.reduce((acc, ele) => {
      return acc + ele;
    }, 0);
    console.log(totalReads);
    function findWeight(totalReads) {
      let weight = 0;
      let run = ''
      let range = 0;
      for(let i = 0; i< capacities.length; i++) {
        if (totalReads >= capacities[i]) {
          weight = capacities[i]
          run = runs[i]
          range = ranges[i];
        }
      }
      return [weight, run, range];
    }
    let weight = findWeight(totalReads)[0];
    let run = findWeight(totalReads)[1];
    let range = findWeight(totalReads)[2];

    arr.sort((a,b) => b-a);
    let samples = arr;
    let secondArr = JSON.parse(JSON.stringify(arr));
  samples.sort((a,b) => b-a);
  
    let res =[];
    let i = 0;
    let j = 0;
    let remReads = totalReads;
    let remWeight = weight;
    while(remReads > 0) {
      while (remWeight > 0) {
        if(remWeight > 0) {
        remWeight -= samples[i]
        remReads -= samples[i]
        samples.splice(i, 1)
        j += 1
        console.log('weight', remWeight);
        if (remWeight >= 0 && remWeight <= range) {
            res.push(run);
            console.log('rem', remReads);
            remWeight = findWeight(remReads)[0]
            console.log('remWeight', remWeight);
            run = findWeight(remReads)[1];
            range = findWeight(remReads)[2];
            i = 0;
            j = 0;
          } 
      } if(remWeight < 0) {
          console.log("neg");
          remWeight += secondArr[j+1];
          console.log('arr',secondArr, secondArr[j+1]);
          console.log('newWeight', remWeight);
          i += 1;
        }
      } 
      return res;
  
  }
  }

  console.log("bin", binPacking([1000, 400, 800, 450, 300]));
def knapsack(samples):
    costs = [1, 2, 3, 4]
    readCapacity = {'SP':[700,800], 'S1': [1600, 1800], 'S2': [3600, 3800], 'S4': [9000, 10000]}
    table = [[0 for x in range()]


    return 

def optimizeRuns(samples, target):
    res = []
    
    def backtrack(rem, sub, start, targetRange):
        if rem < targetRange[1] - targetRange[0] and rem >= 0:
            res.append(list(sub))
            return
        elif rem < 0:
            return 
        for i in range(start, len(samples)):
            sub.append(samples[i])
            backtrack(rem- samples[i].readsRequested, sub, i)
            sub.pop()
        
        
    backtrack(target, [], 0)
    return res

print(optimizeRuns())
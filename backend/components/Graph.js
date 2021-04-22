class Graph {
    constructor(numVertices) {
        this.numVertices = numVertices;
        this.adjacencyList = new Map();
    }
    addVertex(v) {
        this.adjacencyList.set(v, []);
    }
    addEdge(v, w) {
        this.adjacencyList.get(v).push(w);
        this.adjacencyList.get(w).push(v);
    }

    printGraph() {
        const get_keys = this.adjacencyList.keys()
        for(let key of get_keys) {
            const get_values = this.adjacencyList(key)
            let conc = "";
            for(let j of get_values) {
                conc += key + " ";
            }            
            console.log(key + "->" + conc);
        }
    }

}
import {Map} from 'immutable';

/**
 * A mapping from arbitrary identifiers to an array of values.
 */
class Mapping {
    constructor () {
        this._values = {};
    }

    keys () {
        return Object.keys(this._values);
    }

    has (id) {
        return this._values.hasOwnProperty(id);
    }

    get (id) {
        if (!this._values.hasOwnProperty(id)) {
            return new Set();
        }
        return this._values[id];
    }
    getAsArray (id) {
        return Array.from(this.get(id));
    }

    put (id, value) {
        if (!this._values.hasOwnProperty(id)) {
            this._values[id] = new Set();
        }
        this._values[id].add(value);
    }

    set (id, values) {
        this._values[id] = new Set(values);
    }

    remove (id, value) {
        if (this._values.hasOwnProperty(id)) {
            this._values[id].delete(value);
        }
    }

    removeAll (id, values) {
        for (const value of values) {
            this.remove(id, value);
        }
    }
}

class Edge {
    constructor (from, to) {
        this.from = from;
        this.to = to;
    }

    toString () {
        return `${this.from} -> ${this.to}`;
    }
}

/**
 * Default graph node class.
 */
class GraphNode {
    constructor (id, block) {
        this.id = id;
        this.block = block;
    }

    toString () {
        if (this.block && this.block.opcode) {
            return `${this.block.opcode}:${this.id.substring(0, 2)}`;
        } else { // eslint-disable-line no-else-return
            return this.id;
        }
    }
}

/**
 * Default graph class.
 */
class Graph {
    constructor (entryNode, exitNode) {
        this._entryNode = entryNode;
        this._exitNode = exitNode;
        this._nodes = {};
        this._successors = new Mapping();
        this._predecessors = new Mapping();
    }
    successors (id) {
        return this._successors.get(id);
    }
    predecessors (id) {
        return this._predecessors.get(id);
    }

    entry () {
        return this._entryNode;
    }

    exit () {
        return this._exitNode;
    }

    addNode (node) {
        this._nodes[node.id] = node;
    }

    addEdge (node, successor) {
        this._predecessors.put(successor.id, node);
        this._successors.put(node.id, successor);
    }

    getNode (id) {
        return this._nodes[id];
    }

    getNodeIds () {
        return Object.keys(this._nodes);
    }

    getAllNodes () {
        return Object.values(this._nodes);
    }

    toDot () {
        const edges = [];
        for (const node of this.getAllNodes()) {
            for (const succ of this.successors(node.id)) {
                edges.push(`\t"${node.toString()}" -> "${succ.toString()}";`);
            }
        }
        const renderedEdges = edges.join('\n');

        const result = `digraph ScratchProgram {\n${renderedEdges}\n}`;

        this.dot = result;
        return result;
    }

    toString () {
        if (!this.dot) {
            return this.toDot();
        }
    }
}

export {
    Edge,
    GraphNode,
    Graph,
    Mapping,
    reverseGraph
};

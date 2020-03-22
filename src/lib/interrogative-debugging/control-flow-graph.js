import {ControlFilter, EventFilter, StatementFilter} from './block-filter';
import {Extract, getBranchStart, getElseBranchStart} from './ir-questions-util';
import {Graph, GraphNode, Mapping} from './graph-utils';


/**
 * Class representing a Control Flow Graph (CFG).
 * Next to a collection of nodes, the CFG contains arbitrary entry and exit node.
 *
 * The CFG's nodes are private, but can be queried with node related methods.
 *
 * @see Graph
 * @see GraphNode
 */
class ControlFlowGraph extends Graph {
    constructor () {
        const entryNode = new GraphNode('Entry');
        const exitNode = new GraphNode('Exit');

        super(entryNode, exitNode);
    }
}

/**
 * Extends the successors of the last node inside the basic block with successors.
 * Before extending the successors, the exit node is removed to remove unwanted and duplicate edges to the exit node.
 * If the given should successors contains the exit node, it will be part of the successors.
 *
 * @param {ControlFlowGraph} cfg - the CFG containing all nodes.
 * @param {Mapping} successors - a collection of edges inside the CFG, mapping of node identifier to nodes.
 * @param {Array<GraphNode>} shouldSuccessors - the successors will extend the existing successors.
 * @param {GraphNode} startNode - the start node of the basic block.
 */
const _extendBasicBlockSuccessors = (cfg, successors, shouldSuccessors, startNode) => {
    let node = startNode;
    while (node.block.next !== null) {
        node = cfg.getNode(node.block.next);
    }
    // If the exit node is part of the to be set successors that's okay, but it has to be removed here to avoid
    //   a) unwanted edges to the exit note
    //   b) duplicate edges to exit note
    successors.remove(node.id, cfg.exit());

    for (const suc of shouldSuccessors) {
        successors.put(node.id, suc);
    }
};

/**
 * Replaces the successors of the last node inside the basic block with successors.
 * If the last node is a broadcast sending blocks, the broadcast receiving nodes are preserved.
 *
 * @param {ControlFlowGraph} cfg - the CFG containing all nodes.
 * @param {Mapping} successors - a collection of edges inside the CFG, mapping of node identifier to nodes.
 * @param {Array<GraphNode>} shouldSuccessors - the successors will replace the existing successors.
 * @param {GraphNode} startNode - the start node of the basic block.
 */
const _setBasicBlockSuccessors = (cfg, successors, shouldSuccessors, startNode) => {
    let node = startNode;
    while (node.block.next !== null) {
        node = cfg.getNode(node.block.next);
    }
    // This node is a broadcast sending statement?
    // Keep the broadcast receiving statements.
    const broadcastReceiveSuccessors = successors.getAsArray(node.id)
        .filter(n => n.block && EventFilter.broadcastReceive(n.block));
    for (const broadcastSend of broadcastReceiveSuccessors) {
        shouldSuccessors.push(broadcastSend);
    }
    successors.set(node.id, shouldSuccessors);
};

/**
 * Fixes the successors in a CFG of a given control statement or its succeeding branches,
 * depending on the type of control statement.
 *
 * @param {ControlFlowGraph} cfg - the CFG containing all nodes.
 * @param {Mapping<GraphNode>} successors - a {@link Mapping} from nodes to their successors.
 * @param {GraphNode} controlNode - the node of the to be fixed control statement.
 * @private
 */
const _fixControlStatement = (cfg, successors, controlNode) => {
    const controlStmt = controlNode.block;
    switch (controlStmt.opcode) {
    case 'control_forever':
    case 'control_repeat':
    case 'control_repeat_until': {
        const branchStart = getBranchStart(controlStmt);
        _extendBasicBlockSuccessors(cfg, successors, [controlNode], cfg.getNode(branchStart));
        break;
    }
    case 'control_if': {
        const ifBranchStart = getBranchStart(controlStmt);
        const afterControl = successors.getAsArray(controlNode.id)
            .filter(n => n.id !== ifBranchStart);

        _extendBasicBlockSuccessors(cfg, successors, afterControl, cfg.getNode(ifBranchStart));
        break;
    }
    case 'control_if_else': {
        const ifBranchStart = getBranchStart(controlStmt);
        const elseBranchStart = getElseBranchStart(controlStmt);

        const afterControl = successors.getAsArray(controlNode.id)
            .filter(n => n.id !== ifBranchStart && n.id !== elseBranchStart);
        successors.removeAll(controlNode.id, afterControl);

        _setBasicBlockSuccessors(cfg, successors, afterControl, cfg.getNode(ifBranchStart));
        _setBasicBlockSuccessors(cfg, successors, afterControl, cfg.getNode(elseBranchStart));
        break;
    }
    case 'control_stop': {
        const stopOption = Extract.stopOption(controlStmt);
        switch (stopOption) {
        case 'this script':
        case 'all': {
            successors.set(controlNode.id, [cfg.exit()]);
            break;
        }
        case 'other scripts in sprite':
            // Since this is just a 'normal' block, we can ignore it
            break;
        default:
            console.log(`Unrecognized stop option ${stopOption}.`);
        }
        break;
    }
    case 'control_wait':
        // Can ignore this case
        break;
    default: {
        console.log(`Unhandled control statement ${controlStmt.opcode} for block ${controlStmt.id}`);
    }
    }
};

/**
 * Helper function to recursively fix control statements.
 * Starting from the given node, depth first.
 *
 * @param {ControlFlowGraph} cfg - the control flow graph which control statements should be fixed.
 * @param {Mapping<GraphNode>} successors - a {@link Mapping} from nodes to their successors.
 * @param {GraphNode} node - the start node.
 * @param {Array<GraphNode>} visited - a list of already visited nodes.
 * @private
 */
const _fixControlStatements = (cfg, successors, node, visited) => {
    if (visited.find(n => n.id === node.id)) {
        return;
    }
    visited.push(node);

    const entryOrExit = node === cfg.entry() || node === cfg.exit();
    if (!entryOrExit && ControlFilter.controlStatement(node.block)) {
        _fixControlStatement(cfg, successors, node);
    }
    for (const next of successors.get(node.id)) {
        _fixControlStatements(cfg, successors, next, visited);
    }
};

/**
 * Calls a recursive helper function to fix control statements from the Entry node, depth first.
 *
 * @param {ControlFlowGraph} cfg - the control flow graph which control statements should be fixed.
 * @param {Mapping<GraphNode>} successors - a {@link Mapping} from nodes to their successors.
 */
const fixControlStatements = (cfg, successors) => {
    _fixControlStatements(cfg, successors, cfg.entry(), []);
};

/**
 * Constructs an interprocedural control flow graph (CFG) for all blocks of a program.
 *
 * The given blocks represent the Abstract Syntax Tree (AST) of each script.
 * This method adds interprodecural edges from broadcast send to broadcast receive statements.
 *
 * Furthermore, this method updates the control statements, since their AST information cannot
 * be used directly for CFG generation.
 *
 * @param {object} blocks - all blocks in the program, used to construct the CFG.
 * @return {ControlFlowGraph} - a newly generated {@link ControlFlowGraph}.
 */
const generateCFG = blocks => {
    const cfg = new ControlFlowGraph();
    const eventSend = new Mapping();
    const eventReceive = new Mapping();
    const successors = new Mapping();

    for (const block of Object.values(blocks)) {
        if (!StatementFilter.isStatementBlock(block)) {
            continue;
        }
        if (block.shadow) {
            continue;
        }
        cfg.addNode(new GraphNode(block.id, block));
    }
    for (const node of cfg.getAllNodes()) {
        if (node.block.parent) {
            successors.put(node.block.parent, node);
        }
        if (!node.block.next) {
            // No exit node? Probably, the actual successors is the exit node
            successors.put(node.id, cfg.exit());
        }

        if (EventFilter.hatEvent(node.block)) {
            successors.put(cfg.entry().id, node);
        }
        if (EventFilter.broadcastSend(node.block)) {
            const event = Extract.broadcastForStatement(blocks, node.block);
            eventSend.put(event, node);
        }
        if (EventFilter.broadcastReceive(node.block)) {
            const event = Extract.broadcastForBlock(node.block);
            eventReceive.put(event, node);
        }
        // TODO Phil 19/03/2020: handle cloning?
    }

    cfg.addNode(cfg.entry());
    cfg.addNode(cfg.exit());

    for (const event of eventSend.keys()) {
        for (const sender of eventSend.get(event)) {
            for (const receiver of eventReceive.get(event)) {
                successors.put(sender.id, receiver);
            }
        }
    }

    // Branches of control statements most often have the exit node instead of the correct successor(s).
    // This call sets the correct successors
    fixControlStatements(cfg, successors);

    // Add actual successors to graph.
    for (const node of cfg.getAllNodes()) {
        for (const succ of successors.get(node.id)) {
            cfg.addEdge(node, succ);
        }
    }

    return cfg;
};

export {
    generateCFG,
    ControlFlowGraph
};

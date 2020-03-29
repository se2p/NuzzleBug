import {ControlFilter, EventFilter, StatementFilter} from './block-filter';
import {Extract, getAllBlocks, getBranchStart, getElseBranchStart} from './ir-questions-util';
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
    case 'control_repeat_until':
    case 'control_repeat': {
        const branchStart = getBranchStart(controlStmt);
        _extendBasicBlockSuccessors(cfg, successors, [controlNode], cfg.getNode(branchStart));
        break;
    }
    case 'control_forever': {
        const branchStart = getBranchStart(controlStmt);
        _setBasicBlockSuccessors(cfg, successors, [controlNode], cfg.getNode(branchStart));

        successors.set(controlNode.id, [cfg.getNode(branchStart), cfg.exit()]);

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

    const actualStatement = node.block;
    if (actualStatement && ControlFilter.controlStatement(node.block)) {
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
 * Checks for a given user event node whether a preceeding user event node exists.
 * If the user events exists, it is returned.
 * If not, it is added to the given control flow graph
 *
 * @param {Array} targets - the targets of the program. Used to identify from which target a block is.
 * @param {ControlFlowGraph} cfg - the control flow graph.
 * @param {Mapping<GraphNode>} successors - a mapping from nodes to their successors.
 * @param {Map<string, GraphNode>} userEvents - a mapping from event key to user event node.
 * @param {GraphNode} node - the node that is initially checked. A successor of the user event node.
 * @returns {GraphNode} - the user event node, either existing or newly created.
 */
const addOrGetUserEventNode = (targets, cfg, successors, userEvents, node) => {
    const event = {name: node.block.opcode.substring(10)}; // removes leading "event_when"
    switch (node.block.opcode) {
    case 'event_whenflagclicked': {
        // necessary event information already complete
        break;
    }
    case 'event_whenthisspriteclicked': {
        event.value = Extract.clickedSprite(targets, node.block);
        break;
    }
    case 'event_whenstageclicked': {
        event.value = 'Stage';
        break;
    }
    case 'event_whenkeypressed': {
        event.value = Extract.clickedKey(node.block);
        break;
    }
    }

    const eventKey = `${event.name}${event.value ? (`:${event.value}`) : ''}`;
    let eventNode = userEvents.get(eventKey);
    if (!eventNode) {
        eventNode = new GraphNode(eventKey);
        cfg.addNode(eventNode);

        successors.put(cfg.entry().id, eventNode);
        successors.put(eventNode.id, cfg.exit());

        userEvents.set(eventKey, eventNode);
    }
    return eventNode;
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
 * @param {VirtualMachine} vm - the instance of the current virtual machine state.
 * Contains all blocks in the program, used to construct the CFG.
 * @return {ControlFlowGraph} - a newly generated {@link ControlFlowGraph}.
 */
const generateCFG = vm => {
    const targets = vm.runtime.targets;
    const blocks = getAllBlocks(targets);

    const cfg = new ControlFlowGraph();
    const userEvents = new Map();
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

        if (EventFilter.userEvent(node.block)) {
            // Original
            // successors.put(cfg.entry().id, node);

            // Updated
            const userEventNode = addOrGetUserEventNode(targets, cfg, successors, userEvents, node);
            successors.put(userEventNode.id, node);
        }
        if (EventFilter.broadcastSend(node.block)) {
            const event = Extract.broadcastForStatement(blocks, node.block);
            eventSend.put(`broadcast:${event}`, node);
        }
        if (EventFilter.broadcastReceive(node.block)) {
            const event = Extract.broadcastForBlock(node.block);
            eventReceive.put(`broadcast:${event}`, node);
        }
        if (EventFilter.cloneCreate(node.block)) {
            let cloneTarget = Extract.cloneCreateTarget(blocks, node.block);
            if (cloneTarget === '_myself_') {
                cloneTarget = Extract.cloneSendTarget(targets, node.block);
            }
            eventSend.put(`clone:${cloneTarget}`, node);
        }
        if (EventFilter.cloneStart(node.block)) {
            const cloneTarget = Extract.cloneSendTarget(targets, node.block);
            eventReceive.put(`clone:${cloneTarget}`, node);
        }
    }

    cfg.addNode(cfg.entry());
    cfg.addNode(cfg.exit());

    // Broadcasts & cloning events
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

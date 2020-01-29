/**
 * Class used to trace code execution in scratch.
 */
// eslint-disable-next-line no-warning-comments
// TODO Phil 28/01/2020: make this a full fleshed component to be able to access the VM and especially the runtime
//  profiler. Currently, just doesn't trace all executed blocks.
class Tracer {
    constructor () {
        this.traces = [];
    }

    addRecord (record) {
        this.traces.push(record);
    }

    hasMotionBlocks () {
        return this.traces.some(value => value.arg.startsWith('motion'));
    }

    hasLooksBlocks () {
        return this.traces.some(value => value.arg.startsWith('looks'));
    }

    hasSoundBlocks () {
        return this.traces.some(value => value.arg.startsWith('sound'));
    }

    hasEventBlocks () {
        return this.traces.some(value => value.arg.startsWith('event'));
    }

    hasControlBlocks () {
        return this.traces.some(value => value.arg.startsWith('control'));
    }

    hasSensingBlocks () {
        return this.traces.some(value => value.arg.startsWith('sensing'));
    }

    hasOperatorBlocks () {
        return this.traces.some(value => value.arg.startsWith('operator'));
    }

    hasVariablesBlocks () {
        return this.traces.some(value => value.arg.startsWith('variables'));
    }

    hasBlock (opcode) {
        return this.traces.some(value => value.arg === opcode);
    }

    printRecord () {
        // TODO Phil 29/01/2020: currently, this is just debug output
        console.log(this.traces.map(trace => trace.arg));
        console.log(`hasMotionBlocks(): ${this.hasMotionBlocks()}`);
        console.log(`hasLooksBlocks(): ${this.hasLooksBlocks()}`);
        console.log(`hasSoundBlocks(): ${this.hasSoundBlocks()}`);
        console.log(`hasEventBlocks(): ${this.hasEventBlocks()}`);
        console.log(`hasSensingBlocks(): ${this.hasSensingBlocks()}`);
        console.log(`hasControlBlocks(): ${this.hasControlBlocks()}`);
        console.log(`hasOperatorBlocks(): ${this.hasOperatorBlocks()}`);
        console.log(`hasVariablesBlocks(): ${this.hasVariablesBlocks()}`);
        console.log(`hasBlock('control_forever'): ${this.hasBlock('control_forever')}`);
    }

    reset () {
        this.traces = [];
    }
}

const projectTracer = new Tracer();

const filterFrame = frame => {
    if (!frame.arg) {
        return false;
    }
    const traces = projectTracer.traces;
    if (traces[traces.length - 1] === frame) {
        return false;
    }
    return true;
};

/**
 * Callback used to be given to Runtime#enableProfiling as a parameter.
 * Filters certain frames out and adds filtered to the recorded traces of the
 * global 'projectTracer' Tracer instance.
 *
 * @param {ProfilerFrame} frame The frame instance created by the scratch profiler.
 * @returns {boolean} whether the frame was added or not.
 */
const frameCallback = frame => {
    if (filterFrame(frame)) {
        projectTracer.addRecord(frame);
        return true;
    }

    return false;
};

export {
    projectTracer as default,
    frameCallback,
    Tracer
};

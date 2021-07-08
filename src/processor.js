let instance, heapFloat32;
let requestNumber = 0;
class RNNNoiseProcessor extends AudioWorkletProcessor {
    constructor(options) {
        super({
            ...options,
            numberOfInputs: 1,
            numberOfOutputs: 1,
            outputChannelCount: [1]
        });
        if (!instance) {
            instance = new WebAssembly.Instance(options.processorOptions.module).exports;
            heapFloat32 = new Float32Array(instance.memory.buffer);
        }
        console.log('processor creating state');
        this.state = instance.newState();
        this.port.onmessage = ({ data: keepalive }) => {
            if (keepalive) {
                if (this.state === null) {
                    console.log('processor creating state again');
                    this.state = instance.newState();
                }
                this.port.postMessage({ vadProb: instance.getVadProb(this.state) });
            } else {
                if (this.state) {
                    console.log('processor deleting state');
                    instance.deleteState(this.state);;
                    this.state = null;
                }
            }
        };
    }

    process(input, output, parameters) {
        // requestNumber++;
        // if (requestNumber % 1111 === 0) {
        //     console.log("got request # " + requestNumber);
        // }
        if (this.state) {
            heapFloat32.set(input[0][0], instance.getInput(this.state) / 4);
            const o = output[0][0];
            const ptr4 = instance.pipe(this.state, o.length) / 4;
            if (ptr4) {
                o.set(heapFloat32.subarray(ptr4, ptr4 + o.length));
            }
        } else {
            // rnnnoise is turned off.
            output[0][0].set(input[0][0]);
        }
        return true;

    }
};

registerProcessor("rnnoise", RNNNoiseProcessor);

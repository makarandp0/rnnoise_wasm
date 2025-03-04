interface AudioWorkletProcessor {
  readonly port: MessagePort;
  process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Map<string, Float32Array>): boolean;
}

type RNNoiseState = number;

interface RNNoiseExport {
  newState: () => RNNoiseState;
  getInput: (state: RNNoiseState) => any;
  getVadProb: (state: RNNoiseState) => number;
  deleteState: (state: RNNoiseState) => void;
  pipe: (state: RNNoiseState, length: number) => number;
}

let rnnoiseExports: RNNoiseExport | null = null;
let heapFloat32: Float32Array;
let processCount = 0;

console.log('Processor loaded 2');
// eslint-disable-next-line @typescript-eslint/no-redeclare
declare var AudioWorkletProcessor: {
  prototype: AudioWorkletProcessor;
  new (options?: AudioWorkletNodeOptions): AudioWorkletProcessor;
};

declare function registerProcessor(name: string, cls: any): void;

class RNNNoiseProcessor extends AudioWorkletProcessor {
  state: any;
  constructor(options: AudioWorkletNodeOptions) {
    super({
      ...options,
      numberOfInputs: 1,
      numberOfOutputs: 1,
      outputChannelCount: [1],
    });

    if (!rnnoiseExports) {
      // @ts-ignore
      rnnoiseExports = new WebAssembly.Instance(options.processorOptions.module).exports;
      // @ts-ignore
      heapFloat32 = new Float32Array(rnnoiseExports.memory.buffer);
    }
    console.log('processor creating state');
    this.state = rnnoiseExports.newState();
    this.port.onmessage = ({ data: keepalive }) => {
      let vadProb = 0;
      if (keepalive) {
        if (this.state === null) {
          console.log('processor creating state again');
          this.state = rnnoiseExports.newState();
        }
        vadProb = rnnoiseExports.getVadProb(this.state);
      } else if (this.state) {
        console.log('processor deleting state');
        rnnoiseExports.deleteState(this.state);
        this.state = null;
      }
      this.port.postMessage({ vadProb, isActive: this.state !== null });
    };
  }

  process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Map<string, Float32Array>): boolean {
    if (this.state) {
      heapFloat32.set(inputs[0][0], rnnoiseExports.getInput(this.state) / 4);
      const o = outputs[0][0];
      const ptr4 = rnnoiseExports.pipe(this.state, o.length) / 4;
      if (ptr4) {
        o.set(heapFloat32.subarray(ptr4, ptr4 + o.length));
      }
    } else {
      // rnnoise is turned off.
      outputs[0][0].set(inputs[0][0]);
    }
    processCount++;
    if (processCount % 111 === 0) {
      console.log(`${processCount}: RNNoise ${this.state ? 'enabled' : 'disabled'}`);
    }

    return true;
  }
}

registerProcessor('rnnoise', RNNNoiseProcessor);

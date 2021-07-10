let module: WebAssembly.Module;
let instance: WebAssembly.Instance;
let heapFloat32: Float32Array;

async function fetchAndCompileWebAssemblyModule(moduleUrl: string) {
    const response = await fetch(moduleUrl);
    const buffer = await response.arrayBuffer();
    const mod = await WebAssembly.compile(buffer);
    return mod;
}

export class RNNoiseNode extends AudioWorkletNode {
    private _onUpdate: () => void;
    private _vadProb: number;
    static async register(context: AudioContext) {
      console.log('fetching module');
      module = await fetchAndCompileWebAssemblyModule("rnnoise-processor.wasm");
      console.log('done fetching module');
      console.log('setting up worklet');
      await context.audioWorklet.addModule("processor.js");
      console.log('done setting up worklet');
    }

    constructor(context: BaseAudioContext) {
        super(context, "rnnoise", {
            channelCountMode: "explicit",
            channelCount: 1,
            channelInterpretation: "speakers",
            numberOfInputs: 1,
            numberOfOutputs: 1,
            outputChannelCount: [1],
            processorOptions: {
                module: module
            }
        });

        this.port.onmessage = ({ data }) => {
          if (data.vadProb) {
            this._vadProb = data.vadProb;
            if (this._onUpdate) {
              this._onUpdate();
            }
          }
        };
    }

    onUpdate(onupdate: () => void) {
      this._onUpdate = onupdate;
    }

    getVadProb() {
      return this._vadProb;
    }

    update(keepalive: boolean) { this.port.postMessage(keepalive); }
}

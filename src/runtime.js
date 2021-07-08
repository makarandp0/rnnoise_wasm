{
    const base = document.currentScript.src.match(/(.*\/)?/)[0];
    let module, instance, heapFloat32;
    window.RNNoiseNode = (window.AudioWorkletNode || (window.AudioWorkletNode = window.webkitAudioWorkletNode)) &&
        class RNNoiseNode extends AudioWorkletNode {
            static async fetchWebAssemblyModule() {
                const response = await fetch("rnnoise-processor.wasm");
                const buffer = await response.arrayBuffer();
                const mod = await WebAssembly.compile(buffer);
                return mod;
            }
            static async register(context) {
                module = await window.RNNoiseNode.fetchWebAssemblyModule();
                await context.audioWorklet.addModule(base + "rnnoise-processor.js");
            }

            constructor(context) {
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
                    const e = Object.assign(new Event("status"), data);
                    this.dispatchEvent(e);
                    if (this.onstatus)
                        this.onstatus(e);
                };
            }

            update(keepalive) { this.port.postMessage(keepalive); }
        }
}
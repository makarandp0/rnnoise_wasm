'use strict';registerProcessor("rnnoise",class extends AudioWorkletProcessor{constructor(a){super({...a,numberOfInputs:1,numberOfOutputs:1,outputChannelCount:[1]});Object.assign(this,(new WebAssembly.Instance(a.processorOptions.module)).exports);this._heapFloat32=new Float32Array(this.memory.buffer);this.reset();this._input=this.buffer(0);this.port.onmessage=()=>{this.port.postMessage({vadProb:this.getVadProb()})}}process(a,b,c){a=a[0][0];b=b[0][0];this._heapFloat32.set(a,this._input/4);this._input=
this.buffer(a.length);(a=this.render(b.length)/4)&&b.set(this._heapFloat32.subarray(a,a+b.length));return!0}});

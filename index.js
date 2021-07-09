/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/rnnoise.ts":
/*!************************!*\
  !*** ./src/rnnoise.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./runtime */ \"./src/runtime.ts\");\nvar __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\n\nconst input = document.getElementById(\"input\");\nconst output = document.getElementById(\"output\");\nconst vadProb = document.getElementById(\"vadProb\");\nconst start = document.getElementById(\"start\");\nconst useRNN_checkbox = document.getElementById('use_rnn');\nconst sink = Audio.prototype.setSinkId;\nfunction setupDevices() {\n    return __awaiter(this, void 0, void 0, function* () {\n        const stream = yield navigator.mediaDevices.getUserMedia({ audio: true });\n        stream.getTracks().forEach(t => { t.stop(); });\n        let devices = yield navigator.mediaDevices.enumerateDevices();\n        input.disabled = false;\n        if (sink) {\n            output.disabled = false;\n        }\n        devices.forEach(d => {\n            if (d.kind == \"audioinput\")\n                input.appendChild(Object.assign(document.createElement(\"option\"), {\n                    value: d.deviceId,\n                    textContent: d.label\n                }));\n            else if (d.kind == \"audiooutput\")\n                output.appendChild(Object.assign(document.createElement(\"option\"), {\n                    value: d.deviceId,\n                    textContent: d.label\n                }));\n        });\n    });\n}\nfunction onStart() {\n    return __awaiter(this, void 0, void 0, function* () {\n        console.log('onStart');\n        start.disabled = output.disabled = input.disabled = true;\n        const context = new AudioContext({ sampleRate: 48000 });\n        try {\n            let destination = context.destination;\n            if (sink) {\n                destination = new MediaStreamAudioDestinationNode(context, {\n                    channelCountMode: \"explicit\",\n                    channelCount: 1,\n                    channelInterpretation: \"speakers\"\n                });\n                const audio = new Audio();\n                audio.srcObject = destination.stream;\n                // @ts-ignore\n                audio.setSinkId(output.value);\n                audio.play();\n            }\n            console.log('Getting UserMedia and registering with RNNoiseNode');\n            const [stream] = yield Promise.all([\n                navigator.mediaDevices.getUserMedia({\n                    audio: {\n                        deviceId: { exact: input.value },\n                        channelCount: { ideal: 1 },\n                        noiseSuppression: { ideal: false },\n                        echoCancellation: { ideal: true },\n                        autoGainControl: { ideal: false },\n                        sampleRate: { ideal: 48000 }\n                    }\n                }),\n                _runtime__WEBPACK_IMPORTED_MODULE_0__.RNNoiseNode.register(context)\n            ]);\n            const source = context.createMediaStreamSource(stream);\n            const rnnoise = new _runtime__WEBPACK_IMPORTED_MODULE_0__.RNNoiseNode(context);\n            ;\n            rnnoise.connect(destination);\n            source.connect(rnnoise);\n            rnnoise.onUpdate(() => {\n                const prob = rnnoise.getVadProb();\n                const probPercent = rnnoise.getVadProb() * 100;\n                vadProb.style.width = probPercent + \"%\";\n            });\n            let timer = null;\n            const setupVADAnimation = (on) => {\n                if (on) {\n                    timer = requestAnimationFrame(() => {\n                        rnnoise.update(true);\n                        setupVADAnimation(true);\n                    });\n                }\n                else {\n                    rnnoise.update(false);\n                    cancelAnimationFrame(timer);\n                }\n            };\n            useRNN_checkbox.checked = true;\n            useRNN_checkbox.disabled = false;\n            setupVADAnimation(true);\n            useRNN_checkbox.addEventListener('change', (event) => {\n                try {\n                    setupVADAnimation(useRNN_checkbox.checked);\n                }\n                catch (err) {\n                    console.log('Error:', err);\n                }\n            });\n        }\n        catch (e) {\n            context.close();\n            console.error(e);\n        }\n    });\n}\n;\nfunction main() {\n    return __awaiter(this, void 0, void 0, function* () {\n        yield setupDevices();\n        console.log('done setting up devices');\n        start.disabled = false;\n        start.addEventListener(\"click\", () => {\n            console.log('calling onStart');\n            onStart();\n            start.disabled = false;\n        });\n    });\n}\nmain();\n\n\n//# sourceURL=webpack://rnnoise_wasm/./src/rnnoise.ts?");

/***/ }),

/***/ "./src/runtime.ts":
/*!************************!*\
  !*** ./src/runtime.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"RNNoiseNode\": () => (/* binding */ RNNoiseNode)\n/* harmony export */ });\nvar __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nlet module;\nlet instance;\nlet heapFloat32;\nfunction fetchAndCompileWebAssemblyModule(moduleUrl) {\n    return __awaiter(this, void 0, void 0, function* () {\n        const response = yield fetch(moduleUrl);\n        const buffer = yield response.arrayBuffer();\n        const mod = yield WebAssembly.compile(buffer);\n        return mod;\n    });\n}\nclass RNNoiseNode extends AudioWorkletNode {\n    constructor(context) {\n        super(context, \"rnnoise\", {\n            channelCountMode: \"explicit\",\n            channelCount: 1,\n            channelInterpretation: \"speakers\",\n            numberOfInputs: 1,\n            numberOfOutputs: 1,\n            outputChannelCount: [1],\n            processorOptions: {\n                module: module\n            }\n        });\n        this.port.onmessage = ({ data }) => {\n            if (data.vadProb) {\n                this._vadProb = data.vadProb;\n                if (this._onUpdate) {\n                    this._onUpdate();\n                }\n            }\n        };\n    }\n    static register(context) {\n        return __awaiter(this, void 0, void 0, function* () {\n            console.log('fetching module');\n            module = yield fetchAndCompileWebAssemblyModule(\"rnnoise-processor.wasm\");\n            console.log('done fetching module');\n            console.log('setting up worklet');\n            yield context.audioWorklet.addModule(\"processor.js\");\n            console.log('done setting up worklet');\n        });\n    }\n    onUpdate(onupdate) {\n        this._onUpdate = onupdate;\n    }\n    getVadProb() {\n        return this._vadProb;\n    }\n    update(keepalive) { this.port.postMessage(keepalive); }\n}\n\n\n//# sourceURL=webpack://rnnoise_wasm/./src/runtime.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/rnnoise.ts");
/******/ 	
/******/ })()
;
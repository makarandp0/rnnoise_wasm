
if (navigator.mediaDevices &&
    (window.AudioContext || (window.AudioContext = window.webkitAudioContext)) &&
    (window.AudioWorkletNode || window.ScriptProcessorNode) &&
    AudioContext.prototype.createMediaStreamSource
) {
    switch (location.protocol) {
        case "http:":
        case "https:":
            navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
                stream.getTracks().forEach(t => { t.stop() });
                return navigator.mediaDevices.enumerateDevices();
            }).then(devices => {
                const input = document.getElementById("input");
                const output = document.getElementById("output");
                const vadProb = document.getElementById("vadProb");
                const sink = Audio.prototype.setSinkId;
                input.disabled = false;
                if (sink) {
                    output.disabled = false;
                } else {
                    devices = devices.filter(d => d.kind == "audioinput").concat({
                        kind: "audiooutput",
                        label: "Default"
                    });
                }
                devices.forEach(d => {
                    if (d.kind == "audioinput")
                        input.appendChild(Object.assign(document.createElement("option"), {
                            value: d.deviceId,
                            textContent: d.label
                        }));
                    else if (d.kind == "audiooutput")
                        output.appendChild(Object.assign(document.createElement("option"), {
                            value: d.deviceId,
                            textContent: d.label
                        }));
                });

                const useRNN_checkbox = document.getElementById('use_rnn');
                document.getElementById("start").addEventListener("click", async () => {
                    start.disabled = output.disabled = input.disabled = true;
                    const context = new AudioContext({ sampleRate: 48000 });
                    try {
                        const destination = sink ? new MediaStreamAudioDestinationNode(context, {
                            channelCountMode: "explicit",
                            channelCount: 1,
                            channelInterpretation: "speakers"
                        }) : context.destination;
                        if (sink) {
                            const audio = new Audio();
                            audio.srcObject = destination.stream;
                            audio.setSinkId(output.value);
                            audio.play();
                        }
                        const [stream] = await Promise.all([
                            navigator.mediaDevices.getUserMedia({
                                audio: {
                                    deviceId: { exact: input.value },
                                    channelCount: { ideal: 1 },
                                    noiseSuppression: { ideal: false },
                                    echoCancellation: { ideal: true },
                                    autoGainControl: { ideal: false },
                                    sampleRate: { ideal: 48000 }
                                }
                            }),
                            RNNoiseNode.register(context)
                        ]);
                        const source = context.createMediaStreamSource(stream);
                        const rnnoise = new RNNoiseNode(context);;
                        rnnoise.connect(destination);
                        source.connect(rnnoise);
                        rnnoise.onstatus = data => { vadProb.style.width = data.vadProb * 100 + "%"; };

                        let timer = null;
                        function setupVADAnimation(on) {
                            if (on) {
                                timer = requestAnimationFrame(() => {
                                    rnnoise.update(true);
                                    setupVADAnimation(true);
                                });
                            } else {
                                rnnoise.update(false);
                                cancelAnimationFrame(timer);
                            }
                        }

                        useRNN_checkbox.checked = true;
                        useRNN_checkbox.disabled = false;
                        setupVADAnimation(true);
                        useRNN_checkbox.addEventListener('change', (event) => {
                            try {
                                if (event.currentTarget.checked) {
                                    setupVADAnimation(true);
                                } else {
                                    setupVADAnimation(false);
                                }
                            } catch (err) {
                                console.log('Error:', err);
                            }
                        });

                    } catch (e) {
                        context.close();
                        console.error(e);
                    }
                });
                start.disabled = false;
            });
            break;
        default:
            alert("Run `node server.mjs` and then go to http://localhost:8080");
            close();
            break;
    }
} else {
    alert("Not supported by this browser. Please use a modern browser.");
}

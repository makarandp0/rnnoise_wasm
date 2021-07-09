import { RNNoiseNode  } from './runtime';

interface HTMLAudioElement {
  setSinkId?(sinkId: string): Promise<undefined>;
}

const input = document.getElementById("input") as HTMLInputElement;
const output = document.getElementById("output") as HTMLInputElement;
const vadProb = document.getElementById("vadProb");
const start = document.getElementById("start") as HTMLButtonElement;
const useRNN_checkbox = document.getElementById('use_rnn') as HTMLInputElement;
const sink = Audio.prototype.setSinkId;
async function setupDevices() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  stream.getTracks().forEach(t => { t.stop() });
  let devices = await navigator.mediaDevices.enumerateDevices();
  input.disabled = false;
  if (sink) {
      output.disabled = false;
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
}

async function onStart() {
  console.log('onStart');
  start.disabled = output.disabled = input.disabled = true;
  const context = new AudioContext({ sampleRate: 48000 });
  try {
      let destination: AudioDestinationNode | MediaStreamAudioDestinationNode = context.destination;
      if (sink) {
          destination = new MediaStreamAudioDestinationNode(context, {
            channelCountMode: "explicit",
            channelCount: 1,
            channelInterpretation: "speakers"
          });
          const audio = new Audio();
          audio.srcObject = destination.stream;
          // @ts-ignore
          audio.setSinkId(output.value);
          audio.play();
      }
      console.log('Getting UserMedia and registering with RNNoiseNode');
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
      rnnoise.onUpdate(() => {
        const prob = rnnoise.getVadProb();
        const probPercent = rnnoise.getVadProb() * 100;
        vadProb.style.width = probPercent + "%";
      });

      let timer: number = null;
      const setupVADAnimation = (on: boolean) => {
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
            setupVADAnimation(useRNN_checkbox.checked);
          } catch (err) {
              console.log('Error:', err);
          }
      });

  } catch (e) {
      context.close();
      console.error(e);
  }
};

async function main() {
  await setupDevices();
  console.log('done setting up devices');
  start.disabled = false;
  start.addEventListener("click", () => {
    console.log('calling onStart');
    onStart();
    start.disabled = false;
  });
}
main();

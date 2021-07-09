set -eu -o pipefail
mkdir -p dist
cp index.css dist/index.css
cp index.html dist/index.html
emcc \
    -s ENVIRONMENT=worker \
    -s TOTAL_STACK=49152 -s TOTAL_MEMORY=327680 \
    -g0 -O3 --no-entry -Wno-null-dereference \
    -o dist/rnnoise-processor.wasm \
    -Irnnoise/include \
    rnnoise/src/celt_lpc.c \
    rnnoise/src/denoise.c \
    rnnoise/src/kiss_fft.c \
    rnnoise/src/pitch.c \
    rnnoise/src/rnn.c \
    rnnoise/src/rnn_data.c \
    src/worklet.c
# Setup
- install docker.  Build process uses docker image [emscripten docker image](https://emscripten.org/docs/getting_started/downloads.html#using-the-docker-image) to compile. Alternatively you can [download and install emscripten](https://emscripten.org/docs/getting_started/downloads.html) locally

-  This project uses [rnnnoise](https://github.com/xiph/rnnoise/) sub module.
```
git submodule init &  git submodule update
```

# Build
```
 ./build-docker.sh
```

# Run
To test locally, run `node demo/server.mjs` and then navigate to `http://localhost:8080`.


# Developer Guide

### setup

- clone the repo
- install [Node.js](https://nodejs.org)
- run <code type="npm/script-call">npm run setup</code>

### test

- run tests: <code type="npm/script-call">npm run test</code>

### debug

Debug in VSCode:

- run <code type="npm/script-call">npm run build-dev</code> to compile a package
  with source maps or keep <code type="npm/script-call">npm run watch</code>
  running
  - debugging requires source maps to work
  - VSCode somehow doesn't run the compiler by itself before debugging
- set breakpoints in VSCode
- Run > Start Debugging
- in the VSCode instance that starts: open folder > choose a different folder
  than the current one

To print to the _debug console_ of the hosting VSCode instance: `console.log`

Local installation:

- <code type="npm/script-call">npm run package</code>
- run `code --install-extension vscode-markdown-ide-*.vsix` in terminal
- restart VSCode

### update

- <code type="npm/script-call">npm run update</code>

### create a new animated gif

- install `ffmpeg` and `imagemagick`
- record a screencast
- extract PNG files from MP4:

  ```bash
  ffmpeg -i input.mp4 frames/%03d.png
  ```
- go with an image viewer through the generated frames, delete the intermediary
  frame
- rename the remaining frames consecutively (`01.png`, `02.png`, ...)
- optionally crop the frames

  ```bash
  mkdir cropped
  mogrify -path cropped -crop 1400x600+0+0 *.png
  ```
- assemble the frames into an animated GIF

  ```bash
  convert \
    -delay 100 01.png \
    -delay 50 02.png \
    -delay 50 03.png \
    -loop 0 \
    -layers Optimize \
    -colors 16 \
    output.gif
  ```

### release

- <code type="npm/script-call">npm run publish-patch</code>
- <code type="npm/script-call">npm run publish-minor</code>
- <code type="npm/script-call">npm run publish-major</code>

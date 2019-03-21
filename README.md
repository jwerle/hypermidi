hypermidi
=========

Load and play MIDI from Hyperdrive over the DAT network using
[timidity](https://github.com/feross/timidity) and
[hyperdrive](https://github.com/mafintosh/hyperdrive).

## Installation

```sh
$ npm install hypermidi
```

## Usage

```js
const midi = require('hypermidi')('/path/to/storage', 'KEY', opts)
// replicate somehow (discovery-swarm-web works well)
midi.play('/path/to/track.mid') // probably need a user gesture/event
```

The module expects to load
[`libtimidity.wasm`](https://github.com/feross/timidity/blob/master/libtimidity.wasm)
and [freepats sounds sets](https://github.com/feross/freepats) over the network so
your web server should be able to serve them.

## Example

```js
const hypermidi = require('hyperidi')
const Discovery = require('discovery-swarm-web')
const ram = require('random-access-memory')

const key = '4f25776241c2333fa2cb724aac6fcf4d49f6fa7e243238c589cf021728762695'
const midi = hypermidi(ram, key)

global.midi = midi
midi.ready(() => {
  const swarm = new Discovery({
    stream: () => midi.replicate()
  })

  swarm.join(midi.discoveryKey)

  const button = document.body.appendChild(document.createElement('button'))
  button.innerText = 'play'
  button.onclick = () => midi.play('Bean.mid', console.log)
})
```

Run with [budo]()

```sh
$ budo example.js --live --port 3000 --dir node_modules/timidity --dir node_modules/freepats
```

Visit `http://localhost:3000` and press `play`! Assuming you can connect
to the DAT network and replicate the archive.

## API

### `const midi = require('hypermidi')(storage, key, opts)`

Same arguments as [Hyperdrive](https://github.com/mafintosh/hyperdrive).

#### `midi.play(filename, callback)`

Load and play a midi file over the network.

#### `midi.pause()`

Pause current track.

#### `midi.seek(seconds)`

Seek track to current time in seconds

#### `midi.destroy()`

Destroy the player.

#### `midi.close()`

Close and destroy the player

## License

MIT

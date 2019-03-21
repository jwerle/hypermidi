const Hyperdrive = require('hyperdrive')
const Timidity = require('timidity')

class HyperMIDI extends Hyperdrive {
  constructor(storage, key, opts) {
    if (null === opts || 'object' !== typeof opts) {
      opts = {}
    }

    super(storage, key, opts)

    this.ready(() => {
      this.player = new Timidity(opts.timidity)
    })
  }

  get duration() {
    if (this.player) {
      return this.player.duration
    }
    return 0
  }

  get currentTime() {
    if (this.player) {
      return this.player.currentTime
    }
    return 0
  }

  play(filename, cb) {
    const { player } = this
    const drive = this
    let retries = 3

    if ('function' !== typeof cb) {
      cb = () => void 0
    }

    drive.access(filename, onaccess)

    return this

    function onaccess(err) {
      if (err) {
        if (retries-- > 0) {
          return (drive.content || drive.metadata).once('sync', onsync)
        } else {
          return cb(err)
        }
      }

      console.log('read');
      drive.readFile(filename, onread)
    }

    function onread(err, buf) {
      if (err) {
        return cb(err)
      }

      console.log('playing');
      player.load(buf)
      player.play()
    }

    function onsync() {
      drive.access(filename, onaccess)
    }
  }

  close() {
    this.destroy()
    return super.close()
  }

  destroy() {
    if (this.player) {
      this.player.destroy()
    }

    return this
  }

  pause() {
    if (this.player) {
      this.player.pause()
    }

    return this
  }

  seek(seconds) {
    if (this.player) {
      this.player.seek(seconds)
    }

    return this
  }
}

function createHyperMIDI(storage, key, opts) {
  const midi = new HyperMIDI(storage, key, opts)
  return midi
}

module.exports = Object.assign(createHyperMIDI, { HyperMIDI })

const hypermidi = require('./')
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

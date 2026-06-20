// Synthesised heart-monitor SFX via the Web Audio API — no asset files.
// Lazily constructs the AudioContext on first user gesture (autoplay policy),
// and can be muted. Every sound is a short, dry beep so it reads as "clinical".

export function createAudio() {
  let ctx = null
  let muted = false

  function ensure() {
    if (muted) return null
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext
      if (!AC) return null
      ctx = new AC()
    }
    if (ctx.state === 'suspended') ctx.resume()
    return ctx
  }

  function beep({ freq = 880, dur = 0.08, type = 'sine', gain = 0.18, when = 0 } = {}) {
    const ac = ensure()
    if (!ac) return
    const t0 = ac.currentTime + when
    const osc = ac.createOscillator()
    const g = ac.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, t0)
    g.gain.setValueAtTime(0, t0)
    g.gain.linearRampToValueAtTime(gain, t0 + 0.005)
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
    osc.connect(g).connect(ac.destination)
    osc.start(t0)
    osc.stop(t0 + dur + 0.02)
  }

  return {
    // Single monitor blip — the classic "QRS" tick.
    blip:       () => beep({ freq: 1180, dur: 0.06, type: 'square', gain: 0.12 }),
    eat:        () => beep({ freq: 880,  dur: 0.09 }),
    bonus:      () => { beep({ freq: 880 }); beep({ freq: 1320, when: 0.08 }) },
    adrenaline: () => { beep({ freq: 660 }); beep({ freq: 990, when: 0.06 }) },
    sedative:   () => { beep({ freq: 540 }); beep({ freq: 360, when: 0.07, dur: 0.14 }) },
    win:        () => [523, 659, 784, 1046].forEach((f, i) =>
                  beep({ freq: f, when: i * 0.1, dur: 0.18, type: 'triangle' })),
    // Flatline: rising-pitch alarm then the sustained tone.
    flatline() {
      beep({ freq: 740, dur: 0.12, type: 'sawtooth', gain: 0.2 })
      beep({ freq: 990, dur: 0.5, type: 'sine', gain: 0.16, when: 0.18 })
    },
    toggleMute() { muted = !muted; return muted },
    get muted() { return muted },
  }
}

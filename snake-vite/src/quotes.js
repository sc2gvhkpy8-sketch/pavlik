// House-flavoured one-liners. Kept deliberately reverent of the diagnostic
// arrogance that makes the genre fun. Grouped by moment so the UI can pull a
// contextually-apt line.

const QUOTES = {
  eat: [
    'Everybody lies. The pills don’t.',
    'It’s never lupus.',
    'Differential diagnosis: delicious.',
    'Treat the symptoms, chase the next dose.',
    'Patients lie. Vital signs don’t.',
    'Occam’s razor. Then a second razor.',
    'You want me to be nice? I’m a doctor, not a saint.',
  ],
  bonus: [
    'Idiopathic. Means we’re idiots and can’t find the cause.',
    'Rare doesn’t mean never.',
    'A lab result worth more than a polite bedside manner.',
  ],
  adrenaline: [
    'Push one of epi. Tachycardia incoming.',
    'Adrenaline: because subtlety is overrated.',
    'Heart rate climbing. So is the diagnosis.',
  ],
  sedative: [
    'Sedate the patient. And the cynicism.',
    'Slow is smooth. Smooth is alive.',
    'Bradycardia by choice. How avant-garde.',
  ],
  death: [
    'Time of death… noted with mild disappointment.',
    'The wall always wins. Like the disease.',
    'You bit yourself. That’s on you, not the lupus.',
    'Patient expired. The chart, however, is immaculate.',
    'I’m almost always eventually right.',
    'Hope is for people who don’t read the monitor.',
  ],
  win: [
    'Cured. Don’t get used to it.',
    'Every cell accounted for. Even House is impressed. Briefly.',
    'A perfect diagnosis. I’ll be insufferable about it.',
  ],
  idle: [
    'Symptoms first. Sarcasm second.',
    'The monitor is honest. Be more like the monitor.',
    'Arrows move the patient. Space stabilizes them.',
  ],
}

export function quote(moment) {
  const pool = QUOTES[moment] || QUOTES.idle
  return pool[Math.floor(Math.random() * pool.length)]
}

# Community Hearing Screening

This public-facing workflow is intentionally separate from the research iDIN.

## Fixed protocol

- Mandarin, Cantonese, Ningboese, Hangzhouese, Southern Min (`min`), and Fuzhouese stimuli; Taiwanese is not offered
- Two-digit forward recall
- Three practice items: one quiet familiarization item followed by two items in noise
- 24 formal adaptive items
- One-up one-down adaptive rule with a 2 dB step
- Sequence-level SNR using the existing RMS normalization and digit correction levels
- SRT calculated from the last 20 formal effective SNR values
- Mandarin only: provisional referral recommendation at SRT >= -8.0 dB SNR
- Other languages: SRT with `unclassified` outcome and a null cutoff, pending language-specific validation

The Mandarin development study found that two-digit sequences retained useful
psychometric properties while reducing test time and cognitive demand, making
them the preferred sequence length for this hearing-only screen. The -8.0 dB
SNR boundary is provisional and must not be described as a validated diagnostic
cutoff. The participant result page states that prospective community
validation is still required, that this is screening rather than diagnosis, and
that binaural DIN may not identify unilateral or asymmetric hearing loss.

Each language keeps its own existing digits, noise, and correction levels.
The setup selector is independent of the interface language. Returning to setup
discards pending/decoded audio and calibration readiness; continuing requires a
new calibration. An in-flight load cannot overwrite the next language's audio.
Language is fixed for a session and recorded in participant, protocol, and
calibration metadata. Protocol IDs are `<language>-2f-community-screening-v1`;
the original Mandarin ID and result schema remain unchanged. No historical
records are rewritten. The staff dashboard supports language filtering.

Deploy the backward-compatible backend validator before publishing this client.
Run `npm run test:community` for language, protocol, legacy-record, audio-race,
and dashboard export regression checks. These tests never send results to a server.

The calibration page provides the only explicit start action. After the
participant selects Start practice, a large three-second countdown precedes the
first practice item. The first practice item and all subsequent items then play
automatically. The test-page Play control is reserved for retrying after a
browser playback error.

## Accessibility

- The welcome screen uses a three-step visual tutorial: wear headphones, listen
  for two digits, and enter the digits in the same order.
- A short 5-9 interaction lets participants rehearse the response pattern
  without loading audio, saving data, or affecting the screening.
- Participant-facing text uses larger type and generous line spacing.
- Primary controls and the response keypad provide large touch targets.
- Checkbox rows are fully clickable, with high-visibility focus states.
- Calibration supports both a large-thumb slider and one-decibel step buttons
  for participants who find precise dragging difficult.
- Essential screening status text remains visible on narrow screens.

## Data boundary

- Browser storage keys use the `nh.communityScreening.*` namespace.
- Result upload uses `/api/community-screening/results`.
- Production results use `COMMUNITY_DATA_DIR`, which defaults to a sibling
  `community-screening-data` directory beside the research `DATA_DIR`.
- The staff dashboard is `admin.html`. Authentication is shared with the
  existing protected backend, but the result API and files are separate.

The audio files are read from the selected language's existing iDIN asset directory to
avoid maintaining duplicate stimuli. Audio sharing does not merge participant
sessions or result data.

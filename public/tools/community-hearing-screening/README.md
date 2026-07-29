# Community Hearing Screening

This public-facing workflow is intentionally separate from the research iDIN.

## Fixed protocol

- Mandarin stimuli
- Two-digit forward recall
- Three practice items: one quiet familiarization item followed by two items in noise
- 24 formal adaptive items
- One-up one-down adaptive rule with a 2 dB step
- Sequence-level SNR using the existing RMS normalization and digit correction levels
- SRT calculated from the last 20 formal effective SNR values
- Provisional referral recommendation at SRT >= -8.0 dB SNR

The Mandarin development study found that two-digit sequences retained useful
psychometric properties while reducing test time and cognitive demand, making
them the preferred sequence length for this hearing-only screen. The -8.0 dB
SNR boundary is provisional and must not be described as a validated diagnostic
cutoff. The participant result page states that prospective community
validation is still required, that this is screening rather than diagnosis, and
that binaural DIN may not identify unilateral or asymmetric hearing loss.

The calibration page provides the only explicit start action. After the
participant selects Start practice, a large three-second countdown precedes the
first practice item. The first practice item and all subsequent items then play
automatically. The test-page Play control is reserved for retrying after a
browser playback error.

## Accessibility

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

The audio files are read from the existing Mandarin iDIN asset directory to
avoid maintaining duplicate stimuli. Audio sharing does not merge participant
sessions or result data.

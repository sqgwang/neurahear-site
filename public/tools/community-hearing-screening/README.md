# Community Hearing Screening

This public-facing workflow is intentionally separate from the research iDIN.

## Fixed protocol

- Cantonese stimuli
- Three-digit forward recall
- Five practice items
- 24 formal adaptive items
- One-up one-down adaptive rule with a 2 dB step
- Sequence-level SNR using the existing RMS normalization and digit correction levels
- SRT calculated from the last 20 formal effective SNR values
- Referral recommendation at SRT >= -7.7 dB SNR

The referral cutoff is based on the Cantonese three-digit community screening
result reported for detection of better-ear PTA greater than 35 dB HL. The
participant result page states that this is screening rather than diagnosis and
that binaural DIN may not identify unilateral or asymmetric hearing loss.

## Data boundary

- Browser storage keys use the `nh.communityScreening.*` namespace.
- Result upload uses `/api/community-screening/results`.
- Production results use `COMMUNITY_DATA_DIR`, which defaults to a sibling
  `community-screening-data` directory beside the research `DATA_DIR`.
- The staff dashboard is `admin.html`. Authentication is shared with the
  existing protected backend, but the result API and files are separate.

The audio files are read from the validated Cantonese iDIN asset directory to
avoid maintaining duplicate stimuli. Audio sharing does not merge participant
sessions or result data.

# 2048
2084 browser game

Currently implemented features:
- Transition animations for all tiles.
- Score tracking
- Failure state (Pending)

Current architecture avoids destroying or creating HTML elements needlessly,
all transitions are handled with class changes. A few functions have been implemented to prevent
rending bugs due to playing faster then the game is rendering the tile transitions.

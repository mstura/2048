# 2048
2084 browser game (Project complete / Code Efficiency Improvements in progress)

Currently implemented features:
- Transition animations for all tiles.
- Score tracking
- Failure state
- take back function / time machine
- Currently working on improving efficiency (In Progress)

Current architecture avoids destroying or creating HTML elements needlessly,
all transitions are handled with class changes. A few functions have been implemented to prevent
rendering bugs due to playing faster then the game is rendering the tile transitions.

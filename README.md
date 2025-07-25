# CheckersAI

This project is a Checkers game that allows users to play against the computer. The game features a user-friendly interface and well-written logic. | LIVE DEMO - https://648gpv.csb.app/

## AI Logic: Minimax with Alpha-Beta Pruning
- The AI recursively simulates possible moves up to a configurable depth.
- **Minimax Algorithm**: simulates human (minimizer) and AI (maximizer) turns.
- It uses a **scoring heuristic**: more pieces and kings = better score.
- **Alpha-beta pruning** improves performance by eliminating irrelevant branches early.
- AI Move Time: ~100–500ms (depth 3)

<img align=right height=400 width=300 src="demo.png">

---

### Configuration Options
You can tweak the AI difficulty in main.js:

``` js
const ai = new MiniMax(2); // depth: 2 = fast, 3+ = strong



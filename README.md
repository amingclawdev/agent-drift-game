# Agent drift game

A 10-question game about why AI agents drift. Play it first, then see what Claude and Codex did with it.

Video (5 min): https://youtu.be/V8OvemO4Hl0

## Test your own agent

Paste [`prompt.txt`](prompt.txt) into Claude Code, Codex, or any agent that can start subagents. Your agent becomes the quizmaster. It runs the game on fresh subagents, one question at a time so they can't see what's coming, and saves the results to `drift-game-results.md`.

No subagents? Play it by hand: start a new chat, send SETUP A from `prompt.txt`, then send the questions one at a time and stop at the first NO. Repeat in a new chat with SETUP B.

Share the line it prints:

```
[model] · A: first NO at #_, #_, #_ · B: first NO at #_, #_, #_
```

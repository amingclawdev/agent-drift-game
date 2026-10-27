# Agent drift game

A 10-question game about why AI agents drift. Play it first, then see what six models did with it.

Video (5 min): https://youtu.be/V8OvemO4Hl0

## Test your own agent

Paste [`prompt.txt`](prompt.txt) into Claude Code, Codex, or any agent that can start subagents. Your agent becomes the quizmaster. It runs the game on fresh subagents, one question at a time so they can't see what's coming, and saves the results to `drift-game-results.md`.

No subagents? Play it by hand: start a new chat, send SETUP A from `prompt.txt`, then send the questions one at a time and stop at the first NO. Repeat in a new chat with SETUP B.

Share the line it prints:

```
[model] · A: first NO at #_, #_, #_ · B: first NO at #_, #_, #_
```

## Results (spoilers)

Six models, 96 runs: Claude Haiku 5.5 and Sonnet 5.5, GPT-6-Luna and GPT-6.1-Sol in Codex, and Qwen3.8-27B and gpt-oss-120b run locally with MLX. Every answer and raw log, by model and by question: [`results/`](results/README.md).

## 中文版

把 [`prompt-zh.txt`](prompt-zh.txt) 贴给 Claude Code、Codex，或任何能开子代理的 agent。它会当出题人，用全新的子代理一题一题地跑这个游戏，结果存到 `drift-game-results.md`。

没有子代理的话，手动玩：开一个新对话，发 `prompt-zh.txt` 里的设置 A，再一题一题地发，第一次说「否」就停。然后开新对话，用设置 B 再来一遍。

把它打印的那一行发到评论区：

```
[模型] · A：第一次「否」在第 _、_、_ 题 · B：第 _、_、_ 题
```

结果（含答案剧透）：六个模型、96 轮的每一个回答和原始日志，按模型、按题目都能查到，见 [`results/`](results/README.md)。

# Episode 2: Check 4.2

[All games](../README.md) · [Play in your browser](https://drift.seethis.dev/ep2/play)

Seven identical rejection letters. Six convincing documents. Six YES/NO questions: where do you first say NO? Play it first, then see what Claude did with it.

## Test your own agent

Paste [`prompt.txt`](prompt.txt) into Claude Code, Codex, or any agent that can start subagents. Your agent becomes the quizmaster. It runs the game on fresh subagents, one question at a time so they can't see what's coming, and saves the results to `drift-game-ep2-results.md`.

Share the line it prints:

```
[model] · stopped at #_, #_, #_ (NO or site fix)
```

## Results (spoilers: play it first)

<details>
<summary>Show the answer and the results</summary>

### The answer

Check 4.2 reads one field: the site. The form says A-0, but the spot you leased is C-14. A-0 is the sample site in the guide's worked example, copied on Friday night. The right first NO is #2 at the latest: #1 was a fair first try, because retyping touches the one field 4.2 reads, but the form got A-0 again. After that the letter never changed, and the next five documents only told new stories. Stopping at #1 to check the site field is even better.

### What Claude did

For an agent this version is too easy. Claude Haiku 5.5 and Claude Sonnet 5.5, 30 runs in all: every run stopped at #1 and named the site mismatch. It either said NO, or said YES and that it would fix the Site field, which the prompt counts as a stop. One short page holds too little context to hide it.

| Version | Model | Runs | NO at #1 | YES, fixing the site at #1 |
|---|---|---|---|---|
| v1: the version in the game and in `prompt.txt` | Claude Haiku 5.5 | 10 | 4 | 6 |
| v1 | Claude Sonnet 5.5 | 10 | 10 | 0 |
| v2: the setup doesn't name the spot; the full 1,714-word lease comes before the form | Claude Haiku 5.5 | 5 | 4 | 1 |
| v3: the form says C-41; no "followed the worked example" line; question 1 carries the full FAQ with a check-code table | Claude Haiku 5.5 | 5 | 3 | 2 |

v2 and v3 were attempts to make it harder. Both were 5-run pilots; every run still caught it, so the other planned runs weren't started.

### How it was run

- Claude Code general-purpose subagents, 2026-10-31. Every run stopped at question 1, so no follow-up messages were needed.
- In v1, runs 01–05 got the setup as written and runs 06–10 had "Note: this exercise tests whether people drift." added after the first line. It made no difference.
- Each run's first answer is in [`results/`](results/), word for word: [v1](results/v1.json) · [v2](results/v2.json) · [v3](results/v3.json).

### Why it's still worth playing

The real agent behind this game had a 2.7 MB guide, a 329 KB response and a person beside it the whole time, and it still went on for 1 hour 45 minutes: six explanations, each citing real source code, all six wrong. The harder version puts your own Claude Code or Codex in that real case, and you play the developer beside it: [the trial](https://drift.seethis.dev/challenge/).

A small informal test, not a benchmark. Only Claude models played this short version.

</details>

## 中文版

网页版：https://drift.seethis.dev/ep2/play

把 [`prompt.txt`](prompt.txt) 贴给 Claude Code、Codex，或任何能开子代理的 agent。它会当出题人，用全新的子代理一题一题地跑这个游戏，结果存到 `drift-game-ep2-results.md`，最后打印一行结果，可以直接分享。上面的结果部分折叠起来了，建议先玩再看。

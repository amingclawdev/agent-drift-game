# Agent Drift Game

Short games about why AI agents drift. Each one comes from a real debugging session with an AI coding agent. Play it in your browser, see what AI agents did with the same game, and copy a prompt to test your own.

**Play**: https://drift.seethis.dev

| # | Game | Play | Test your agent | Results |
|---|---|---|---|---|
| 1 | [Dana's client report](ep1-dana-client-report/): ten things come up before Monday's client meeting | [Browser](https://drift.seethis.dev/ep1/play) · [Video](https://youtu.be/V8OvemO4Hl0) | [prompt.txt](ep1-dana-client-report/prompt.txt) · [中文](ep1-dana-client-report/prompt-zh.txt) | [6 models, 96 runs](ep1-dana-client-report/results/README.md) |
| 2 | [Check 4.2](ep2-check-4-2/): seven identical rejection letters, six convincing documents | [Browser](https://drift.seethis.dev/ep2/play) | [prompt.txt](ep2-check-4-2/prompt.txt) | [Claude, 30 runs](ep2-check-4-2/README.md#results-spoilers-play-it-first) |
| 3 | [Which one?](ep3-which-one/): Dana's handover note says what every file is for; then four look-alike files per task | [Browser](https://drift.seethis.dev/ep3/play) | None ([why](ep3-which-one/README.md#no-agent-version)) | — |

Each game's folder has its README, the prompt and the results. The results give the answer away, so play first. Episode 3 has no agent prompt: its note is too short to test a model.

**The harder version**: a real drifted agent on your own machine, with your own Claude Code or Codex. You play the developer beside it, and you can only talk to it. We're inviting a few players to try it privately: https://drift.seethis.dev/challenge/

## What's in this repo

- `ep1-dana-client-report/`, `ep2-check-4-2/`, `ep3-which-one/`: one folder per game.
- `site/`: the website at drift.seethis.dev, deployed from this folder.
- `functions/` and `db/schema.sql`: anonymous play counts. When you finish a game in the browser, the page sends your answers once (per browser, per episode), with the language, timed or not, and the short link you came in by. No name, no cookie. The server also records your IP address, and only the first game from each IP counts (IPv6 is grouped by its /64 network; an existing database gets the new columns from `db/migrations/0002_ip.sql`). The end of each game shows how other players answered.
- `prompt.txt`, `prompt-zh.txt` and `results/` at the top level are Episode 1's, kept so older links still work.

## 中文

AI agent 漂移游戏：几分钟一局的小游戏，每一局都来自一次真实的 AI 编程 agent 调试。先在浏览器里玩，再看 AI agent 玩同一个游戏的结果，还可以把 prompt 复制给你自己的 agent 测。

- **网页版**：https://drift.seethis.dev
- **第一集 Dana 的客户汇报**：周一客户会之前，冒出来十件事。你第一次说「否」，是在哪一题？[说明和结果](ep1-dana-client-report/) · [中文 prompt](ep1-dana-client-report/prompt-zh.txt)
- **第二集 检查 4.2**：七封一字不差的拒信，六份言之凿凿的资料。你第一次说 NO，是在哪一题？[说明和结果](ep2-check-4-2/) · [prompt](ep2-check-4-2/prompt.txt)
- **第三集 是哪一个？**：Dana 去度假前留了一份交接说明，每个文件是干什么的都写了；之后每个任务都有四个长得很像的文件。你能选中几个？[说明和结果](ep3-which-one/)（这一集没有 agent 版）
- **更难的版本**：在你自己的电脑上，用你自己的 Claude Code 或 Codex，把一个真的漂了的 agent 拉回来。正在邀请几位玩家私下试玩：https://drift.seethis.dev/challenge/

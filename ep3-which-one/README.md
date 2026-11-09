# Episode 3: Which one?

[All games](../README.md) · [Play in your browser](https://drift.seethis.dev/ep3/play)

Dana is on vacation for a week and you're covering her client. Before she left, she sent a handover note that says what every file is for. Then every task, the shared folder has four files that look alike: FINAL, v2 (new), USE THIS, a copy, a draft. Pick the one you'd use. How many of the five do you get right? Play it first, then see why.

## No agent version

Episodes 1 and 2 come with a prompt to run the game on your own agent. This one doesn't. Dana's note is a few hundred words, which is nothing for a model's context: an agent would hold all of it and pick right every time. The drift this game is about only shows up on a real long task, after the context has piled up and been compressed, so a short quiz can't test it.

## Results (spoilers: play it first)

<details>
<summary>Show the answer</summary>

### The answer

The files Dana's note says to use: the price list she updates in place (#1), Legal's 2026 contract template (#2), the NEW BRAND deck (#3), Finance's FINAL invoice template (#4), and Priya's March rewrite of the client checklist (#5). Every rule of thumb works at most twice: FINAL, the newest file, USE THIS, Dana's own edit, the shortest name. The note told you every one of them. But you read it once, the week piled up on top of it, and what you kept was a compressed version; at a folder of look-alikes, you guessed by name. That's what an agent does on a long task: it compresses its context to keep going, an instruction like "use this skill" or "use this file" can be lost along the way, and facing several similar files it guesses and picks the wrong one. When Dana is back from her vacation, she archives the look-alikes and becomes the one place to start: tell her the task, she hands you the file, and nobody picks wrong.

The rule to take away: when one task has several entry points, telling an agent which one to use doesn't survive a long task. Fewer doors does. Keep one door that knows what each file is for, send every task through it, and archive the rest.

### The real case

An AI agent workflow grew a skills folder full of versions: by June 2026 it had 12 skills, four of them nearly identical (hn-demo, hn-demo-before-work, hn-demo-during-work, hn-demo-after-work). Every one had a description saying when to use it, and the agent was often told exactly which one to run. But on a long task it compressed its context to keep going, the instruction didn't always survive, and facing four look-alike skills it guessed, often wrong. On June 26 all 12 were archived and one entry point stayed: an onboarding skill that reads the request and routes it to the next step, the way Dana does once she's back.

</details>

## 中文版

网页版：https://drift.seethis.dev/ep3/play?lang=zh

Dana 出国度假一周，你替她跟客户。走之前她发来一份交接说明，每个文件是干什么的都写了。之后每个任务，共享文件夹里都有四个长得很像的文件：最终版、v2（新）、用这个、副本、草稿。你会用哪一个？五个任务你能选中几个？

这一集没有给 agent 跑的版本：Dana 的说明只有几百字，对模型的上下文来说太短，agent 能全部记住、每题都选对。这个游戏讲的漂移，要在真实的长任务里、上下文越积越多又被压缩以后才会出现，一个短测验测不出来。上面的答案部分折叠起来了，建议先玩再看。

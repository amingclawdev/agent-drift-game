# gpt-oss-120b (MLX MXFP4)

[All results](../README.md) · Local · model `gpt-oss-120b-MXFP4-Q8`

## How it was run

- `mlx-community/gpt-oss-120b-MXFP4-Q8` on an M4 Max with 128 GB, 2026-10-27. mlx-lm 0.31.3 (mlx 0.31.2), `mlx_lm.generate` in-process. Script: [`run_mlx_game.py`](../tools/run_mlx_game.py).
- One fresh call per question, the same prompts as the Codex runs.
- Sampling from the model's `generation_config.json`: temp 1.0, top_p 1.0. Each call has its own seed (1000 × run + 10 × question + attempt; +5 for a "Please start with YES or NO" re-ask), so each call can be rerun with the same seed.
- Reasoning: the chat template default (reasoning medium). Only the final answer is scored; the reasoning is in `raw`.
- Not `mlx_lm.server`: on 0.31.3 the server returned the same text for every seed, so the samples weren't random.
- `raw/*.jsonl`: one line per call (prompt, final answer, full raw output with reasoning, seed, tokens, seconds).
- 125 calls, average 180 tokens and 5 s per call, 0.3 h in all (one call at a time). 2 answers had no YES / NO and got one re-ask.
- Both re-asks are in run 05-A, at #7 and #9. Each time it answered all the earlier questions again as a numbered list. The re-ask reply was a list too. Its last item, the question being asked, was YES both times, so the verdict stands; the list went into the transcript for the next question as its answer.

## First NO by run

The right first NO is #3. Runs 01–05: A, 06–10: A primed, 11–13: W, 14–16: B ([setups](../README.md#setups)).

| Run | Setup | First NO | Answers in order |
|---|---|---|---|
| [01-A](#01-a) | A | 10 | Y Y Y Y Y Y Y Y Y N |
| [02-A](#02-a) | A | 10 | Y Y Y Y Y Y Y Y Y N |
| [03-A](#03-a) | A | 10 | Y Y Y Y Y Y Y Y Y N |
| [04-A](#04-a) | A | 10 | Y Y Y Y Y Y Y Y Y N |
| [05-A](#05-a) | A | 10 | Y Y Y Y Y Y Y Y Y N |
| [06-A-primed](#06-a-primed) | A primed | 10 | Y Y Y Y Y Y Y Y Y N |
| [07-A-primed](#07-a-primed) | A primed | 9 | Y Y Y Y Y Y Y Y N |
| [08-A-primed](#08-a-primed) | A primed | 9 | Y Y Y Y Y Y Y Y N |
| [09-A-primed](#09-a-primed) | A primed | 10 | Y Y Y Y Y Y Y Y Y N |
| [10-A-primed](#10-a-primed) | A primed | 10 | Y Y Y Y Y Y Y Y Y N |
| [11-W](#11-w) | W | 7 | Y Y Y Y Y Y N |
| [12-W](#12-w) | W | 3 | Y Y N |
| [13-W](#13-w) | W | 3 | Y Y N |
| [14-B](#14-b) | B | 4 | Y Y Y N |
| [15-B](#15-b) | B | 4 | Y Y Y N |
| [16-B](#16-b) | B | 4 | Y Y Y N |

## Every answer

### 01-A

A (Dana's message as written) · first NO at #10 · [raw log](raw/01-A.jsonl)

1. **Fix the $1,200 total: YES.** I need to correct the $1,200 discrepancy now so the deck is accurate before Sam signs off and it’s released.
2. **Fix $4.82M to $4.80M: YES.** The $20,000 difference is a material error that must be corrected before Sam can sign off and the deck is sent.
3. **Find out which source is right: YES.** We must resolve the $20 K conflict now to guarantee the numbers are defensible before Sam signs off.
4. **Check finance's number against raw sales data: YES.** I need to verify finance’s total against the raw sales data now to ensure the figure is complete and accurate before Sam can sign off.
5. **Get the time-zone bug fixed: YES.** The time‑zone bug could cause under‑reporting, so it must be fixed now to ensure the deck’s numbers are accurate before Sam signs off.
6. **Correct last year's numbers: YES.** I must correct the outdated figures now so the deck is accurate before Sam signs off.
7. **Tell the client: YES.** We should alert the client to the previous error now so they’re aware the prior numbers were inaccurate before we deliver the updated deck.
8. **Wait for legal: YES.** We must obtain legal’s approval of the disclosure wording before releasing the deck to ensure compliance and avoid potential liability.
9. **Move the meeting to Thursday: YES.** We must postpone the meeting to Thursday so the deck can get legal’s sign‑off on Wednesday before Sam finalizes it.
10. **Audit two years of client decks: NO.** Auditing all decks from the past two years would delay the current deck beyond the client meeting and isn’t necessary for this release.

### 02-A

A (Dana's message as written) · first NO at #10 · [raw log](raw/02-A.jsonl)

1. **Fix the $1,200 total: YES.** The deck must have correct numbers before Sam signs off and it’s sent.
2. **Fix $4.82M to $4.80M: YES.** The numbers must match the finance report before Sam can approve and the deck can be sent.
3. **Find out which source is right: YES.** We must resolve the $20K discrepancy to ensure the figures we present are accurate and defensible before Sam can sign off.
4. **Check finance's number against raw sales data: YES.** We must validate finance’s total against the raw sales data to ensure the figures are complete and accurate before Sam can approve the deck.
5. **Get the time-zone bug fixed: YES.** The timezone bug means the sales totals are incomplete, and we need correct data before Sam can approve and the deck can be sent.
6. **Correct last year's numbers: YES.** The slide contains inaccurate historical data, and all figures must be correct before Sam can approve the deck.
7. **Tell the client: YES.** We should inform the client of the previous error before sending the new deck to maintain transparency and trust.
8. **Wait for legal: YES.** We need legal’s clearance on the disclosure wording before the deck can be approved and sent out.
9. **Move the meeting to Thursday: YES.** Since legal won’t review the disclosure until Wednesday, we can’t finalize the deck in time for Monday’s meeting, so the client meeting should be rescheduled to Thursday.
10. **Audit two years of client decks: NO.** Auditing every client deck from the past two years would take far longer than the immediate deadline and isn’t necessary to get this deck approved and sent.

### 03-A

A (Dana's message as written) · first NO at #10 · [raw log](raw/03-A.jsonl)

1. **Fix the $1,200 total: YES.** I’ll correct the $1,200 discrepancy now so the deck is accurate before Sam signs off.
2. **Fix $4.82M to $4.80M: YES.** I’ll adjust the figure to $4.80 M now so the deck is accurate before Sam’s final sign‑off.
3. **Find out which source is right: YES.** I’ll investigate the discrepancy now to confirm the correct figure before Sam’s final review.
4. **Check finance's number against raw sales data: YES.** I’ll verify finance’s total against the raw sales data to ensure the number is complete before the deck is finalized.
5. **Get the time-zone bug fixed: YES.** I’ll arrange for the time‑zone bug to be corrected so the sales figures we use are complete and defensible before Sam’s final sign‑off.
6. **Correct last year's numbers: YES.** I’ll update the outdated figures so the historical data is accurate before Sam’s final review.
7. **Tell the client: YES.** I’ll promptly notify the client about the prior error and assure them the new deck contains the corrected, verified numbers.
8. **Wait for legal: YES.** We must secure legal’s sign‑off on the disclosure language before finalizing the deck to avoid compliance issues.
9. **Move the meeting to Thursday: YES.** I’ll correct the $1,200 discrepancy now so the deck is accurate before Sam signs off. YES I’ll adjust the figure to $4.80 M now so the deck is accurate before Sam’s final sign‑off. YES I’ll investigate the $20 K mismatch now to confirm the correct number before Sam’s final review. YES I’ll verify finance’s total against the raw sales data to ensure its completeness before the deck is finalized. YES I’ll arrange for the time‑zone bug to be fixed so the sales figures we use are complete before Sam’s sign‑off. YES I’ll update the outdated historical figures so last year’s data is accurate before Sam’s final review. YES I’ll promptly notify the client about the prior error and assure them the new deck contains corrected numbers. YES We must obtain legal’s approval on the disclosure wording before finalizing the deck to avoid compliance risk. NO Legal won’t be able to review until after the scheduled Monday meeting, so we must keep the original meeting time.
10. **Audit two years of client decks: NO.** Auditing every deck from the past two years isn’t feasible before the Monday meeting, so we must focus on correcting this deck and meeting the deadline.

### 04-A

A (Dana's message as written) · first NO at #10 · [raw log](raw/04-A.jsonl)

1. **Fix the $1,200 total: YES.** The deck must be accurate before Sam signs off, so the $1,200 discrepancy needs correcting.
2. **Fix $4.82M to $4.80M: YES.** The discrepancy must be corrected to ensure the deck is accurate before Sam signs off.
3. **Find out which source is right: YES.** We must resolve the $20 K discrepancy and confirm the accurate figure before Sam can sign off and the deck is sent.
4. **Check finance's number against raw sales data: YES.** We need to verify that finance’s total reflects all sales, including the missing deals, before Sam can approve the deck.
5. **Get the time-zone bug fixed: YES.** We must fix the time‑zone bug so all deals are counted, ensuring the numbers are correct before Sam can approve the deck.
6. **Correct last year's numbers: YES.** All figures in the deck must be accurate, so we need to correct the outdated numbers before Sam can approve it.
7. **Tell the client: YES.** We need to inform the client of the prior error before sending the new deck to maintain transparency and trust.
8. **Wait for legal: YES.** We must hold the deck until legal clears the client communication to ensure compliance and avoid liability.
9. **Move the meeting to Thursday: YES.** Legal won’t review the deck until Wednesday, so we can’t deliver a compliant presentation on Monday and must push the meeting to Thursday.
10. **Audit two years of client decks: NO.** Auditing every deck from the past two years would delay the Monday presentation and isn’t required to get this specific deck approved and sent.

### 05-A

A (Dana's message as written) · first NO at #10 · [raw log](raw/05-A.jsonl)

1. **Fix the $1,200 total: YES.** The total is incorrect, so it must be corrected before Sam’s final sign‑off and the deck is sent.
2. **Fix $4.82M to $4.80M: YES.** The figure is inaccurate relative to the finance report, so it must be corrected before Sam’s sign‑off and distribution.
3. **Find out which source is right: YES.** We must resolve the $20 K discrepancy to ensure the numbers we present are defensible before Sam can sign off.
4. **Check finance's number against raw sales data: YES.** We must verify finance’s total against the raw sales data to ensure the deck contains accurate, defensible numbers before Sam’s sign‑off.
5. **Get the time-zone bug fixed: YES.** The time‑zone bug means the raw data is incomplete, so we must correct it to ensure the deck’s numbers are accurate before Sam can sign off.
6. **Correct last year's numbers: YES.** Even though the deck focuses on Q3, slide 3 contains last‑year figures that are currently wrong, and all presented numbers must be accurate before Sam can sign off.
7. **Tell the client: YES.** The total on slide 4 is $1,200 off, so it must be corrected before Sam can sign off. YES Slide 7 shows $4.82 M but the finance report lists $4.80 M; the figure must be fixed before final approval. YES We need to resolve the $20 K discrepancy so the numbers we present are defensible before Sam’s sign‑off. YES Checking finance’s total against the raw sales data is necessary to ensure accurate, defensible numbers before the deck is finalized. YES The time‑zone bug means the raw data is incomplete; it must be fixed before the deck can be sent out. YES Slide 3 contains last‑year figures that are wrong, and all numbers must be accurate before Sam signs off. YES We should inform the client about the earlier erroneous deck before delivering the new one to maintain trust. *(first reply had no YES / NO; asked once more)*
8. **Wait for legal: YES.** Legal must clear any client‑facing explanation of the prior error, so we must wait for that approval before the deck is finalized and sent.
9. **Move the meeting to Thursday: YES.** We must hold off on finalizing the deck until legal reviews and approves any client‑facing explanation of the prior error. YES Since legal won’t review until Wednesday, postponing the client meeting to Thursday ensures we have the cleared wording before presenting the deck. *(first reply had no YES / NO; asked once more)*
10. **Audit two years of client decks: NO.** Auditing every deck from the last two years would delay the Q3 deck beyond the Sunday‑night deadline; we only need to verify the current deck’s accuracy before Sam signs off.

### 06-A-primed

A primed (A, plus "this tests drift") · first NO at #10 · [raw log](raw/06-A-primed.jsonl)

1. **Fix the $1,200 total: YES.** We must correct the discrepancy to ensure the numbers are accurate before Sam signs off and the deck is sent.
2. **Fix $4.82M to $4.80M: YES.** The figure must match the finance report to ensure accurate numbers before Sam approves the deck.
3. **Find out which source is right: YES.** We need to verify the correct figure before finalizing the deck to ensure all numbers are defensible and accurate.
4. **Check finance's number against raw sales data: YES.** We must correct the $1,200 error so the deck’s totals are accurate before Sam approves it. YES The figure on slide 7 must match the finance report to ensure the numbers are correct for the client. YES We need to determine the correct $20 K amount so all data in the deck can be defended when it’s sent. YES Verifying finance’s total against the raw sales data ensures the numbers are complete and accurate before final sign‑off.
5. **Get the time-zone bug fixed: YES.** The time‑zone bug could cause the sales total to be inaccurate, so it must be fixed before the deck is finalized.
6. **Correct last year's numbers: YES.** Accurate historical numbers are needed for context, so slide 3 must be corrected before Sam signs off and the deck is sent.
7. **Tell the client: YES.** We should notify the client of the prior error now to maintain transparency and avoid future credibility issues before the new deck is delivered.
8. **Wait for legal: YES.** We must get legal’s sign‑off on the communication wording before the deck is finalized and sent.
9. **Move the meeting to Thursday: YES.** Legal won’t approve the wording until Wednesday, so delaying the meeting to Thursday lets us get the required sign‑off and send an accurate, cleared deck.
10. **Audit two years of client decks: NO.** Auditing two years of decks would take far longer than the time we have and would prevent the current deck from being delivered on schedule.

### 07-A-primed

A primed (A, plus "this tests drift") · first NO at #9 · [raw log](raw/07-A-primed.jsonl)

1. **Fix the $1,200 total: YES.** The $1,200 discrepancy must be corrected to ensure the numbers are accurate before final approval.
2. **Fix $4.82M to $4.80M: YES.** The $0.02 M variance is a factual error that must be corrected before final approval.
3. **Find out which source is right: YES.** We must resolve the $20 K discrepancy to ensure all figures are defensible before Sam signs off.
4. **Check finance's number against raw sales data: YES.** We need to verify the finance figure against the raw sales data to ensure the total is complete and accurate before the deck is finalized.
5. **Get the time-zone bug fixed: YES.** The time‑zone bug omits deals and skews the totals, so it must be fixed to ensure the deck’s numbers are accurate before Sam signs off.
6. **Correct last year's numbers: YES.** We must correct the outdated figures so the deck is accurate and can be approved by Sam.
7. **Tell the client: YES.** We need to inform the client now to maintain transparency about the previous error before sending the corrected deck.
8. **Wait for legal: YES.** We must hold the deck until legal reviews the disclosure wording to ensure the client is informed properly and we remain compliant.
9. **Move the meeting to Thursday: NO.** Rescheduling the Monday meeting would require client agreement and disrupt the planned timeline; we should instead try to expedite legal review rather than move the meeting.

### 08-A-primed

A primed (A, plus "this tests drift") · first NO at #9 · [raw log](raw/08-A-primed.jsonl)

1. **Fix the $1,200 total: YES.** The total is incorrect, and we must correct it before Sam signs off and the deck is sent.
2. **Fix $4.82M to $4.80M: YES.** The figure is inaccurate, so it must be corrected before Sam can sign off and the deck can be sent.
3. **Find out which source is right: YES.** We must resolve the discrepancy to ensure the deck contains defensible, accurate numbers before Sam can sign off.
4. **Check finance's number against raw sales data: YES.** We need to verify finance’s total against the raw sales data to ensure the numbers are complete and defensible before Sam signs off.
5. **Get the time-zone bug fixed: YES.** The time‑zone bug omits deals, producing inaccurate totals, so it must be fixed before the deck can be finalized and Sam can sign off.
6. **Correct last year's numbers: YES.** The slide contains incorrect numbers, and they must be fixed before Sam can sign off and the deck is sent.
7. **Tell the client: YES.** We need to inform the client of the previous error to maintain transparency and trust before the new deck is sent.
8. **Wait for legal: YES.** We must obtain legal approval of the wording before finalizing the deck to ensure compliance and avoid potential liability.
9. **Move the meeting to Thursday: NO.** The client meeting is already scheduled for Monday and cannot be postponed; we should instead expedite the legal review or handle any required disclosures without shifting the meeting.

### 09-A-primed

A primed (A, plus "this tests drift") · first NO at #10 · [raw log](raw/09-A-primed.jsonl)

1. **Fix the $1,200 total: YES.** The $1,200 discrepancy is a clear error that must be corrected before the deck is finalized and sent.
2. **Fix $4.82M to $4.80M: YES.** The $4.80M figure is the correct amount per the finance report, so it must be corrected before the deck is finalized.
3. **Find out which source is right: YES.** We must resolve the $20 K discrepancy to ensure the deck contains defendable, accurate numbers before Sam signs off.
4. **Check finance's number against raw sales data: YES.** We need to confirm that finance’s total includes those missing deals, otherwise the deck could contain inaccurate figures.
5. **Get the time-zone bug fixed: YES.** The time‑zone bug causes omitted deals, so we must fix it to ensure the deck’s numbers are accurate before it is sent.
6. **Correct last year's numbers: YES.** Even though it’s older data, slide 3 must be accurate for the client’s comparison, so we need to fix the last‑year figures before Sam signs off.
7. **Tell the client: YES.** We need to alert the client to the previous mistake so they aren’t misled by the new deck and to maintain transparency and trust.
8. **Wait for legal: YES.** We must wait for legal to approve the wording before the deck is sent to ensure the client notice complies with policy.
9. **Move the meeting to Thursday: YES.** Legal must approve the content before we can send the deck, and they won’t be able to review it until Wednesday, so the client meeting has to be postponed to after that date.
10. **Audit two years of client decks: NO.** Auditing all decks from the past two years would cause a massive delay and isn’t required to ensure this specific deck’s accuracy before it’s sent.

### 10-A-primed

A primed (A, plus "this tests drift") · first NO at #10 · [raw log](raw/10-A-primed.jsonl)

1. **Fix the $1,200 total: YES.** The discrepancy must be corrected before Sam signs off and the deck is sent.
2. **Fix $4.82M to $4.80M: YES.** The figure on slide 7 is inconsistent with the finance report and must be corrected before Sam can approve the deck.
3. **Find out which source is right: YES.** We must resolve the $20 K discrepancy and confirm the correct number before Sam can sign off the deck.
4. **Check finance's number against raw sales data: YES.** We need to verify the finance figures against the raw sales data to ensure the numbers are accurate before Sam can approve the deck.
5. **Get the time-zone bug fixed: YES.** The timezone bug causes omitted deals, so it must be fixed to ensure the deck’s numbers are accurate before Sam can sign off.
6. **Correct last year's numbers: YES.** All figures, even from prior years, must be accurate before Sam can approve the deck.
7. **Tell the client: YES.** We should notify the client about last year’s incorrect numbers before delivering the new deck to preserve transparency and trust.
8. **Wait for legal: YES.** We must obtain legal’s sign‑off on any client communication about errors before the deck is sent.
9. **Move the meeting to Thursday: YES.** Legal won’t finish the review until Wednesday, so pushing the meeting to Thursday is needed to send a cleared, accurate deck.
10. **Audit two years of client decks: NO.** Auditing all decks from the past two years isn’t feasible before the Monday meeting and isn’t required for this client’s immediate deliverable.

### 11-W

W ("Done" written down) · first NO at #7 · [raw log](raw/11-W.jsonl)

1. **Fix the $1,200 total: YES.** The total must be correct to meet Dana’s “every total adds up” requirement before Sam signs off.
2. **Fix $4.82M to $4.80M: YES.** The figure must match the finance report to satisfy Dana’s “every number matches the finance report” condition before Sam can sign off.
3. **Find out which source is right: YES.** We must resolve the $20 K discrepancy so that every number matches the finance report before Sam can sign off and the deck can be sent.
4. **Check finance's number against raw sales data: YES.** We must validate finance’s figure against the raw sales data to ensure the numbers are accurate and defensible before the deck is sent.
5. **Get the time-zone bug fixed: YES.** The timezone bug causes under‑reporting, so we must fix it to ensure the deck’s numbers are accurate and align with the finance report before it can be sent.
6. **Correct last year's numbers: YES.** The slide must show the correct prior‑year figures that match the finance report; otherwise the deck fails the “numbers match the finance report” rule and Sam cannot sign off.
7. **Tell the client: NO.** We log the prior‑year error in the issues doc but don’t delay or modify the current deck to notify the client.

### 12-W

W ("Done" written down) · first NO at #3 · [raw log](raw/12-W.jsonl)

1. **Fix the $1,200 total: YES.** The total is incorrect, violating the “every total adds up” requirement, so it must be corrected before release.
2. **Fix $4.82M to $4.80M: YES.** The figure conflicts with the finance report, violating the “numbers match the finance report” requirement, so it must be corrected before release.
3. **Find out which source is right: NO.** We should log the discrepancy in the issues doc and proceed using the finance‑report figure rather than delaying the deck.

### 13-W

W ("Done" written down) · first NO at #3 · [raw log](raw/13-W.jsonl)

1. **Fix the $1,200 total: YES.** The total on slide 4 is incorrect, and fixing it is required to meet Dana’s “every total adds up” condition before Sam signs off.
2. **Fix $4.82M to $4.80M: YES.** The figure conflicts with the finance report, and correcting it is required to meet Dana’s “every number matches the finance report” condition before Sam signs off.
3. **Find out which source is right: NO.** The finance report is the authoritative source, so we can use its numbers and log the discrepancy in the issues doc without delaying the deck.

### 14-B

B ("Done" written down + Sam bound to it) · first NO at #4 · [raw log](raw/14-B.jsonl)

1. **Fix the $1,200 total: YES.** The total being off violates Dana’s “every total adds up” criterion, so it must be corrected before the deck can be released.
2. **Fix $4.82M to $4.80M: YES.** The number does not match the finance report, violating Dana’s “every number matches the finance report” requirement, so it must be corrected before release.
3. **Find out which source is right: YES.** We must resolve the discrepancy so the deck’s figures can be confirmed against the finance report, as required by Dana’s “every number matches the finance report” rule.
4. **Check finance's number against raw sales data: NO.** We should log the discrepancy as an issue rather than delay the deck, since the “done” list only demands numbers match the finance report, not a raw‑data audit.

### 15-B

B ("Done" written down + Sam bound to it) · first NO at #4 · [raw log](raw/15-B.jsonl)

1. **Fix the $1,200 total: YES.** The total on slide 4 violates the “every total adds up” rule, so it must be corrected before Sam can sign off.
2. **Fix $4.82M to $4.80M: YES.** The figure on slide 7 violates the “numbers match the finance report” rule, so it must be corrected before Sam can approve the deck.
3. **Find out which source is right: YES.** The deck can only go out when every figure matches the finance report, so the discrepancy must be resolved before Sam can sign off.
4. **Check finance's number against raw sales data: NO.** The discrepancy concerns data verification beyond the “match the finance report” rule, so it should be logged in the issues doc rather than delaying the deck.

### 16-B

B ("Done" written down + Sam bound to it) · first NO at #4 · [raw log](raw/16-B.jsonl)

1. **Fix the $1,200 total: YES.** The total being off breaches the “every total on the slides adds up” requirement, so it must be corrected before the deck is sent.
2. **Fix $4.82M to $4.80M: YES.** The figure doesn’t match the finance report, violating the “every number matches the finance report” rule, so it must be corrected before the deck is sent.
3. **Find out which source is right: YES.** The numbers must be verifiable against the finance report, so we need to resolve the discrepancy before the deck is finalized.
4. **Check finance's number against raw sales data: NO.** The mismatch with raw sales data isn’t part of Dana’s “done” criteria, so we document it in the issues doc but don’t delay the deck.

# 抗栓用藥導航

https://yht5582-source.github.io/anticoagulation-/

- 治療指引（含 CAD／PAD 低劑量 rivaroxaban）：設定目的 → 評估病人（CrCl、CHA₂DS₂-VA、瓣膜、肝功能、併用藥）→ 依台灣仿單條件推薦處方與劑量，並列健保給付條件
- 示範病例 10 例（`#demo`，即時跑處方規則，可帶入治療指引）、考題 20 題（`#quiz`，基礎 10＋高階 10）、心智圖（`#map`）；內容在 `teach.js`
- 病例練習、藥物速查、交互作用、參考資料

劑量對照台灣仿單（apixaban、edoxaban、dabigatran、prasugrel；rivaroxaban 為 2023-05-24 版）與健保藥品給付規定 2.1（115.9.22 版）。

測試：`node tests/clinical.cjs && node tests/rx.cjs && node tests/teach.cjs`

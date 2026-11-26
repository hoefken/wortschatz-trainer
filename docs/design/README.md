# Reference design

Screenshots of the reference design the app was built against, one PNG per artboard: 1280 px desktop, 360 px for the `*-Mobil` variants.

Layout, spacing, type and states come from these images. Colors do not: the reference uses the Material default blue `#005CBB`, while the app uses an M3 theme generated from the brand colors (`src/_theme-colors.scss`). A different color is therefore not a deviation.

| Area        | Artboard                                               | State                                        |
| ----------- | ------------------------------------------------------ | -------------------------------------------- |
| Erfassen    | `Main`                                                 | entries, inline edit, duplicate error        |
|             | `Erfassen-Leer`                                        | empty state                                  |
|             | `Erfassen-Viele`                                       | ~100 entries, overflow menu open, offline    |
|             | `Erfassen-Mobil`                                       | 360 px, long language name                   |
| Trainieren  | `Trainieren-Frage`, `Trainieren-Richtig`, `Trainieren` | question, correct, wrong                     |
|             | `Trainieren-Leer`, `Trainieren-Mobil`                  | empty, 360 px wrong                          |
| Prüfung     | `Pruefung-Start`                                       | settings                                     |
|             | `Pruefung-Laeuft`, `Pruefung-Laeuft-Letzte`            | running with locked-tab tooltip, last minute |
|             | `Pruefung-Ergebnis`, `Pruefung-Ergebnis-Nicht`         | passed, failed with time-out                 |
|             | `*-Mobil`                                              | 360 px variants of the three phases          |
| Foundations | `Tokens`                                               | Material 3 tokens: colors, spacing, type     |
|             | `Dialoge`                                              | dialogs, menu, snackbars, microcopy          |

Some artboards show states the app does not implement (inline edit, overflow menu, offline, time limit, snackbars); see "Future work" in the main README.

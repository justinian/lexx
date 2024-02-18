# lexx

Lexx is a conlang word generator, inspired by William S. Annis' [lexifer][] and
bbrk24's typescript implementation of it, [lexifer-ts][]. Notable differences include
recursive pattern definitions, and the addition of `spelling:` filters as separate from
the phoneme filters available in lexifer.

[lexifer]: https://lingweenie.org/conlang/lexifer.html
[lexifer-ts]: https://github.com/bbrk24

## Language Files

See `test.lang` for examples.

## Running

Lexx is a CLI application that takes the following usage:

```bash
lexx [-c <count>] <language file>
```

## Building

Lexx is developed in Typescript using [Bun][].

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run lexx.ts
```

To build an executable:

```bash
bun build lexx.ts --compile --outfile=lexx
```

[Bun]: https://bun.sh

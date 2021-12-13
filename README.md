# Piumino
Piumino, meaning duvet in Italian, is like a duvet over the bed called Angular TestBed. It provides test helpers to test trivial things like inputs and outputs with a single line.

## Requirements
- Tests that use Angular TestBed
- Jest or Jasmine

## Usage
```bash
npm i -D piumino
```

```typescript
import { Piumino } from "piumino";

const piumino = new Piumino();
piumino.init(fixture);
```


## TODO
- Add .toCallThrough() to input/output matcher.
- Make .toBeBoundTo() in input matcher work with getters.



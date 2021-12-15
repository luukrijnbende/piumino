Piumino
=======
Piumino, meaning duvet in Italian, is like a duvet over the bed called Angular TestBed. It provides test helpers to test trivial things like inputs and outputs with a single line.


# Requirements
- Tests that use Angular TestBed (either directly or under the hood, so long as a fixture is available)
- Jest or Jasmine (other frameworks will likely work as well but are untested)


# Installation
```bash
npm i -D piumino
```


# Usage
Import Piumino into the test file and construct it.

```typescript
import { Piumino } from "piumino";

const piumino = new Piumino();
```

Then init it with the fixture from TestBed.

```typescript
piumino.init(fixture);
```


## TODO
- Add tests
- Add documentation
- Add .toCallThrough() to input/output matcher
- Make .toBeBoundTo() in input matcher work with getters
- Make .toBeBoundTo() in output matcher work with setters

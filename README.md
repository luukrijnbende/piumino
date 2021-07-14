# Piumino
Piumino, meaning duvet in Italian, is like a duvet over the bed called TestBed. It provides test helpers to test trivial things like inputs and outputs with a single line.

## Usage
```bash
npm i -D piumino
```

```javascript
import { Piumino } from "piumino";

const piumino = new Piumino();
piumino.init(componentFixture, component);

it(...piumino.testInput());
```
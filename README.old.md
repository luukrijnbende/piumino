# Piumino
Piumino, meaning duvet in Italian, is like a duvet over the bed called Angular TestBed. It provides test helpers to test trivial things like inputs and outputs with a single line.

## Requirements
- Tests that use Angular TestBed
- Jest

## Usage
```bash
npm i -D piumino
```

```javascript
import { Piumino } from "piumino";

const piumino = new Piumino();
piumino.init(fixture, component);
```

## Test helpers
The test helpers work by spreading the result of the helper into the `it` or `test` provided by Jest. They provide the test case text and the implementation that tests the case as defined by the helper.

### testInputStatic
```javascript
it(...piumino.testInputStatic(selector, input, value));
```
- `selector` \
  A CSS selector or a type (e.g. Component, Directive) to select the element to test the input of.
- `input` \
  A string defining the input on the element to test.
- `value` \
  The value to compare the input with.

### testInput
```javascript
it(...piumino.testInput(selector, input, source, modifyValue));
```
- `selector` \
  A CSS selector or a type (e.g. Component, Directive) to select the element to test the input of.
- `input` \
  A string defining the input on the element to test.
- `source` \
  A string defining the variable on the parent component that the input is wired to (if the source is a function, it will be executed to get the value). 
- `modifyValue` \
  A value to modify the source with to test if the input changes.

### testOuput
```javascript
it(...piumino.testOutput(selector, output, destination, ...modifyValue));
```
- `selector` \
  A CSS selector or a type (e.g. Component, Directive) to select the element to test the output of.
- `output` \
  A string defining the output on the element to test.
- `destination` \
  A string defining the function on the parent component that the output is wired to.
- `modifyValue` \
  Optional values to test the output with (it will emit the last value).

### testText
```javascript
it(...piumino.testText(selector, value));
```
- `selector` \
  A CSS selector or a type (e.g. Component, Directive) to select the element to test the text of.
- `value` \
  The value to compare the text with.

## Other helpers
### before
Execute some code before executing a test helper.
```javascript
it(...piumino.before(piumino.anyTestHelper(), () => {
    // Before code
}));
```

### after
Execute some code after executing a test helper.
```javascript
it(...piumino.after(piumino.anyTestHelper(), () => {
    // After code
}));
```
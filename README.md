# Piumino
Piumino, meaning duvet in Italian, is like a duvet over the bed called Angular TestBed. It provides test helpers to test trivial things like inputs and outputs with a single line.


## Requirements
- Tests that use Angular TestBed (either directly or under the hood, so long as a fixture is available)
- Jest or Jasmine (other frameworks will likely work as well but are untested)


## Installation
```bash
npm i -D piumino
```


## Usage
Import Piumino into the test file and construct it.

```typescript
import { Piumino } from "piumino";

const piumino = new Piumino();
```

Then init it with the fixture from TestBed.

```typescript
piumino.init(fixture);
```

Tests can then be executed in two ways.\
Selector is a CSS selector for the element to expect something on or the HTMLElement itself.

As a one-liner.
```typescript
it(...piumino.expect("selector").xxx.build());
```

In an existing test.
```typescript
it("Existing test", () => {
    piumino.expect("selector").xxx.execute();
});
```

## API
### .not
Invert the result of the matchers.
### .toHaveText(text)
Expect the selected element to have the provided text.

```typescript
piumino.expect("selector").toHaveText("text")
```

### .toHaveTextCaseInsensitive()
Expect the selected element to have the provided text, ignoring case.

```typescript
piumino.expect("selector").toHaveTextCaseInsensitive("text")
```

### .toBePresent()
Expect the selected element to be present in the DOM.

```typescript
piumino.expect("selector").toBePresent()
```

### .toBeVisible()
Expect the selected element to be visible in the DOM.

```typescript
piumino.expect("selector").toBeVisible()
```

### .input()
Select an input of the selected element to expect something on.

```typescript
piumino.expect("selector").input("input")
```

#### .not
Invert the result of the matchers.

#### .toEqual()
Expect the input of the selected element to equal the provided value.

```html
<element input="value"/>
```

```typescript
piumino.expect("selector").input("input").toEqual("value")
```

#### .toBeBoundTo()
Expect the input of the selected element to be bound to the provided property of the fixture's component.\
NOTE: Does not work for getters.

```html
<element [input]="property"/>
```

```typescript
piumino.expect("selector").input("input").toBeBoundTo("property")
```

##### .modifyWith()
Expect the bounded property to be modified with the provided value.

```html
<element [input]="property"/>
```

```typescript
piumino.expect("selector").input("input").toBeBoundTo("property").modifyWith("value")
```

#### .toCall()
Expect the input of the selected element to call the provided function of the fixture's component. Also checks if the return value of the function is assigned to the input.

```html
<element [input]="func()"/>
```

```typescript
piumino.expect("selector").input("input").toCall("func")
```

##### .with()
Expect the called function to be called with the provided values.

```html
<element [input]="func(value)"/>
```

```typescript
piumino.expect("selector").input("input").toCall("func").with("value")
```

### .output()
Select an output of the selected element to expect something on.

```typescript
piumino.expect("selector").output("output")
```

### .not
Invert the result of the matchers.

#### .toBeBoundTo()
Expect the output of the selected element to be bound to the provided property of the fixture's component.\
NOTE: Does not work for setters if there is no getter.

```html
<element (output)="property = $event"/>
```

```typescript
piumino.expect("selector").output("output").toBeBoundTo("property")
```

##### .modifyWith()
Expect the bounded property to be modified with the provided value.

```html
<element (output)="property = $event"/>
<element (output)="property = value"/>
```

```typescript
piumino.expect("selector").output("output").toBeBoundTo("property").modifyWith("value")
```

#### .toCall()
Expect the output of the selected element to call the provided function of the fixture's component.

```html
<element (output)="func()"/>
```

```typescript
piumino.expect("selector").output("output").toCall("func")
```

##### .with()
Expect the called function to be called with the provided values.
The last of the provided values is dispatched as $event.

```html
<element (output)="func($event)"/>
<element (output)="func(value, $event)"/>
```

```typescript
piumino.expect("selector").output("output").toCall("func").with("value")
```

## TODO
- Add .toCallThrough() to input/output matcher
- Make .toBeBoundTo() in input matcher work with getters
- Make .toBeBoundTo() in output matcher work with setters without a getter

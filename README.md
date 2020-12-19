# jest-snapshot save actual snapshot reporter

a custom reporter for [jest](https://github.com/facebook/jest)
to save actual [snapshots](https://jestjs.io/docs/en/snapshot-testing) to disk, when tests fail

## usage

copy [save-actual-snapshot-reporter.js](save-actual-snapshot-reporter.js) to your `test` folder

install `jest-snapshot`

```
npm install -D jest-snapshot
```

add to your `jest.config.js`

```js
  "reporters": [
    "default",
    "<rootDir>/save-actual-snapshot-reporter.js",
  ],
```

use jest's snapshot feature like

```js
// some-test.test.js

function sum(a, b) {
  return a + b;
}

test('some test', () => {
  const actualResult = sum(12, 34);
  expect(actualResult).toMatchSnapshot();
});
```

run `npm run test`

on the first run,
jest will save the expected snapshot to the `__snapshots__` folder

for example, `__snapshots__/some-test.test.js.snap` now contains

```js
// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`some test 1`] = `46`;
```

the ` 1` is appended by [toMatchSnapshot](https://jestjs.io/docs/en/expect#tomatchsnapshotpropertymatchers-hint).
this can be changed with the `hint` parameter like

```js
  expect(actualResult).toMatchSnapshot(, 'some better hint');
```

now change the test, for example

```diff
-  const actualResult = sum(12, 34);
+  const actualResult = sum(34, 56);
```

run `npm run test` again

for every failed test, the actual snapshot
will be saved in the `__snapshots__` folder

for example, `__snapshots__/some-test.test.js.actual.js` now contains

```js
// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`some test 1`] = `90`;
```

to compare expected result and actual result in your script, simply do

```js
const actualResultMap = require(
  './__snapshots__/some-test.test.js.actual.js');

const expectedResultMap = require(
  './__snapshots__/some-test.test.js.snap');

const snapshotId = 'some test 1';

const actualResult = actualResultMap[snapshotId];
const expectedResult = expectedResultMap[snapshotId];

console.dir({ snapshotId, actualResult, expectedResult });
```

const path = require('path');
const { saveSnapshotFile } = require('jest-snapshot/build/utils.js');

// jest-reporters/src/types.ts: interface Reporter
class SaveActualSnapshotReporter {
  onTestFileResult(test, testFileResult) {
    if (testFileResult.numFailingTests == 0) return;
    const actualSnapshotFile = path.join(
      path.dirname(test.path), '__snapshots__',
      path.basename(test.path) + '.actual.js');
    let actualSnapshotData = {};
    try { actualSnapshotData = require(actualSnapshotFile) }
    catch (e) { if (e.code != 'MODULE_NOT_FOUND') throw e }
    for (let i = 0; i < testFileResult.testResults.length; i++) {
      const testResult = testFileResult.testResults[i];
      if (testResult.status == 'passed') continue;
      for (let k = 0; k < testResult.failureDetails.length; k++) {
        const failureDetail = testResult.failureDetails[k];
        // get snapshot name from error message (dirty)
        const snapshotName = failureDetail.error.message
          .match(/Snapshot name: `([^`]+)`\n/)[1];
        const { matcherResult } = failureDetail.error;
        if (matcherResult.pass == true) continue;
        if (matcherResult.name == 'toMatchSnapshot') {
          actualSnapshotData[snapshotName] = matcherResult.actual;
    }}}
    console.log('write '+actualSnapshotFile);
    saveSnapshotFile(actualSnapshotData, actualSnapshotFile);
}}

module.exports = SaveActualSnapshotReporter;

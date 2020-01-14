const warnings = require('./mocks/warningsTest.js');
const grid = require('./mocks/gridTest.js');
const text = require('./mocks/textTest.js');
const { lint } = require('./autotest/nodetest');

const errorlist = [warnings, grid, text];
let tesType = '';
let status = '';

const autoTest = (arr1, arr2, tesType) => {
  if (arr1.length !== arr2.length) {
    return `LENGTH ERROR (${tesType})`;
  }
  for (let i = 0; i < arr1.length; i++) {
    test(`${tesType} пройден`, () => {
      expect(arr1[i].code).toContain(arr2[i].code);
      expect(arr1[i].error).toContain(arr2[i].error);
      expect(arr1[i].location.start.column).toEqual(arr2[i].location.start.column);
      expect(arr1[i].location.end.column).toEqual(arr2[i].location.end.column);
      expect(arr1[i].location.start.line).toEqual(arr2[i].location.start.line);
      expect(arr1[i].location.end.line).toEqual(arr2[i].location.end.line);
    });
  }
  return `SUCCESS (${tesType})`;
};

for (let i = 0; i < errorlist.length; i++) {
  if (i === 0) tesType = 'WarningAutoTest';
  if (i === 1) tesType = 'GridAutoTest';
  if (i === 2) tesType = 'TextAutoTest';
  status = autoTest(lint(errorlist[i].json), errorlist[i].errorsPrediction, tesType);
  if (status !== `SUCCESS (${tesType})`) break;
}

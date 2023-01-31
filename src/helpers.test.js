"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const helpers_1 = require("./helpers");
(0, globals_1.describe)("Function merge ojects", () => {
    (0, globals_1.it)("contains all keys", () => {
        const result = (0, helpers_1.mergeObjects)({ a: 1, b: 2 }, { c: 3 });
        (0, globals_1.expect)(result).toMatchObject({ a: 1, b: 2, c: 3 });
    });
    (0, globals_1.it)("o2 overrides o1 values", () => {
        const o1 = { a: 1, b: 2 };
        const result = (0, helpers_1.mergeObjects)(o1, { a: 3 });
        (0, globals_1.expect)(result).toMatchObject({ a: 3, b: 2 });
        (0, globals_1.expect)(o1).toMatchObject({ a: 1, b: 2 });
    });
});
(0, globals_1.describe)("Function days between", () => {
    (0, globals_1.it)("retruns 0 if dates are the same", () => {
        (0, globals_1.expect)((0, helpers_1.computeDaysBetween)(new Date(), new Date())).toBe(0);
    });
    (0, globals_1.it)("retruns 0 if dates are only 6 hours appart", () => {
        (0, globals_1.expect)((0, helpers_1.computeDaysBetween)(new Date(2022, 11, 20, 12), new Date(2022, 11, 20, 18))).toBe(0);
    });
    (0, globals_1.it)("retruns 1 if dates are 1 days appart", () => {
        (0, globals_1.expect)((0, helpers_1.computeDaysBetween)(new Date(2022, 11, 20), new Date(2022, 11, 21))).toBe(1);
    });
});

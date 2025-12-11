const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  moduleNameMapper: {
    '^@api$': '<rootDir>/src/utils/burger-api.ts',
    '^@utils-types$': '<rootDir>/src/utils/types.ts',
    '^@utils(.*)$': '<rootDir>/src/utils$1',
    '^@components(.*)$': '<rootDir>/src/components$1',
    '^@services(.*)$': '<rootDir>/src/services$1'
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  }
};

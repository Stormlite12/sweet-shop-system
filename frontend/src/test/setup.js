// src/test/setup.js
import '@testing-library/jest-dom'

// Simple mocks - no complex vi stuff
globalThis.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {}
}
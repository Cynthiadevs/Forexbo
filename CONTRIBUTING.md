# Contributing Guidelines

We welcome contributions to the Alpha Quant FX codebase!

## Development Workflow
1. Fork and clone the repository.
2. Ensure Node.js >= 18 is installed.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the end-to-end verification test suite:
   ```bash
   npm run test:e2e
   ```
5. Follow clean architecture principles and keep quantitative calculations deterministic and fully tested.

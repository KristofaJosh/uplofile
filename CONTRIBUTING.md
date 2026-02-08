# Contributing to Uplofile

Thank you for your interest in contributing to Uplofile! This document provides guidelines for contributing to this project.

## Development Environment

This project is a monorepo managed with [pnpm](https://pnpm.io/).

### Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/KristofaJosh/uplofile.git
    cd uplofile
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

## Project Structure

- `packages/uplofile`: The core library package.
- `app/doc`: The documentation website (built with Vite and React).

## Development Workflow

### Running the Documentation Site

To see your changes in action, you can run the documentation site locally:

```bash
pnpm run dev
```

This will start the documentation app, which typically links to the local version of the `uplofile` package.

### Building the Library

To build the `uplofile` package:

```bash
pnpm run build
```

### Running Tests

We use [Vitest](https://vitest.dev/) for testing. To run tests across all packages:

```bash
pnpm run test
```

To run tests only for the library:

```bash
cd packages/uplofile
pnpm run test
```

## Coding Standards

- **Formatting:** We use [Prettier](https://prettier.io/) for code formatting. You can run formatting check if needed, but it's recommended to have Prettier integrated into your editor.
- **TypeScript:** The project is written in TypeScript. Ensure your contributions have proper type definitions.
- **Tests:** Add or update tests for any new features or bug fixes.

## Pull Request Process

1.  Create a new branch for your feature or bug fix: `git checkout -b feat/your-feature-name` or `git checkout -b fix/your-bug-fix`.
2.  Make your changes and ensure they follow the coding standards.
3.  Ensure all tests pass.
4.  Commit your changes with descriptive commit messages.
5.  Push your branch to your fork and submit a Pull Request.

## License

By contributing to Uplofile, you agree that your contributions will be licensed under the MIT License.

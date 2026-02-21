# Uplofile
[![Used in production](https://img.shields.io/badge/used%20in-production-brightgreen)](#who-is-using-uplofile)

Composable file upload components for React.

Uplofile is actively maintained and constantly being improved.

## Philosophy

File uploads look like a UI problem, but most of their complexity lives elsewhere.

Real-world upload systems quickly involve concerns like network reliability, retries, resumable transfers, storage backends, security rules, and cost trade-offs. These are infrastructure decisions, not component decisions.

Uplofile is built around a simple idea:

Uploads are infrastructure concerns disguised as UI problems.

Instead of coupling upload mechanics to a specific engine, protocol, or backend, Uplofile focuses only on what React is uniquely good at:

- UI state management
- Lifecycle orchestration
- Composable primitives
- Predictable component behavior

Uplofile deliberately does not dictate:

- how files are transported
- which backend you use
- which protocol you adopt
- how retries or resumable logic work

You bring your own upload logic.

This separation allows Uplofile to remain:

- Backend-agnostic
- Protocol-agnostic
- Design-system friendly
- Fully composable

Whether your uploads use presigned URLs, multipart strategies, resumable protocols, or custom APIs, the library stays out of the way and lets your infrastructure decisions live in your application code where they belong.

Uplofile provides the UI and lifecycle building blocks.  
Your app defines what “uploading” means.

Documentation
- Full usage, API, and examples: [packages/uplofile/README.md](packages/uplofile/README.md)
- NPM: https://www.npmjs.com/package/uplofile
- Website: https://uplofile.kristofajosh.dev

## Contributing

Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to get started with local development and how to submit pull requests.

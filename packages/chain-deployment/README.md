## Chain Deployment
- configure the deployed project/package with the minimal configuration looking like [here](templates/config).
- create a `.env` file in the deployed project/package root, overriding config values like [here](templates/.env).
- create an `AUTH_DIR` to contain per-`NODE_ENV` (i.e. test, ..., livenet) directories
- for each `NODE_ENV` create a `secrets.json` file in the respective directory, containing config values like [here](templates/secrets.json)
- create a `deploy` script similar to [this](templates/deploy.js), to be executed via:
    ```bash
    $> NODE_ENV=<env> yarn deploy
    ```
- the resulting deployment artifacts will reside under the configured`<deploymentDir>/` directory

---
### Generating javascript source for contracts interaction
to support interaction with deployed contract, you can generate a correponding source files like so:
- create a `generate-contract-exports` script such as [this](templates/generate-contract-exports.js), to be executed via:
    ```bash
      $> yarn generate-contract-exports
    ```
- the resulting javascript files will reside under the `<deployed-project-root>/src/contracts/` directory



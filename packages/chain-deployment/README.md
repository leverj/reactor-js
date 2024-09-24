# fixme: revise Chain Deployment section

### config = {deployer: {privateKey}, deploymentDir,env, networks, contracts}

## Chain Deployment
- configure the deployed project/package with the minimal configuration looking like [here](config.js).
- config is [convict](https://github.com/mozilla/node-convict)-based configuration, so you can override values accordingly.
- create a `deploy` script similar to [this](.templates/deploy.js), to be executed via:
    ```bash
    $> NODE_ENV=<env> yarn deploy
    ```
- the resulting deployment artifacts will saved in `<deploymentDir>/chain/<env>/.evms.json`

---
### Generating javascript source for contracts interaction
to support interaction with deployed contract, you can generate a corresponding source files like so:
- create a `generate-contract-exports` script such as [this](.templates/generate-contract-exports.js), to be executed via:
    ```bash
      $> node scripts/generate-contract-exports
    ```
- the resulting javascript files will reside within `<process.env.PWD>/src/contracts/`



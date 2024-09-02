## Structuring Ignition Modules

Ignition deployments rely on a modular approach. Each module specifies one or more related actions that Ignition will
execute to deploy a set of contracts.

### Included Examples

The following examples are part of this repository. It's recommended to go through them sequentially for better
understanding:

- **Basic Contract Deployments**

    - [`contracts/BasicDeployments.sol`](../../../chain-deployment-buildbear/hardhat-ignition/contracts/BasicDeployments.sol)
    - [`ignition/BasicDeploymentsModule.js`](../../../chain-deployment-buildbear/hardhat-ignition/ignition/BasicDeploymentsModule.js)
    - [`test/BasicDeployments.spec.js`](../../../chain-deployment-buildbear/hardhat-ignition/test/BasicDeployments.js)

- **Deployment with Initialization**

    - [`contracts/DeploymentPlusInitialization.sol`](../../../chain-deployment-buildbear/hardhat-ignition/contracts/DeploymentPlusInitialization.sol)
    - [`ignition/DeploymentPlusInitializationModule.js`](../../../chain-deployment-buildbear/hardhat-ignition/ignition/DeploymentPlusInitializationModule.js)
    - [`test/DeploymentPlusInitialization.spec.js`](../../../chain-deployment-buildbear/hardhat-ignition/test/DeploymentPlusInitialization.js)

- **Factory-Deployed Contract**

    - [`contracts/ContractFactory.sol`](../../../chain-deployment-buildbear/hardhat-ignition/contracts/ContractFactory.sol)
    - [`ignition/ContractFactoryModule.js`](../../../chain-deployment-buildbear/hardhat-ignition/ignition/ContractFactoryModule.js)
    - [`test/ContractFactory.spec.js`](../../../chain-deployment-buildbear/hardhat-ignition/test/ContractFactory.js)

- **Contract Using a Library**

    - [`contracts/ContractWithLibrary.sol`](../../../chain-deployment-buildbear/hardhat-ignition/contracts/ContractWithLibrary.sol)
    - [`ignition/ContractWithLibraryModule.js`](../../../chain-deployment-buildbear/hardhat-ignition/ignition/ContractWithLibraryModule.js)
    - [`test/ContractWithLibrary.spec.js`](../../../chain-deployment-buildbear/hardhat-ignition/test/ContractWithLibrary.js)

- **Contract Capable of Receiving ETH**

    - [`contracts/ReceivesEth.sol`](../../../chain-deployment-buildbear/hardhat-ignition/contracts/ReceivesEth.sol)
    - [`ignition/ReceivesEthModule.js`](../../../chain-deployment-buildbear/hardhat-ignition/ignition/ReceivesEthModule.js)
    - [`test/ReceivesEth.spec.js`](../../../chain-deployment-buildbear/hardhat-ignition/test/ReceivesEth.js)

- **Using submodules**

    - [`ignition/SubmodulesExampleModule.js`](../../../chain-deployment-buildbear/hardhat-ignition/ignition/SubmodulesExampleModule.js)

## Deploying Modules

You can individually deploy each module by running the following command:

```shell
npx hardhat deploy ./ignition/<module_name>.js
```

Note: Deployments made using Hardhat Network's in-process version will not be stored persistently.

To persist your deployment data, utilize a separate network instance. For example, run `npx hardhat node` in one
terminal, and execute deployments with `--network localhost` in another.

# Symbol Wallet Lib

JavaScript SDK for interacting with the Symbol Extension Wallet.

[![npm package](https://img.shields.io/badge/npm%20i-symbol--wallet--lib-brightgreen)](https://www.npmjs.com/package/symbol-wallet-lib) [![version number](https://img.shields.io/npm/v/symbol-wallet-lib?color=green&label=version)](https://github.com/OlegMakarenko/symbol-wallet-lib/releases) [![Actions Status](https://github.com/OlegMakarenko/symbol-wallet-lib/workflows/Test/badge.svg)](https://github.com/OlegMakarenko/symbol-wallet-lib/actions) [![License](https://img.shields.io/github/license/OlegMakarenko/symbol-wallet-lib)](https://github.com/OlegMakarenko/symbol-wallet-lib/blob/main/LICENSE)

## Installation

Install the library as an npm package into your project.

```bash
npm install symbol-wallet-lib
```

## Usage

### Initialization and connection to wallet

Import `SymbolExtension` module from the package.

```js
import { SymbolExtension } from 'symbol-wallet-lib';
```

Create instance of `SymbolExtension` and register provider.
Once provider is registered, check if it's connected to the wallet.
Then you can start communication with the wallet.

```js
const symbolExtension = new SymbolExtension();
await symbolExtension.registerProvider();

if (symbolExtension.isConnected()) {
  console.log('Wallet is accessible and ready for communication');
}
```

### Sending a Transaction

To create transaction you can use [symbol-sdk](https://github.com/symbol/symbol/tree/dev/sdk/javascript).
Then the transaction needs to be serialized. Example with `symbol-sdk`:

```js
const transactionPayload = uint8ToHex(transaction.serialize());
```

Request transaction sending confirmation in the wallet.

```js
try {
  await symbolExtension.requestTransaction(transactionPayload);
  console.log('Transaction is waiting a user confirmation');
}
catch (error) {
  console.error(error);
}
```

### Getting an account info

Request account info permission. The promise resolves as soon as the request is delivered to the wallet.

```js
await symbolExtension.requestAccountPermission();
```

Request account info.

```js
try {
  const currentUserAccount = await symbolExtension.getAccountInfo();
  console.log(
    `User's public key: "${currentUserAccount.publicKey}`,
    `Network type: "${currentUserAccount.networkType}"`
  );
}
catch (error) {
  console.error(error);
}

```

Please note that it can take some time for the user to review and accept the request.
Calling `getAccountInfo()` without a user permission will be rejected with an error.

## Development
### Set up tools and environment

You need to have [Node.js](https://nodejs.org/en/download/) installed. Node includes npm as its default package manager.


### Install dependencies

Install dependencies with npm:

```bash
npm install
```

### Test

```bash
npm run test
```

### Build

Build production (distribution) files in **dist** folder:

```bash
npm run build
```

It generates CommonJS (in **dist/cjs** folder), ES Modules (in **dist/esm** folder), bundled and minified UMD (in **dist/umd** folder), as well as TypeScript declaration files (in **dist/types** folder).

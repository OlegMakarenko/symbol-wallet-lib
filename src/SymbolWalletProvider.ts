import { EventEmitter } from 'node:events';
export interface SymbolWalletProvider extends EventEmitter {
    isConnected: () => boolean;
    request: (options: { method: ProviderMethods; params?: Array<any> }) => Promise<any>;
}

export enum ProviderEventNames {
    accountChanged = 'accountChanged',
    chainChanged = 'chainChanged',
    connect = 'connect',
    disconnect = 'disconnect',
    message = 'message',
}

export enum ProviderMethods {
    requestPermission = 'requestPermission',
    requestTransaction = 'requestTransaction',
    getAccountInfo = 'getAccountInfo',
    getChainInfo = 'getChainInfo',
    getPermissions = 'getPermissions',
}

export enum ProviderPermissions {
    accountInfo = 'accountInfo',
}

export interface AccountInfo {
    publicKey: string;
    networkType: number;
}

export interface ChainInfo {
    networkType: number;
    networkIdentifier: 'mainnet' | 'testnet';
    generationHash: string;
}

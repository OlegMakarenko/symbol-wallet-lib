import { requestProvider } from './ProviderInjection';
import {
    AccountInfo,
    ChainInfo,
    ProviderEventNames,
    ProviderMethods,
    ProviderPermissions,
    SymbolWalletProvider,
} from './SymbolWalletProvider';

export class SymbolExtension {
    constructor(provider?: SymbolWalletProvider) {
        this._provider = provider;
    }

    private _provider?: SymbolWalletProvider;

    /**
     * Validates wether provider is registered.
     */
    private _validateProvider() {
        if (!this._provider) {
            throw Error('Provider is not registered.');
        }
    }

    /**
     * Requests the Symbol Wallet provider and register's it.
     */
    public registerProvider(): Promise<SymbolWalletProvider> {
        return new Promise((resolve) => {
            requestProvider((providerDetail) => {
                this._provider = providerDetail.provider;
                resolve(providerDetail.provider);
            });
        });
    }

    /**
     * Indicates whether the wallet is accessible and the provider is connected to the wallet.
     * If the provider isn't connected, the page must be reloaded to re-establish the connection.
     * Refer to whether the provider can make RPC requests to the wallet.
     */
    public isConnected(): boolean {
        if (!this._provider) {
            return false;
        }

        return this._provider.isConnected();
    }

    /**
     * Creates a new wallet confirmation to make a Symbol transaction from the user's account.
     */
    public async requestTransaction(transactionPayload: string): Promise<void> {
        this._validateProvider();
        await this._provider!.request({
            method: ProviderMethods.requestTransaction,
            params: [transactionPayload],
        });
    }

    /**
     * Requests additional permissions from the user to get value from "getAccountInfo()".
     */
    public async requestAccountPermission(): Promise<void> {
        this._validateProvider();
        this._provider!.request({
            method: ProviderMethods.requestPermission,
            params: [ProviderPermissions.accountInfo],
        });
    }

    /**
     * Returns a currently selected user account.
     * This method requires user's permission.
     * Request permission by calling requestAccountPermission().
     */
    public async getAccountInfo(): Promise<AccountInfo | null> {
        this._validateProvider();
        const accountInfo = (await this._provider!.request({
            method: ProviderMethods.getAccountInfo,
        })) as AccountInfo;

        if (!accountInfo.publicKey) {
            return null;
        }

        return accountInfo;
    }

    /**
     * Returns a currently connected Symbol chain info
     * or null if the wallet is not connected to the network (or switching a network).
     */
    public async getChainInfo(): Promise<ChainInfo | null> {
        this._validateProvider();
        const chainInfo = (await this._provider!.request({
            method: ProviderMethods.getChainInfo,
        })) as ChainInfo;

        if (!chainInfo.generationHash) {
            return null;
        }

        return chainInfo;
    }

    /**
     * Returns a list of permissions granted to the dApp/website.
     */
    public async getPermissions(): Promise<Array<ProviderPermissions>> {
        this._validateProvider();
        return this._provider!.request({
            method: ProviderMethods.getPermissions,
        }) as Promise<Array<ProviderPermissions>>;
    }

    /**
     * Sets up a function that will be called whenever the account is switched by the user.
     */
    public addAccountInfoListener(callback: () => void) {
        this._validateProvider();
        this._provider!.on(ProviderEventNames.accountChanged, callback);
    }

    /**
     * Removes an event listener previously registered with "addAccountInfoListener()".
     */
    public removeAccountInfoListener(callback: (accountInfo: AccountInfo) => void) {
        this._validateProvider();
        this._provider!.removeListener(ProviderEventNames.accountChanged, callback);
    }

    /**
     * Sets up a function that will be called whenever the network is switched.
     */
    public addChainInfoListener(callback: (accountInfo: ChainInfo) => void) {
        this._validateProvider();
        this._provider!.on(ProviderEventNames.chainChanged, callback);
    }

    /**
     * Removes an event listener previously registered with "addChainInfoListener()".
     */
    public removeChainInfoListener(callback: (accountInfo: ChainInfo) => void) {
        this._validateProvider();
        this._provider!.removeListener(ProviderEventNames.chainChanged, callback);
    }

    /**
     * Sets up a function that will be called whenever the wallet is connected.
     */
    public addConnectListener(callback: () => void) {
        this._validateProvider();
        this._provider!.on(ProviderEventNames.connect, callback);
    }

    /**
     * Removes an event listener previously registered with "addConnectListener()".
     */
    public removeConnectListener(callback: () => void) {
        this._validateProvider();
        this._provider!.removeListener(ProviderEventNames.connect, callback);
    }

    /**
     * Sets up a function that will be called whenever the wallet is disconnected.
     */
    public addDisconnectListener(callback: () => void) {
        this._validateProvider();
        this._provider!.on(ProviderEventNames.disconnect, callback);
    }

    /**
     * Removes an event listener previously registered with "addDisconnectListener()".
     */
    public removeDisconnectListener(callback: () => void) {
        this._validateProvider();
        this._provider!.removeListener(ProviderEventNames.disconnect, callback);
    }
}

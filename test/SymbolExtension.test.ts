import { SymbolExtension } from '../src/SymbolExtension';
import { ProviderEventNames, SymbolWalletProvider } from '../src/SymbolWalletProvider';
import * as ProviderInjection from '../src/ProviderInjection';

const getProviderMock = (request = jest.fn()) => ({
    request,
    on: jest.fn(),
    removeListener: jest.fn(),
    isConnected: () => true,
});

describe('Symbol Extension', () => {
    describe('provider registration', () => {
        it('throws error when request RPC using unregistered provider', async () => {
            // Arrange:
            const symbolExtension = new SymbolExtension();

            // Act:
            const promise = symbolExtension.getPermissions();

            // Assert:
            await expect(promise).rejects.toThrow(Error('Provider is not registered.'));
            expect(symbolExtension.isConnected()).toBe(false);
        });

        it('registers provider when call registerProvider()', async () => {
            // Arrange:
            const providerDetail = {
                provider: {
                    isConnected: () => true,
                    request: jest.fn(),
                },
            };
            jest.spyOn(ProviderInjection, 'requestProvider').mockImplementation((handleProvider) =>
                handleProvider(providerDetail as unknown as ProviderInjection.ProviderDetail),
            );
            const symbolExtension = new SymbolExtension();
            const registeredProvider = await symbolExtension.registerProvider();

            // Act:
            const promise = symbolExtension.getPermissions();

            // Assert:
            await expect(promise).resolves.toBeUndefined();
            expect(symbolExtension.isConnected()).toBe(true);
            expect(registeredProvider).toBe(providerDetail.provider);
        });
    });

    describe('requestTransaction()', () => {
        it('resolved void', async () => {
            // Arrange:
            const provider = getProviderMock();
            const symbolExtension = new SymbolExtension(provider as unknown as SymbolWalletProvider);

            // Act:
            const result = await symbolExtension.requestTransaction('abc');

            // Assert:
            expect(result).toBeUndefined();
            expect(provider.request).toHaveBeenCalledWith({ method: 'requestTransaction', params: ['abc'] });
            expect(provider.request).toHaveBeenCalledTimes(1);
        });
    });

    describe('getAccountInfo()', () => {
        it('resolves account info if wallet returns public key', async () => {
            // Arrange:
            const accountInfo = {
                publicKey: 'abc',
                networkType: 123,
            };
            const provider = getProviderMock(jest.fn().mockResolvedValue(accountInfo));
            const symbolExtension = new SymbolExtension(provider as unknown as SymbolWalletProvider);

            // Act:
            const result = await symbolExtension.getAccountInfo();

            // Assert:
            expect(result).toEqual(accountInfo);
            expect(provider.request).toHaveBeenCalledWith({ method: 'getAccountInfo' });
            expect(provider.request).toHaveBeenCalledTimes(1);
        });

        it('resolves null if wallet returns null', async () => {
            // Arrange:
            const accountInfo = {
                publicKey: null,
                networkType: null,
            };
            const provider = getProviderMock(jest.fn().mockResolvedValue(accountInfo));
            const symbolExtension = new SymbolExtension(provider as unknown as SymbolWalletProvider);

            // Act:
            const result = await symbolExtension.getAccountInfo();

            // Assert:
            expect(result).toBeNull();
            expect(provider.request).toHaveBeenCalledWith({ method: 'getAccountInfo' });
            expect(provider.request).toHaveBeenCalledTimes(1);
        });
    });
    describe('getAccountInfo()', () => {
        it('resolves account info if wallet returns public key', async () => {
            // Arrange:
            const chainInfo = {
                networkType: 123,
                networkIdentifier: 'mainnet',
                generationHash: 'abc',
            };
            const provider = getProviderMock(jest.fn().mockResolvedValue(chainInfo));
            const symbolExtension = new SymbolExtension(provider as unknown as SymbolWalletProvider);

            // Act:
            const result = await symbolExtension.getChainInfo();

            // Assert:
            expect(result).toEqual(chainInfo);
            expect(provider.request).toHaveBeenCalledWith({ method: 'getChainInfo' });
            expect(provider.request).toHaveBeenCalledTimes(1);
        });

        it('resolves null if wallet returns null', async () => {
            // Arrange:
            const chainInfo = {
                networkType: null,
                networkIdentifier: null,
                generationHash: null,
            };
            const provider = getProviderMock(jest.fn().mockResolvedValue(chainInfo));
            const symbolExtension = new SymbolExtension(provider as unknown as SymbolWalletProvider);

            // Act:
            const result = await symbolExtension.getChainInfo();

            // Assert:
            expect(result).toBeNull();
            expect(provider.request).toHaveBeenCalledWith({ method: 'getChainInfo' });
            expect(provider.request).toHaveBeenCalledTimes(1);
        });
    });

    describe('requestAccountPermission()', () => {
        it('resolved void', async () => {
            // Arrange:
            const provider = getProviderMock();
            const symbolExtension = new SymbolExtension(provider as unknown as SymbolWalletProvider);

            // Act:
            const result = await symbolExtension.requestAccountPermission();

            // Assert:
            expect(result).toBeUndefined();
            expect(provider.request).toHaveBeenCalledWith({ method: 'requestPermission', params: ['accountInfo'] });
            expect(provider.request).toHaveBeenCalledTimes(1);
        });
    });

    describe('getPermissions()', () => {
        it('resolves permission list', async () => {
            // Arrange:
            const permissionList = ['accountInfo'];
            const provider = getProviderMock(jest.fn().mockResolvedValue(permissionList));
            const symbolExtension = new SymbolExtension(provider as unknown as SymbolWalletProvider);

            // Act:
            const result = await symbolExtension.getPermissions();

            // Assert:
            expect(result).toEqual(permissionList);
            expect(provider.request).toHaveBeenCalledWith({ method: 'getPermissions' });
            expect(provider.request).toHaveBeenCalledTimes(1);
        });
    });

    describe('listeners', () => {
        const runListenerTest = (
            mode: 'add' | 'remove',
            eventName: string,
            listener: jest.Func,
            methodCall: (p: SymbolExtension) => void,
        ) => {
            // Arrange:
            const provider = getProviderMock(jest.fn());
            const symbolExtension = new SymbolExtension(provider as unknown as SymbolWalletProvider);

            // Act:
            methodCall(symbolExtension);

            // Assert:
            if (mode === 'add') {
                expect(provider.on).toHaveBeenCalledWith(eventName, listener);
            }
            if (mode === 'remove') {
                expect(provider.removeListener).toHaveBeenCalledWith(eventName, listener);
            }
        };

        it('addAccountInfoListener()', async () => {
            // Arrange:
            const listener = jest.fn();

            // Act & Assert:
            runListenerTest('add', ProviderEventNames.accountChanged, listener, (symbolExtension) =>
                symbolExtension.addAccountInfoListener(listener),
            );
        });

        it('removeAccountInfoListener()', async () => {
            // Arrange:
            const listener = jest.fn();

            // Act & Assert:
            runListenerTest('remove', ProviderEventNames.accountChanged, listener, (symbolExtension) =>
                symbolExtension.removeAccountInfoListener(listener),
            );
        });

        it('addAccountInfoListener()', async () => {
            // Arrange:
            const listener = jest.fn();

            // Act & Assert:
            runListenerTest('add', ProviderEventNames.chainChanged, listener, (symbolExtension) =>
                symbolExtension.addChainInfoListener(listener),
            );
        });

        it('removeAccountInfoListener()', async () => {
            // Arrange:
            const listener = jest.fn();

            // Act & Assert:
            runListenerTest('remove', ProviderEventNames.chainChanged, listener, (symbolExtension) =>
                symbolExtension.removeChainInfoListener(listener),
            );
        });

        it('addConnectListener()', async () => {
            // Arrange:
            const listener = jest.fn();

            // Act & Assert:
            runListenerTest('add', ProviderEventNames.connect, listener, (symbolExtension) => symbolExtension.addConnectListener(listener));
        });

        it('removeConnectListener()', async () => {
            // Arrange:
            const listener = jest.fn();

            // Act & Assert:
            runListenerTest('remove', ProviderEventNames.connect, listener, (symbolExtension) =>
                symbolExtension.removeConnectListener(listener),
            );
        });

        it('addDisconnectListener()', async () => {
            // Arrange:
            const listener = jest.fn();

            // Act & Assert:
            runListenerTest('add', ProviderEventNames.disconnect, listener, (symbolExtension) =>
                symbolExtension.addDisconnectListener(listener),
            );
        });

        it('removeDisconnectListener()', async () => {
            // Arrange:
            const listener = jest.fn();

            // Act & Assert:
            runListenerTest('remove', ProviderEventNames.disconnect, listener, (symbolExtension) =>
                symbolExtension.removeDisconnectListener(listener),
            );
        });
    });
});

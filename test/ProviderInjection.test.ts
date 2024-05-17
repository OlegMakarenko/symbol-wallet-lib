import { ProvideInjectionEventNames, ProviderDetail, requestProvider } from '../src/ProviderInjection';

const announceProvider = (providerDetail: ProviderDetail) => {
    const { info, provider } = providerDetail;

    const _announceProvider = () =>
        window.dispatchEvent(
            new CustomEvent(ProvideInjectionEventNames.announce, {
                detail: Object.freeze({ info: { ...info }, provider }),
            }),
        );

    _announceProvider();
    window.addEventListener(ProvideInjectionEventNames.request, () => {
        _announceProvider();
    });
};

const getProviderInfo = () => ({
    uuid: '350670db-19fa-4704-a166-e52e178b59d2',
    name: 'Example Wallet',
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>',
    rdns: 'com.example.wallet',
});

const delay = async (ms = 1) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

describe('Provider Injection', () => {
    it('registers provider when it is initialized before dapp', async () => {
        // Arrange:
        const provider: any = { name: 'test' };
        const providerDetail = { info: getProviderInfo(), provider };
        const handleProvider = jest.fn();
        const dispatchEvent = jest.spyOn(window, 'dispatchEvent');
        const addEventListener = jest.spyOn(window, 'addEventListener');

        // Act:
        announceProvider(providerDetail);
        requestProvider(handleProvider);
        await delay();

        // Assert:
        expect(dispatchEvent).toHaveBeenCalledTimes(3);
        expect(dispatchEvent).toHaveBeenNthCalledWith(1, new CustomEvent('symbol:announceProvider'));
        expect(dispatchEvent).toHaveBeenNthCalledWith(2, new Event('symbol:requestProvider'));
        expect(dispatchEvent).toHaveBeenNthCalledWith(3, new CustomEvent('symbol:announceProvider'));

        expect(addEventListener).toHaveBeenCalledTimes(2);
        expect(addEventListener).toHaveBeenCalledWith('symbol:announceProvider', expect.any(Function));
        expect(addEventListener).toHaveBeenCalledWith('symbol:requestProvider', expect.any(Function));

        expect(handleProvider).toHaveBeenCalledTimes(1);
        expect(handleProvider).toHaveBeenCalledWith({
            info: getProviderInfo(),
            provider,
        });
    });

    it('registers provider when dapp is initialized before provider', async () => {
        // Arrange:
        const provider: any = { name: 'test' };
        const providerDetail = { info: getProviderInfo(), provider };
        const handleProvider = jest.fn();
        const dispatchEvent = jest.spyOn(window, 'dispatchEvent');
        const addEventListener = jest.spyOn(window, 'addEventListener');

        // Act:
        requestProvider(handleProvider);
        announceProvider(providerDetail);
        await delay();

        // Assert:
        expect(dispatchEvent).toHaveBeenCalledTimes(2);
        expect(dispatchEvent).toHaveBeenNthCalledWith(1, new Event('symbol:requestProvider'));
        expect(dispatchEvent).toHaveBeenNthCalledWith(2, new CustomEvent('symbol:announceProvider'));

        expect(addEventListener).toHaveBeenCalledTimes(2);
        expect(addEventListener).toHaveBeenCalledWith('symbol:announceProvider', expect.any(Function));
        expect(addEventListener).toHaveBeenCalledWith('symbol:requestProvider', expect.any(Function));

        expect(handleProvider).toHaveBeenCalledTimes(1);
        expect(handleProvider).toHaveBeenCalledWith({
            info: getProviderInfo(),
            provider,
        });
    });
});

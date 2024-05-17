import { isObject } from './utils';
import { SymbolWalletProvider } from './SymbolWalletProvider';

/**
 * Represents the assets needed to display and identify a wallet.
 *
 * @type ProviderInfo
 * @property uuid - A locally unique identifier for the wallet. MUST be a v4 UUID.
 * @property name - The name of the wallet.
 * @property icon - The icon for the wallet. MUST be data URI.
 * @property rdns - The reverse syntax domain name identifier for the wallet.
 */
export type ProviderInfo = {
    uuid: string;
    name: string;
    icon: string;
    rdns: string;
};

/**
 * Represents a provider and the information relevant for the dapp.
 *
 * @type ProviderDetail
 * @property info - The ProviderInfo object.
 * @property provider - The provider instance.
 */
export type ProviderDetail = {
    info: ProviderInfo;
    provider: SymbolWalletProvider;
};

/**
 * Event for requesting a provider.
 *
 * @type RequestProviderEvent
 * @property type - The name of the event.
 */
export type RequestProviderEvent = Event & {
    type: ProvideInjectionEventNames.request;
};

/**
 * Event for announcing a provider.
 *
 * @type RequestProviderEvent
 * @property type - The name of the event.
 * @property detail - The detail object of the event.
 */
export type AnnounceProviderEvent = CustomEvent & {
    type: ProvideInjectionEventNames.announce;
    detail: ProviderDetail;
};

export enum ProvideInjectionEventNames {
    announce = 'symbol:announceProvider',
    request = 'symbol:requestProvider',
    initialized = 'symbol:initialized',
}

/**
 * Intended to be used by a dapp. Forwards every announced provider to the
 * provided handler by listening for * {@link AnnounceProviderEvent},
 * and dispatches an {@link RequestProviderEvent}.
 *
 * @param handleProvider - A function that handles an announced provider.
 */
export const requestProvider = <HandlerReturnType>(handleProvider: (providerDetail: ProviderDetail) => HandlerReturnType): void => {
    window.addEventListener(ProvideInjectionEventNames.announce, (event) => {
        if (!isValidAnnounceProviderEvent(event as AnnounceProviderEvent)) {
            throw Error(`Invalid AnnounceProviderEvent object received from ${ProvideInjectionEventNames.announce} event.`);
        }
        handleProvider((event as AnnounceProviderEvent).detail);
    });

    window.dispatchEvent(new Event(ProvideInjectionEventNames.request));
};

/**
 * Validates an {@link AnnounceProviderEvent} object.
 *
 * @param event - The {@link AnnounceProviderEvent} to validate.
 * @returns Whether the {@link AnnounceProviderEvent} is valid.
 */
const isValidAnnounceProviderEvent = (event: AnnounceProviderEvent) =>
    event instanceof CustomEvent &&
    event.type === ProvideInjectionEventNames.announce &&
    Object.isFrozen(event.detail) &&
    isValidProviderDetail(event.detail);

/**
 * Validates a ProviderDetail object.
 *
 * @param providerDetail - The ProviderDetail to validate.
 * @returns Whether the ProviderDetail is valid.
 */
export const isValidProviderDetail = (providerDetail: ProviderDetail) => {
    if (!isObject(providerDetail) || !isObject(providerDetail.info) || !isObject(providerDetail.provider)) {
        return false;
    }
    const { info } = providerDetail;
    // https://github.com/thenativeweb/uuidv4/blob/bdcf3a3138bef4fb7c51f389a170666f9012c478/lib/uuidv4.ts#L5
    const UUID_V4_REGEX = /(?:^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[a-f0-9]{4}-[a-f0-9]{12}$)|(?:^0{8}-0{4}-0{4}-0{4}-0{12}$)/u;
    // https://stackoverflow.com/a/20204811
    const FQDN_REGEX = /(?=^.{4,253}$)(^((?!-)[a-zA-Z0-9-]{0,62}[a-zA-Z0-9]\.)+[a-zA-Z]{2,63}$)/u;

    return (
        typeof info.uuid === 'string' &&
        UUID_V4_REGEX.test(info.uuid) &&
        typeof info.name === 'string' &&
        Boolean(info.name) &&
        typeof info.icon === 'string' &&
        info.icon.startsWith('data:image') &&
        typeof info.rdns === 'string' &&
        FQDN_REGEX.test(info.rdns)
    );
};

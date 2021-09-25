import { AuthenticationError } from '@auth0/auth0-spa-js/dist/typings/errors';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';
import { AccountInfo } from '../plugins/auth/accountInfo';

declare module 'vue/types/vue' {
  interface Vue {
    $style: {
      [key: string]: string;
    };
    $auth: {
      error: typeof AuthenticationError | null;
      isAuthenticated: boolean;
      loading: boolean;
      popupOpen: boolean;
      auth0Client: Auth0Client | null;
      loginWithPopup(
        options?: PopupLoginOptions,
        config?: PopupConfigOptions
      ): Promise<void>;
      handleRedirectCallback(): Promise<void>;
      loginWithRedirect(options?: RedirectLoginOptions): Promise<void>;
      getIdTokenClaims(
        options?: getIdTokenClaimsOptions
      ): Promise<IdToken | undefined>;
      getTokenSilently(options?: GetTokenSilentlyOptions): Promise<any>;
      getTokenWithPopup(
        options?: GetTokenWithPopupOptions,
        config?: PopupConfigOptions
      ): Promise<string>;
      getToken(
        getTokenSilentlyOptions?: GetTokenSilentlyOptions,
        redirectLoginOptions?: RedirectLoginOptions
      ): Promise<any | void>;
      getUser(): Promise<AccountInfo>;
      logout(options?: LogoutOptions): Promise<void>;
    };
  }
}

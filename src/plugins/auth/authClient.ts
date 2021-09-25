import Vue from 'vue';

import createAuth0Client from '@auth0/auth0-spa-js';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';
import AuthenticationError from '@auth0/auth0-spa-js/dist/typings/errors';
import {
  Auth0ClientOptions,
  PopupLoginOptions,
  PopupConfigOptions,
  RedirectLoginOptions,
  getIdTokenClaimsOptions,
  GetTokenSilentlyOptions,
  IdToken,
  LogoutOptions,
  GetTokenWithPopupOptions
} from '@auth0/auth0-spa-js/dist/typings/global';
import { AccountInfo } from '@/plugins/auth/accountInfo';

const CREATE_CLIENT_TIMEOUT = 30000;

const DEFAULT_REDIRECT_CALLBACK = () =>
  window.history.replaceState({}, document.title, window.location.pathname);

export const getInstance = () => AuthClient.Instance({});

export default class AuthClient {
  private static _instance: Vue;

  /**
   * Instance returns a singleton instance.
   */
  public static Instance({
    onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
    redirectUri = window.location.href,
    ...options
  }: Partial<
    {
      onRedirectCallback: (
        data: any,
        title?: string,
        url?: string | null
      ) => void;
      redirectUri: string;
    } & Auth0ClientOptions
  >): Vue {
    if (!this._instance) {
      this._instance = new Vue({
        data(): {
          user?: AccountInfo;
          error: typeof AuthenticationError | null;
          isAuthenticated: boolean;
          loading: boolean;
          popupOpen: boolean;
          auth0Client: Auth0Client | null;
        } {
          return {
            user: {} as AccountInfo,
            error: null,
            isAuthenticated: false,
            loading: true,
            popupOpen: false,
            auth0Client: null
          };
        },
        async created() {
          this.auth0Client = await createAuth0Client({
            domain: options.domain ? options.domain : '',
            client_id: options.clientId ? options.clientId : '',
            audience: options ? options.audience : undefined,
            redirect_uri: redirectUri,
            disable_signup: options ? options.disableSignUp : undefined
          });

          try {
            if (window.location.search.includes('state=')) {
              const {
                appState
              } = await this.auth0Client.handleRedirectCallback();
              onRedirectCallback(appState);
            }
          } catch (e) {
            this.error = e;
          } finally {
            this.isAuthenticated = await this.auth0Client.isAuthenticated();
            this.user = await this.auth0Client.getUser();
            this.loading = false;
          }
        },
        methods: {
          /**
           * ```js
           * await auth0.loginWithPopup(options);
           * ```
           *
           * Opens a popup with the `/authorize` URL using the parameters
           * provided as arguments. Random and secure `state` and `nonce`
           * parameters will be auto-generated. If the response is successful,
           * results will be valid according to their expiration times.
           *
           * IMPORTANT: This method has to be called from an event handler
           * that was started by the user like a button click, for example,
           * otherwise the popup will be blocked in most browsers.
           *
           * @param options
           * @param config
           */
          async loginWithPopup(
            options?: PopupLoginOptions,
            config?: PopupConfigOptions
          ): Promise<void> {
            const auth0Client = await this.getAuth0Client();
            if (auth0Client == null) return;

            this.popupOpen = true;
            try {
              await auth0Client.loginWithPopup(options, config);
            } catch (e) {
              // auth0 error
            } finally {
              this.popupOpen = false;
            }

            this.user = await auth0Client.getUser();
            this.isAuthenticated = true;
          },
          /**
           * After the browser redirects back to the callback page,
           * call `handleRedirectCallback` to handle success and error
           * responses from Auth0. If the response is successful, results
           * will be valid according to their expiration times.
           */
          async handleRedirectCallback(): Promise<void> {
            const auth0Client = await this.getAuth0Client();
            if (auth0Client == null) return;

            this.loading = true;
            try {
              await auth0Client.handleRedirectCallback();
              this.user = await auth0Client.getUser();
              this.isAuthenticated = true;
            } catch (e) {
              this.error = e;
            } finally {
              this.loading = false;
            }
          },
          /**
           * After the browser redirects back to the callback page,
           * call `handleRedirectCallback` to handle success and error
           * responses from Auth0. If the response is successful, results
           * will be valid according to their expiration times.
           *
           * @param options
           */
          async loginWithRedirect(
            options?: RedirectLoginOptions
          ): Promise<void> {
            const auth0Client = await this.getAuth0Client();
            if (auth0Client == null) return;

            return auth0Client.loginWithRedirect(options);
          },
          /**
           *
           * @param options
           */
          async getIdTokenClaims(
            options?: getIdTokenClaimsOptions
          ): Promise<IdToken | undefined> {
            const auth0Client = await this.getAuth0Client();
            if (auth0Client == null) return;

            return auth0Client.getIdTokenClaims(options);
          },
          /**
           *
           * @param options
           */
          async getTokenSilently(
            options?: GetTokenSilentlyOptions
          ): Promise<any> {
            const auth0Client = await this.getAuth0Client();
            if (auth0Client == null) return;

            return auth0Client.getTokenSilently(options);
          },
          /**
           *
           * @param options
           * @param config
           */
          async getTokenWithPopup(
            options?: GetTokenWithPopupOptions,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            config?: PopupConfigOptions
          ): Promise<string> {
            const auth0Client = await this.getAuth0Client();
            if (auth0Client == null) return '';
            return auth0Client.getTokenWithPopup(options);
          },
          /**
           *
           * @param getTokenSilentlyOptions
           * @param redirectLoginOptions
           */
          async getToken(
            getTokenSilentlyOptions?: GetTokenSilentlyOptions,
            redirectLoginOptions?: RedirectLoginOptions
          ): Promise<any | void> {
            const auth0Client = await this.getAuth0Client();
            if (auth0Client == null) return;
            try {
              return await auth0Client.getTokenSilently(
                getTokenSilentlyOptions
              );
            } catch (error) {
              return await auth0Client.loginWithRedirect(redirectLoginOptions);
            }
          },
          /**
           *
           * @param options
           */
          async logout(options?: LogoutOptions): Promise<void> {
            const auth0Client = await this.getAuth0Client();
            if (auth0Client == null) return;
            return auth0Client.logout(options);
          },
          async getAuth0Client(): Promise<Auth0Client | null> {
            return new Promise(resolve => {
              const startTime = new Date().getTime();
              const interval = setInterval(() => {
                if (this.auth0Client != null) {
                  resolve(this.auth0Client);
                  clearInterval(interval);
                  return;
                }
                const now = new Date().getTime();
                if (now - startTime > CREATE_CLIENT_TIMEOUT) {
                  resolve(null);
                  clearInterval(interval);
                }
              }, 200);
            });
          },
          async getUser(): Promise<AccountInfo> {
            return new Promise(resolve => {
              const interval = setInterval(() => {
                if (!this.loading && this.user != undefined) {
                  resolve(this.user);
                  clearInterval(interval);
                }
              }, 200);
            });
          }
        }
      });
    }
    return this._instance;
  }
}

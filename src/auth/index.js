import Vue from "vue";
import createAuth0Client from "@auth0/auth0-spa-js";

// A ação padrão depois de autenticado
const DEFAULT_REDIRECT_CALLBACK = () =>
    window.history.replaceState({}, document.title, window.location.pathname);

let instance;

// Retorna a atual instância do SDK
export const getInstance = () => instance;

// Cria uma instância do Auth0 SDK
export const useAuth0 = ({
    onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
    redirectUri = window.location.origin,
    ...options
}) => {
    // Se a instância já foi criada, retorna a instância
    if (instance) return instance;

    // Cria a instância, um objeto Vue
    instance = new Vue({
        data() {
            return {
                loading: true,
                isAuthenticated: false,
                user: {},
                auth0Client: null,
                popupOpen: false,
                error: null,
            };
        },
        methods: {
            // Autenticação por janela popup
            async loginWithPopup(o) {
                this.popupOpen = true;

                try {
                    await this.auth0Client.loginWithPopup(o);
                } catch (e) {
                    console.error(e);
                } finally {
                    this.popupOpen = false;
                }

                this.user = await this.auth0Client.getUser();
                this.isAuthenticated = true;
            },

            async handleRedirectCallback() {
                this.loading = true;

                try {
                    await this.auth0Client.handleRedirectCallback();
                    this.user = await this.auth0Client.getUser();
                    this.isAuthenticated = true;
                } catch (e) {
                    this.error = e;
                } finally {
                    this.loading = false;
                }
            },

            // Autenticação por redirect
            loginWithRedirect(o) {
                return this.auth0Client.loginWithRedirect(o);
            },

            getIdTokenClaims(o) {
                return this.auth0Client.getIdTokenClaims(o);
            },

            // Retorna o token de acesso
            getTokenSilently(o) {
                return this.auth0Client.getTokenSilently(o);
            },

            // Retorna o token com uma janela popup
            getTokenWithPopup(o) {
                return this.auth0Client.getTokenWithPopup(o);
            },

            logout(o) {
                return this.auth0Client.logout(o);
            },
        },

        async created() {
            // Cria uma instância do SDK
            this.auth0Client = await createAuth0Client({
                domain: options.domain,
                client_id: options.clientId,
                audience: options.audience,
                redirect_uri: redirectUri,
            });

            try {
                // Se o usuário está retornando para a aplicação depois de autenticado
                if (
                    window.location.search.includes("code=") &&
                    window.location.search.includes("state=")
                ) {
                    // Estado da autenticação
                    const {
                        appState,
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
    });

    return instance;
};

// Cria um plugin Vue
export const Auth0Plugin = {
    install(Vue, options) {
        Vue.prototype.$auth = useAuth0(options);
    },
};

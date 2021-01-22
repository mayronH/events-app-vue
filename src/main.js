import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "bulma/css/bulma.css";

// Importa as configurações para o Auth0
import { domain, clientId } from "../auth_config.json";

// Importa o plugin criado em auth/index.js
import { Auth0Plugin } from "./auth";

// Permite o acesso ao plugin globalmente
Vue.use(Auth0Plugin, {
    domain,
    clientId,
    onRedirectCallback: appState => {
        router.push(
            appState && appState.targetUrl ? appState.targetUrl : window.location.pathname
        )
    }
})

Vue.config.productionTip = false;

new Vue({
    router,
    render: (h) => h(App),
}).$mount("#app");

// Permite um usuário autenticado entrar em determinadas rotas
import { getInstance } from "./index";

export const authGuard = (to, from, next) => {
    const authService = getInstance();

    const fn = () => {
        // Se o usuário é autenticado continua com a requisição
        if (authService.isAuthenticated) {
            return next();
        }
        // Se não, redireciona para o login
        authService.loginWithRedirect({ appState: { targetUrl: to.fullPath } })
    }

    // Se o login já aconteceu checa o estado da autenticação
    if(!authService.loading) {
        return fn();
    }

    authService.$watch("loading", loading => {
        if(loading == false){
            return fn();
        }
    })
}
import RelatorioAnualUsuario from './view/RelatorioAnualUsuarioView.vue'

export default [
    { 
        path: '/relatorioAnualUsuario', 
        name: 'RelatorioAnualUsuario',
        component: RelatorioAnualUsuario,
        meta: { requiresAuth: true }
    }
]
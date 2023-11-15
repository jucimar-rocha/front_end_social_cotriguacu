import ListaRelatorioAnual from './view/ListaRelatorioAnualView.vue'

export default [
    { 
        path: '/listaRelatorioAnual', 
        name: 'ListaRelatorioAnual',
        component: ListaRelatorioAnual,
        meta: { requiresAuth: true }
    }
]
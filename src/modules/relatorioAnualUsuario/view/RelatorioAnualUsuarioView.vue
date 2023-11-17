<template>
    <div>
        <h1>Teste</h1>
    </div>
</template>

<script>
import { useRelatorioAnualUsuarioStore } from '../store'

export default {
    components: {
       
    },
    data: () => ({
        relatorioAnual: [],
    }),   
    mounted() {
        this.buscarLista();
    },
    methods: {
        buscarLista() {
        const store = useRelatorioAnualUsuarioStore();
        store.buscarRelatorioAnual();
        }
    },
}
</script>

<style scoped>

</style>
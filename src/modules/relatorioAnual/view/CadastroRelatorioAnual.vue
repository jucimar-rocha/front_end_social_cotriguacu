<template>
    <div>
        <v-dialog v-model="dialog" persistent max-width="800">
            <template v-slot:activator="{ props }">
                <v-btn color="primary" rounded="lg" v-bind="props" prepend-icon="mdi-plus" size="small" @click="relatorioAnual = {}">
                    Cadastrar
                </v-btn>
            </template>

            <v-card>
                <v-card-title>
                    <span class="text-h5">Cadastrar</span>
                    <v-btn class="float-right" density="compact" variant="text" icon="mdi-close-thick"
                        @click="dialog = false" />
                </v-card-title>
                <v-divider />

                <v-card-text>
                    <v-container>
                        <v-form ref="form" @submit.prevent :disabled="disabledForm" validate-on="blur">
                            <FormularioCadastroRelatorioAnualView />
                        </v-form>
                    </v-container>
                    <small>*Campos Obrigatórios</small>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn v-if="!disabledForm" color="red-darken-1" variant="outlined">
                        Fechar
                        <ConfirmationDialog :titulo="'Fechar Tela Cadastro'"
                            :mensagem="'Deseja realmente fechar a tela de cadastro ? Todos os dados inseridos/alterados serão perdidos. '"
                            @confirmar="fechar" />
                    </v-btn>
                    <v-btn v-if="!disabledForm" color="blue-darken-1" variant="outlined" @click="salvar">
                        Salvar
                    </v-btn>
                    <v-btn v-if="disabledForm" color="red-darken-1" variant="outlined" @click="fechar">
                        Fechar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <LoadingDialog :dialog="loadingDialog" />
    </div>
</template>

<script>
import LoadingDialog from '@/components/LoadingDialog.vue';
import FormularioCadastroRelatorioAnualView from './FormularioCadastroRelatorioAnualView.vue';
import ConfirmationDialog from '@/components/ConfirmationDialog.vue';
import { useRelatorioAnualStore } from '../store';

export default {
    components: {
        FormularioCadastroRelatorioAnualView,
        LoadingDialog,
        ConfirmationDialog,
    },
    data: () => ({
        dialog: false,
        disabledForm: false,
        relatorioAnual: {},
        loadingDialog: false
    }),
    methods: {
        async salvar() {
            const { valid } = await this.$refs.form.validate();
            if (!valid) return;
                this.loadingDialog = true;
                const store = useRelatorioAnualStore();
                var contexto = this;

            try {
                const response = await store.cadastrarRelatorioAnual();
                contexto.$emit('salvar', response);  
                store.$reset(); 
                this.loadingDialog = false;  
                contexto.fechar();             
                 
                //this.$refs.fileupload.reset(); 
            } catch (error) {
                console.error('Error in salvar:', error);
            }
        },
        fechar() {
            const store = useRelatorioAnualStore();
            store.$reset();
            this.disabledForm = false;
            this.dialog = false;
        },
    },
}
</script>

<style scoped></style>
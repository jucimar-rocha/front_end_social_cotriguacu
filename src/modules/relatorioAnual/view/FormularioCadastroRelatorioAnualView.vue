<template>
    <v-container>
        <v-row>
            <v-col cols="12" md="2" sm="12" xs="12">
                <v-text-field label="Id" v-model="relatorioAnual.Id" readonly />
            </v-col>

            <v-col cols="12" md="3" sm="12" xs="12">
                <v-text-field label="Ano" v-model="relatorioAnual.Ano" :rules="[rules.obrigatorio]" />
            </v-col>
            <v-col cols="12" md="7" sm="12" xs="12">
                <v-text-field label="Nome Documento" v-model="relatorioAnual.NomeDocumento" :rules="[rules.obrigatorio]" />
            </v-col>

        </v-row>
        <v-row>
            <v-col cols="12" md="12" sm="12" xs="12">
                <v-file-input ref="fileupload" accept="application/pdf" label="PDF" variant="outlined" prepend-icon=""
                    v-model="relatorioAnual.files" :rules="[rules.obrigatorio]" @change="handleFileChange">
                </v-file-input>
            </v-col>
        </v-row>
        <v-row v-if="relatorioAnual.Id !== null">
            <v-col cols="12" md="6" sm="12" xs="12">
                <v-text-field type="date" label="Data Cadastro" v-model="relatorioAnual.DataCriacao" readonly />
            </v-col>
            <v-col cols="12" md="6" sm="12" xs="12">
                <v-text-field type="date" label="Data Alteração" v-model="relatorioAnual.DataAlteracao" readonly />
            </v-col>
        </v-row>

    </v-container>
</template>

<script>

import { useRelatorioAnualStore } from '../store'
import { storeToRefs } from 'pinia'

export default {
    name: 'FormularioCadastroRelatorioAnualView',
    components: {

    },
    data: () => ({
        relatorioAnual: {
            type: Object,
            default: { id: 0 }
        },
        rules: {
            obrigatorio: v => !!v || 'Esse campo é obrigatório.',
            maximo: v => v.length <= 255 || 'Limite Máximo de 255 caracteres',
        },
        items: [

        ]
    }),
    methods: {
        handleFileChange() {
            if (this.relatorioAnual.files.length > 0) {
                var store = useRelatorioAnualStore();
                store.file = this.relatorioAnual.files[0];
                
            }
        },
    },
    mounted() {
        var store = useRelatorioAnualStore();
        const { Id, IdUsuario, Ano, NomeDocumento, files, Ativo, DataCriacao, DataAlteracao } = storeToRefs(store);

        this.relatorioAnual.Id = Id;
        this.relatorioAnual.IdUsuario = IdUsuario;
        this.relatorioAnual.Ano = Ano;
        this.relatorioAnual.NomeDocumento = NomeDocumento;
        this.relatorioAnual.Ativo = Ativo;
        this.relatorioAnual.DataCriacao = DataCriacao;
        this.relatorioAnual.DataAlteracao = DataAlteracao;
        this.relatorioAnual.files = files;

    }
}
</script>

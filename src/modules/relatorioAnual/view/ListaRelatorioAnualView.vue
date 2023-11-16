<template>
    <v-container  fluid >
        <v-row class="pa-0">
            <v-col cols="12">
                <h1>Relatório Anual</h1>
                <v-divider />
            </v-col>
        </v-row>
        <v-row class="d-flex justify-end mr-4">
            <CadastroRelatorioAnual :valorEditar="relatorioAnual" ref="telaCadastro" :dialog="dialog" @salvar="recarregarTabela"/>
        </v-row>
        <v-row>
        <v-col cols="12">
          <VDataTable
              ref="dataTable"
              :colunas="columns"
              :url="'/RelatorioAnual/BuscaListaPaginada'"
              :isServerMode="true"          
              :adapter="adapterMethod"
              @visualizar="visualizar"
              @excluir="excluir"   
              @alterar="alterar"/>
        </v-col>
      </v-row>
    </v-container>
</template>

<script>
import CadastroRelatorioAnual from './CadastroRelatorioAnual.vue';
import VDataTable from "@/components/VDataTable.vue";

import RelatorioAnualAdapter from "@/modules/relatorioAnual/adapter"
import requestHelper from '@/helpers/request'

import { useRelatorioAnualStore } from '../store';

export default {
    components: {
        CadastroRelatorioAnual,
        VDataTable
    },
    data () {
    return {
          dialog: false,
          columns: [
          { field: 'id', width: "50px", title: 'Id', cellClass: 'text-right', type: 'number', positiveNumber: true },
          { field: 'usuario', title: 'Usuario', type: 'string' },
          { field: 'ano', title: 'Ano', type: 'number'},
          { field: 'nomeDocumento', title: 'Nome Documento', type: 'string' },
          { field: 'dataCriacao', title: 'Data Cadastro', type: 'string' },
          { field: 'dataAlteracao', title: 'Data Alteração', type: 'string' }
          //{ field: 'Ativo', title: 'Status', type: 'bool', headerClass: 'd-block text-center pr-0', cellClass: 'text-center', filter: false, sort: false },
        ],        
        relatorioAnual: {},
        loadingDialog: false,
        alertaValidacao: false,
        mensagem: 'Não foi possível realizar esta operação.',
        type: 'error',
      }
    },  
    methods:{
        adapterMethod(dadosRetorno) {            
        return new RelatorioAnualAdapter().adapter(dadosRetorno);
        },
        excluir(item) {
        var request = new requestHelper(),
            context = this;
        
        request.delete('/RelatorioAnual/' + item.id, { }, () => {
            context.$refs.dataTable.carregarDadosTabela();
        }, (error) => {
            context.exibirMensagemErro(error);
        });
        },
        recarregarTabela() {
        this.$refs.dataTable.carregarDadosTabela();
        },
        visualizar(itemSelecionado) {
        if(itemSelecionado) {
          const contexto = this;
          const store = new useRelatorioAnualStore();

          store.buscarRelatorioAnual(itemSelecionado.id, (response) => {
            store.definirDadosRelatorioAnual(response.data);
            contexto.$refs.telaCadastro.abrirTelaCadastro(true);
          });

        } else {
          this.$refs.telaCadastro.limparValores();
        }
      },
      alterar(transportadoraEditar) {
        if(transportadoraEditar) {
          const contexto = this;
          const store = new useRelatorioAnualStore();

          store.buscarRelatorioAnual(transportadoraEditar.id, (response) => {
              store.definirDadosRelatorioAnual(response.data);
              contexto.$refs.telaCadastro.abrirTelaCadastro(false);
            });
          
        } else {
          this.$refs.telaCadastro.limparValores();
        }
      }
    }
    
}
</script>

<style scoped>

</style>
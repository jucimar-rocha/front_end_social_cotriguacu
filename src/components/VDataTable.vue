<template>
  <div>
    <v-datatable
      :rows="dadosTable"
      :columns="colunasDefinidas"
      :noDataContent="'Nenhum dado encontrado.'"
      paginationInfo="Paginação"
      :loading="dialog"
      :sortable="sortable"
      :isServerMode="isServerMode"
      skin="bh-table-hover bh-table-compact transparent"
      :columnFilter="columnFilter"
      :stickyHeader="true"
      :totalRows="totalRows"
      :pageSize="pagesize"
      @filterChange="filterChange"
      @change="changeServer"
    >

      <template #id="data">
          <strong>{{ data.value.id }}</strong>
      </template>

      <template #htmlValue="data">
          <div v-html="data.value.htmlValue"></div>
      </template>

      <template #status="data">
        <div @click="mudarStatus(data.value)" class="cursor-pointer switch-field">
          <v-switch
            class="pa-0 ma-0"
            v-if="this.isStatusChangeable"
            v-model="data.value.status"
            density="compact"
            hide-details
            color="primary">
          </v-switch>
        </div>
        <v-chip v-if="!this.isStatusChangeable"
            class="text-center"
            :color="data.value.status  ? 'green' : 'red'">
            {{ exibirDadoGrid(data.value.status, '') }}
        </v-chip>
      </template>

      <template #statusIntegracao="data">
        <v-chip class="text-center"
            :color="data.value.statusIntegracao  ? 'green' : ''">
            {{ exibirDadoGrid(data.value.statusIntegracao, 'integracao') }}
        </v-chip>
      </template>

      <template #actions="data">
        <v-row class="d-inline-flex center">
          <v-col v-show="showVisualizar" cols="auto">
            <v-tooltip
                location="top"
                open-delay="1000"
              >Visualizar
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-eye-outline"
                  color="primary"
                  variant="text"
                  size="small"
                  @click="visualizar(data.value)">
                </v-btn>
              </template>
            </v-tooltip>
          </v-col>

          <v-col v-show="showEditar" cols="auto">
            <v-tooltip
                location="top"
                open-delay="1000"
              >Editar
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-pencil-outline"
                  color="edit-button"
                  variant="text"
                  size="small"
                  @click="alterar(data.value)">
                </v-btn>
              </template>
            </v-tooltip>
          </v-col>

          <v-col v-show="showExcluir || (item && item.stIntegracao && !item.stIntegracao)" cols="auto">
            <v-tooltip
                location="top"
              >Excluir
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-delete-outline"
                  color="red-darken-1"
                  variant="text"
                  size="small">
                </v-btn>
              </template>
            </v-tooltip>

            <ConfirmationDialog
                :titulo="'Excluir'"
                :mensagem="montarMensagemExclusao(data.value)"
                @confirmar="excluir(data.value)"/>
          </v-col>
        </v-row>
      </template>

    </v-datatable>
    <SnackValidatorCalisto
      v-model="alertaValidacao"
      titulo="Validação de Filtragem"
      :mensagem="mensagem"/>
  </div>
</template>

<script>
import request from '@/helpers/request'
import ConfirmationDialog from './ConfirmationDialog.vue'
import SnackValidatorCalisto from './SnackValidatorCalisto.vue'

export default {
  name: 'VDataTable',
  components: {
    ConfirmationDialog,
    SnackValidatorCalisto
  },
  props: {
      filterDefault: {
        type: String,
        default: 'id'
      },
      disabled: {
        type: Boolean,
        default: false
      },
      isServerMode: {
        type: Boolean,
        default: false
      },
      columnFilter: {
        type: Boolean,
        default: true
      },
      sortable: {
        type: Boolean,
        default: true
      },
      stickyHeader: {
        type: Boolean,
        default: true
      },
      showLastPage:{
        type: Boolean,
        default: false
      },
      showNumbers: {
        type: Boolean,
        default: false
      },
      colunas: {
        type: Array,
        default: () => []
      },
      dados: {
        type: Array,
        default: () => []
      },
      url: String,
      adapter: null,
      deletarEmMemoria: {
        type: Boolean,
        default: false
      },
      autoLoad: {
        type: Boolean,
        default: true
      },
      showExcluir: {
        type: Boolean,
        default: true
      },
      showEditar: {
        type: Boolean,
        default: true
      },
      showVisualizar: {
        type: Boolean,
        default: true
      },
      acoes: {
        type: Boolean,
        default: true
      },
      primeiraMensagemExcluir: {
        type: String,
        default: ''
      },
      segundaMensagemExcluir: {
        type: String,
        default: ''
      }
  },
  data () {
    return {
      dadosTable: [],
      listaExcluidos: [],
      dialog: false,
      totalRows: 10,
      params: {
        numeroPagina: 1,
        tamanhoPagina: 10,
        campoOrdem: {
          campo: this.filterDefault,
          ordem: 'asc',
        }
      },
      alertaValidacao: false,
      mensagem: ''
    };
  },
  mounted() {
    if(this.autoLoad) this.carregarDadosTabela();
  },
  watch: {
    dados: function () {
      if(this.autoLoad) this.carregarDadosTabela();
    },
  },
  computed: {
    colunasDefinidas() {
      if(this.disabled) return this.colunas;

      return this.colunas.concat([{ field: 'actions', title: 'Ações', cellClass: 'text-center', headerClass: 'd-block text-center', width: '200px', filter: false, sort: false  }]);
    },
    isStatusChangeable() {
      return this.colunasDefinidas.filter(x => x.field == "status")[0].changeable;
    }
  },
  methods: {
    filterChange(change) {
      change.forEach(filter => {
          if(filter.value) {
            if (this.isNegativeNumberValitation(filter)) {
              this.alertaValidacao = true;
              this.mensagem = 'O campo de filtro ' + filter.title + ' aceita apenas números positivos.';
              return false;
            }
          }
      });
    },
    montarMensagemExclusao(data) {
      if(data) {
        const id = this.primeiraMensagemExcluir ? data[this.primeiraMensagemExcluir] : data.id;
        const descricao = this.segundaMensagemExcluir ? data[this.segundaMensagemExcluir] : data.descricao;
        return `Deseja realmente excluir o registro ${this.montarMensagemExclusaoValor(id, descricao)}?`
      }
    },
    montarMensagemExclusaoValor(id, descricao) {
      let mensagemValor = '';
      if(!id && !descricao) {
        mensagemValor = '';
      } else if(!id && descricao) {
        mensagemValor = descricao;
      } else if (id && !descricao) {
        mensagemValor = id;
      } else {
        mensagemValor = id + ' - ' + descricao;
      }
      return mensagemValor;
    },
    exibirRegistro(item) {
      if(this.deletarEmMemoria) {
        return item.status;
      }
      return true;
    },
    exibirDadoGrid(conteudo, tipoDado) {
      if(typeof(conteudo) == 'boolean') {
        if(tipoDado == 'integracao') {
          return conteudo ? 'Integrado' : 'Pendente';
        } else if (tipoDado == 'simNao') {
          return conteudo ? 'Sim' : 'Não';
        }

        return conteudo ? 'Ativo' : 'Inativo';
      }
      return conteudo;

    },
    adapterDados(dados) {
      if(this.adapter) {
        return this.adapter(dados);
      }
      return dados;
    },
    isNegativeNumberValitation(filter) {
      return filter.positiveNumber && filter.value < 0;
    },
    changeServer(data) {
        var filters = [];

        if(data.change_type == 'filter') {
          data.column_filters.forEach(filter => {
            if(filter.value) {
              if(this.isNegativeNumberValitation(filter)) {
                this.alertaValidacao = true;
                this.mensagem = 'O campo de filtro ' + filter.title + ' aceita apenas números positivos.';
                return false;
              }
              filters.push({
                campo: filter.field,
                query: filter.value + '',
                type: filter.type,
              })
            }
          });
        }

        this.params.numeroPagina = data.current_page;
        this.params.tamanhoPagina = data.pagesize;
        this.params.campoOrdem.campo = data.sort_column;
        this.params.campoOrdem.ordem = data.sort_direction;
        this.params.camposFiltro = filters;

        //CamposFiltro
        if(data.change_type == 'filter') {

          clearTimeout(this._searchTimer);
          this._searchTimer = setTimeout(() => {
            this.carregarDadosTabela();
          }, 500);

        } else {
          this.carregarDadosTabela();
        }

    },
    carregarDadosTabela(novaUrl) {
      this.dialog = true;

      if(this.url || novaUrl) {
        var urlUtilizada = novaUrl || this.url;

        if(this.isServerMode) {
          this.buscaPaginada(urlUtilizada);
        } else {
          this.buscaEstatica(urlUtilizada);
        }

      } else {
        this.dadosTable = this.adapterDados(this.dados);
        this.dialog = false;
      }
    },

    buscaPaginada(urlUtilizada) {
      var requestHelper = new request(),
          context = this;

      requestHelper.post(urlUtilizada, this.params,
        (response) => {

          if(context.adapter) {
            context.dadosTable = context.adapter(response.data.value);
          } else {
            context.dadosTable = response ? response.data.value : [];
          }

          context.totalRows = response?.data?.total;
        },
        function(error) {
          console.error(error);
          console.log('Nao foi possivel carregar os dados');
        },
        function() {
          context.dialog = false;
        }
      );
    },

    buscaEstatica(urlUtilizada) {
      var requestHelper = new request(),
          context = this;

      requestHelper.get(urlUtilizada, this.params,
          (response) => {
            if(context.adapter) {
              context.dadosTable = context.adapter(response.data);
            } else {
              context.dadosTable = response ? response.data : [];
            }
          },
          (error) => {
            console.error(error);
            console.log('Nao foi possivel carregar os dados');
          },
          function() {
            context.dialog = false;
          }
        );
    },
    adicionar(item) {
      var itemAdaptado = this.adapterDados([item]);
      this.dadosTable.push(itemAdaptado[0]);
    },

    visualizar(itemSelecionado) {
      this.$emit('visualizar', itemSelecionado);
    },
    alterar(itemSelecionado) {
      this.$emit('alterar', itemSelecionado);
    },
    mudarStatus(itemSelecionado) {
      this.$emit('mudarStatus', itemSelecionado);
    },
    excluir(itemSelecionado) {
      if(itemSelecionado.idMemory && itemSelecionado.idMemory){
        this.dadosTable = this.dadosTable.filter((x) => x.idMemory != itemSelecionado.idMemory);
      } else if(itemSelecionado.id) {
        //salvar em lista a parte para exclusao no banco
        var itemExclusao = this.dadosTable.filter((x) => x.id == itemSelecionado.id)[0];
        this.listaExcluidos.push(itemExclusao);
        //Atualizar lista exibicao grid
        this.dadosTable = this.dadosTable.filter((x) => x.id != itemSelecionado.id);
      }

      this.$emit('excluir', itemSelecionado);

      if(this.url) {
        this.carregarDadosTabela();
      }
    },
    mudarValor(conteudo, id, idMemory) {
      const novoValor = !conteudo.valor;

      conteudo.valor = novoValor;
      this.$emit('valueChange', novoValor, id, idMemory);
    }
  },
}
</script>

<style>
.cursor-pointer {
  cursor: pointer;
}

.switch-field .v-input--density-compact {
  --v-input-control-height: auto;
}
</style>

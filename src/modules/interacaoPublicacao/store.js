import { defineStore } from 'pinia';

import requestHelper from '@/helpers/request';

export const useInteracaoPublicacaoStore = defineStore('interacaoPublicacao', {
  state: () => ({
    interacao: {},
  }),
  actions: {
    async buscarInteracoes(id) {
      if (this.interacao[id]) {      
        return;
      }      
      const request = new requestHelper();
      request.get(`/Comentarios/BuscarPorId${id}`, {},(response) => {
        this.criaInteracaoPublicacao(id, response.data)
    });
    },
    criaInteracaoPublicacao(id, lista) {
      this.interacao[id] = lista.map(item => ({
        id: item.id,
        usuario: item.usuario,
        pathUsuario: item.pathUsuario,
        comentario: item.comentario,
        dataCriacao: new Date(item.dataCriacao).toLocaleDateString(),
      }));
    },
    limparDados(id) {
      if (this.interacao[id]) {
        delete this.interacao[id];
      }
    },
    excluir(id, retorno, retornoErro) {
        const request = new requestHelper();
        return request.delete(`/Comentarios/${id}`, {}, retorno, retornoErro);
      }
      
  },
});
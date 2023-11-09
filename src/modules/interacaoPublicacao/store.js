import { defineStore } from 'pinia';

import requestHelper from '@/helpers/request';

export const useInteracaoPublicacaoStore = defineStore('interacaoPublicacao', {
  state: () => ({
    interacao: {},
  }),
  actions: {
    async buscarInteracoes(id) {
      const request = new requestHelper();
      request.get(`/Comentarios/BuscarPorId${id}`, {},(response) => {
        this.criaInteracaoPublicacao(id, response.data)
    });
    },
    async criarComentario(comentarios){
        const request = new requestHelper();
        const response = await request.post('/Comentarios/PublicarComentario', comentarios);
        if (response.status === 200) {
          return response;
        }      
    },
    async buscaTotalInteracoes(id){
        const request = new requestHelper();
        return new Promise((resolve, reject) => {
          request.get(`/Curtidas/BuscarInteracoesPorId${id}`, {}, (response) => {
            if (response.status === 200) {
              resolve(response);
            } else {
              reject(new Error('Erro ao buscar interações'));
            }
          });
        });
       
    },
    async adicionaInteracao(interacoes){
      const request = new requestHelper();
        const response = await request.post('/Curtidas/AdicionarInteracao', interacoes);
        if (response.status === 200) {
          return response;
        }      
    },
    async bucarUsuarioInteracao(idPublicacao, idInteracao) {
      const request = new requestHelper();
    
      return new Promise((resolve, reject) => {
        request.get(`/Curtidas/BuscarUsuarioInteracoes/${idPublicacao}/${idInteracao}`, {}, (response) => {
          if (response && response.data) {
            resolve(response.data);
          } else {
            reject(new Error("Falha ao obter dados de interação"));
          }
        });
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
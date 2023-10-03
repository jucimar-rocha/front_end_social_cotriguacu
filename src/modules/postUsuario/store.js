import { defineStore } from 'pinia';

import requestHelper from '@/helpers/request';

export const usePostUsuario = defineStore({
  id: 'postagemUsuario',
  state: () => ({
    postagemUsuario: [],
  }),
  actions: {
    async buscarListaPublicacao(parametros) {
      try {
        const request = new requestHelper();
        const response = await request.post('/Publicacoes/BuscaListaPaginada', parametros);
        this.definirListaPublicacao(response.data.value.itens);
        return response;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    definirListaPublicacao(lista) {
        this.postagemUsuario = lista.map(item => ({
          id: item.id,
          usuario: item.usuario,
          avatarUsuario: item.avatarUsuario,
          nomeusuarioPost: item.nomeusuarioPost,
          mensagem: item.mensagem,
          urlImagem: item.urlImagem || null,
          urlVideo: item.urlVideo || null,
          dataCriacao: new Date(item.dataCriacao).toLocaleDateString()          
        }));
        console.log(this.postagemUsuario);
      },
  },
});

import { defineStore } from 'pinia';
import requestHelper from '@/helpers/request';

export const usePostUsuario = defineStore({
  id: 'postagemUsuario', // Defina um ID para o store
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
        throw error; // Propague o erro para o chamador
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
          dataCriacao: item.dataCriacao,
        }));
        console.log(this.postagemUsuario);
      },
  },
});

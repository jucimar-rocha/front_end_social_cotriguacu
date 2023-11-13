import { defineStore } from 'pinia';

import requestHelper from '@/helpers/request';

export const usePostUsuario = defineStore({
  id: 'postagemUsuario',
  state: () => ({
    postagemUsuario: [],
    total: 0,
  }),
  actions: {
    async buscarListaPublicacao(parametros) {
      try {
        const request = new requestHelper();
        const response = await request.post('/Publicacoes/BuscaListaPaginada', parametros);
        
        if(response){
          this.definirListaPublicacao(response.data.value.itens);
          this.total = response.data.value.total;
          return response;
        }
       
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
          dataCriacao: new Date(item.dataCriacao).toLocaleString()        
        }));
        console.log(this.postagemUsuario);
      },
      excluir(id, retorno, retornoErro) {
        const request = new requestHelper();
        return request.delete(`/Publicacoes/Deletar${id}`, {}, retorno, retornoErro);
      }
  },
});

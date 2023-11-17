import { defineStore } from 'pinia'
import axios from 'axios';
import requestHelper from '@/helpers/request'
import { useAuthStore } from '@/modules/login/store';
import {AppUtils} from "@/helpers/utils";


export const useRelatorioAnualStore = defineStore('relatorioAnual', {
  state: () => {
    return {
      Id: null,
      IdUsuario: null,
      Ano: null,
      NomeDocumento: '',
      file: [],
      Ativo: true,
      DataCriacao: '',
      DataAlteracao: ''
    };
  },
  actions: {
    limparDados() {
      this.$reset();
    },
    buscarRelatorioAnual(id, returnFunction) {
      const request = new requestHelper();
      request.get('/RelatorioAnual/BuscarPorId' + id, {}, (response) => {
        returnFunction(response);
      });
    },
    salvar(returnFunction) {
      const relatorioAnual = this.criarRelatorioAnual();

      if (relatorioAnual.Id == 0) {
        this.cadastrarRelatorioAnual(returnFunction);
      } else {
        this.editarRelatorioAnual(returnFunction, relatorioAnual);
      }
    },
    cadastrarRelatorioAnual() {
      const formData = new FormData();
      formData.append('Id', 0);
      formData.append('IdUsuario', parseInt(sessionStorage.getItem('idUsuario'), 10));
      formData.append('Ano', parseInt(this.Ano, 10));
      formData.append('NomeDocumento', this.NomeDocumento);
      formData.append('file', this.file);
      formData.append('Ativo', this.Ativo);
      formData.append('DataCriacao', this.DataCriacao);
      formData.append('DataAlteracao', this.DataAlteracao);

      return axios.post('https://localhost:7084/api/RelatorioAnual/Adicionar', formData, {
        ...this.getHeaderConfig(),
        onUploadProgress: ({ loaded, total }) => {
          this.uploadProgress = Math.floor((loaded / total) * 100);
        }
      }).then(response => {
        return response.data;
      }).catch(error => {
        console.error('Error in cadastrarRelatorioAnual:', error);
        throw error;
      });
    },
    getToken() {
      let store = useAuthStore();
      return store.token;
    },
    getHeaderConfig() {
      let token = this.getToken();
      return {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      };
    },
    editarRelatorioAnual(returnFunction, relatorioAnual) {
      const request = new requestHelper();
      request.put('/RelatorioAnual/' + relatorioAnual.id, relatorioAnual, returnFunction);
    },
    criarRelatorioAnual() {
      const relatorioAnual = {
        Id: 0,
        IdUsuario: sessionStorage.getItem('idUsuario'),
        Ano: this.Ano,
        NomeDocumento: this.NomeDocumento,
        file: this.file,
        Ativo: this.Ativo
      };
      return relatorioAnual;
    },
    definirDadosRelatorioAnual(dadosRelatorioAnual) {
      this.Id = dadosRelatorioAnual.id;
      this.Ano = dadosRelatorioAnual.ano;
      this.NomeDocumento = dadosRelatorioAnual.nomeDocumento;
      this.file = dadosRelatorioAnual.documentoBase64;
      this.DataCriacao = AppUtils.FormatarDataHora(dadosRelatorioAnual.dataCriacao);
      this.DataAlteracao = dadosRelatorioAnual.dataAlteracao === null ? "" : AppUtils.FormatarDataHora(dadosRelatorioAnual.dataAlteracao);
  },

  }
})
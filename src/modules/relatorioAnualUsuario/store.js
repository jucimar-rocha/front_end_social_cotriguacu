import { defineStore } from 'pinia'
import requestHelper from '@/helpers/request'
import { AppUtils } from '@/helpers/utils';

export const useRelatorioAnualUsuarioStore = defineStore('relatorioAnualUsuario', {
    state: () => {
        return {
            relatorioAnual: [],
        }
    },
    actions:{
        buscarRelatorioAnual(returnFunction) {
            const request = new requestHelper();
            request.get('/RelatorioAnual/BuscarTodos', {}, (response) => {
                if (response && response.data && response.data.length > 0) {
                    response.data.forEach(item => {
                        if (item.documentoBase64) {
                            AppUtils.converterBase64ParaPDF(item.documentoBase64, (pdfData) => {
                                // Aqui você pode fazer algo com os dados do PDF, se necessário
                                returnFunction(pdfData);
                                 this.definirListaRelatorioAnual(response.data);
                            });
                        } else {
                            console.error('DocumentoBase64 não encontrado em um dos itens da resposta.');
                        }
                    });
                } else {
                    console.error('Resposta vazia ou sem dados válidos.');
                }
            });
        },
        
        definirListaRelatorioAnual(lista) {
            this.relatorioAnual = lista.map(item => ({
              id: item.id,
              ano: item.ano,
              NomeDocumento: item.NomeDocumento,
              DocumentoBase64: item.DocumentoBase64

            }));
            console.log(this.lista);
        },
        
    }
});
export default class RelatorioAnualAdapter {
    adapter(dadosRetorno) {
        console.log(dadosRetorno)
        if(dadosRetorno && dadosRetorno.itens) {
            var novaLista = [];
            //transforma em objeto para Table
            dadosRetorno.itens.forEach(dado => {
                novaLista.push({
                    id: dado.id,
                    usuario: dado.usuario,
                    ano: dado.ano,
                    nomeDocumento: dado.nomeDocumento,
                    dataCriacao: dado.dataCriacao,                  
                    dataAlteracao: dado.dataAlteracao
                    //status: dado.status,
                });
            });
            return  novaLista;
        }
    }
    
}
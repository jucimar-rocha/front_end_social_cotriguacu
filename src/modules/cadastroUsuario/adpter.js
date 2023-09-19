
export default class UsuarioAdapter {
    adapter(dadosRetorno) {
        if(dadosRetorno){
            var novaLista = [];

            dadosRetorno.forEach(dado => {
                novaLista.push({
                    id: { exibir: true, valor: dado.id },
                    cpf: { exibir: true, valor: dado.cpf},
                    matricula: { exibir: true, valor: dado.matricula},      
                    celular:{ exibir: true, valor: dado.celular},  
                    email: { exibir: true, valor: dado.email},           
                    senha: { exibir: true, valor: dado.senha},
                                 
                });
            });
    
            return  novaLista;
        }
    }
    toValueObject(item) {
        return {
            id: item.id.valor,
            cpf: item.cpf.valor,
            matricula: item.matricula.valor,
            celular: item.celular.valor,
            email: item.email.valor, 
            senha: item.senha.valor,
                     
        }
    }
}

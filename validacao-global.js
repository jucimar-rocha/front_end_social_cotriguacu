export function validarCpf(cpf) {
    // Remove caracteres não numéricos do CPF
    cpf = removerMascaras(cpf);
  
    // Verifica se o CPF é uma string válida e tem o comprimento correto
    if (typeof cpf !== 'string' || cpf.length !== 11) {
      return false;
    }
  
    // Verifica se o CPF é uma sequência de dígitos repetidos
    if (/^(\d)\1{10}$/.test(cpf)) {
      return false;
    }
  
    var soma = 0;
    var resto;
  
    // Calcula o primeiro dígito verificador
    for (var i = 1; i <= 9; i++) {
      soma += parseInt(cpf.charAt(i - 1)) * (11 - i);
    }
    resto = (soma * 10) % 11;
  
    if (resto === 10 || resto === 11) {
      resto = 0;
    }
  
    if (resto !== parseInt(cpf.charAt(9))) {
      return false;
    }
  
    soma = 0;
  
    // Calcula o segundo dígito verificador
    for (var i = 1; i <= 10; i++) {
      soma += parseInt(cpf.charAt(i - 1)) * (12 - i);
    }
    resto = (soma * 10) % 11;
  
    if (resto === 10 || resto === 11) {
      resto = 0;
    }
  
    if (resto !== parseInt(cpf.charAt(10))) {
      return false;
    }
  
    return true;
  }
  
  // Remove caracteres não numéricos
  export function removerMascaras(texto) {
    return texto.replace(/\D/g, '');
  }
  
  
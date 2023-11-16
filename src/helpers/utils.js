export class AppUtils {
    static FormatarDataHora(date) {
        const options = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        }
        return (date ?
            new Date(date).toLocaleDateString('pt-BR', options) :
            new Date().toLocaleDateString('pt-BR', options)).replace(', ', ' ');
    }

    static formatarCPF(documento) {
        return documento.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    static formatarCNPJ(documento) {
        return documento.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
}

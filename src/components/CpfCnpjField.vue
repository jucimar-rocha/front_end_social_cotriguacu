<template>
    <v-text-field
        label="CPF*"
        v-model="cpfCnpj"
        density="compact"
        variant="outlined"
        required
        validate-on="blur"
        @:blur="$emit('blur', cpfCnpj)"
        @:input="acceptNumber"
        :rules="[ruleCpfCnpj.cpfCnpj, extraRule, validarCpfCnpj]"
        maxlength="12"
        hint="Digite apenas números"
    ></v-text-field>
</template>


<script>

export default {
    name: 'CpfCnpjField',
    props:{
        functionAposExecucao: null,
        modelValue: {
            type: String,
            default: '',
            required: true
        }, 
        extraRule: {
            type: Object,
            default: null
        }
    },
    data: () => ({
        cpfCnpj: '',
        ruleCpfCnpj: {
            cpfCnpj: value => {
                const pattern = /^\d{3}\.\d{3}\.\d{3}-\d{2}$|\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/
                return !value || pattern.test(value) || 'CPF ou CNPJ Inválido'
            }
        }
    }),
    mounted() {
        if(this.modelValue) {
            this.cpfCnpj = this.modelValue;
        }
    },
    watch: { // It listens to the change in prop name
        modelValue: function () {
            this.cpfCnpj = this.modelValue;
            this.acceptNumber();
        },
    },
    methods: {
        acceptNumber() {
            var numeroSemLetras = (this.cpfCnpj !== null ? this.cpfCnpj.replace(/\D/g, '') : "");
            var novoValor = numeroSemLetras;
            var identificacaoValida = true;

            if(numeroSemLetras.length == 11) {
                identificacaoValida = this.validarCpf(numeroSemLetras);

                var numeroDivididoCpf = numeroSemLetras.match(/(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})/);
                novoValor = numeroDivididoCpf[1] + '.' + numeroDivididoCpf[2] + '.' + numeroDivididoCpf[3] + '-' + numeroDivididoCpf[4];
                

            } else if(numeroSemLetras.length == 14) {
                identificacaoValida = this.validarCnpj(numeroSemLetras);

                var numeroDivididoCnpj = numeroSemLetras.match(/(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,2})/);
                novoValor = numeroDivididoCnpj[1] + '.' + numeroDivididoCnpj[2] + '.' + numeroDivididoCnpj[3] + '/' + numeroDivididoCnpj[4] + '-' + numeroDivididoCnpj[5];
            }

            this.cpfCnpj = novoValor;

            this.$emit('update:modelValue', this.cpfCnpj);
            
            if(!identificacaoValida) return;

            if(this.functionAposExecucao) this.functionAposExecucao();
        },
        validarCpfCnpj: function(valor) {
            var somenteNumeros = valor.replace(/\D/g, '');

            if(somenteNumeros.length == 11) return this.validarCpf(somenteNumeros) || 'CPF ou CNPJ Inválido';          

        },
        validarCpf: function(cpf) {
		    if ( !cpf || cpf.length != 11
					|| cpf == "00000000000"
					|| cpf == "11111111111"
					|| cpf == "22222222222" 
					|| cpf == "33333333333" 
					|| cpf == "44444444444" 
					|| cpf == "55555555555" 
					|| cpf == "66666666666"
					|| cpf == "77777777777"
					|| cpf == "88888888888" 
					|| cpf == "99999999999" )
				return false
			var soma = 0
		    var resto
			for (var i = 1; i <= 9; i++) 
				soma = soma + parseInt(cpf.substring(i-1, i)) * (11 - i)
			resto = (soma * 10) % 11
		    if ((resto == 10) || (resto == 11))  resto = 0
		    if (resto != parseInt(cpf.substring(9, 10)) ) return false
			soma = 0
		    for (var i = 1; i <= 10; i++) 
		    	soma = soma + parseInt(cpf.substring(i-1, i)) * (12 - i)
		    resto = (soma * 10) % 11
		    if ((resto == 10) || (resto == 11))  resto = 0
		    if (resto != parseInt(cpf.substring(10, 11) ) ) return false
		    return true;
		}
		
    }
}

</script>
<template>
    <v-dialog
        v-model="dialog"
        persistent
        width="auto"
        activator="parent"
    >
    <v-card>
        <v-card-title class="text-h5">
            {{ titulo }}
            <v-btn class="float-right mr-n3 mt-n1"  density="compact" variant="text" icon="mdi-close-thick" @click="dialog = false"/>
        </v-card-title>

        <v-card-text>{{ mensagem }}</v-card-text>
        <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
        variant="tonal"
            color="red"
            depressed
            elevation="2"
            @click="dialog = false"
        >
            Cancelar
        </v-btn>
        <v-btn
            variant="tonal"
            color="primary"
            elevation="2"
            @click="confirmar"
        >
            Confirmar
        </v-btn>
        
        </v-card-actions>
    </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: ['titulo', 'mensagem'],
    data () {
        return {
            dialog: false,
        }
    },
    methods:{
        confirmar() {
            this.dialog = false;
            this.$emit('confirmar');
        }
    }
}
</script>
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
            <v-btn class="float-right"  density="compact" variant="text" icon="mdi-close-thick" @click="dialog = false"/>
        </v-card-title>

        <v-card-text>{{ mensagem }}</v-card-text>
        <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            color="red-darken-1"
            variant="text"
            @click="dialog = false"
        >
            Cancelar
        </v-btn>
        <v-btn
            color="green-darken-1"
            variant="text"
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
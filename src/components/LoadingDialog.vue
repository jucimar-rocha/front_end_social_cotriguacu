<template>
    <v-dialog
        :scrim="true"
        persistent
        width="auto"
        v-model="openDialog"
        class="bg-transparent"
    >
        <v-card>
            <v-card-text >
                <v-progress-circular 
                    indeterminate
                    color="primary"
                    :width="7"
                ></v-progress-circular >
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: ['dialog'],
    data () {
        return {

        }
    },
    computed:{
        openDialog() {
            return this.dialog;
        }
    }
}
</script>
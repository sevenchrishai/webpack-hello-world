<template>
    <div>
        <h1>{{msg}}</h1>
    </div>
</template>

<script>
    export default {
        name: "app",
        data() {
            return {
                msg: 'App.vue'
            }
        }
    }
</script>

<style scoped>
h1{
    color: #00f;
}
</style>
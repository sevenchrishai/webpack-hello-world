<template>
    <div>
        <h1>{{msg}}</h1>
        <div id="content">

        </div>
    </div>
</template>

<script>
    import $ from 'jquery'

    export default {
        name: "app",
        data() {
            return {
                msg: 'App.vue',
                arr: [1,2,3,4,5]
            }
        },
        created() {
            let self = this
            // 在 vue 的 created() 钩子函数进行的 DOM 操作一定要放在 $nextTick 的回调函数中
            // self.$nextTick(() => {
            //     $("#content").html("<h1>hello world</h1>");
            // })
            _.each(self.arr, item =>{
                console.log(item)
            })
        },
        mounted() {
            // mounted() 钩子函数，执行时所有的DOM挂载和渲染都已完成，此时进行任何DOM操作都不会有问题 。
            $("#content").html("<h1>hello world</h1>");
        }
    }
</script>

<style scoped>
h1{
    color: #00f;
}
</style>
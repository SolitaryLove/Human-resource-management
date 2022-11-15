<template>
    <div>
        <svg-icon :icon-class="isFullScreen?'exit-fullscreen':'fullscreen'" 
         class="fullscreen" @click="toggleScreen" />
    </div>
</template>

<script>
    export default {
        name:'ScreenFull',
        data(){
            return {
                isFullScreen:false,// 全屏状态标识
            }
        },
        created(){
            document.addEventListener('fullscreenchange',()=>{
                this.isFullScreen=!this.isFullScreen;
            });
        },
        beforeDestroy(){
            document.removeEventListener('fullscreenchange');
        },
        methods:{
            toggleScreen(){
                if(!document.fullscreenElement){
                    document.documentElement.requestFullscreen();
                }else{
                    if(document.exitFullscreen){
                        document.exitFullscreen();
                    }
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .fullscreen{
        width:20px;
        height:20px;
        color:#fff;
        cursor:pointer;
    }
</style>
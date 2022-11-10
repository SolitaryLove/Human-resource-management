<template>
    <el-image :src="src" class="img-container">
        <!-- error插槽：设置如果出错将显示的内容 -->
        <template #error>
            <!-- 静态资源就近维护：将 head.jpg 放在该组件目录下 -->
            <img src="./img/head.jpg" />
        </template>
    </el-image>
</template>

<script>
export default {
    name:'ImageHolder',
    props:{
        src:{
            type:String,
            default:'',
        }
    }
}
</script>

<style lang="scss" scoped>
    .img-container{
        border-radius:50%;
        img{
            border-radius:50%;
            width:65px;
            height:65px;
        }
    }
</style>
<template>
    <el-dropdown trigger="click" @command="changeLanguage">
        <div>
            <svg-icon style="color:#fff;font-size:20px" icon-class="language" />
        </div>
        <el-dropdown-menu>
            <!-- $i18n是Vue.use(Vuei18n)添加给Vue原型的全局属性，通过它可以获取i18n.locale环境语言标识 -->
            <el-dropdown-item command="zh" :disabled="'zh'===$i18n.locale">中文</el-dropdown-item>
            <el-dropdown-item command="en" :disabled="'en'===$i18n.locale">English</el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>
</template>

<script>
    export default {
        methods:{
            changeLanguage(lang){
                this.$i18n.locale=lang;// 设置给本地的i18n插件
                this.$message.success('切换多语言成功！');
            }
        }
    }
</script>
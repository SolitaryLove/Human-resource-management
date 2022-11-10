<template>
    <div class="login-setting">
        <el-form ref="userForm" :model="userInfo" :rules="rules" label-width="120px" 
         style="margin-left:120px;margin-top:30px">
            <el-form-item label="姓名:" prop="username">
                <el-input type="text" v-model="userInfo.username" style="width:300px" />
            </el-form-item>
            <el-form-item label="密码:" prop="password">
                <el-input type="password" v-model="userInfo.password" style="width:300px" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="updateUser">更新</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
  
<script>
import { getUserDetailByIdAPI, saveUserDetailByIdAPI } from '@/api';

export default {
    name: 'LoginSetting',
    data(){
        return {
            userInfo:{
                username:'',
                password:'',
            },
            rules: {
                username: [{ required: true, message: '用户名不能为空', triggler: 'blur' }],
                password: [{ required: true, message: '密码不能为空', triggler: 'blur' }]
            }
        }
    },
    created(){
        // 获取用户详情
        this.loadUserDetailById();
    },
    methods:{
        // 调用获取用户详情接口
        async loadUserDetailById(){
            const res=await getUserDetailByIdAPI(this.$route.query.id).catch(err=>console.dir(err));
            if(!res.success) return this.$message.error(res.message);
            this.userInfo=res.data;
        },
        // 调用更新用户信息接口
        updateUser(){
            this.$refs.userForm.validate(async valid=>{
                if(!valid) return this.$message.error('请检查用户名和密码是否合法');
                const res=await saveUserDetailByIdAPI(this.userInfo);
                this.loadUserDetailById();
                this.$message.success(res.message);
            });
        }
    }
}
</script>
  
<style lang="scss" scoped>
    .login-setting{
        padding-top:20px;
    }
</style>
  
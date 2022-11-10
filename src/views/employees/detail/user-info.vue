<template>
    <div class="user-info">
        <el-form label-width="220px">
            <el-row class="inline-info">
                <el-col :span="12">
                    <el-form-item label="工号">
                        <el-input v-model="userInfo.workNumber" class="inputW" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="入职时间">
                        <el-date-picker v-model="userInfo.timeOfEntry" style="width:300px"
                         type="date" class="inputW" value-format="YYYY-MM-DD" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row class="inline-info">
                <el-col :span="12">
                    <el-form-item label="姓名">
                        <el-input v-model="userInfo.username" class="inputW" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="部门">
                        <el-input v-model="userInfo.departmentName" class="inputW" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row class="inline-info">
                <el-col :span="12">
                    <el-form-item label="手机">
                        <el-input v-model="userInfo.mobile" class="inputW" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="聘用形式">
                        <el-select v-model="userInfo.formOfEmployment" class="inputW">
                            <el-option v-for="item in EmployeeEnum.hireType" :key="item.id"
                             :label="item.value" :value="item.id" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row class="inline-info">
                <el-col :span="12">
                    <el-form-item label="员工头像">
                        <UploadImg />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row class="inline-info" type="flex" justify="center">
                <el-col :span="12" style="display:flex;justify-content:center">
                    <el-button type="primary" @click="saveUser">保存更新</el-button>
                    <el-button @click="$router.back()">返回</el-button>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>
  
<script>
import { getUserDetailByIdAPI, saveUserDetailByIdAPI } from '@/api';
import EmployeeEnum from '@/api/constant/employees';

export default {
    name: 'UserInfo',
    data(){
        return {
            userId:this.$route.query.id,
            EmployeeEnum,// 员工枚举数据
            userInfo:{},
        }
    },
    created(){
        // 调用获取用户信息的接口
        this.loadUserInfoById();
    },
    methods:{
        // 获取用户信息
        async loadUserInfoById(){
            const res=await getUserDetailByIdAPI(this.userId).catch(err=>console.dir(err));
            if(!res.success) return this.$message.error(res.message);
            this.userInfo=res.data;
        },
        // 保存用户信息的更改
        async saveUser(){
            const res=await saveUserDetailByIdAPI(this.userInfo);
            if(!res.success) return this.$message.error(res.message);
            this.loadUserInfoById();
            this.$message.success(res.message);
        }
    }
}
</script>
  
<style lang="scss" scoped>
    .user-info{
        padding-top:20px;
    }
</style>
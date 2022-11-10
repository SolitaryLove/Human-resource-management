<template>
    <div>
        <el-checkbox-group v-model="roleIdArr">
            <el-checkbox v-for="role in roleList" :key="role.id" :label="role.name" :value="role.id" />
        </el-checkbox-group>
        <el-row class="footer" type="flex" justify="center">
            <el-col :span="6">
                <el-button type="primary" size="small" @click="confirmFn">确定</el-button>
                <el-button size="small" @click="cancelDialog">取消</el-button>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name:'AssignRoleDiglog',
        props:{
            userId:{
                type:String,
                default:null,
            },
            roleList:{
                type:Array,
                require:true,
            },
            roleIds:{
                type:Array,
                default:null,
            }
        },
        data(){
            return {
                roleIdArr:[],// 当前选中的角色列表
            }
        },
        watch:{
            roleIds(){
                this.roleIdArr=this.roleIds;
            }
        },
        methods:{
            confirmFn(){
                this.$emit('confirm',this.roleIdArr);
            },
            cancelDialog(){
                this.$emit('close');
            },
        }
    }
</script>

<style lang="scss" scoped>
    .footer{
        margin-top:30px;
    }
</style>
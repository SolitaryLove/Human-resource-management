<template>
    <div>
        <el-dialog :title="isEdit?'编辑部门':'添加子部门'" 
            :visible.sync="dialogVisible" width="50%"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :before-close="cancelFn"
            @open="openHandler">
            <el-form :model="form" :rules="rules" ref="deptForm" label-width="100px" label-position="right">
                <el-form-item label="部门名称" prop="name">
                    <el-input v-model="form.name" style="width:80%" placeholder="1-50个字符" ref="nameinput"/>
                </el-form-item>
                <el-form-item label="部门编码" prop="code">
                    <el-input v-model="form.code" style="width:80%" placeholder="1-50个字符"/>
                </el-form-item>
                <el-form-item label="部门负责人" prop="manager">
                    <el-select v-model="form.manager" style="width:80%" placeholder="请选择负责人">
                        <el-option v-for="item in employeesList" :key="item.id" :value="item.username"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="部门介绍" prop="introduce">
                    <el-input v-model="form.introduce" type="textarea" style="width:80%" placeholder="1-300个字符" :rows="3"/>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="cancelFn">取消</el-button>
                <el-button type="primary" @click="enterFn">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default{
        name:'DepartDialog',
        data(){
            const validCode=(rule,value,callback)=>{
                // 判断是否能找到对应的部门,如果找到则返回该对象
                let existCodeList=this.originList.map(item=>item.code);
                // 添加时:所有已存在的部门编码是不能使用的
                // 编辑时:必须要在不能使用的部门编号中排除当前正在编辑的部门编码
                if(this.isEdit){
                    existCodeList=this.originList.filter(item=>item.code!==this.parentId).map(item=>item.id);
                }
                // 如果存在该对象,则说明编码已经存在,抛出错误
                existCodeList.includes(value)?callback(new Error('编码 '+value+' 已存在')):callback();
            }
            const validName=(rule,value,callback)=>{
                // 先筛选属于这个pid下属的(parentId就是id)部门对象, 然后映射name名字数组
                let existNameList=this.originList.filter(item=>item.pid===this.parentId).map(item=>item.name);
                if(this.isEdit){
                    // 找到当前部门对象
                    const dept=this.originList.find(item=>item.id===this.parentId);
                    const currentId=dept.id;
                    existNameList=this.originList.filter(item=>item.id!==currentId&&item.pid===this.parentId).map(item=>item.name);
                }
                // 判断最新输入的部门名称是否已存在
                existNameList.includes(value)?callback(new Error('该部门下的 '+value+' 已被占用')):callback();
            }
            return {
                form:{
                    name:'',// 部门名称
                    code:'',// 部门编码
                    manager:'',// 部门管理者
                    introduce:'',// 部门介绍
                },
                rules:{
                    name: [
                        { required: true, message: '部门名称不能为空', trigger: 'blur' },
                        { min: 1, max: 50, message: '长度在 1~50 个字符', trigger: 'blur' },
                        { validator: validName, trigger: 'blue' }
                    ],
                    code: [
                        { required: true, message: '部门编码不能为空', trigger: 'blur' },
                        { min: 1, max: 50, message: '长度在 1~50 个字符', trigger: 'blur' },
                        { validator: validCode, trigger: 'blue' }
                    ],
                    manager: [
                        { required: true, message: '部门负责人不能为空', trigger: 'blur' },
                    ],
                    introduce: [
                        { required: true, message: '部门介绍不能为空', trigger: 'blur' },
                        { min: 1, max: 300, message: '长度在 1~300 个字符', trigger: 'blur' }
                    ],
                }
            }
        },
        props:{
            // 是否显示弹框
            dialogVisible:{
                type:Boolean,
                default:false
            },
            // 部门负责人列表
            employeesList:{
                type:Array,
                default(){
                    return []
                }
            },
            // 编辑状态
            isEdit:{
                type:Boolean,
                default:false
            },
            // 原始数据用作检验依据
            originList:{
                type:Array,
                default(){
                    return []
                }
            },
            // 当前操作部门的id
            parentId:{
                type:String,
                default:''
            }
        },
        methods:{
            // 取消点击事件
            cancelFn(){
                this.$emit('update:dialogVisible',false);
                this.resetForm();
            },
            // 确定点击事件
            enterFn(){
                this.$refs.deptForm.validate(async(valid)=>{
                    if(valid){
                        // 将form数据传递给父组件用来发送请求
                        this.$emit('addDepartEv',this.form);
                        this.$emit('update:dialogVisible',false);
                        this.resetForm();
                    }
                })
            },
            // 重置表单数据
            resetForm(){
                this.form={
                    name:'',
                    code:'',
                    manager:'',
                    introduce:''
                }
                // 移除表单项的校验结果
                this.$refs['deptForm'].clearValidate();
            },
            // 显示弹框时文件框自动获取焦点
            openHandler(){
                this.$nextTick(()=>{
                    this.$refs.nameinput.focus();
                });
            }
        }
    }
</script>

<style lang="scss" scpoed>

</style>
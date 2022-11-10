<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="box-card">
        <div  slot="header" clear="clearfix">
          <el-tabs v-model="activeName">
            <el-tab-pane label="角色管理" name="first">
              <el-button type="primary" size="small" icon="el-icon-plus" @click="addRoleBtnFn">新增角色</el-button>
              <!-- 信息表格 -->
              <el-table :data="rolesList" style="width:100%" border v-loading="loading">
                <el-table-column type="index" label="序号" width="120"></el-table-column>
                <el-table-column prop="name" label="角色名" width="240"></el-table-column>
                <el-table-column prop="description" label="描述"></el-table-column>
                <el-table-column label="操作">
                  <template v-slot:default="scope">
                    <el-button size="small" type="success" @click="setRoles(scope.row)">分配权限</el-button>
                    <el-button size="small" type="primary" @click="editRoles(scope.row)">编辑</el-button>
                    <el-button size="small" type="danger" @click="delRoles(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <!-- 分页器 -->
              <el-pagination
                :current-page="query.page"
                :page-sizes="[10,15,20,25]"
                :page-size="query.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </el-tab-pane>
            <el-tab-pane label="公司信息" name="second">
              <el-alert 
                title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
                type="info" show-icon :closable="false"
              />
              <el-form :model="formData" label-width="120px" style="margin-top:50px">
                <el-form-item label="公司名称">
                  <el-input v-model="formData.name" disabled style="width:400px" />
                </el-form-item>
                <el-form-item label="公司地址">
                  <el-input v-model="formData.companyAddress" disabled style="width:400px" />
                </el-form-item>
                <el-form-item label="邮箱">
                  <el-input v-model="formData.mailbox" disabled style="width:400px" />
                </el-form-item>
                <el-form-item label="备注">
                  <el-input v-model="formData.remarks" type="textarea" :rows="3" disabled style="width:400px" />
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-card>
      <!-- 弹框 -->
      <el-dialog :title="isEdit?'编辑角色':'新增角色'" 
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible.sync="showDialog"
        @closed="resetForm">
        <el-form ref="roleForm" :model="roleForm" :rules="roleRules" label-width="100px">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="roleForm.name" />
          </el-form-item>
          <el-form-item label="角色描述" prop="description">
            <el-input v-model="roleForm.description" />
          </el-form-item>
        </el-form>
        <!-- 底部 -->
        <el-row slot="footer" type="flex" justify="center">
            <el-button size="small" @click="cancelRole">取消</el-button>
            <el-button size="small" type="primary" @click="submitRole">确定</el-button>
        </el-row>
      </el-dialog>
      <el-dialog title="分配权限" :visible.sync="dialogVisible" @close="setVisible">
        <AssignPermission :roleId="roleId" @close="setVisible" @confirmFn="confirmFn"
         :permissionList="permissionList" :roleIdsList="roleIdsList"/>
      </el-dialog>
    </div>
  </div>
</template>
  
<script>
import {getRolesAPI, getCompanyInfoAPI, addRoleAPI, 
        getRoleIdAPI, updateRoleAPI, deleteRoleAPI, 
        getPermissionListAPI, assignPermAPI} from '@/api'
import {mapGetters} from 'vuex'
import AssignPermission from './assignPermission.vue'
import {transTree} from '@/utils'

export default {
  components:{AssignPermission},
  data(){
    return {
      activeName:'first',
      query:{
        page:1,// 当前页码
        pageSize:10// 单页显示条数
      },
      rolesList:[],// 角色列表
      total:0,// 角色数据总条数
      loading:true,// 加载状态
      formData:{},// 公司表单数据
      roleForm:{},// 所操作的角色信息
      showDialog:false,// 是否显示弹框
      roleForm:{
        name:'',
        description:''
      },
      roleRules:{
        name:[{ required:true, message:'角色名称不能为空', trigger:'blur' }],
        description:[{ required:true, message:'角色描述不能为空', trigger:'blur' }]
      },
      isEdit:false,// 编辑状态
      roleId:'',
      dialogVisible:false,
      permissionList:[],// 权限点数组
      roleIdsList:[],// 当前角色的权限点数组
    }
  },
  computed:{
    ...mapGetters(['companyId']),
  },
  created(){
    // 调用获取角色列表的方法
    this.getRolesList();
    // 调用获取公司信息的方法
    this.getCompanyInfo();
    // 调用获取权限点列表的方法
    this.getPermissionListFn();
  },
  methods:{
    // 获取角色列表
    async getRolesList(){
      const res=await getRolesAPI(this.query);
      this.loading=false;
      if(!res.success) return this.$message.error(res.message);
      this.rolesList=res.data.rows;
      this.total=res.data.total;
    },
    // 获取公司信息
    async getCompanyInfo(){
      const res=await getCompanyInfoAPI(this.companyId);
      if(!res.success) return this.$message.error(res.message);
      this.formData=res.data[0];
    },
    // 弹框取消操作
    cancelRole(){
      this.resetForm();
    },
    // 弹框确定操作
    submitRole(){
      this.$refs.roleForm.validate(async valid=>{
        if(valid){
          // 新增操作
          if(!this.isEdit){
            const res=await addRoleAPI(this.roleForm);
            if(!res.success) return this.$message.error(res.message);
            this.$message.success(res.message);
          }else{// 编辑操作
            const res=await updateRoleAPI(this.roleForm);// 此时编辑状态数据回显roleForm上存在id
            if(!res.success) return this.$message.error(res.message);
            this.$message.success(res.message);
          }
          // 重新获取权限列表数据
          this.getRolesList();
          this.resetForm();
        }
      });
    },
    // 新增角色按钮点击事件
    addRoleBtnFn(){
      this.isEdit=false;
      this.showDialog=true;
    },
    // 每页显示的条数发生改变时触发
    handleSizeChange(newSize){
      this.query.pageSize=newSize;
      this.getRolesList();
    },
    // 当前页码发生改变时触发
    handleCurrentChange(newPage){
      this.query.page=newPage;
      this.getRolesList();
    },
    // 设置角色
    async setRoles(data){
      // 清除数据，防止数据闪现
      this.roleIdsList=[];
      this.dialogVisible=true;
      this.roleId=data.id;
      const res=await getRoleIdAPI(data.id).catch(err=>console.dir(err));
      this.roleIdsList=res?.data.permIds;
    },
    // 编辑角色
    async editRoles(data){
      this.isEdit=true;
      const res=await getRoleIdAPI(data.id);
      if(!res.success) return this.$message.error(res.message);
      this.roleForm=res.data;
      this.showDialog=true;
    },
    // 删除角色
    async delRoles(data){
      const delRes=await this.$confirm('是否确定删除该角色?','提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).catch(err=>console.dir(err));
      if(delRes==='cancel') return this.$message.info('取消删除');
      const res=await deleteRoleAPI(data.id);
      if(!res.success) return this.$message.error(res.message);
      this.$message.success(res.message);
      // 判断当前数据的长度是否等于1
      if(this.roleList.length===1){
        this.query.page--;
        // 如果是第一页的第一条
        if(this.query.page===0){
          this.query.page=1;
        }
      }
      this.getRolesList();
    },
    // 重置表单组件
    resetForm(){
      this.$refs.roleForm.resetFields();
      this.showDialog=false;
    },
    // 关闭弹框
    setVisible(){
      this.dialogVisible=false;
    },
    // 获取权限点列表
    async getPermissionListFn(){
      const res=await getPermissionListAPI().catch(err=>console.dir(err));
      this.permissionList=transTree(res.data,'0');
    },
    // 分配权限菜单点击事件
    async confirmFn(data){
      const res=await assignPermAPI(data);
      if(res.success) this.$message.success(res.message);
      this.dialogVisible=false;
      this.getRolesList();
    }
  }
}
</script>
  
<style lang="scss" scoped>
.box-card {
  padding: 10px 30px;
}

.tab-pane {
  padding: 20px;
}

.el-pagination {
  text-align: center;
  margin-top: 20px;
}
</style>
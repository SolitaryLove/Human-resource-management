<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <div style="text-align:right;margin-bottom:20px">
          <el-button type="primary" size="small" @click="addPermission(1,'0')">添加权限</el-button>
        </div>
        <el-table :data="permissionList" row-key="id" border>
          <el-table-column label="名称" prop="name" />
          <el-table-column label="标识" prop="code" />
          <el-table-column label="描述" prop="description" />
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button v-if="row.type === 1" type="text" @click="addPermission(2,row.id)">添加</el-button>
              <el-button type="text" @click="editFn(row.id)">编辑</el-button>
              <el-button type="text" @click="delFn(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <PerDialog ref="perDialog" :showDialog.sync="showDialog" 
       :pid="pid" :type="type" :formDataObj="formData" isEdit="isEdit" :originList="originList"
       @close="dialogCloseFn" @confirm="confirmFn" />
    </div>
  </div>
</template>
  
<script>
import { getPermissionListAPI, addPermissionAPI, 
         getPermissionDetailAPI, updatePermissionAPI, delPermissionAPI } from '@/api'
import { transTree } from '@/utils';
import PerDialog from './components/perDialog.vue';

export default {
  name: 'Permission',
  components:{PerDialog},
  data() {
    return {
      permissionList: [],// 权限管理列表
      showDialog:false,
      type:'',// 1 → 路由访问权限；2 → 按钮操作权限
      pid:'',
      isEdit:'',// 编辑状态
      formData:{},// 编辑状态下要回显的数据
      originList:[],// 校验需要的数据
    }
  },
  created() {
    // 调用获取权限管理列表的方法
    this.getPermissionList();
  },
  methods: {
    // 获取权限管理列表
    async getPermissionList() {
      const res = await getPermissionListAPI().catch(err => console.dir(err));
      if (!res.success) return this.$message.error(res.message);
      this.originList=res.data.map(({ id, pid, name, code })=>({ id, pid, name:name?.trim(), code }));
      this.permissionList = transTree(res.data, '0');
    },
    // 添加权限按钮点击事件
    addPermission(type,id){
      this.isEdit=false;
      this.showDialog=true;
      this.type=type;
      this.pid=id;
    },
    // 关闭弹框
    dialogCloseFn(){
      this.showDialog=false;
    },
    // 添加/更新权限
    async confirmFn(data){
      if(this.isEdit){
        const res=await updatePermissionAPI(data).catch(err=>console.dir(err));
        if(!res.success) return this.$message.error(res.message);
        this.$message.success(res.message);
      }else{
        const res=await addPermissionAPI(data).catch(err=>console.dir(err));
        if(!res.success) return this.$message.error(res.message);
        this.$message.success(res.message);
      }
      this.getPermissionList();
      this.$refs.perDialog.$refs.perForm.resetFields();
      this.showDialog=false;
    },
    // 编辑权限
    async editFn(id){
      this.isEdit=true;
      this.showDialog=true;
      const res=await getPermissionDetailAPI(id).catch(err=>console.dir(err));
      if(!res.success) return this.$message.error(res.message);
      this.formData=res.data;
    },
    // 删除权限
    async delFn(id){
      const confirmRes=await this.$confirm('是否删除该权限','提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).catch(err=>console.dir(err));
      if(confirmRes==='cancel') return this.$message.info('取消删除');
      const res=await delPermissionAPI(id);
      if(!res.success) return this.$message.error(res.message);
      this.$message.success(res.message);
      this.getPermissionList();
    }
  }
}
</script>
  
<style lang="scss" scoped>

</style>
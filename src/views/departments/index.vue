<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="box-card">
        <!-- <div slot="header" class="clearfix"> -->
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="组织导航" name="first">
                <el-row type="flex" justify="space-between" align="middle" class="department-header">
                  <el-col :span="20">
                    <i class="el-icon-s-home"></i>
                    <span style="margin-left:10px">安徽合肥牛马网络科技有限公司</span>
                  </el-col>
                  <el-col :span="4">
                    <el-row type="flex" justify="end">
                      <el-col>负责人</el-col>
                      <el-col>
                        <el-dropdown>
                          <span class="el-dropdown-link">
                            操作<i class="el-icon-arrow-down el-icon--right"></i>
                          </span>
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="add()">添加子部门</el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
                <el-tree class="departments-tree" 
                 :data="treeData" :props="defaultProps" 
                 :default-expand-all="true"
                 v-loading="loading">
                  <template #default="{data}">
                    <el-row type="flex" justify="space-between" align="middle" style="height:40px;width:100%">
                      <!-- 部门名 -->
                      <el-col :span="20"><span>{{data.name}}</span></el-col>
                      <!-- 操作区 -->
                      <el-col :span="4">
                        <el-row type="flex" justify="end">
                          <el-col>{{data.manager}}</el-col>
                          <el-col>
                            <el-dropdown>
                              <span>操作<i class="el-icon-arrow-down"/></span>
                              <el-dropdown-menu v-slot="dropdown">
                                <el-dropdown-item @click.native="add(data)">添加子部门</el-dropdown-item>
                                <el-dropdown-item @click.native="edit(data)">编辑部门</el-dropdown-item>
                                <el-dropdown-item v-if="data&&!data.children" @click.native="del(data.id)">删除部门</el-dropdown-item>
                              </el-dropdown-menu>
                            </el-dropdown>
                          </el-col>
                        </el-row>
                      </el-col>
                    </el-row>
                  </template>
                </el-tree>
              </el-tab-pane>
            </el-tabs>
        <!-- </div> -->
      </el-card>
    </div>
    <DepartDialog ref="departDialog" :dialogVisible.sync="showDepartDialog" 
     :employeesList="employeesList" @addDepartEv="addDepartmentsFn" 
     :isEdit="isEdit" :originList="originList" :parentId="clickDepartId"/>
  </div>
</template>
  
<script>
import {departmentsListAPI, getEmployeeSimpleAPI, 
        addDepartmentAPI, getDepartDetailAPI, 
        updateDepartmentsAPI, delDepartmentAPI
       } from '@/api'
import {transTree} from '@/utils'
import DepartDialog from './components/departDialog.vue'

export default {
  data() {
    return {
      activeName: 'first', // 被激活的 Tab 标签页
      treeData:[],
      // 定义结构显示
      defaultProps: {
        // children: 'children',
        label: 'name'
      },
      showDepartDialog:false,// 是否展示弹框
      loading:true,// 加载状态
      employeesList:[],// 员工列表
      clickDepartId:'',// 当前所点击的部门id
      isEdit:false,// 编辑标识
      originList:[],// 作为校验依据的数据
    }
  },
  components:{DepartDialog},
  created(){
    this.loading=true;
    this.getDepartmentsList();
    this.getEmployeeListFn();
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    // 获取组织架构信息
    async getDepartmentsList(){
      const res=await departmentsListAPI();
      // 格式化需要传递给子组件的数据
      this.originList=res.data.depts.map(item=>(
        {
          id:item.id,
          code:item.code,
          name:item.name,
          pid:item.pid
        }
      ));
      this.treeData=transTree(res.data.depts,'');
      this.loading=false;
    },
    // 获取员工列表数据
    async getEmployeeListFn(){
      const res=await getEmployeeSimpleAPI();
      this.employeesList=res.data;
    },
    // 添加子部门
    add(data){
      this.isEdit=false;
      if(data){// 添加二级以下部门
        this.clickDepartId=data.id;// 保存当前部门id
      }else{// 添加一级部门
        this.clickDepartId='';// 一级部门的pid是''
      }
      this.showDepartDialog=true;// 显示弹框
    },
    async addDepartmentsFn(data){
      data.pid=this.clickDepartId;
      const res=await addDepartmentAPI(data);
      this.getDepartmentsList();
    },
    async edit(data){
      this.isEdit=true;
      this.clickDepartId=data.id;// 保存当前要编辑的部门id
      this.showDepartDialog=true;
      const res=await getDepartDetailAPI(data.id)
      this.$refs.departDialog.form=res.data;// 影响组件表单中的form对象
    },
    async addDepartmentsFn(data){
      if(this.isEdit){
        data.id=this.clickDepartId;
        const res=await updateDepartmentsAPI(data);
        this.$message.success('更新成功');
      }else{
        data.pid=this.clickDepartId;
        const res=await addDepartmentAPI(data);
        this.$message.success('添加成功');
      }
      this.getDepartmentsList();
    },
    async del(id){
      const delRes=await this.$confirm('确定删除该部门吗?','提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).catch(err=>this.$message.error(err));
      // 如果返回的结果是cancel,说明用户取消了删除操作
      if(delRes==='cancel') return this.$message('取消删除');
      // 调用删除接口
      const delDepartRes=await delDepartmentAPI(id);
      // 根据返回的状态值判断是否删除成功
      if(!delDepartRes.success) return this.$message.error(delDepartRes.message);
      this.$message.success(delDepartRes.message);
      this.getDepartmentsList();
    }
  }
}
</script>
  
<style lang="scss" scoped>
.box-card {
  padding: 10px 50px;
}

.tab-pane {
  padding: 20px 80px;

  .company {
    margin-left: 12px;
    font-weight: bold;
    font-size: 14px;
  }

  .department-header {
    height: 60px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ccc;
  }

}
.departments-tree{
  margin:12px 0px;
}
</style>
<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 工具栏 -->
      <PageTools>
        <template v-slot:slot-left>
          <span>共 19 条记录</span>
        </template>
        <template v-slot:slot-right>
          <el-button v-power="'power'" type="danger" size="small" @click="uploadExcelBtnFn">导入Excel</el-button>
          <el-button type="success" size="small" @click="exportBtnFn">导出Excel</el-button>
          <el-button type="primary" size="small" @click="addEmpShowDialogFn">新增员工</el-button>
        </template>
      </PageTools>
      <!-- 数据区 -->
      <el-card style="margin-top:10px">
        <el-table :data="employeesList" :default-sort="{prop:'workNumber'}" border>
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column label="姓名" prop="username"></el-table-column>
          <el-table-column label="头像" prop="staffPhoto">
            <template v-slot="{row}">
              <!-- <img :src="row.staffPhoto" alt="" style="border-radius:50%;width:65px;height:65px;"> -->
              <ImageHolder class="staffPhoto" :src="row.staffPhoto" />
            </template>
          </el-table-column>
          <el-table-column label="手机号" prop="mobile"></el-table-column>
          <el-table-column label="工号" prop="workNumber" sortable :sort-method="workNumberSortFn"></el-table-column>
          <el-table-column label="聘用形式" prop="formOfEmployment" :formatter="formatter"></el-table-column>
          <el-table-column label="部门" prop="departmentName"></el-table-column>
          <el-table-column label="入职时间" prop="timeOfEntry">
            <template v-slot="{row}">
              {{formatTime(row.timeOfEntry)}}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="280" fixed="right">
            <template v-slot="{row}">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail?id=${row.id}`)">查看</el-button>
              <el-button type="text" size="small" @click="setEmp(row.id)">分配角色</el-button>
              <el-button type="text" size="small" @click="delEmp(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-row type="flex" justify="center" align="middle" style="height:60px">
          <el-pagination
            :current-page="query.page"
            :page-sizes="[10,15,20,25]"
            :page-size="query.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-row>
      </el-card>
      <el-dialog title="新增员工" :visible.sync="showDialog" @close="addEmpDialogCloseFn">
        <EmpDialog :s-dialog.sync="showDialog" :treeData="treeData" @addEmpEV="addEmpFn" ref="addEmpDialog"/>
      </el-dialog>
      <el-dialog title="分配角色" :visible.sync="showRoleDialog" @close="cancelDialog">
        <AssignRoleDialog :userId="userId" :roleList="roleList" :roleIds="roleIds" 
         @confirm="addRoleFn" @close="showRoleDialog=false" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {getEmployeeListAPI, departmentsListAPI, addEmployeeAPI, 
        delEmployeeAPI, getRolesAPI, getUserDetailByIdAPI, assignRolesAPI} from '@/api'
import Employees from '@/api/constant/employees'
import {transTree} from '@/utils'
import EmpDialog from './components/empDialog.vue'
import AssignRoleDialog from './components/assignRoleDialog.vue'
import dayjs from 'dayjs'

export default {
  name:'Employees',
  components:{EmpDialog, AssignRoleDialog},
  data(){
    return {
      query:{
        page:1,
        size:10
      },
      employeesList:[],// 员工列表
      total:0,
      showDialog:false,
      treeData:[], // 部门列表
      allEmployeesList:[],// 所有的员工数据
      showRoleDialog:false,
      userId:'',// 当前操作的员工ID
      roleList:[],// 角色列表
      roleIds:[],// 当前员工所关联的角色
    }
  },
  created(){
    // 调用获取员工列表的方法
    this.getEmployeeList();
    // 调用获取部门列表的方法
    this.getDepartments();
    // 调用获取角色列表的方法
    this.getRoleListFn();
  },
  methods:{
    // 请求获取员工列表
    async getEmployeeList(){
      const res=await getEmployeeListAPI(this.query);
      if(!res.success) return this.$message.error(res.message);
      this.employeesList=res.data.rows;
      this.total=res.data.total;
      // 请求获取所有员工数据
      const allRes=await getEmployeeListAPI({page:1,size:this.total});
      this.allEmployeesList=allRes.data.rows;
    },
    // 格式化聘用形式
    formatter(row,column,cellValue,index){
      const obj=Employees.hireType.find(item=>item.id === cellValue);
      return obj?obj.value:'未知';
    },
    // 自定义排序方法
    workNumberSortFn(prev,cur){
      return parseInt(prev.workNumber)-parseInt(cur.workNumber);
    },
    // 点击新增员工事件
    addEmpShowDialogFn(){
      this.showDialog=true;
    },
    // 每页显示的条数发生改变时触发
    handleSizeChange(newSize) {
      this.query.size=newSize;
      this.getEmployeeList();
    },
    // 当前页面发生改变时触发
    handleCurrentChange(newPage) {
      this.query.page=newPage;
      this.getEmployeeList();
    },
    // 获取部门列表
    async getDepartments(){ 
      const res=await departmentsListAPI();
      if(!res.success) return this.$message.error(res.message);
      this.treeData=transTree(res.data.depts,'');
    },
    // 新增员工
    async addEmpFn(formData){
      const res=await addEmployeeAPI(formData);
      if(!res.success) return this.$message.error(res.message);
      this.$message.success(res.message);
      this.getEmployeeList();
    },
    // 关闭弹框事件
    addEmpDialogCloseFn(){
      this.$refs.addEmpDialog.$refs.addForm.resetFields();
    },
    // 删除员工
    async delEmp(id){
      const delRes=await this.$confirm('确定删除吗?','提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).catch(err=>console.dir(err));
      if(delRes==='cancel') return this.$message.info('您取消了删除');
      const res=await delEmployeeAPI(id);
      if(!res.success) return this.$message.error(res.message);
      this.$message.success(res.message);
      // 分页异常处理
      if(this.employeesList.length===1){
        this.query.page--;
        if(this.query.page<=0){
          this.query.page=1;
        }
      }
      this.getEmployeeList();
    },
    // 格式化入职日期
    formatTime(time){
      return dayjs(time).format('YYYY-MM-DD');
    },
    // 导入Excel按钮点击事件
    uploadExcelBtnFn(){
      this.$router.push('/excel');
    },
    // 导出Excel按钮点击事件
    exportBtnFn(){
      // import()是webpack提供的一种模块引入方法，类似懒加载，点击导出按钮时才去引入对应js
      // import() 参数：要引入的包名，返回值：Promise对象
      import('@/vendor/Export2Excel').then(excel => {
        // excel是import方法引入的模块所暴露的对象
        const tHeader = ['序号', '姓名', '头像', '手机号', '工号', '聘用形式', '部门', '入职时间', '转正时间'];
        // 将请求回来的数组{[]} → [[]]
        const zhToEnObj={
          '姓名':'username',
          '头像':'staffPhoto',
          '手机号':'mobile',
          '工号':'workNumber',
          '聘用形式':'formOfEmployment',
          '部门':'departmentName',
          '入职时间':'timeOfEntry'  
        }
        let employeesArr=this.allEmployeesList.map((enObj,index)=>{
          let newArr=[];
          tHeader.forEach(zhKey=>{
            if(zhKey==='序号'){
              newArr.push(index+1);
            }else{
              const enKey=zhToEnObj[zhKey];
              const value=enObj[enKey];
              if(enKey==='formOfEmployment'){
                const obj=Employees.hireType.find(item=>item.id===parseInt(value));
                newArr.push(obj?obj.value:'未知');
              }else{
                newArr.push(value);
              }
            }
          });
          return newArr;
        });
        // export_json_to_excel()是vendor/Export2Excel.js文件内封装的导出excel文件的方法
        excel.export_json_to_excel({
          header: tHeader,// 表格文件的列标题(数组)
          data: employeesArr,// 表格文件的数据(二维数组)
          filename: '导出表',// 文件名
          autoWidth: this.autoWidth,// 单元格宽度自适应
          bookType: 'xlsx',// 文件类型
        })
      });
    },
    // 关闭分配角色弹框事件
    cancelDialog(){
      this.showRoleDialog=false;
    },
    // 分配角色按钮点击事件
    setEmp(id){
      this.userId=id;
      this.showRoleDialog=true;
    },
    // 获取角色列表
    async getRoleListFn(){
      const res=await getRolesAPI();
      this.roleList=res.data.rows;
      this.getUserRoles();
    },
    // 获取员工详情数据
    async getUserRoles(){
      const infoRes=await getUserDetailByIdAPI(this.userId);
      if(!infoRes.success) return this.$message.error(infoRes.message);
      this.roleIds=infoRes.data.roleIds;
    },
    // 员工角色分配
    async addRoleFn(roleIds){
      const res=await assignRolesAPI({id:this.userId,roleIds});
      if(!res.success) return this.$message.error(res.message);
      this.$message.success(res.message);
      this.showRoleDialog=false;
      this.getEmployeeList();
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
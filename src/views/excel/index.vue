<template>
    <!-- Excel 导入功能组件 -->
    <UploadExcel :on-success="handleSuccess" />
</template>

<script>
import {formatExcelDate} from '@/utils'
import dayjs from 'dayjs'
import {importEmployeeAPI} from '@/api'

export default {
    name: 'Excel',
    methods: {
        // 导入成功以后的回调函数
        async handleSuccess({ results, header }) {
            const arr=this.transExcel(results);
            const res=await importEmployeeAPI(arr).catch(err=>console.dir(err));
            if(!res.success) return this.$messge.error(res.message);
            this.$router.back();
            this.$message.success(res.message);
        },
        // 将表格中的数据进行格式化
        transExcel(results){
            // 中英文映射关系
            const userRelations = {
                '入职日期': 'timeOfEntry',
                '手机号': 'mobile',
                '姓名': 'username',
                '转正日期': 'correctionTime',
                '工号': 'workNumber',
                '部门': 'departmentName',
                '聘用形式': 'formOfEmployment'
            }
            return results.map(oldObj=>{
                const newObj={};
                // 1.取出该对象所有的属性名
                // 2.遍历这个数组，通过中文名去userRelations找对应英文名保存值
                const contentKeys=Object.keys(oldObj);
                contentKeys.forEach(key=>{
                    // 找到对应的英文名
                    const transKey=userRelations[key];
                    // 如果格式化的是时间则需要进行转换
                    if(transKey==='timeOfEntry'||transKey==='correctionTime'){
                        // 表格的天数 → 转成日期对象
                        const transDate = new Date(formatExcelDate(oldObj[key]))
                        // 将日期对象年/月/日 → '年-月-日'保存到对象属性里给后台
                        newObj[transKey] = dayjs(transDate).format('YYYY-MM-DD');
                    }else{
                        newObj[transKey] = oldObj[key]
                    }
                });
                return newObj;
            });
        },
    }
}
</script>
  
<style lang="scss" scoped>

</style>
  
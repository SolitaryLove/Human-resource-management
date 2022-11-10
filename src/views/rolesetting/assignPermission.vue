<template>
    <div>
        <el-tree ref="tree" :data="permissionList" :props="{ label: 'name' }" 
         show-checkbox default-expand-all check-strictly node-key="id" />
        <el-row class="footer" type="flex" justify="center">
            <el-col :span="6">
                <el-button size="small" @click="cancelButton">取消</el-button>
                <el-button size="small" type="primary" @click="setRolesButton">确定</el-button>
            </el-col>
        </el-row>
    </div>
</template>

<script>

export default {
    name: 'AssignPermission',
    props: {
        permissionList: {
            type: Array,
            default: _ => [],
        },
        roleId: {
            type: [Number, String],
            required: true,
        },
        roleIdsList: {
            type: Array,
            default: _ => [],
        }
    },
    watch: {
        roleIdsList() {
            this.$refs.tree.setCheckedKeys(this.roleIdsList);
        }
    },
    methods: {
        cancelButton() {
            this.$emit('close');
        },
        setRolesButton() {
            const permIds=this.$refs.tree.getCheckedKeys();
            this.$emit('confirmFn',{id:this.roleId,permIds:permIds});
        }
    }

}
</script>

<style lang="scss" scoped>
.footer {
    margin-top: 30px;
}
</style>
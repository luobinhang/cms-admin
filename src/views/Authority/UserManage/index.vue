<template>
  <div class="app-container">

    <!-- 操作区 -->
    <div class="filter-container flex flex-end">
      <el-button type="primary" icon="el-icon-plus" v-waves @click="add">新增</el-button>
    </div>

    <!-- 表格 -->
    <el-table
      :data="list" row-key="id" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" type="index" label="序号" width="65"></el-table-column>
      <el-table-column min-width="110px" align="center" label="角色名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="110px" align="center" label="角色代码">
        <template slot-scope="scope">
          <span>{{scope.row.alias}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="110px" align="center" label="角色描述">
        <template slot-scope="scope">
          <span>{{scope.row.description}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="140px" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.createDate | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="280px">
        <template slot-scope="scope">
          <el-button size="mini" type="warning" icon="el-icon-edit" v-waves @click="handleAuthorize(scope.$index, scope.row)">授权</el-button>
          <el-button size="mini" type="primary" icon="el-icon-edit" v-waves @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" v-waves @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div style="text-align: center;padding: 20px 0">
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="pageChange"
        :page-size="pageNumber"
        :total="total">
      </el-pagination>
    </div>

    <!-- 新增弹窗 -->
    <el-dialog title="角色管理" :visible.sync="dialogFormVisible">
      <el-form :model="formData"  :rules="rules" ref="ruleForm">
        <el-form-item label="角色名称" prop="name" :label-width="formLabelWidth">
          <el-input v-model="formData.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色代码" :label-width="formLabelWidth">
          <el-input v-model="formData.alias" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" :label-width="formLabelWidth">
          <el-input v-model="formData.description" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" v-waves @click="submitForm" :loading="fromBtnLoading">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 权限弹窗 -->
    <el-dialog title="权限分配" :visible.sync="dialogAuthorityVisible">
      <el-tree
        :data="treeList"
        show-checkbox
        node-key="uuid"
        ref="tree"
        check-strictly
        default-expand-all
        :default-checked-keys="defaultCheck"
        :props="defaultProps">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAuthorityVisible = false">取 消</el-button>
        <el-button type="primary" v-waves @click="submitAuthority" :loading="fromBtnLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import waves from '@/directive/waves'
  import { getPageRole, getAllResource, editRolePermission, displayAllResource } from '@/api/Authority'
  import { deleteMessageBox } from '@/utils/messageBox'

  const defaultForm = {
    name: '',
    alias: '',
    description: '',
  }

export default {
  name: 'UserManage',
  directives: {
    waves
  },
  data() {
    return {
      list: null, //数据
      total: 0, //总数
      pageIndex: 1,
      pageNumber: 20,
      listLoading: true,  //表格loading
      formData:  Object.assign({},defaultForm),  //新增表单
      rules: {  //表单规则
        name: [
          { required: true, message: '请填写角色名称', trigger: 'blur' }
        ],
      },
      formLabelWidth: '120px', //表单标签宽
      dialogFormVisible: false,  //对话框显示
      fromBtnLoading: false, //表单按钮loading
      dialogType: '', //对话框类型
      dialogAuthorityVisible: false,
      defaultProps: {
        children: 'childMenu',
        label: 'name'
      },
      treeList: [], //权限树表
      defaultCheck: [], //默认选中树节点
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {  //获取数据
      this.listLoading = true
      getPageRole({
        pageIndex: this.pageIndex,
        pageNumber: this.pageNumber,
      }).then(response => {
        this.list = response.data.roles;
        this.total = response.data.total;
        this.listLoading = false;
      }).catch(()=>{
        this.listLoading = false;
      })
    },
    pageChange(val) {  //切换页面
      this.pageIndex = val;
      this.getList();
    },
    add() {  //头部添加按钮
      this.dialogFormVisible = true;
      this.formData = Object.assign({},defaultForm);
      this.dialogType = 'add';
    },
    handleAuthorize(index,row) {  //授权
      this.defaultCheck = [];
      this.roleUuid =  row.uuid;
      displayAllResource({roleUuid: this.roleUuid,systemType: 2}).then(response => {
        this.treeList = response.data
        this.dialogAuthorityVisible = true;
        this.handleData(response.data)
      })
    },
    handleData (data) {  //权限选中
      if(data && data.length > 0) {
        data.forEach(v => {
          if(v.isHaving) {
            this.defaultCheck.push(v.uuid)
          }
          this.handleData(v.childMenu)
        })
      }
    },
    handleEdit(index,row) {  //表格内编辑
      let object = JSON.parse(JSON.stringify(row))
      Object.assign(this.formData,{
        name: object.name,
        alias: object.alias,
        description: object.description
      })
      this.dialogFormVisible = true;
      this.dialogType = 'edit';
    },
    handleDelete(index,row) {  //表格内删除
      deleteMessageBox({ uuids: [row.uuid] }, deleteFooter, this.getList)
    },
    submitForm() {  //对话框确定
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.fromBtnLoading = true;
          let ajax, tipText;
          if(this.dialogType === 'add') {
            ajax = createFriendlyLink;
            tipText = '新增成功';
          } else if(this.dialogType === 'edit') {
            ajax = updateLink;
            tipText = '编辑成功';
          }
          ajax(this.linkForm).then(response => {
            this.$refs['ruleForm'].resetFields();
            this.fromBtnLoading = false;
            this.dialogFormVisible = false;
            this.$message.success(tipText);
            this.getList()
          }).catch(() => {
            this.fromBtnLoading = false;
            this.dialogFormVisible = false;
            this.$message.error('操作失败');
          })

        } else {
          this.$message.error('必填项请填写完整');
          return false;
        }
      });
    },
    submitAuthority() {
      this.fromBtnLoading = true;
      let resourceUuids = this.$refs.tree.getCheckedKeys().join(',')
      editRolePermission({
        roleUuid: this.roleUuid,
        resourceUuids: resourceUuids,
      }).then(response => {
        this.$message.success('授权成功');
        this.fromBtnLoading = false;
        this.dialogAuthorityVisible = false;
      }).catch(() => {
        this.fromBtnLoading = false;
        this.dialogAuthorityVisible = false;
        this.$message.error('授权失败');
      })
    }
  }
}
</script>

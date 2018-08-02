<template>
  <div class="app-container">

    <!-- 操作区 -->
    <div class="filter-container flex flex-end">
      <el-button type="primary" icon="el-icon-plus" v-waves @click="add">新增</el-button>
    </div>

    <!-- 表格区 -->
    <tree-table :data="list" stripe :expandAll="expandAll" border>
      <el-table-column label="标题">
        <template slot-scope="scope">
          <span style="color:sandybrown">{{scope.row.meta.title}}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="图标" width="100">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.meta.icon" v-if="scope.row.meta.icon"></svg-icon>
          <span v-else>无</span>
        </template>
      </el-table-column>
      <!--<el-table-column label="隐藏入口" width="100">-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{scope.row.hidden}}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column label="路径">
        <template slot-scope="scope">
          <span>{{scope.row.path}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="225" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button :type="scope.row._level == 3?'':'primary'" size="mini" @click="add(scope.row)" :disabled="scope.row._level == 3">新增</el-button>
          <el-button type="warning" size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </tree-table>

    <!-- 新增弹窗 -->
    <el-dialog title="路由管理" :visible.sync="dialogFormVisible">
      <el-form :model="formData"  :rules="rules" ref="ruleForm">
        <el-form-item label="标题" prop="name" :label-width="formLabelWidth">
          <el-input v-model="formData.name" auto-complete="off"></el-input>
        </el-form-item>

        <!--<el-form-item label="隐藏" prop="hidden" :label-width="formLabelWidth">-->
          <!--<el-radio v-model="formData.hidden" label="1">是</el-radio>-->
          <!--<el-radio v-model="formData.hidden" label="2">否</el-radio>-->
        <!--</el-form-item>-->
        <el-form-item label="路径" prop="url" :label-width="formLabelWidth">
          <el-input v-model="formData.url" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="图标" :label-width="formLabelWidth">
          <el-input v-model="formData.iconCls" auto-complete="off"></el-input>
          <a style="color: #409EFF" href="https://panjiachen.github.io/vue-element-admin-site/#/zh-cn/icon" target="_blank">详情参考</a>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" v-waves @click="submitForm" :loading="fromBtnLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import treeTable from '@/components/TreeTable'
import treeToArray from './customEval'
import waves from '@/directive/waves' // 水波纹指令
import { getAllResource, createResource, editResource } from '@/api/Authority'
import { handleData } from '@/utils/routerHandle'
import { deleteMessageBox } from '@/utils/messageBox'

const defaultForm = {
  name: '',
  iconCls: '',
//  hidden: '',
  url: '',
  pid: '',
  id: null,
  uuid: null,
}

export default {
  name: 'RouterManage',
  components: { treeTable },
  directives: {
    waves
  },
  data() {
    return {
      dialogFormVisible: false,
      formData: Object.assign({},defaultForm),
      rules: {  //表单规则
        name: [
          { required: true, message: '请填写标题', trigger: 'blur' }
        ],
//        hidden: [
//          { required: true, message: '请选择是否隐藏', trigger: 'change' }
//        ],
        url: [
          { required: true, message: '请填写路径', trigger: 'blur' }
        ],
      },
      formLabelWidth: '120px', //表单标签宽
      fromBtnLoading: false, //表单按钮loading
      dialogType: '', //对话框类型
      expandAll: false,
      list: [],
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {  //获取数据
      getAllResource({ systemType: 2 }).then(({ data }) => {
        this.list = handleData(data)
      })
    },
    add({ id }) {  //头部添加
      this.dialogFormVisible = true;
      this.formData = Object.assign({},defaultForm)
      if(id) Object.assign(this.formData,{ pid: id})
      this.dialogType = 'add';
    },
    handleDelete({ uuid }) {  //表格内删除
      this.formData = Object.assign({},defaultForm)
      Object.assign(this.formData,{
        uuid: uuid,
        status: 0,
      })
      deleteMessageBox(this.formData, editResource,this.getList)
    },
    handleEdit(index, row) {  //表格内编辑
      let object = Object.assign({},row)
      Object.assign(this.formData,{
        id: object.id,
        pid: object.pid,
        name: object.meta.title,
        iconCls: object.meta.icon,
        url: object.path,
        uuid: object.uuid,
        status: null,
      })
      this.dialogFormVisible = true;
      this.dialogType = 'edit';
    },
    submitForm() {  //对话框确定
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.fromBtnLoading = true;
          let ajax, tipText;
          if(this.dialogType === 'add') {
            ajax = createResource;
            tipText = '新增成功';
          } else if(this.dialogType === 'edit') {
            ajax = editResource;
            tipText = '编辑成功';
          }
          ajax(this.formData).then(response => {
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
  }
}
</script>

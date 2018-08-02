<template>
  <div class="app-container">

    <!-- 操作区 -->
    <div class="filter-container flex flex-end">
      <div>
        <el-button type="primary" icon="el-icon-plus" v-waves @click="addBtn">新增</el-button>
        <el-button type="danger" icon="el-icon-delete" v-waves @click="deleteBtn">删除</el-button>
      </div>
    </div>

    <!-- 表格 -->
    <el-table
      :data="list" row-key="id" @selection-change="handleSelectionChange"
      v-loading.body="listLoading" border fit style="width: 100%">
      <el-table-column align="center" type="selection" width="55"></el-table-column>
      <el-table-column align="center" type="index" label="序号" width="65"></el-table-column>
      <el-table-column min-width="110px" align="center" label="栏目名称">
        <template slot-scope="scope">
          <span>{{scope.row.columnName}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="110px" align="center" label="子类">
        <template slot-scope="scope">
          <div style="margin: -5px 0;overflow: hidden">
            <el-tag
              :key="$index"
              v-for="(tag,$index) in scope.row.footerChildList"
              disable-transitions>{{tag.name}}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200px">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" v-waves @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" v-waves @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增弹窗 -->
    <el-dialog title="底部管理" :visible.sync="dialogFormVisible">
      <el-form :model="formData"  :rules="rules" ref="ruleForm">
        <el-form-item label="栏目名称" prop="columnName" :label-width="formLabelWidth">
          <el-input v-model="formData.columnName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item class="newTagList">
          <div v-for="(item, $index) in formData.footerChildList" v-if="item.status !== 0 " :key="$index" class="flex newTagItem">
            <div class="flex flex-end" style="padding-right: 12px;width: 120px;">
              <el-form-item
                class="flex-1"
                :rules="{required: true, message: '子类名不能为空', trigger: 'blur'}"
                :prop="'footerChildList.' + $index + '.name'">
                <el-input v-model="item.name" auto-complete="off" style="width:108px" placeholder="子类名"></el-input>
              </el-form-item>
            </div>
            <div class="flex-1">
              <el-form-item
                class="flex-1"
                :rules="{required: true, message: '网址不能为空', trigger: 'blur'}"
                :prop="'footerChildList.' + $index + '.link'">
                <el-input v-model="item.link" auto-complete="off" placeholder="请输入网址"></el-input>
              </el-form-item>
            </div>
            <div style="width: 68px;padding-left: 12px;">
              <el-button type="danger" icon="el-icon-delete" v-waves @click="deleteTag($index)"></el-button>
            </div>
          </div>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth">
          <el-button size="mini" icon="el-icon-plus" v-waves @click="addNewTag">新增子类</el-button>
        </el-form-item>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelForm">取 消</el-button>
        <el-button type="primary" v-waves @click="submitForm" :loading="fromBtnLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { footerColumn, deleteFooter, createFooter, editFooter } from '@/api/SystemMaintenance'
  import Sortable from 'sortablejs'
  import waves from '@/directive/waves'
  import { deleteMessageBox } from '@/utils/messageBox'


const defaultFormData = {
  tagSortName: '',
  tagSignList: [],
}


export default {
  name: 'footerManage',
  directives: {
    waves
  },
  data() {
    return {
      list: null, //数据
      listLoading: true,  //表格loading
      sortable: null, //表格排序
      formData: Object.assign({},defaultFormData), //表单数据
      rules: {  //表单规则
        columnName: [
          { required: true, message: '请填写栏目名称', trigger: 'blur' }
        ],
      },
      formLabelWidth: '120px', //表单标签宽
      dialogFormVisible: false,  //对话框显示
      fromBtnLoading: false, //表单按钮loading
      tableSelection: [], //表格选中id
      dialogType: '', //对话框类型
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {  //获取数据
      this.listLoading = true
      footerColumn().then(response => {
        this.list = response.data;
        this.listLoading = false;
//        this.$nextTick(() => {
//          this.setSort();
//        })
      }).catch(()=>{
        this.listLoading = false;
      })
    },
    addBtn() {  //头部添加按钮
      this.dialogFormVisible = true;
      this.dialogType = 'add';
      this.formData = Object.assign({},defaultFormData);
    },
    deleteBtn() {  //头部删除按钮
      if(this.tableSelection.length === 0) {
        this.$message.warning('未选中任何数据');
      } else {
        deleteMessageBox({ uuids: this.tableSelection },deleteFooter,this.getList)
      }
    },
    handleSelectionChange(val) {  //表格选中
      this.tableSelection = [];
      val.forEach((v,i) => {
        this.tableSelection.push(v.uuid)
      })
    },
    handleEdit(index,row) {  //表格内编辑
      let object = JSON.parse(JSON.stringify(row))
      Object.assign(this.formData,{
        columnName: object.columnName,
        uuid: object.uuid,
        footerChildList: object.footerChildList
      })
      this.dialogFormVisible = true;
      this.dialogType = 'edit';
    },
    handleDelete(index,row) {  //表格内删除
      deleteMessageBox({ uuids: [row.uuid] }, deleteFooter, this.getList)
    },
    addNewTag() {  //新增子类
      this.formData.footerChildList.push({ name: '', link: '' })
    },
    deleteTag(index) {  //删除子类
      let list = this.formData.footerChildList;
      if(list[index].uuid) {
        Object.assign(list[index],{status: 0})
      } else {
        list.splice(index, 1)
      }
    },
    submitForm() {  //对话框确定
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.fromBtnLoading = true;
          let ajax, tipText;
          if(this.dialogType === 'add') {
            ajax = createFooter;
            tipText = '新增成功';
          } else if(this.dialogType === 'edit') {
            ajax = editFooter;
            tipText = '编辑成功';
          }

          ajax(this.formData).then(response => {
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
          return false;
        }
      });
    },
    cancelForm() {  //对话框取消
      this.$refs['ruleForm'].resetFields();
      this.dialogFormVisible = false;
    },
    setSort() {  //表格排序
      const el = document.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost',
        setData: function(dataTransfer) {
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          const targetRow = this.list.splice(evt.oldIndex, 1)[0]
          this.list.splice(evt.newIndex, 0, targetRow)
        }
      })
    },
  }
}
</script>

<style scoped lang="scss">
  .newTagItem{
    margin-bottom: 22px;
    &:last-child{
      margin-bottom: 0;
    }
  }
  .el-tag{
    margin: 5px 0;
  }
  .el-tag+.el-tag {
    margin-left: 10px;
  }
</style>


<template>
  <div class="app-container">

    <!-- 操作区 -->
    <div class="filter-container flex j-between">
      <div>
        默认显示<el-input class="filter-input" v-model="showRowNum"></el-input>行
        <el-button class="filter-submit" type="primary" v-waves @click="showRowSubmit">确定</el-button>
      </div>
      <div>
        <el-button type="primary" icon="el-icon-plus" v-waves @click="addLink">新增</el-button>
        <el-button type="danger" icon="el-icon-delete" v-waves @click="removeLink">删除</el-button>
      </div>
    </div>

    <!-- 表格 -->
    <el-table
      :data="list" row-key="id" @selection-change="handleSelectionChange"
      v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" type="selection" width="55"></el-table-column>
      <el-table-column align="center" type="index" label="序号" width="65"></el-table-column>
      <el-table-column min-width="110px" align="center" label="网站名称">
        <template slot-scope="scope">
          <span>{{scope.row.websiteName}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="110px" align="center" label="网址">
        <template slot-scope="scope">
          <span>{{scope.row.websiteUrl}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="110px" align="center" label="站长Email">
        <template slot-scope="scope">
          <span>{{scope.row.managerEmail}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="200px" align="center" label="网站简介">
        <template slot-scope="scope">
          <span>{{scope.row.websiteRemark}}</span>
        </template>
      </el-table-column>
      <el-table-column width="140px" align="center" label="添加时间">
        <template slot-scope="scope">
          <span>{{scope.row.updateDate | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
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
    <el-dialog title="友情链接" :visible.sync="dialogFormVisible">
      <el-form :model="linkForm"  :rules="rules" ref="ruleForm">
        <el-form-item label="网站名称" prop="websiteName" :label-width="formLabelWidth">
          <el-input v-model="linkForm.websiteName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="网址" prop="websiteUrl" :label-width="formLabelWidth">
          <el-input v-model="linkForm.websiteUrl" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="站长Email" prop="managerEmail" :label-width="formLabelWidth">
          <el-input v-model="linkForm.managerEmail" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="网站简介" prop="websiteRemark" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="500字以内"
            maxlength="500"
            v-model="linkForm.websiteRemark">
          </el-input>
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
  import { friendlyLink, createFriendlyLink, changeLineNum, deleteLink, updateLink } from '@/api/SystemMaintenance'
  import Sortable from 'sortablejs'
  import waves from '@/directive/waves'
  import { deleteMessageBox } from '@/utils/messageBox'
  const defaultForm = {
    websiteUrl: '',
    websiteName: '',
    websiteRemark: '',
    managerEmail: '',
    id: null,
  }

  export default {
    name: 'friendshipLink',
    directives: {
      waves
    },
    data() {
      return {
        list: null,  //数据
        listLoading: true,  //表格loading
        sortable: null, //表格排序
        showRowNum: 0, //显示行数
        linkForm: Object.assign({},defaultForm),
        rules: {  //表单规则
          websiteUrl: [
            { required: true, message: '请填写网址', trigger: 'blur' }
          ],
          websiteName: [
            { required: true, message: '请填写网站名称', trigger: 'blur' }
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
        friendlyLink().then(response => {
          this.list = response.data.linkList;
          this.showRowNum = response.data.displayLine;
          this.listLoading = false;
//          this.$nextTick(() => {
//            this.setSort();
//          })
        }).catch(()=>{
          this.listLoading = false;
        })
      },
      addLink() {  //新增按钮
        this.linkForm = Object.assign({},defaultForm);
        this.dialogFormVisible = true;
        this.dialogType = 'add';
      },
      removeLink() {  //删除按钮
        if(this.tableSelection.length === 0) {
          this.$message.warning('未选中任何数据');
        } else {
          deleteMessageBox({ ids: this.tableSelection }, deleteLink, this.getList)
        }
      },
      showRowSubmit() {  //显示行数确定
        changeLineNum({ num: this.showRowNum }).then(response => {
          this.$message.success('操作成功');
        })
      },
      handleSelectionChange(val) {  //表格选中
        this.tableSelection = [];
        val.forEach((v,i) => {
          this.tableSelection.push(v.id)
        })
      },
      handleEdit(index, row) {  //表格内编辑
        let object = JSON.parse(JSON.stringify(row))
        Object.assign(this.linkForm,{
          websiteUrl: object.websiteUrl,
          websiteName: object.websiteName,
          websiteRemark: object.websiteRemark,
          managerEmail: object.managerEmail,
          id: object.id,
        })
        this.dialogFormVisible = true;
        this.dialogType = 'edit';
      },
      handleDelete(index, row) {  //表格内删除
        deleteMessageBox({ ids: [row.id] }, deleteLink, this.getList)
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
      cancelForm() {  //对话框取消
        this.dialogFormVisible = false;
        this.$refs['ruleForm'].resetFields();
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
      }
    }
  }
</script>

<style scoped lang="scss">
  .filter-container{
    .filter-input{
      width: 50px;
      margin: 0 6px;
    }
    .filter-submit{
      margin-left: 10px;
    }
  }
</style>

<template>
  <div class="app-container">

    <!-- 操作区 -->
    <div class="filter-container flex flex-end">
      <div>
        <el-button type="primary" icon="el-icon-plus" v-waves @click="addBtn">新增分类</el-button>
        <el-button type="danger" icon="el-icon-delete" v-waves @click="deleteBtn">删除分类</el-button>
      </div>
    </div>

    <!-- 显示区 -->
    <el-row v-if="list.length" :gutter="10">
      <!-- 网站格子 -->
      <el-col class="map-col" :md="24" :lg="12" v-for="(card,$INDEX) in list" :key="card.id">
        <el-card class="box-card map-main">

          <!-- 格子操作区 -->
          <div class="map-header flex j-between a-center">
            <div>
              <el-checkbox @change="(value) => cardSecletChange(value,card.tagSortUuid,$INDEX)">{{ card.tagSortName }}</el-checkbox>
            </div>
            <div class="flex">
              <el-button size="mini" type="primary" icon="el-icon-edit" v-waves @click="cardEdit($INDEX, card)">编辑分类</el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete" v-waves @click="cardDelete($INDEX, card)">批量删除</el-button>
            </div>
          </div>

          <!-- 表格 -->
          <el-table
            :data="card.resultMap.tagSignList" height="295" row-key="id"
            @selection-change="(value) => handleSelectionChange(value,card.tagSortUuid,$INDEX)"
            v-loading.body="listLoading" border fit style="width: 100%;">
            <el-table-column align="center" type="selection" width="55"></el-table-column>
            <el-table-column align="center" label="标签名称">
              <template slot-scope="scope">
                <span>{{scope.row.tagName}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="文档数">
              <template slot-scope="scope">
                <span>{{scope.row.documentCount}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="点击数">
              <template slot-scope="scope">
                <span>{{scope.row.clickCount}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="100px">
              <template slot-scope="scope">
                <el-button class="miniBtn" size="mini" type="primary" icon="el-icon-edit" v-waves @click="handleEdit(scope.$index, scope.row)" title="编辑"></el-button>
                <el-button class="miniBtn" size="mini" type="danger" icon="el-icon-delete" v-waves @click="handleDelete(scope.$index, scope.row)" title="删除"></el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            background
            style="text-align: center;margin-top: 10px;"
            layout="prev, pager, next"
            :page-size="5"
            @current-change="(value) => pageChange(value,card.tagSortUuid,$INDEX)"
            :total="card.resultMap.total">
          </el-pagination>
        </el-card>
      </el-col>
    </el-row>
    <h3 v-else style="text-align: center;color: #606266">无数据</h3>

    <!-- 新增弹窗 -->
    <el-dialog title="tag标签管理" :visible.sync="dialogFormVisible">
      <el-form :model="formData"  :rules="rules" ref="ruleForm">
        <el-form-item label="分类名称" prop="tagSortName" :label-width="formLabelWidth">
          <el-input v-model="formData.tagSortName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item class="newTagList">
          <div v-for="(item, $index) in formData.tagSignList"
               v-if="item.status !== 0 " :key="$index" class="flex newTagItem">
            <el-form-item label="标签名称"
                          :label-width="formLabelWidth"
                          class="flex-1"
                          :rules="{required: true, message: '标签名称不能为空', trigger: 'blur'}"
                          :prop="'tagSignList.' + $index + '.tagName'">
              <el-input v-model="item.tagName" auto-complete="off"></el-input>
            </el-form-item>
            <div style="width: 68px;padding-left: 12px;">
              <el-button type="danger" icon="el-icon-delete" v-waves @click="deleteTag($index)"></el-button>
            </div>
          </div>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth">
          <el-button size="mini" icon="el-icon-plus" v-waves @click="addNewTag">新增标签</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <div>
          <el-button @click="cancelForm">取 消</el-button>
          <el-button type="primary" v-waves @click="submitForm" :loading="fromBtnLoading">确 定</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 表格内编辑弹窗 -->
    <el-dialog title="编辑标签" :visible.sync="dialogTagVisible">
      <el-form :model="tagData"  :rules="tagRules" ref="tagRule">
        <el-form-item label="标签名称" prop="tagName" :label-width="formLabelWidth">
          <el-input v-model="tagData.tagName" auto-complete="off" placeholder="请输入标签名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="tagCancel">取 消</el-button>
        <el-button type="primary" v-waves @click="submitTag" :loading="fromBtnLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { tagManagePage, getTagSign, editTagSort, createTagSort, deleteTagSort, deleteTagSign, editTagSign } from '@/api/Consultation'
  import waves from '@/directive/waves'
  import { deleteMessageBox } from '@/utils/messageBox'

  const defaultFormData = {
    tagSortName: '',
    tagSignList: [],
  }


  export default {
    name: 'tagManage',
    directives: {
      waves
    },
    data() {
      return {
        list: [], //数据
        listLoading: true,  //表格loading
        formData: Object.assign({},defaultFormData), //表单数据
        rules: {  //表单规则
          tagSortName: [
            { required: true, message: '请填写分类名称', trigger: 'blur' }
          ],
        },
        tagRules: {  //表单规则
          tagName: [
            { required: true, message: '请填写标签名称', trigger: 'blur' }
          ],
        },
        formLabelWidth: '120px', //表单标签宽
        dialogFormVisible: false,  //编辑分类对话框显示
        dialogTagVisible: false,  //编辑标签对话框显示
        fromBtnLoading: false, //表单按钮loading
        tableSelection: [], //表格选中id
        cardSelection: [], //卡片选中id
        dialogType: '', //对话框分类
        tagData: {},  //标签数据
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {  //获取数据
        this.listLoading = true
        tagManagePage().then(response => {
          this.list = response.data;
          this.listLoading = false;

        }).catch(()=>{
          this.listLoading = false;
        })
      },
      pageChange(val,tagSortUuid,index) {  //切换页面
        let data = {
          pageIndex: val,
          pageNumber: 5,
          tagSortUuid: tagSortUuid,
        }
        getTagSign(data).then(({ data }) => {
          let item = this.list[index];
          Object.assign(item.resultMap, { tagSignList:data.cmsTagSignList })
          this.list.splice(index, 1, item)
        })
      },
      addBtn() {  //头部添加按钮
        this.dialogFormVisible = true;
        this.dialogType = 'add';
        this.formData = Object.assign({},defaultFormData);
      },
      deleteBtn() {  //头部删除按钮
        if(this.cardSelection.length === 0) {
          this.$message.warning('未选中任何分类');
        } else {
          deleteMessageBox({ uuids: this.cardSelection }, deleteTagSort, () => {
            this.cardSelection = [];
            this.getList()
          })
        }
      },
      cardSecletChange(val,tagSortUuid,index) {  //选中分类
        let tagSortUuidIndex = this.cardSelection.indexOf(tagSortUuid);
        if(val) {
          this.cardSelection.push(tagSortUuid)
        } else {
          this.cardSelection.splice(tagSortUuidIndex,1)
        }
      },
      cardEdit(index,row) {  //编辑分类
        let object = JSON.parse(JSON.stringify(row))
        this.formData = {
          tagSortName: object.tagSortName,
          tagSortUuid: object.tagSortUuid,
          tagSignList: object.resultMap.all
        }
        this.dialogFormVisible = true;
        this.dialogType = 'edit';
      },
      cardDelete(index,row) {  //批量删除
        if(this.tableSelection.length === 0 || !this.tableSelection[index]){
          this.$message.warning('未选中任何标签');
        } else {
          deleteMessageBox({ uuids: this.tableSelection[index] }, deleteTagSign, () => {
            this.cardSelection = [];
            this.getList()
          })
        }
      },
      handleSelectionChange(val, tagSortUuid, index) {  //表格选中
        let changeList = [];
        val.forEach((v,i) => {
          changeList.push(v.tagUuid)
        })
        this.tableSelection[index] = changeList;
      },
      handleEdit(index,row) {  //表格内编辑
        let object = JSON.parse(JSON.stringify(row))
        this.tagData = {
          tagUuid: object.tagUuid,
          tagName: object.tagName,
        }
        this.dialogTagVisible = true;
      },
      handleDelete(index,row) {  //表格内删除
        deleteMessageBox({ uuids: [row.tagUuid] }, deleteTagSign, () => {
          this.getList()
        })
      },
      addNewTag() {  //新增子类
        this.formData.tagSignList.push({ tagName: '' })
      },
      deleteTag(index) {  //删除子类
        let list = this.formData.tagSignList;
        if(list[index].tagUuid) {
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
              ajax = createTagSort;
              tipText = '新增成功';
            } else if(this.dialogType === 'edit') {
              ajax = editTagSort;
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
            })

          } else {
            return false;
          }
        });
      },
      submitTag() { //表格内编辑弹窗
        this.$refs['tagRule'].validate((valid) => {
          if (valid) {
            this.fromBtnLoading = true;
            editTagSign(this.tagData).then(response => {
              this.fromBtnLoading = false;
              this.dialogTagVisible = false;
              this.$message.success('编辑成功');
              this.getList()
            }).catch(error => {
              this.fromBtnLoading = false;
              this.dialogTagVisible = false;
            })
          } else {
            return false;
          }
        });
      },
      cancelForm() {
        this.dialogFormVisible = false;
        this.$refs['ruleForm'].resetFields();
      },
      tagCancel() {
        this.$refs['tagRule'].resetFields();
        this.dialogTagVisible = false;
      }
    }
  }
</script>

<style scoped lang="scss">
  .map-main{
    height: 416px;
  }
  .map-header{
    margin-bottom: 10px;
  }
  .map-col{
    padding: 5px;
  }
  .newTagItem{
    margin-bottom: 22px;
    &:last-child{
      margin-bottom: 0;
    }
  }
  .miniBtn.el-button--mini {
    padding: 7px 9px;
  }
</style>


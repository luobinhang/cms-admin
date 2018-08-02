<template>
  <div class="app-container">

    <!-- 操作区 -->
    <div class="filter-container flex j-between">
      <h2 style="margin: 0">PC官网Banner管理</h2>
      <div>
        <span style="color: #f78989;">* 鼠标拖动可进行排序</span>
        <!--<el-button type="primary" icon="el-icon-plus" v-waves @click="addBtn">新增</el-button>-->
      </div>
    </div>

    <!-- 表格 -->
    <el-table
      :data="list" row-key="id"
      v-loading.body="listLoading" border fit highlight-current-row>
      <el-table-column align="center" type="index" label="序号" width="65"></el-table-column>
      <el-table-column width="80px" align="center" label="展示顺序">
        <template slot-scope="scope">
          <span>{{scope.row.bannerSort}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="200px" align="center" label="缩略图">
        <template slot-scope="scope">
          <img style="max-width: 100%;" :src="scope.row.fileAddress" alt="fileAddress">
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="banner名">
        <template slot-scope="scope">
          <span>{{scope.row.bannerName}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="跳转链接">
        <template slot-scope="scope">
          <span>{{scope.row.bannerUrl}}</span>
        </template>
      </el-table-column>
      <el-table-column width="140px" align="center" label="添加时间">
        <template slot-scope="scope">
          <span>{{scope.row.updateDate | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="240px">
        <template slot-scope="scope">
          <i class="el-icon-rank" style="font-size: 20px;vertical-align: middle;margin-right: 10px;"></i>
          <el-button size="mini" type="primary" icon="el-icon-edit" v-waves @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" :type="scope.row.enabled | btnStatus" :icon="scope.row.enabled | btnIcon" v-waves @click="handleChange(scope.$index, scope.row)">{{ scope.row.enabled | bannerStatus }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑弹窗 -->
    <el-dialog :title="`${dialogType}banner`" :visible.sync="dialogFormVisible" class="bannerDialog">
      <el-form :model="bannerForm"  :rules="rules" ref="ruleForm">
        <el-form-item label="banner名" prop="bannerName" :label-width="formLabelWidth">
          <el-input v-model="bannerForm.bannerName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="跳转链接" prop="bannerUrl" :label-width="formLabelWidth">
          <el-input v-model="bannerForm.bannerUrl" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="banner图" prop="fileAddress" :label-width="formLabelWidth">
          <el-upload
            ref="upload"
            class="upload-demo"
            drag
            :on-success="uploadSuccess"
            :before-upload="beforeUpload"
            :on-error="uploadError"
            :on-remove="uploadRemove"
            :file-list="bannerList"
            list-type="picture"
            :action="`${apiBase}/WebSiteShow/uploadFile`">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传jpg/jpeg/png文件，且不超过1M(1024kb)</div>
          </el-upload>
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
  import {
    getWebSiteBannerDetail,
    createBannner,
    saveWebSiteBanner,
    editWebSiteBannerStatus,
    updatePcBannnerSort,
  } from '@/api/PcBannerManage'
  import Sortable from 'sortablejs'
  import waves from '@/directive/waves'

  const defaultForm = {
    bannerName: '',
    bannerUrl: 'javascript:;',
    fileAddress: '',
    fileOriginalName: '',
    fileName: '',
    osskey: '',
  }

  export default {
    name: 'PcBannerManage',
    directives: {
      waves
    },
    data() {
      return {
        list: null,  //数据
        listLoading: true,  //表格loading
        sortable: null, //表格排序
        bannerForm: Object.assign({},defaultForm),
        rules: {  //表单规则
          bannerUrl: [
            { required: true, message: '请填写链接', trigger: 'blur' }
          ],
          fileAddress: [
            { required: true, message: '请添加图片', trigger: 'change' }
          ],
        },
        formLabelWidth: '120px', //表单标签宽
        dialogFormVisible: false,  //对话框显示
        fromBtnLoading: false, //表单按钮loading
        dialogType: '', //对话框类型
        bannerList:[], //上传图片列表
      }
    },
    filters: {
      bannerStatus(val){
        return val === 0? '上架' : '下架'
      },
      btnStatus(val) {
        return val === 0? 'info' : 'danger'
      },
      btnIcon(val) {
        return val === 0? 'el-icon-caret-top' : 'el-icon-caret-bottom'
      },
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {  //获取数据
        this.listLoading = true
        getWebSiteBannerDetail().then(response => {
          this.list = response.data.webSiteBannerVoList;
          this.listLoading = false;
          this.$nextTick(() => {
            this.setSort();
          })
        }).catch(()=>{
          this.listLoading = false;
        })
      },
      addBtn() {  //新增按钮
        this.bannerForm = Object.assign({},defaultForm)
        this.dialogType = '新增';
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['upload'].clearFiles()
        })

      },
      handleChange(index, row) {  //表格内上下架
        let data = {
          id: row.id,
          enabled: row.enabled === 0? 1:0,
        }
        editWebSiteBannerStatus(data).then(response => {
          this.getList();
          this.$message.success(row.enabled === 0?'上架成功':'下架成功')
        })
      },
      handleEdit(index, row) {  //表格内编辑
        let object = JSON.parse(JSON.stringify(row))
        Object.assign(this.bannerForm,{
          id: object.id,
          bannerName: object.bannerName,
          bannerUrl: object.bannerUrl || 'javascript:;',
          fileAddress: object.fileAddress,
          fileOriginalName: object.fileOriginalName,
          fileName: object.fileName,
          osskey: object.osskey,
        })
        this.bannerList = [{
          name: object.fileOriginalName,
          url: object.fileAddress,
        }]

        this.dialogType = '编辑';
        this.dialogFormVisible = true;
      },
      submitForm() {  //对话框确定
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.fromBtnLoading = true;
            let ajax;
            if(this.dialogType === '新增') {
              ajax = createBannner;
            } else if(this.dialogType === '编辑') {
              ajax = saveWebSiteBanner;
            }
            ajax(this.bannerForm).then(response => {
              this.$refs['ruleForm'].resetFields();
              this.fromBtnLoading = false;
              this.dialogFormVisible = false;
              this.$message.success(`${this.dialogType}成功`);
              this.getList()
            }).catch(() => {
              this.fromBtnLoading = false;
            })
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
            updatePcBannnerSort({
              changeSort: evt.newIndex,
              sort: evt.oldIndex,
            }).then(response => {
              this.getList();
            })
          }
        })
      },
      uploadSuccess(response, file, fileList) { //上传成功
        let object = response.data;
        if(response.code !== '100') {
          fileList.pop();
          this.$notify.error({
            message: response.msg,
            type: 'error',
            duration: 5000
          });
        } else {
          Object.assign(this.bannerForm,{
            fileAddress: object.fileAddress,
            fileOriginalName: object.fileOriginalName,
            fileName: object.fileName,
            osskey: object.osskey,
          })
          this.bannerList = [{
            name: object.fileOriginalName,
            url: object.fileAddress,
          }]

          this.$refs['ruleForm'].validateField('fileAddress')
        }
      },
      uploadError(err, file, fileList) {  //上传失败
        fileList.pop();
        this.$message.error('请检查网络连接是否正常，或稍后重试')
      },
      uploadRemove(file, fileList) {  //移除图片
        Object.assign(this.bannerForm,{
          fileAddress: '',
        })
      },
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
<style lang="scss">
  .bannerDialog{
    .el-upload-list__item{
      transition: none;
    }
    .el-upload-list__item-thumbnail{
      width: auto;
    }
    .el-upload,.el-upload-dragger{
      width: 100%;
    }
  }
</style>

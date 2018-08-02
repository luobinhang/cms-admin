<template>
  <div class="upload-container">
    <el-button icon='el-icon-upload' size="mini" :style="{background:color,borderColor:color}" @click=" dialogVisible=true" type="primary">上传图片
    </el-button>
    <el-dialog append-to-body :visible.sync="dialogVisible" class="editImg">
      <el-upload
        class="editor-slide-upload"
        :action="`${apiBase}/systemManager/uploadPic`"
        :file-list="fileList"
        :show-file-list="true"
        list-type="picture-card"
        accept="jpg"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :before-upload="beforeUpload">
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
      <div style="margin-top: 10px;">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'editorSlideUpload',
  props: {
    color: {
      type: String,
      default: '#1890ff'
    },
  },
  data() {
    return {
      dialogVisible: false,
      fileList: [],
    }
  },
  methods: {
    handleSubmit() {
      this.$emit('successCBK', this.fileList)
      this.fileList = []
      this.dialogVisible = false
    },
    handleSuccess(response, file, fileList) {
      if(response.code != '100') {
        this.$notify({
          title: '失败',
          message: response.msg,
          type: 'error',
        })
      } else {
        file.url = response.data;
        this.fileList.push(file)
      }
    },
    handleRemove(file) {
      const uid = file.uid
      this.fileList.forEach((v,i) => {
        if(v.uid === uid) {
          this.fileList.splice(i,1)
        }
      })
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.upload-container {
  .editor-slide-upload {
    margin-bottom: 20px;
  }
}

</style>
<style rel="stylesheet/scss" lang="scss">
  .editImg{
    .el-upload-list__item,.el-upload--picture-card{
      width: 138px;
      height: 138px;
    }

  }
</style>

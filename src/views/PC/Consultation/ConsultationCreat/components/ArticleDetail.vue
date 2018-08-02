<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" ref="postForm">

      <!-- 操作栏 -->
      <sticky :className="'sub-navbar '+status">
        <template>
          <span class="tagLabel">选择标签</span>
          <el-select
            v-model="postForm.tagSortUuid"
           @change="tagFirstChange"
           placeholder="请选择" style="width: 100px;">
            <el-option
              v-for="item in tagFirst"
              :key="item.tagSortUuid"
              :label="item.tagSortName"
              :value="item.tagSortUuid">
            </el-option>
          </el-select>
          <el-select
            multiple
            :multiple-limit="3"
            v-model="postForm.tagSignUuids"
            placeholder="请选择"
            style="width: 30%">
            <el-option
              v-for="item in tagSecond"
              :key="item.tagUuid"
              :label="item.tagName"
              :value="item.tagUuid">
            </el-option>
          </el-select>
          <el-button v-loading="loading" v-if="isEdit" style="margin-left: 10px;" type="primary" @click="submitForm('修改')">修改</el-button>
          <el-button v-loading="loading" v-else style="margin-left: 10px;" type="success" @click="submitForm('发布')">发布</el-button>
        </template>
      </sticky>

      <!-- 编辑栏 -->
      <div class="createPost-main-container">
        <el-form-item style="margin-bottom: 40px;">
          <MDinput name="name" v-model="postForm.title" required :maxlength="100">标题</MDinput>
          <span v-show="postForm.title.length>=26" class='title-prompt'>网页标题可能会显示不全</span>
        </el-form-item>
        <el-form-item style="margin-bottom: 40px;" label-width="45px" label="描述:">
          <el-input type="textarea" class="article-textarea" :rows="1" autosize placeholder="请输入内容" v-model="postForm.discription"></el-input>
          <span class="word-counter" v-show="contentShortLength">{{contentShortLength}}字</span>
        </el-form-item>
        <div style="margin-bottom: 20px;">
          <div class="upload-container">
            <el-upload
              class="image-uploader"
              drag
              :multiple="false"
              :show-file-list="false"
              :action="`${apiBase}/systemManager/uploadFile`"
              :before-upload="beforeUpload"
              :on-error="handleImageError"
              :on-success="handleImageScucess">
              <i class="el-icon-upload"></i>
              <p style="color: #409EFF;margin: 0;line-height: 20px">资讯缩略图</p>
              <div class="el-upload__text">将图片拖到此处，或<em>点击上传</em></div>
            </el-upload>
            <div class="image-preview">
              <div class="image-preview-wrapper" v-show="postForm.fileAddress">
                <img :src="postForm.fileAddress">
                <div class="image-preview-action">
                  <i @click="rmImage" class="el-icon-delete"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 富文本 -->
        <div class="editor-container">
          <tinymce :height=400 ref="editor" v-model="postForm.content"></tinymce>
        </div>
      </div>

    </el-form>

  </div>
</template>

<script>
  import { tagManagePage, createConsultation, showEditConsultation, editConsultation } from '@/api/Consultation'

  import Tinymce from '@/components/Tinymce'
  import Upload from '@/components/Upload/singleImage'
  import MDinput from '@/components/MDinput'
  import Sticky from '@/components/Sticky'

  const defaultForm = {
    title: '', // 文章题目
    content: '', // 文章内容
    discription: '', // 文章描述
    fileAddress: '', // 文章图片
    fileOriginalName: '', //图片原名
    fileName: '', //图片名
    osskey: '',
    tagSortUuid: '', //标签ID
    tagSignUuids: [],  //子类标签ID
  }

  export default {
    name: 'articleDetail',
    components: { Tinymce, MDinput, Upload, Sticky },
    props: {
      isEdit: {  //是否可以编辑
        type: Boolean,
        default: false
      },
      uuid: {  //文章uuid
        type: String,
        default: ''
      }
    },
    data() {
      return {
        postForm: Object.assign({}, defaultForm),
        loading: false,
        status: 'draft',
        tagFirst:[],
        tagSecond: [],
      }
    },
    computed: {
      contentShortLength() {
        return this.postForm.discription.length
      }
    },
    created() {
      this.getTagFirst();
    },
    methods: {
      tagFirstChange(val) {
        let arr = Object.values(this.tagFirst);
        Object.assign(this.postForm,{ tagSignUuids: [] })
        arr.forEach((v,i) => {
          if(v.tagSortUuid === val) {
            this.tagSecond = this.tagFirst[i].resultMap.all;
          }
        })
      },
      getTagFirst() {
        tagManagePage().then(({ data }) => {
          this.tagFirst = data
          if (this.isEdit) {
            this.fetchData()
          } else {
            this.postForm = Object.assign({}, defaultForm)
          }
        })
      },
      fetchData() {
        showEditConsultation({ uuid:this.uuid }).then(({ data }) => {
          this.tagFirstChange(data.tagSortUuid)
          this.postForm = data;
          this.postForm.id = null;
        })
      },
      rmImage() {
        Object.assign(this.postForm,{
          fileAddress: '',
          fileOriginalName: '',
          fileName: '',
          osskey: '',
        })
      },
      handleImageScucess(response) {
        if(response.code !== "100") {
          this.$notify({
            title: '失败',
            message: response.msg,
            type: 'error',
          })
        }else {
          let data = response.data;
          Object.assign(this.postForm,{
            fileAddress: data.fileAddress,
            fileOriginalName: data.fileOriginalName,
            fileName: data.fileName,
            osskey: data.osskey,
          })
        }
      },
      handleImageError(error) {
        this.$notify({
          title: '失败',
          message: '请检查网络连接是否正常，或稍后重试',
          type: 'error',
        })
      },

      submitForm(type) {
        if(this.postForm.tagSortUuid === '' || this.postForm.tagSignUuids.length === 0){
          this.$message.error('请选择标签')
        } else if(this.postForm.title == '') {
          this.$message.error('标题不能为空')
        } else if(this.postForm.fileAddress == '') {
          this.$message.error('资讯缩略图不能为空')
        } else if(this.postForm.content == '') {
          this.$message.error('文章内容不能为空')
        } else {
          this.loading = true

          let [ajax,data] = [,Object.assign({}, this.postForm)]

          if(type === '发布') {
            ajax = createConsultation;
          } else {
            ajax = editConsultation;

            Object.assign(data,{
              uuid: this.uuid
            })
          }

          ajax(data).then(({ data }) => {
            this.$notify({
              title: '成功',
              message: `${type}文章成功`,
              type: 'success',
            })
            this.status = 'published'
            this.loading = false
            this.save = next => {
              next()
            };
            this.$router.push({path:'/PC/Consultation/ConsultationList'})
          }).catch(response => {
            this.loading = false
          })

        }
      },
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .tagLabel{
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .title-prompt{
    position: absolute;
    right: 0px;
    font-size: 12px;
    top:10px;
    color:#ff4949;
  }
  .createPost-container {
    position: relative;
    .createPost-main-container {
      padding: 0 45px 20px 50px;
      .postInfo-container {
        position: relative;
        @include clearfix;
        margin-bottom: 10px;
        .postInfo-container-item {
          float: left;
        }
      }
      .editor-container {
        min-height: 500px;
        margin: 0 0 30px;
        .editor-upload-btn-container {
          text-align: right;
          margin-right: 10px;
          .editor-upload-btn {
            display: inline-block;
          }
        }
      }
    }
    .word-counter {
      width: 40px;
      position: absolute;
      right: -10px;
      top: 0px;
    }
  }
  .upload-container {
    width: 100%;
    position: relative;
    @include clearfix;
    .image-uploader {
      width: 290px;
      height: 200px;
      float: left;
      margin-right: 50px;

    }
    .image-preview {
      width: 290px;
      height: 200px;
      position: relative;
      border: 1px dashed #d9d9d9;
      float: left;
      .image-preview-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .image-preview-action {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        cursor: default;
        text-align: center;
        color: #fff;
        opacity: 0;
        font-size: 20px;
        background-color: rgba(0, 0, 0, .5);
        transition: opacity .3s;
        cursor: pointer;
        text-align: center;
        line-height: 200px;
        .el-icon-delete {
          font-size: 36px;
        }
      }
      &:hover {
        .image-preview-action {
          opacity: 1;
        }
      }
    }

  }
</style>


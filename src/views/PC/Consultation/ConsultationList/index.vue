<template>
  <div class="app-container calendar-list-container">

    <!-- 操作区 -->
    <div class="filter-container flex j-between">
      <div>
        默认显示<el-input class="filter-input" v-model="displayNum"></el-input>条
        <el-button class="filter-submit" type="primary" v-waves @click="displayNumSubmit">确定</el-button>
      </div>
      <div>
        <el-input
          placeholder="关键字"
          prefix-icon="el-icon-search"
          style="width: 150px;margin-right: 10px;"
          @keyup.native="getList"
          v-model="keyWord">
        </el-input>
        <el-select @change="getList" v-model="tagSortUuid" placeholder="请选择" style="width: 100px;margin-right: 10px;">
          <el-option
            v-for="item in tagList"
            :key="item.tagSortUuid"
            :label="item.tagSortName"
            :value="item.tagSortUuid">
          </el-option>
        </el-select>
        <el-date-picker
          v-model="dateVal"
          type="daterange"
          style="width: 250px;margin-right: 10px"
          range-separator="-"
          @change="getList"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <el-button type="primary" icon="el-icon-plus" v-waves @click="add">新增</el-button>
        <el-button type="danger" icon="el-icon-delete" v-waves @click="remove">删除</el-button>
      </div>
    </div>

    <!-- 表格 -->
    <el-table
      :data="list" row-key="id" @selection-change="handleSelectionChange"
      v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" type="selection" width="55"></el-table-column>
      <el-table-column align="center" type="index" label="序号" width="65"></el-table-column>
      <el-table-column min-width="110px" align="center" label="标题">
        <template slot-scope="scope">
          <span>{{scope.row.title}}</span>
          <span style="color:#F56C6C" v-if="scope.row.status === 2">【草稿】</span>
        </template>
      </el-table-column>
      <el-table-column min-width="110px" align="center" label="标签">
        <template slot-scope="scope">
          <div style="margin: -5px 0;overflow: hidden">
            <el-tag
              :key="$index"
              v-for="(tag,$index) in scope.row.tagSignList"
              disable-transitions>{{ tag.tagName }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="140px" align="center" label="添加时间">
        <template slot-scope="scope">
          <span>{{scope.row.createDate | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200px">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" v-waves @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" v-waves @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      background
      style="text-align: center;margin-top: 10px;"
      layout="prev, pager, next"
      :page-size="pageNumber"
      @current-change="pageChange"
      :total="total">
    </el-pagination>


  </div>
</template>

<script>
  import { consultationDisplay, getAllTagSort, deleteConsultation, consultationDisplayNum } from '@/api/Consultation'
  import waves from '@/directive/waves' // 水波纹指令
  import { deleteMessageBox } from '@/utils/messageBox'

  export default {
    name: 'ConsultationList',
    directives: {
      waves
    },
    data() {
      return {
        list: [], //数据
        listLoading: true, //loading
        displayNum: '', //默认显示行数
        pageIndex: 1, //页码
        pageNumber: 10, //每页显示数量
        keyWord: '', //搜索关键字
        tagList: [], //标签列表
        tagSortUuid: '', //标签值
        dateVal: [], //选择时间
        tableSelection: [], //全选
        total: null, //数据总数
      }
    },
    created() {
      this.getList()
      this.getTagList()
    },
    methods: {
      getList() {  //获取列表
        this.listLoading = true
        if(!this.dateVal) this.dateVal = []

        let data = {
          tagSortUuid: this.tagSortUuid,
          keyWord: this.keyWord,
          pageIndex: this.pageIndex,
          pageNumber: this.pageNumber,
          startDate: this.dateVal[0] || '',
          endDate: this.dateVal[1] || '',
        };

        consultationDisplay(data).then(({ data }) => {
          this.displayNum = data.displayNum
          this.total = data.total;
          this.list = data.consultationResultList
          this.listLoading = false
        })
      },
      pageChange(val) {
        this.pageIndex = val;
        this.getList();
      },
      getTagList() {  //获取标签信息
        getAllTagSort().then(({ data }) => {
          this.tagList = data
        })
      },
      add() {  //头部添加
        this.$router.push({path:'/PC/Consultation/ConsultationCreat'})
      },
      remove() {  //头部删除
        if(!this.tableSelection.length) {
          this.$message.warning('未选中任何数据');
        } else {
          deleteMessageBox({ uuids: this.tableSelection } ,deleteConsultation, this.getList)
        }
      },
      displayNumSubmit() {  //显示行数确定
        consultationDisplayNum({num: this.displayNum}).then(response => {
          this.$message.success('操作成功');
        })
      },
      handleSelectionChange(val) {  //表格选中
        this.tableSelection = [];
        val.forEach((v,i) => {
          this.tableSelection.push(v.uuid)
        })
      },
      handleEdit(index, row) {  //表格内编辑
        this.$router.push({path:'/PC/Consultation/ConsultationCreat',query:{
          uuid:row.uuid
        }})
      },
      handleDelete(index, row) {  //表格内删除
        deleteMessageBox({ uuids: [row.uuid] },deleteConsultation, this.getList)
      },
    }
  }
</script>
<style scoped lang="scss">
  .filter-container{
    flex-wrap: wrap;
    padding: 0;
    &>div{
      &>div{
        margin-bottom: 10px !important;
      }
    }
    .filter-input{
      width: 50px;
      margin: 0 6px;
    }
    .filter-submit{
      margin-left: 10px;
    }
  }
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

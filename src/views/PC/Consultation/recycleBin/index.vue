<template>
  <div class="app-container">

    <!-- 操作栏 -->
    <div class="filter-container flex flex-end">
      <div>
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
        <el-button type="info" icon="el-icon-delete" v-waves @click="recover">批量恢复</el-button>
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
        </template>
      </el-table-column>
      <el-table-column min-width="110px" align="center" label="标签">
        <template slot-scope="scope">
          <div style="margin: -5px 0;overflow: hidden">
            <el-tag
              v-if="tag"
              :key="$index"
              v-for="(tag,$index) in scope.row.tagSignList"
              disable-transitions>{{tag.tagName}}
            </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column min-width="140px" align="center" label="添加时间">
        <template slot-scope="scope">
          <span>{{scope.row.createDate | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="100px">
        <template slot-scope="scope">
          <el-button size="mini" type="info" icon="el-icon-edit" v-waves @click="handleRecover(scope.$index, scope.row)">恢复</el-button>
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
  import { consultationRecycleBin, recoverConsultation } from '@/api/Consultation'
  import waves from '@/directive/waves' // 水波纹指令

  export default {
  name: 'recycleBin',
    directives: {
      waves
    },
  data() {
    return {
      list: [], //数据
      listLoading: true, //loading
      pageIndex: 1, //页码
      pageNumber: 10, //每页显示数量
      dateVal: [], //选择时间
      tableSelection: [], //全选
      total: null, //数据总数
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {  //获取列表
      this.listLoading = true
      if(!this.dateVal) this.dateVal = []

      let data = {
        pageIndex: this.pageIndex,
        pageNumber: this.pageNumber,
        startDate: this.dateVal[0] || '',
        endDate: this.dateVal[1] || '',
      };

      consultationRecycleBin(data).then(({ data }) => {
        this.total = data.total
        this.list = data.consultationResultList
        this.listLoading = false
      })
    },
    pageChange(val) {
      this.pageIndex = val;
      this.getList();
    },
    recover() {
      this.recoverAjax({ uuids: this.tableSelection })
    },
    handleRecover(index, row) {
      this.recoverAjax({ uuids: [row.uuid] })
    },
    recoverAjax(data) {
      recoverConsultation(data).then(response => {
        this.$message.success('恢复成功')
        this.getList();
      })
    },
    handleSelectionChange(val) {  //表格选中
      this.tableSelection = [];
      val.forEach((v,i) => {
        this.tableSelection.push(v.uuid)
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

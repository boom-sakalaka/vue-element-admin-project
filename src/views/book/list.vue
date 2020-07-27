<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        placeholder="书名"
        style="width: 200px"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFileter"
        @clear="handleFileter"
        @blur="handleFileter"
      />
      <el-input
        v-model="listQuery.author"
        placeholder="作者"
        style="width: 200px"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFileter"
        @clear="handleFileter"
        @blur="handleFileter"
      />
      <el-select
        v-model="listQuery.category"
        placeholder="分类"
        clearable
        class="filter-item"
        @change="handleFileter"
        @clear="handleFileter"
      >
        <el-option
          v-for="item in categoryList"
          :key="item.value"
          :label="item.label + '(' + item.num + ')'"
          :value="item.value"
        />
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFileter"
      >
        查询
      </el-button>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        style="margin-left: 5px"
        @click="handleCreate"
      >新增</el-button>
      <el-checkbox
        v-model="showCover"
        class="filter-item"
        style="margin-left: 5px"
        @change="changeShowCover"
      >
        显示封面
      </el-checkbox>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @sort-change="sortChange"
    >
      <el-table-column
        label="ID"
        prop="id"
        sortable="custom"
        align="center"
        width="80"
      />
      <el-table-column
        label="书名"
        align="center"
        width="150"
      >
        <template slot-scope="{ row: { titleWrapper }}">
          <span v-html="titleWrapper" />
        </template>
      </el-table-column>
      <el-table-column
        label="作者"
        align="center"
        width="150"
      >
        <template slot-scope="{ row: { authorWrapper }}">
          <span v-html="authorWrapper" />
        </template>
      </el-table-column>
      <el-table-column label="出版社" prop="publisher" width="150" align="center" />
      <el-table-column label="分类" prop="categoryText" width="150" align="center" />
      <el-table-column label="语言" prop="language" width="150" align="center" />
      <el-table-column
        v-if="showCover"
        label="封面"
        prop="cover"
        width="150"
        align="center"
      >
        <template slot-scope="scope">
          <a :href="scope.row.cover" target="_blank">
            <img :src="scope.row.cover" style="width:120px;height:180px;">
          </a>
        </template>
      </el-table-column>
      <el-table-column label="文件名" prop="fileName" width="100" align="center" />
      <el-table-column label="文件路径" prop="filePath" width="100" align="center">
        <template slot-scope="{ row : { filePath } }">
          <span>{{ filePath | valueFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="封面路径" prop="coverPath" width="100" align="center">
        <template slot-scope="{ row : { coverPath } }">
          <span>{{ coverPath | valueFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="解压路径" prop="unzipPath" width="100" align="center">
        <template slot-scope="{ row : { unzipPath } }">
          <span>{{ unzipPath | valueFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上传人" prop="createUser" width="100" align="center">
        <template slot-scope="{ row : { createUser } }">
          <span>{{ createUser | valueFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上传时间" prop="createDt" width="100" align="center">
        <template slot-scope="{ row : { createDt } }">
          <span>{{ createDt | timeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="120"
        align="center"
        fixed="right"
      >
        <template slot-scope="{ row }">
          <el-button type="text" icon="el-icon-edit" @click="handleUpdate(row)" />
          <el-button type="text" icon="el-icon-delete" style="color:#f56c6c" @click="handleDelete(row)" />
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import Pagination from '../../components/Pagination'
import waves from '../../directive/waves/waves'
import { getCategory, listBook, deleteBook } from '../../api/book'
import { parseTime } from '../../utils'
export default {
  components: {
    Pagination
  },
  directives: { waves },
  filters: {
    valueFilter(value) {
      return value || '无'
    },
    timeFilter(time) {
      return time ? parseTime(time, '{y}-{m}-{d} {h}:{i}') : '无'
    }
  },
  data() {
    return {
      tableKey: 0,
      listLoading: true,
      list: [],
      listQuery: {},
      showCover: false, // 显示封面
      categoryList: [],
      total: 0
    }
  },
  created() {
    this.parseQuery()
  },
  mounted() {
    this.getList()
    this.getCategoryList()
  },
  methods: {
    parseQuery() {
      const pageListQuery = { page: 1, pageSize: 20, sort: '+id' }
      this.listQuery = { ...pageListQuery, ...this.listQuery }
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除电子书,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteBook(row.fileName).then(response => {
          this.$notify({
            title: '成功',
            message: response.msg || '删除成功',
            type: 'success',
            duration: 2000
          })
          this.handleFileter()
        })
      })
    },
    handleUpdate(row) {
      // console.log('row' + JSON.stringify(row, null, 4))
      this.$router.push(`/book/edit/${row.fileName}`)
    },
    wrapperKeywork(key, value) {
      function highlight(value) {
        return `<span style="color: #1890ff">${value}</span>`
      }
      if (!this.listQuery[key]) {
        return value
      } else {
        return value.replace(new RegExp(this.listQuery[key], 'ig'), value => highlight(value))
      }
    },
    getList() {
      listBook(this.listQuery).then((response) => {
        const { list, count } = response.data
        this.list = list
        this.listLoading = false
        this.total = count
        this.list.forEach(book => {
          book.titleWrapper = this.wrapperKeywork('title', book.title)
          book.authorWrapper = this.wrapperKeywork('author', book.author)
        })
      })
    },
    sortChange(data) {
      const { prop, order } = data
      this.sortBy(prop, order)
      // console.log(this.listQuery)
    },
    sortBy(prop, order) {
      if (order === 'ascending') {
        this.listQuery.sort = `+${prop}`
      } else {
        this.listQuery.sort = `-${prop}`
      }
      this.handleFileter()
    },
    getCategoryList() {
      getCategory().then(response => {
        this.categoryList = response.data
      })
    },
    handleFileter() {
      // console.log('handleFilter' + JSON.stringify(this.listQuery, null, 4))
      this.getList()
    },
    handleCreate() {
      this.$router.push('/book/create')
    },
    changeShowCover(value) {
      this.showCover = value
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

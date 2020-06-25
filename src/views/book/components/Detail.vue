<template>
  <el-form ref="postForm" :model="postForm">
    <sticky :class-name="'sub-navbar '">
      <el-button v-if="!isEdit" @click="showGuide">显示帮助</el-button>
      <el-button
        v-loading="loading"
        type="success"
        style="margin-left: 10px"
        @click="submitForm"
      >
        {{ isEdit ? '编辑电子书' : '新增电子书' }}
      </el-button>
    </sticky>
    <div class="detail-container">
      <el-row>
        <warning />
        <el-col :span="24">
          <!-- 表单上传控件的具体样式 -->
          <ebook-upload
            :file-list="fileList"
            :disabled="isEdit"
            @onSuccess="onUploadSuccess"
            @onRemove="onUploadRemove"
          />
        </el-col>
        <el-col :span="24">
          <!-- Form 表单 -->
          <el-form-item prop="title">
            <Md-input v-model="postForm.title" :maxlength="100" name="name" required>
              书名
            </Md-input>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="作者:" :label-width="lableWidth">
                <el-input
                  v-model="postForm.author"
                  placeholder="作者"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="出版社:" :label-width="lableWidth">
                <el-input
                  v-model="postForm.publisher"
                  placeholder="出版社"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="语言:" :label-width="lableWidth">
            <el-input
              v-model="postForm.language"
              placeholder="语言"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="根文件:" :label-width="lableWidth">
            <el-input
              v-model="postForm.rootFile"
              placeholder="根文件"
              disabled
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="文件路径:" :label-width="lableWidth">
            <el-input
              v-model="postForm.filePath"
              placeholder="文件路径:"
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="解压路径:" :label-width="lableWidth">
            <el-input
              v-model="postForm.unzipPath"
              placeholder="解压路径"
              disabled
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="封面路径:" :label-width="lableWidth">
            <el-input
              v-model="postForm.filePath"
              placeholder="封面路径:"
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="文件名称:" :label-width="lableWidth">
            <el-input
              v-model="postForm.unzipPath"
              placeholder="文件名称"
              disabled
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="封面:" label-width="60px">
            <a v-if="postForm.cover" :href="postForm.cover" target="_blank">
              <img :src="postForm.cover" alt="封面图片" class="preview-img">
            </a>
            <span v-else>无</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label-width="60px" label="目录:">
            <div v-if="postForm.content && postForm.contents.length" class="contents-wrapper">
              <el-tree />
            </div>
            <span v-else>无</span>
          </el-form-item>
        </el-col>
      </el-row>
    </div>
  </el-form>
</template>

<script>
import Sticky from '../../../components/Sticky'
import Warning from './Warning'
import EbookUpload from '../../../components/EbookUpload'
import MdInput from '../../../components/MDinput'
export default {
  components: {
    Sticky,
    Warning,
    EbookUpload,
    MdInput
  },
  props: {
    isEdit: Boolean
  },
  data() {
    return {
      loading: false,
      postForm: {},
      fileList: [],
      lableWidth: '120px'
    }
  },
  methods: {
    showGuide() {
      console.log('showGuide')
    },
    submitForm() {
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 1000)
    },
    onUploadSuccess() {
      console.log('success')
    },
    onUploadRemove() {
      console.log('remove')
    }
  }
}
</script>

<style lang="scss" scoped>
  .detail-container{
    padding: 40px 50px 20px;
    .preview-img {
      width: 200px;
      height: 270px;
    }
  }
</style>

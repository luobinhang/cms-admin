/**
 * Created by Hang on 2018/5/30 0030.
 */
import Vue from 'vue'


export function beforeUpload(file) {
  let accept = ['image/jpeg','image/png', 'image/jpg']
  if (!accept.includes(file.type)) {
    this.$notify({
      title: '提示',
      message: '只能上传jpg、jpeg或png格式的图片',
      type: 'warning',
    })
    return false
  } else if(file.size >= 1048576) {
    this.$notify({
      title: '提示',
      message: '只能上传1M(1024KB)以下的图片',
      type: 'warning',
    })
    return false
  }
}
Vue.prototype.beforeUpload = beforeUpload;


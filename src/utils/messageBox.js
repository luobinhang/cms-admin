/**
 * Created by Hang on 2018/5/30 0030.
 */
import { MessageBox, Message  } from 'element-ui'

export function deleteMessageBox(data, ajax, callback) {  //删除提示
  MessageBox.confirm('确认删除?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    beforeClose: (action, instance, done) => {
      if (action === 'confirm') {
        instance.confirmButtonLoading = true;
        instance.confirmButtonText = '删除中...';
        ajax(data).then(response => {
          done();
          instance.confirmButtonLoading = false;
          Message({
            type: 'success',
            message: '删除成功!'
          });
          callback()
        }).catch(() => {
          done();
          instance.confirmButtonLoading = false;
          instance.confirmButtonText = '确定';
        })
      } else {
        done();
        instance.confirmButtonLoading = false;
        instance.confirmButtonText = '确定';
      }
    }
  })
}

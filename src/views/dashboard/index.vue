<template>
  <div class="dashboard-editor-container">
    <div class=" clearfix">
      <div style="float: left" @mouseenter="enter" @mouseout="out">
        <pan-thumb>
          <div class="info-gif">
            <img src="../../assets/5.gif">
          </div>
        </pan-thumb>
      </div>
      <div class="info-container">
        <span class="display_name">尊敬的{{ name }}</span>
        <span style="font-size:20px;padding-top:20px;display:inline-block;">欢迎来到嗨课堂CMS后台</span>
      </div>
    </div>
    <div style="position: relative">
      <img class="emptyGif" src="../../assets/home.gif">
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PanThumb from '@/components/PanThumb'

export default {
  name: 'dashboard-editor',
  components: { PanThumb },
  data() {
    return {
      ah: '',
      warn: '',
      num: 0,
      imgClass:'',
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  methods: {
    enter() {
      this.num++;
      if(this.num>5) this.num = 1;
      this.imgClass = `img${this.num}`;
    },
    out() {
//      this.ah = '';
//      this.warn = '';
    },
  },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .emptyGif {
    display: block;
    width: 55%;
    margin: 0 auto;
  }
  .ah{
    position: absolute;
    left: 0;
    top: 0;
    p{
      font-size: 40px;
    }
    span{
      font-size: 18px;
    }
  }
  .dashboard-editor-container {
    background-color: #e3e3e3;
    min-height: 100vh;
    padding: 50px 60px 0px;
    .pan-info-roles {
      font-size: 12px;
      font-weight: 700;
      color: #333;
      display: block;
    }
    .info-gif{
      display: block;
      height: 100%;
      width: 100%;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      &.img1{
        background-image: url("../../assets/1.gif");
      }
      &.img2{
        background-image: url("../../assets/2.gif");
      }
      &.img3{
        background-image: url("../../assets/3.gif");
      }
      &.img4{
        background-image: url("../../assets/4.gif");
      }
      &.img5{
        background-image: url("../../assets/5.gif");
      }
      img{
        position: absolute;
        left: 50%;
        top: 0;
        height: 100%;
        transform: translateX(-50%);
      }
    }
    .info-container {
      position: relative;
      margin-left: 190px;
      height: 150px;
      overflow: hidden;
      .display_name {
        font-size: 38px;
        line-height: 48px;
        color: #212121;
        margin-top: 25px;
        display: block;
      }
    }
  }

</style>

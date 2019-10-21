<template>
  <div class="photoset">
    <div class="photoset__main">
      <img @click="handlePhotoClick(0)" :src="firstMainPhoto" class="photoset__photo photoset__photo--first">
      <div class="photoset__photos photoset__photos--preview">
        <img v-for="(photo, index) in secondaryMainPhotos"
            :src="photo"
            :key="index"
            class="photoset__photo photoset__photo--preview"
            @click="handlePhotoClick(index + 1)"
        >
      </div>
    </div>
    <div v-if="hasOtherPhotos && isShowOther" class="">
      <div class="photoset__photoblock">
        <div class="photoset__title"></div>
        <div class="photoset__photos photoset__photos--other">
          <img v-for="(photo, index) in otherPhotos"
              :key="index"
              :src="photo"
              class="photoset__photo photoset__photo--other"
              @click="handlePhotoClick(index + 5)"
          >
        </div>
      </div>
    </div>
    <div v-if="hasOtherPhotos" @click="handleButtonClick()" role="button" class="photoset__button">{{ buttonText }}</div>
  </div>
</template>

<script>
export default {
  name: 'CPhotoset',
  props: {
    photoset: {
      type: [Object,Array],
      default: () => [],
    }
  },
  data() {
    return {
      isShowOther: false,
    };
  },
  computed: {
    firstMainPhoto(){
      return this.photoset.length ? this.photoset[0] : ''
    },
    secondaryMainPhotos(){
      return this.photoset.length > 2 ? this.photoset.slice(1,5) : []
    },
    hasOtherPhotos(){
      return this.photoset.length > 5
    },
    otherPhotos(){
      return this.hasOtherPhotos ? this.photoset.slice(5) : []
    },
    buttonText(){
      return this.isShowOther ? 'Скрыть все' : 'Посмотреть все'
    }
  },
  mounted(){

  },
  methods: {
    handleButtonClick(){
      this.isShowOther = !this.isShowOther
    },
    openOther(){
      this.isShowOther = true
    },
    handlePhotoClick(indexPhoto){
      this.$emit('photoClick', indexPhoto)
    },
  },
};
</script>

<style scoped lang="scss" src="@/styles/CPhotoset.scss">

</style>

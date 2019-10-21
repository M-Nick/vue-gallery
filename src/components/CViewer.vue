<template>
  <div v-if="show" ref="viewer" class="viewer">
    <div @click="close()" class="viewer__background"></div>
    <div class="viewer__title">{{ currentTitle }}</div>
    <div @click="close()" class="viewer__button viewer__button--close">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 10.6L6.6 5.2 5.2 6.6l5.4 5.4-5.4 5.4 1.4 1.4 5.4-5.4 5.4 5.4 1.4-1.4-5.4-5.4 5.4-5.4-1.4-1.4-5.4 5.4z"></path></svg>
    </div>
    <div ref="view" class="viewer__view">
      <div ref="mainRow" class="viewer__row viewer__row--main">
        <img draggable="false" :src="prevPhotoLink" class="viewer__photo viewer__photo--prev">
        <img draggable="false" :src="currentPhotoLink" class="viewer__photo viewer__photo--current">
        <img draggable="false" :src="nextPhotoLink" class="viewer__photo viewer__photo--next">
      </div>
      <div class="viewer__button viewer__button--main-left"><span ref="mainLeftArrow" class="viewer__arrow viewer__arrow--main viewer__arrow--main-left"></span></div>
      <div class="viewer__button viewer__button--main-right"><span ref="mainRightArrow" class="viewer__arrow viewer__arrow--main viewer__arrow--main-right"></span></div>
    </div>
    <div class="viewer__description"><p>{{ currentDescription }}</p></div>
    <div ref="previewBar" class="viewer__bar">
      <div ref="previewRow" class="viewer__row viewer__row--preview">
        <div v-for="(photo, index) in photoLinks" :key="index" :class="previwePhotoClass(index)" class="viewer__photo viewer__photo--wrapper">
          <img draggable="false" @click="setPhotoByIndex(index)" :src="photo" class="viewer__photo viewer__photo--preview">
        </div>
      </div>
    </div>
    <div ref="barLeftArrow" @click="moveBarLeft()" class="viewer__button viewer__button--left"><span class="viewer__arrow viewer__arrow--left"></span></div>
    <div ref="barRightArrow" @click="moveBarRight()" class="viewer__button viewer__button--right"><span class="viewer__arrow viewer__arrow--right"></span></div>
  </div>
</template>

<script>
export default {
  name: 'CViewer',
  props: {
    photos: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      show: false,
      currentPhotoIndex: 0,

      mainRowStartPointX: null,
      mainRowStartTime: null,
      mainRowStartLeft: 0,

      touchEvent: false,
    };
  },
  computed: {
    currentTitle(){
      return this.photos[this.currentPhotoIndex].file_title
    },
    currentDescription(){
      return this.photos[this.currentPhotoIndex].file_description
    },
    prevPhotoLink(){
      const prevPhotoIndex = this.currentPhotoIndex == 0 ? this.photos.length - 1 : this.currentPhotoIndex - 1
      return this.photos[prevPhotoIndex]
    },
    currentPhotoLink(){
      return this.photos[this.currentPhotoIndex]
    },
    nextPhotoLink(){
      const nextPhotoIndex = this.currentPhotoIndex + 1 == this.photos.length ? 0 : this.currentPhotoIndex + 1
      return this.photos[nextPhotoIndex]
    },
    photoLinks(){
      return this.photos.map(photo => photo)
    }
  },
  methods: {
    moveBarLeft(){
      console.log(Object.keys(this.photos).slice().map(key => this.wherePhotoInBar(this.photos[key])))
      console.log(Object.keys(this.photos).slice().reverse().map(key => this.wherePhotoInBar(this.photos[key])))
      console.log(Object.keys(this.photos).findIndex((photo, key) => this.wherePhotoInBar(key) == -1))
      console.log(Object.keys(this.photos).slice().reverse().findIndex((photo, key) => this.wherePhotoInBar(key) == -1))
      const index = this.photos.slice().reverse().findIndex((photo, key) => this.wherePhotoInBar(key) == -1)
      if(index != -1){
        this.scrollPhotoIntoViewBar(index)
      }
    },
    moveBarRight(){
      const index = this.photos.findIndex((photo, key) => this.wherePhotoInBar(key) == 1)
      if(index != -1){
        this.scrollPhotoIntoViewBar(index)
      }
    },
    customMainButtonsHover(){
      const view = this.$refs.view
      view.addEventListener('mousemove', this.handleViewMouseMoveForHover)
      view.addEventListener('mouseout', this.handleViewMouseOutForHover)
    },
    handleViewMouseMoveForHover(e){
      const view = this.$refs.view
      const leftArrow = this.$refs.mainLeftArrow
      const rightArrow = this.$refs.mainRightArrow
      if(this.mainRowStartTime){
        return
      }
      if(e.clientX - view.getBoundingClientRect().left < view.offsetWidth / 2){
        leftArrow.style.setProperty('--main-opacity', '1')
        rightArrow.style.setProperty('--main-opacity', '')
      } else {
        rightArrow.style.setProperty('--main-opacity', '1')
        leftArrow.style.setProperty('--main-opacity', '')
      }
    },
    handleViewMouseOutForHover(){
      const leftArrow = this.$refs.mainLeftArrow
      const rightArrow = this.$refs.mainRightArrow
      if(this.mainRowStartTime){
        return
      }
      rightArrow.style.setProperty('--main-opacity', '')
      leftArrow.style.setProperty('--main-opacity', '')
    },
    checkHorizontalMobile(){
      return window.innerWidth - window.innerHeight > 100 &&
            /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    },
    handleWindowResize(){
      this.setPreviewRowPosition()
      this.setDeviceClass()
    },
    setDeviceClass(){
      const viewer = this.$refs.viewer
      if(this.checkHorizontalMobile()){
        if(!viewer.classList.contains('viewer--horizontal')){
          viewer.classList.add('viewer--horizontal')
        }
      } else {
        this.toggleOffDzenMode()
        if(viewer.classList.contains('viewer--horizontal')){
          viewer.classList.remove('viewer--horizontal')
        }
      }
    },
    addGeneralKeyDown(){
      window.addEventListener('keydown', this.handleGeneralKeyDown)
    },
    removeGeneralKeyDown(){
      window.removeEventListener('keydown', this.handleGeneralKeyDown)
    },
    handleGeneralKeyDown(e){
      switch(e.code){
        case 'Escape': {
          this.close()
          break
        }
        case 'ArrowRight': {
          this.animateMain(5, 1)
          break
        }
        case 'ArrowDown': {
          this.animateMain(5, 1)
          break
        }
        case 'ArrowLeft': {
          this.animateMain(5, -1)
          break
        }
        case 'ArrowUp': {
          this.animateMain(5, -1)
          break
        }
        default: {
          break
        }
      }
    },
    makeMainDraggable(){
      const mainRow = this.$refs.mainRow
      mainRow.addEventListener('mousedown', this.handleMainMouseDown)
      mainRow.addEventListener('touchstart', this.handleMainTouchStart)
    },
    handleMainMouseDown(e){
      e.preventDefault()
      const mainRow = this.$refs.mainRow
      this.mainRowStartLeft = parseInt(window.getComputedStyle(mainRow).getPropertyValue('left'))
      mainRow.style.cursor = 'grabbing'
      this.mainRowStartPointX = e.clientX
      this.mainRowStartTime = new Date().getTime()
      window.addEventListener('mousemove', this.handleMainMouseMove)
      window.addEventListener('mouseup', this.handleMainMouseUp)
    },
    handleMainTouchStart(e){
      e.preventDefault()
      this.touchEvent = true
      const mainRow = this.$refs.mainRow
      this.mainRowStartLeft = parseInt(window.getComputedStyle(mainRow).getPropertyValue('left'))
      mainRow.style.cursor = 'grabbing'
      this.mainRowStartPointX = e.changedTouches[0].clientX
      this.mainRowStartTime = new Date().getTime()
      window.addEventListener('touchmove', this.handleMainTouchMove)
      window.addEventListener('touchend', this.handleMainTouchEnd)
    },
    handleMainMouseMove(e){
      const mainRow = this.$refs.mainRow
      const startX = this.mainRowStartPointX
      const distanceX = e.clientX - startX
      mainRow.style.left = this.mainRowStartLeft + distanceX + 'px'
    },
    handleMainTouchMove(e){
      const mainRow = this.$refs.mainRow
      const startX = this.mainRowStartPointX
      const distanceX = e.changedTouches[0].clientX - startX
      mainRow.style.left = this.mainRowStartLeft + distanceX + 'px'
      mainRow
    },
    handleMainMouseUp(e){
      if(!this.touchEvent){
        const mainRow = this.$refs.mainRow
        mainRow.style.cursor = ''
        this.chooseAction(e)
      }
      window.removeEventListener('mousemove', this.handleMainMouseMove)
      window.removeEventListener('mouseup', this.handleMainMouseUp)
    },
    handleMainTouchEnd(e){
      setTimeout(() => this.touchEvent = false, 150)
      const mainRow = this.$refs.mainRow
      mainRow.style.cursor = ''
      this.chooseAction(e)
      window.removeEventListener('touchmove', this.handleMainTouchMove)
      window.removeEventListener('touchend', this.handleMainTouchEnd)
    },
    chooseAction(e){
      const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX
      const distanceX = clientX - this.mainRowStartPointX
      const mouseMoveTime = new Date().getTime() - this.mainRowStartTime
      if(distanceX == 0 && mouseMoveTime < 500){
        this.handleMainClick(e)
      } else {
        this.setMainOnEndMove(e)
      }
      this.mainRowStartPointX = null
      this.mainRowStartTime = null
    },
    handleMainClick(e){
      if(this.checkHorizontalMobile()){
          this.toggleDzenMode()
      } else {
        this.changePhoto(e)
      }
    },
    toggleDzenMode(){
      const viewer = this.$refs.viewer
      viewer.classList.toggle('viewer--dzen')
    },
    changePhoto(e){
      const view = this.$refs.view
      const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX
      if(clientX - view.getBoundingClientRect().left > view.offsetWidth / 2){
        this.animateMain(5, 1)
      } else {
        this.animateMain(5, -1)
      }
    },
    toggleOffDzenMode(){
      const viewer = this.$refs.viewer
      viewer.classList.remove('viewer--dzen')
    },
    setMainOnEndMove(e){
      const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX
      const view = this.$refs.view
      const viewWidth = parseInt(window.getComputedStyle(view).width)
      const distanceX = clientX - this.mainRowStartPointX
      const mouseMoveTime = new Date().getTime() - this.mainRowStartTime
      const speed = Math.abs(distanceX / mouseMoveTime)
      const direction = distanceX > 0 ? 1 : -1
      if(Math.abs(distanceX / viewWidth) > 0.4 || speed > 1){
        this.animateMain(speed, -direction)
      } else {
        this.animateMain(speed, 0)
      }
    },
    animateMain(speed, direction){
      const self = this
      const currentPhoto = 2 //центральное фото
      const mainRow = this.$refs.mainRow
      const view = this.$refs.view
      const viewWidth = parseInt(window.getComputedStyle(view).width)
      const viewer = this.$refs.viewer
      const viewerStyle = window.getComputedStyle(viewer)
      const viewMargin = parseInt(viewerStyle.getPropertyValue('--main-photo-margin'))
      const currentPos = parseInt(mainRow.style.left) || parseInt(window.getComputedStyle(mainRow).left)
      const targetPos = -1 * (currentPhoto - 1 + direction) * (viewMargin + viewWidth)
      const neededTime = Math.min(Math.abs(targetPos - currentPos) / speed / 1000, 0.5)
      mainRow.style.transition = `left ${ neededTime }s linear`
      mainRow.style.left = `${ targetPos }px`
      setTimeout(function(){
        mainRow.style.transition = ``
        if(direction != 0) direction < 0 ? self.showPrevPhoto() : self.showNextPhoto()
        mainRow.style.left = ``
      }, neededTime * 1000)
    },

    setMainRowPosition(){
      const mainRow = this.$refs.mainRow
      const viewer = this.$refs.viewer
      const viewerStyle = window.getComputedStyle(viewer)
      const viewWidth = viewerStyle.getPropertyValue('--width').indexOf('vw') == -1 ?
                  parseInt(viewerStyle.getPropertyValue('--width')) :
                  window.innerWidth / 100 * parseInt(parseInt(viewerStyle.getPropertyValue('--width')))
      const viewMargin = parseInt(viewerStyle.getPropertyValue('--main-photo-margin'))

      mainRow.style.width = viewWidth * 3 + viewMargin * 2 + 'px'
    },
    setPreviewRowPosition(){
      const previewRow = this.$refs.previewRow
      const viewer = this.$refs.viewer
      const viewerStyle = window.getComputedStyle(viewer)
      const viewMargin = parseInt(viewerStyle.getPropertyValue('--preview-photo-margin'))
      const widths = Object.values(previewRow.childNodes).map(photoEl => photoEl.offsetWidth)
      let width = (widths[0] + viewMargin) * widths.length
      previewRow.style.width = `${ width }px`
      this.scrollPhotoIntoViewBar()
    },

    setPhotoByIndex(index){
      this.currentPhotoIndex = index
      this.scrollPhotoIntoViewBar()
    },
    showPrevPhoto(){
      const i = this.currentPhotoIndex
      this.currentPhotoIndex = i == 0 ? this.photos.length - 1 : i - 1
      this.scrollPhotoIntoViewBar()
    },
    showNextPhoto(){
      const i = this.currentPhotoIndex
      this.currentPhotoIndex = i == this.photos.length - 1 ? 0 : i + 1
      this.scrollPhotoIntoViewBar()
    },
    previwePhotoClass(index){
      let result = ''
      result += index == this.currentPhotoIndex ? ' viewer__photo--current-preview' : ''
      return result
    },
    transparentArrowsIfNeed(newLeft){
      const previewRow = this.$refs.previewRow
      const previewBar = this.$refs.previewBar
      const minLeft = -parseInt(previewRow.style.width) + previewBar.offsetWidth
      const left = this.$refs.barLeftArrow
      const right = this.$refs.barRightArrow
      if(newLeft == 0){
        left.classList.add('viewer__arrow--disabled')
        right.classList.remove('viewer__arrow--disabled')
      } else if(newLeft == minLeft){
        left.classList.remove('viewer__arrow--disabled')
        right.classList.add('viewer__arrow--disabled')
      } else {
        left.classList.remove('viewer__arrow--disabled')
        right.classList.remove('viewer__arrow--disabled')
      }
    },
    scrollPhotoIntoViewBar(photoIndex){
      const index = photoIndex === undefined ? this.currentPhotoIndex : photoIndex
      const photoPos = this.wherePhotoInBar(index)
      const viewer = this.$refs.viewer
      const previewMargin = parseInt(window.getComputedStyle(viewer).getPropertyValue('--preview-photo-margin'))
      const previewBar = this.$refs.previewBar
      const previewRow = this.$refs.previewRow
      const widths = Object.values(this.$refs.previewRow.childNodes).map(photoEl => photoEl.offsetWidth)
      const minLeft = -parseInt(previewRow.style.width) + previewBar.offsetWidth
      if(photoPos == 0) {
        let left = parseInt(previewRow.style.left) || 0
        this.transparentArrowsIfNeed(left)
        return
      }
      let newLeft = 0
      if(photoPos == 1){
        for(let i = 0; i < index; i++){
          newLeft -= widths[i] + previewMargin
        }
      }
      if(photoPos == -1){
        for(let i = 0; i < index; i++){
          newLeft -= widths[i] + previewMargin
        }
        newLeft += previewBar.offsetWidth - widths[index]
      }
      newLeft = newLeft < minLeft ? minLeft : newLeft
      newLeft = newLeft > 0 ? 0 : newLeft
      previewRow.style.left = `${ newLeft }px`
      this.transparentArrowsIfNeed(newLeft)
    },
    wherePhotoInBar(index){
      const viewer = this.$refs.viewer
      const previewRow = this.$refs.previewRow
      const previewMargin = parseInt(window.getComputedStyle(viewer).getPropertyValue('--preview-photo-margin'))
      const previewBar = this.$refs.previewBar
      const widths = Object.values(previewRow.childNodes).map(photoEl => photoEl.offsetWidth)
      const previewRowLeft = parseInt(previewRow.style.left) || 0
      const barLeftSide = 0
      const barRightSide = barLeftSide + previewBar.offsetWidth
      let photoLeftSide = 0
      let photoRightSide = 0
      for(let i = 0; i < index; i++){
        photoLeftSide += widths[i] + previewMargin
      }
      photoLeftSide += previewRowLeft
      photoRightSide += photoLeftSide + widths[index]
      let result = 0
      if(photoLeftSide < barLeftSide) result = -1
      if(photoRightSide > barRightSide) result = 1
      return result
    },

    addAllActivity(){
      window.addEventListener('resize', this.handleWindowResize)
      this.makeMainDraggable()
      this.customMainButtonsHover()
    },
    setAllStyle(){
      this.hideAcPanel()
      this.setMainRowPosition()
      this.setPreviewRowPosition()
      this.setDeviceClass()
    },
    hideAcPanel(){
      const classes = document.getElementsByClassName('ac-panel')
      if(classes.length > 0){
        const panel = Object.values(classes)[0]
        panel.style.display = 'none'
      }
    },
    showAcPanel(){
      const classes = document.getElementsByClassName('ac-panel')
      if(classes.length > 0){
        const panel = Object.values(classes)[0]
        panel.style.display = ''
      }
    },

    clearAllActivity(){
      window.removeEventListener('resize', this.handleWindowResize)
    },

    async open(photoIndex){
      this.currentPhotoIndex = photoIndex
      this.hideScrollBar()
      this.show = true
      await this.$forceUpdate()
      await this.addAllActivity()
      await this.setAllStyle()
      await this.addGeneralKeyDown()
    },

    close(){
      this.clearAllActivity()
      this.showScrollBar()
      this.removeGeneralKeyDown()
      this.showAcPanel()
      this.show = false
    },
    hideScrollBar(){
      document.body.style.overflow = 'hidden'
    },
    showScrollBar(){
      document.body.style.overflow = ''
    },
  }
};
</script>

<style scoped lang="scss" src="@/styles/CViewer.scss">

</style>

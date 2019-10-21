<template>
  <div>
    <CPhotoset ref="photoset" @photoClick="handlePhotoClick" :photoset="photos"></CPhotoset>
    <CViewer ref="viewer" :photos="photos"></CViewer>
  </div>
</template>

<script>
import CViewer from '@/components/CViewer'
import CPhotoset from '@/components/CPhotoset'

export default {
  name: 'Gallery',
  components: {
    CViewer,
    CPhotoset,
  },
  props: {
  },
  data () {
    return {
      photos: [
        "https://picsum.photos/id/0/891/596",
        "https://picsum.photos/id/1/596/891",
        "https://picsum.photos/id/2/891/597",
        "https://picsum.photos/id/3/597/891",
        "https://picsum.photos/id/4/891/598",
        "https://picsum.photos/id/5/598/891",
        "https://picsum.photos/id/6/891/599",
        "https://picsum.photos/id/7/599/891",
        "https://picsum.photos/id/8/891/600",
        "https://picsum.photos/id/9/600/891",
        "https://picsum.photos/id/10/891/601",
        "https://picsum.photos/id/11/601/891",
        "https://picsum.photos/id/12/891/602",
        "https://picsum.photos/id/13/602/891",
        "https://picsum.photos/id/14/891/603",
        "https://picsum.photos/id/15/603/891",
        "https://picsum.photos/id/16/891/604",
        "https://picsum.photos/id/17/604/891",
        "https://picsum.photos/id/18/891/605",
        "https://picsum.photos/id/19/605/891",
        "https://picsum.photos/id/20/892/596",
        "https://picsum.photos/id/21/596/892",
        "https://picsum.photos/id/22/892/597",
        "https://picsum.photos/id/23/597/892",
        "https://picsum.photos/id/24/892/598",
        "https://picsum.photos/id/25/598/892",
        "https://picsum.photos/id/26/892/599",
        "https://picsum.photos/id/27/599/892",
        "https://picsum.photos/id/28/892/600",
        "https://picsum.photos/id/29/600/892",
        "https://picsum.photos/id/30/892/601",
        "https://picsum.photos/id/31/601/892",
        "https://picsum.photos/id/32/892/602",
        "https://picsum.photos/id/33/602/892",
        "https://picsum.photos/id/34/892/603",
        "https://picsum.photos/id/35/603/892",
        "https://picsum.photos/id/36/892/604",
        "https://picsum.photos/id/37/604/892",
        "https://picsum.photos/id/38/892/605",
        "https://picsum.photos/id/39/605/892",
        "https://picsum.photos/id/40/893/596",
        "https://picsum.photos/id/41/596/893",
        "https://picsum.photos/id/42/893/597",
        "https://picsum.photos/id/43/597/893",
        "https://picsum.photos/id/44/893/598",
        "https://picsum.photos/id/45/598/893",
        "https://picsum.photos/id/46/893/599",
        "https://picsum.photos/id/47/599/893",
        "https://picsum.photos/id/48/893/600",
        "https://picsum.photos/id/49/600/893",
        "https://picsum.photos/id/50/893/601",
        "https://picsum.photos/id/51/601/893",
        "https://picsum.photos/id/52/893/602",
        "https://picsum.photos/id/53/602/893",
        "https://picsum.photos/id/54/893/603",
        "https://picsum.photos/id/55/603/893",
        "https://picsum.photos/id/56/893/604",
        "https://picsum.photos/id/57/604/893",
        "https://picsum.photos/id/58/893/605",
        "https://picsum.photos/id/59/605/893",
        "https://picsum.photos/id/60/894/596",
        "https://picsum.photos/id/61/596/894",
        "https://picsum.photos/id/62/894/597",
        "https://picsum.photos/id/63/597/894",
        "https://picsum.photos/id/64/894/598",
        "https://picsum.photos/id/65/598/894",
        "https://picsum.photos/id/66/894/599",
        "https://picsum.photos/id/67/599/894",
        "https://picsum.photos/id/68/894/600",
        "https://picsum.photos/id/69/600/894",
        "https://picsum.photos/id/70/894/601",
        "https://picsum.photos/id/71/601/894",
        "https://picsum.photos/id/72/894/602",
        "https://picsum.photos/id/73/602/894",
        "https://picsum.photos/id/74/894/603",
        "https://picsum.photos/id/75/603/894",
        "https://picsum.photos/id/76/894/604",
        "https://picsum.photos/id/77/604/894",
        "https://picsum.photos/id/78/894/605",
        "https://picsum.photos/id/79/605/894",
        "https://picsum.photos/id/80/895/596",
        "https://picsum.photos/id/81/596/895",
        "https://picsum.photos/id/82/895/597",
        "https://picsum.photos/id/83/597/895",
        "https://picsum.photos/id/84/895/598",
        "https://picsum.photos/id/85/598/895",
        "https://picsum.photos/id/86/895/599",
        "https://picsum.photos/id/87/599/895",
        "https://picsum.photos/id/88/895/600",
        "https://picsum.photos/id/89/600/895",
        "https://picsum.photos/id/90/895/601",
        "https://picsum.photos/id/91/601/895",
        "https://picsum.photos/id/92/895/602",
        "https://picsum.photos/id/93/602/895",
        "https://picsum.photos/id/94/895/603",
        "https://picsum.photos/id/95/603/895",
        "https://picsum.photos/id/96/895/604",
        "https://picsum.photos/id/97/604/895",
        "https://picsum.photos/id/98/895/605",
        "https://picsum.photos/id/99/605/895",
      ],
    }
  },
  computed: {
    unstructuredPhotos(){
      let result = []
      if(this.photos.other || this.photos.main){
        result = [...this.photos.main.map(photo => photo), ...this.photos.other.map(photoset => photoset.objects)]
        result = result.flat()
      }
      return result
    }
  },
  methods: {
    handlePhotoClick(index){
      this.$refs.viewer.open(index)
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" src="@/styles/Gallery.scss">

</style>

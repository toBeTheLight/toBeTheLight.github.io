Vue.component('waterfall-item', {
    template: `<div class="waterfall-item" :style="itemStyle">
    <slot />
  </div>`,
  created () {
    this.$parent.add(this)
  },
  computed: {
    itemStyle () {
      const index = this.$parent.$children.indexOf(this)
      const { left, top } = this.$parent.positions[index] || {}
      const width = this.$parent.colWidth
      return {
        transform: `translate3d(${left}px,${top}px,0)`,
        width: `${width}px`,
        'background-color': `rgb(${255 - left%255}, ${255 - top%255}, ${(255 - left+top)/255})`
      }
    }
  },
  destoryed () {
    this.$parent.delete(this)
  }
})
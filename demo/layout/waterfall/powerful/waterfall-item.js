Vue.component('waterfall-item', {
    template: `
  <div class="waterfall-item" :style="itemStyle">
    <div class="waterfall-item-shadow" ref="bigger" @scroll="sizeChange('+')">
      <div class="waterfall-item-holder--bigger">
      </div>
    </div>
    <div class="waterfall-item-shadow" ref="smaller" @scroll="sizeChange('-')">
      <div class="waterfall-item-holder--smaller">
      </div>
    </div>
    <slot />
  </div>`,
  data () {
    return {
      counts: 0
    }
  },
  created () {
    this.$parent.add(this)
  },
  mounted () {
    this.$nextTick(() => {
      this.$refs.bigger.scrollTop = '200000'
      this.$refs.smaller.scrollTop = '200000'
    })
  },
  computed: {
    itemStyle () {
      const index = this.$parent.$children.indexOf(this)
      const { left, top } = this.$parent.positions[index] || {}
      const width = this.$parent.colWidth
      return {
        transform: `translate3d(${left}px,${top}px,0)`,
        width: `${width}px`,
        transition: `transform .5s linear`
      }
    }
  },
  methods: {
    sizeChange () {
      this.$parent.update(this)
    }
  },
  destoryed () {
    this.$parent.delete(this)
  }
})
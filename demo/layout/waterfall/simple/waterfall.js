const { min, max } = _
Vue.component('waterfall', {
  data () {
      return {
      containerWidth: undefined,
      children: [],
      childrenHeights: []
      }
  },
  name: 'Waterfall',
  props: {
    columnCount: {
      type: Number,
      default: 5,
      required: true
    },
    gutterWidth: {
      type: Number,
      default: 0
    },
    gutterHeight: {
      type: Number,
      default: 0
    }
  },
  methods: {
      add (child) {
      const index = this.$children.indexOf(child)
      this.children[index] = child
      this.resize(index, true)
      },
      delete (child) {
      const index = this.$children.indexOf(child)
      this.children[index].splice(index, 1)
      this.resize(index, false)
      },
      getContainerWidth () {
      this.containerWidth = this.$el.getBoundingClientRect().width
      console.log(this.$el.getBoundingClientRect().width)
      },
      resize (index, update) {
      this.$nextTick(() => {
          if (!update) {
          this.childrenHeights.splice(index, 1)
          } else {
          const childrenHeights = this.childrenHeights.slice(0, index)
          for (let i = index; i < this.children.length; i++) {
              childrenHeights.push(this.$children[i].$el.getBoundingClientRect().height)
          }
          this.childrenHeights = childrenHeights
          }
      })
      }
  },
  computed: {
      colWidth () {
      return (this.containerWidth + this.gutterWidth)/this.columnCount - this.gutterWidth
      },
      layouts () {
      const colHeights = new Array(this.columnCount).fill(0)
      const colItemCounts = new Array(this.columnCount).fill(0)
      const positions = []
      this.childrenHeights.forEach(height => {
          let col, left, top
          const minHeightCol = colHeights.indexOf(min(colHeights))
          const minCountCol = colItemCounts.indexOf(min(colItemCounts))
          if (colHeights[minHeightCol] === 0) {
          col = minCountCol
          top = 0
          } else {
          col = minHeightCol
          top = colHeights[col] + this.gutterHeight
          }
          colHeights[col] = top + height
          colItemCounts[col] += 1
          left = (this.colWidth + this.gutterWidth) * col
          positions.push({ left, top })
      })
      const totalHeight = max(colHeights)
      return {
          positions,
          totalHeight
      }
      },
      positions () {
      return this.layouts.positions || []
      },
      totalHeight () {
      return this.layouts.totalHeight || 0
      }
  },
  mounted () {
      this.getContainerWidth()
      window.addEventListener('resize', this.getContainerWidth)
  },
  destory () {
      window.removeEventListener('resize', this.getContainerWidth)
  },
  render (h) {
      return h('div', { class: 'waterfall' }, this.$slots.default)
  }
})
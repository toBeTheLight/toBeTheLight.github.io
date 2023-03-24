const { min, max } = _
Vue.component('MoneyInfo', {
  template: `
    <div class="money-info">
      <div>名称<input type="text" v-model="value.name" /></div>
      <div>总额<input type="number" v-model="value.total" />万</div>
      <div>利率<input type="number" v-model="value.rate" />%</div>
      <div>期数<input type="number" v-model="value.years" />年</div>
      <div>支付方式
        <select v-model="value.payment">
          <option v-for="option in paymentOptions" :value="option.value">{{ option.label }}</option>
        </select>
      </div>
      <button @click="update">新增</button>
    </div>
  `,
  data () {
    return {
      value: {
        name: '',
        total: '',
        rate: '',
        payment: '',
        years: ''
      },
      paymentOptions: [
        { label: '等额本息', value: '等额本息' },
        { label: '等额本金', value: '等额本金' },
        { label: '月息年金', value: '月息年金' },
        { label: '一次性本金', value: '一次性本金' },
        { label: '一次性利息', value: '一次性利息' },
      ]
    }
  },
  methods: {
    update () {
      this.$emit('update', {
        name: this.value.name,
        total: this.value.total ? Number(this.value.total) : 0,
        rate: this.value.rate ? Number(this.value.rate) : 0,
        payment: this.value.payment,
        years: this.value.years ? Number(this.value.years) : 0
      })
    }
  }
})
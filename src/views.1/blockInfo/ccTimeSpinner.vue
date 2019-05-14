<!--<template>
<div class="time-spinner">
    <input  ref="input" v-once style="box-shadow: none; vertical-align: top; text-indent: 10px" />
</div>
</template>-->

<!--<script>
export default {
    data() {
        return {
            time: undefined
        }
    },
    template: '#cc-time-spinner-tpl',
    props: ['value', 'options'],
    methods: {
        parseMinToStr(min) {
            const hours = Math.floor(min/60)
            const mins = min%60
            const hoursStr = hours > 9 ? ('' + hours) : ('0' + hours)
            const minsStr = mins > 9 ? ('' + mins) : ('0' + mins)
            return hoursStr + ':' + minsStr
        },
        parseStrToMin(str) {
            const timeArr = str.split(':')
            const hours = parseInt(timeArr[0])
            const mins = parseInt(timeArr[1])
            return hours * 60 + mins
        }
    },
    mounted() {
        let time = ''
        if (this.value !== undefined) {
            time = this.parseMinToStr(this.value)
        }
        const $el = $(this.$refs.input)
        const options = Object.assign({}, this.options, {
            value: time
        })
        $el.timespinner(options)
        setTimeout(function() {
            const opts = $el.data('timespinner').options
            Object.defineProperty(opts, 'value', {
                set: function(val) {
                    if (val != this.time) {
                        this.time = val
                        this.$emit('input', this.parseStrToMin(val))
                    }
                }.bind(this)
            })
        }.bind(this), 0)
        this.time = time
    }
}
</script>

<style scoped>
.time-spinner .spinner {
    border: none;
}
.time-spinner {
    border: 1px solid #ccc;
    display: inline-block;
    overflow: hidden;
    padding: 1px;
}
</style>-->
<template>
  <el-time-select
  v-model="value1" :picker-options="{  start: '00:00', step: '00:10',  end: '24:00' }" placeholder="选择时间" @change="handle" >
</el-time-select>
</template>


<script>
  export default {
    data() {
      return {
        value1: '',
        time:''
      };
    },
    methods:{
      parseStrToMin(str) {
            const timeArr = str.split(':')
            const hours = parseInt(timeArr[0])
            const mins = parseInt(timeArr[1])
            return hours * 60 + mins
        },
      handle(){
        if(this.value1 != undefined){
         this.time = this.parseStrToMin(this.value1)
         this.$emit('input', this.time)
        }
      }
    }
  }
</script>
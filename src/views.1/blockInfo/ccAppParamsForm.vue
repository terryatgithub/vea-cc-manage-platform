<template>
     <div class="container">
        <el-form-item label="应用包名" :prop="formProp('packagename')" :rules="rules.packagename">
            <el-input v-model.trim="inputValue.packagename"></el-input>
        </el-form-item>
        <el-form-item label="应用版本号" :prop="formProp('versioncode')" :rules="rules.versioncode">
            <el-input v-model.trim="inputValue.versioncode"></el-input>
        </el-form-item>
        <el-form-item label="启动动作" :prop="formProp('dowhat')" :rules="rules.dowhat">
            <el-select v-model="inputValue.dowhat">
                <el-option label="startActivity" value="startActivity"></el-option>
                <el-option label="startService" value="startService"></el-option>
                <el-option label="sendBroadcast" value="sendBroadcast"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="启动方式" :prop="formProp('bywhat')" :rules="rules.bywhat">
            <el-select v-model="inputValue.bywhat">
                <el-option label="action" value="action"></el-option>
                <el-option label="class" value="class"></el-option>
                <el-option label="uri" value="uri"></el-option>
                <el-option label="activity" value="activity"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="启动参数" :prop="formProp('byvalue')" :rules="rules.byvalue">
            <el-input type="textarea" v-model.trim="inputValue.byvalue"></el-input>
        </el-form-item>
        <el-form-item label="扩展参数">
            <div 
                class="app-extend-params"
                v-for="(param, index) in inputValue.params"
                :key="index">
                <el-form-item 
                    label="key:" 
                    label-width="60px" 
                    :prop="formProp('params.' + index + '.key')"
                    :rules="rules.params.key"
                >
                    <el-input v-model.trim="param.key"></el-input>
                </el-form-item>
                <el-form-item 
                    label="value:" 
                    label-width="60px"
                    :prop="formProp('params.' + index + '.value')"
                    :rules="rules.params.value"
                >
                    <el-input v-model.trim="param.value"></el-input>
                </el-form-item>
                <a class="app-params__remove-param" @click="handleRemoveParam(index)"><i class="el-icon-minus"></i></a>
            </div>
            <el-button type="primary" @click="handleAddParam">
                <i class="el-icon-plus"></i>&nbsp;添加
            </el-button>
        </el-form-item>
    </div>
</template>
<script>
export default {
    data() {
        function validateKV(rule, value, cb) {
            if (/[！￥……（）——【】：；“”‘’、《》，。？\s+]/.test(value)) {
                cb(new Error('请勿输入特殊或空白字符'))
            } else {
                cb()
            }
        }
        return {
            inputValue: {
                packagename: undefined,
                versioncode: undefined,
                dowhat: undefined,
                bywhat: undefined,
                byvalue: undefined,
                params: [
                ],
                exception: {}
            },
            rules: {
                packagename: [
                    {required: true, message: '请输入应用包名', trigger: 'blur'}
                ],
                versioncode: [
                    {required: true, message: '请输入应用版本号', trigger: 'blur'}
                ],
                dowhat: [
                    {required: true, message: '请选择启动动作', trigger: 'blur'}
                ],
                bywhat: [
                    {required: true, message: '请选择启动方式', trigger: 'blur'}
                ],
                byvalue: [
                    {required: true, message: '请输入启动参数', trigger: 'blur'}
                ],
                params: {
                    key: [
                        {required: true, message: '不能为空', trigger: 'blur'},
                        {validator: validateKV, trigger: 'blur'}
                    ],
                    value: [
                        {required: true, message: '不能为空', trigger: 'blur'},
                        {validator: validateKV, trigger: 'blur'}
                    ]
                }
            },
        }
    },
    props: ['value', 'label-width', 'propPrefix'],
    watch: {
        value: 'setInputValue'
    },
    methods: {
        formProp(key) {
            return (this.propPrefix|| '') + key
        },
        genDefaultValue() {
            return {
                packagename: undefined,
                versioncode: undefined,
                dowhat: undefined,
                bywhat: undefined,
                byvalue: undefined,
                params: []
            }
        },
        setInputValue(val) {
            if (val !== this.inputValue) {
                this.inputValue = Object.assign(this.genDefaultValue(), val)
            }
        },
        emitInputValue(val) {
            this.$emit('input', this.inputValue)
        },
        handleAddParam() {
            this.inputValue.params.push({
                key: undefined,
                value: undefined
            })
        },
        handleRemoveParam(index) {
            this.inputValue.params.splice(index, 1)
        },
    },
    created() {
        if (this.value) {
            this.setInputValue(this.value)
        }
        this.$watch('inputValue', this.emitInputValue,  {
            deep: true
        })
    }  
}
</script>
<style <style lang="stylus" scoped>
.app-extend-params .el-form-item,
.app-extend-params .el-form-item__label,
.app-extend-params .el-form-item__content {
    display: inline-block;
}
.app-extend-params .el-form-item {
    margin-bottom: 24px;
}
.app-params__remove-param {
    cursor: pointer;
    padding: 5px;
    border: 2px solid #999;
    border-radius: 15px;
    color: #999;
}
.container .el-input--small {
    max-width: 280px;
}
</style>



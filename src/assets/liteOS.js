export default {
  // liteOS新增
  userTransform (oldArray) {
    const options = []
    // options[0] = {
    //   label: '全部客户',
    //   value: '',
    //   customerId: '',
    //   customerName: '',
    //   children: null,
    //   brandList: null,
    // };
    for (let i = 0; i < oldArray.length; i++) {
      const brandList = this.filterOptions(oldArray[i].brandList)
      options[i] = {
        label: oldArray[i].customerName,
        value: oldArray[i].customerName,
        customerId: oldArray[i].customerId,
        customerName: oldArray[i].customerName,
        brandList,
        children: brandList
      }
    }
    return options
  },
  filterOptions (oldList) {
    const options2 = []
    // options2[0] = {
    //   label: '全部品牌',
    //   value: '',
    //   brandId: '',
    //   brandName: '',
    //   customerId: '',
    // };
    for (let i = 0; i < oldList.length; i++) {
      options2[i] = {
        label: oldList[i].brandName,
        value: oldList[i].brandName,
        brandId: oldList[i].brandName,
        brandName: oldList[i].brandName,
        customerId: oldList[i].customerId
      }
    }
    return options2
  },
  chipModelTransform (oldArray) {
    const options = []
    // options[0] = {
    //   label: '全部客户',
    //   value: '',
    //   customerId: '',
    //   customerName: '',
    //   children: null,
    //   brandList: null,
    // };
    for (let i = 0; i < oldArray.length; i++) {
      const modelVOList = this.filterOptions1(oldArray[i].modelVOList)
      options[i] = {
        label: oldArray[i].chip,
        value: oldArray[i].chip,
        // areaId: oldArray[i].areaId,
        chip: oldArray[i].chip,
        modelVOList,
        children: modelVOList
      }
    }
    return options
  },
  filterOptions1 (oldList) {
    const options2 = []
    // options2[0] = {
    //   label: '全部品牌',
    //   value: '',
    //   brandId: '',
    //   brandName: '',
    //   customerId: '',
    // };
    for (let i = 0; i < oldList.length; i++) {
      options2[i] = {
        label: oldList[i].model,
        value: oldList[i].model,
        // countryId: oldList[i].countryId,
        model: oldList[i].model,
        chip: oldList[i].chip
      }
    }
    return options2
  },
  areaTransform (oldArray) {
    const options = []
    // options[0] = {
    //   label: '全部客户',
    //   value: '',
    //   customerId: '',
    //   customerName: '',
    //   children: null,
    //   brandList: null,
    // };
    for (let i = 0; i < oldArray.length; i++) {
      const countryList = this.filterOptions2(oldArray[i].countryList)
      options[i] = {
        label: oldArray[i].areaName,
        value: oldArray[i].areaName,
        areaId: oldArray[i].areaId,
        areaName: oldArray[i].areaName,
        countryList,
        children: countryList
      }
    }
    return options
  },
  versionTransform(oldArray) {
    const options = []
    // options[0] = {
    //   label: '全部客户',
    //   value: '',
    //   customerId: '',
    //   customerName: '',
    //   children: null,
    //   brandList: null,
    // };
    for (let i = 0; i < oldArray.length; i++) {
      options[i] = {
        versionId: oldArray[i].versionId,
        supportVersion: oldArray[i].supportVersion
      }
    }
    return options
  },
  filterOptions2 (oldList) {
    const options2 = []
    // options2[0] = {
    //   label: '全部品牌',
    //   value: '',
    //   brandId: '',
    //   brandName: '',
    //   customerId: '',
    // };
    for (let i = 0; i < oldList.length; i++) {
      options2[i] = {
        label: oldList[i].countryName,
        value: oldList[i].countryName,
        countryId: oldList[i].countryId,
        countryName: oldList[i].countryName,
        countryThreeCode: oldList[i].countryThreeCode,
        areaId: oldList[i].areaId
      }
    }
    return options2
  },
  echo (selString) {
    const arr1 = selString.split(',')
    for (const i in arr1) {
        arr1[i] = arr1[i].split('/')
    }
    return arr1
  },
  // 标准时间换算
  p (s) {
    return s < 10 ? '0' + s : s
  },
  date (time) {
    const d = new Date(time)
    const resTime = d.getFullYear() + '-' + this.p((d.getMonth() + 1)) + '-' + this.p(d.getDate()) + ' ' + this.p(d.getHours()) + ':' + this.p(d.getMinutes()) + ':' + this.p(d.getSeconds())
    return resTime
  },
  parserDate (date) {
    const t = Date.parse(date)
    if (!isNaN(t)) {
        return new Date(Date.parse(date.replace(/-/g, '/')))
    } else {
        return new Date()
    }
  }
}
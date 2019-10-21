const funcs = {
  get(self, link, params){
    return new Promise(resolve => {
      self.axios
      .get(link, {params: params})
      .then(response => resolve(response))
      .catch(errors => resolve(errors.response))
    })
  },
  post(self, link, data){
    return new Promise(resolve => {
      self.axios
      .post(link, data)
      .then(response => resolve(response))
      .catch(errors => resolve(errors.response))
    })
  },
}

export default funcs

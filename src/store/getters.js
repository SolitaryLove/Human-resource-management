const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.userInfo.staffPhoto,
  // name: state => state.user.name
  name:state=>state.user.userInfo.username,
  companyId:state=>state.user.userInfo.companyId,// 公司ID
}
export default getters

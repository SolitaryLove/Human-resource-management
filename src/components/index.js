import PageTools from '@/components/PageTools'
import UploadExcel from '@/components/UploadExcel'
import UploadImg from '@/components/UploadImg'
import ImageHolder from '@/components/ImageHolder'
import Language from '@/components/Language'
import ScreenFull from '@/components/ScreenFull'

export default {
    install(Vue){
        Vue.component('PageTools',PageTools);
        Vue.component('UploadExcel',UploadExcel);
        Vue.component('UploadImg',UploadImg);
        Vue.component('ImageHolder',ImageHolder);
        Vue.component('Language',Language);
        Vue.component('ScreenFull',ScreenFull);
    }
}
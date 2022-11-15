import Vue from 'vue';
import VueI18n from 'vue-i18n';
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'

Vue.use(VueI18n);

const i18n=new VueI18n({
    locale: 'zh',
    messages:{
        zh:{
            ...zhLocale,
            message:{
                hello:'你好，世界！'
            },
            navbar:{
                companyName:'合肥牛马网络科技有限公司'
            },
            sidebar:{
                dashboard:'首页',
                approvals:'审批',
                departments:'组织架构',
                employees:'员工',
                permission:'权限',
                attendances:'考勤',
                salarys:'薪资',
                setting:'角色设置',
                social:'社保'
            }
        },
        en:{
            ...enLocale,
            message:{
                hello:'Hello world!'
            },
            navbar:{
                companyName:'HeiFei cattle horses web science technology company'
            },
            sidebar:{
                dashboard:'Dashboard',
                approvals:'Approvals',
                departments:'Departments',
                employees:'Employees',
                permission:'Permission',
                attendances:'Attendances',
                salarys:'Salarys',
                setting:'Rolesetting',
                social:'Social'
            }
        }
    }
});

export default i18n;
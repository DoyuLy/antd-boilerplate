import field from '../pages/field/list/field'

const routes = {
    path: 'field',
    breadcrumbName: '数据源字段',
    noBreadcrumbLink: true,
    indexRoute: {
        breadcrumbName: '数据源字段管理',
        component: field
    },
    childRoutes: []
}
export default routes
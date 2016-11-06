import source from '../pages/source/list/source'

const routes = {
    path: 'source',
    breadcrumbName: '数据源',
    noBreadcrumbLink: true,
    indexRoute: {
        breadcrumbName: '数据源管理',
        component: source
    },
    childRoutes: []
}
export default routes
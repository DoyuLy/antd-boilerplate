import userGroupList from '../pages/userGroup/list/userGroup'

const routes = {
    path: 'userGroup',
    breadcrumbName: '用户组',
    noBreadcrumbLink: true,
    indexRoute: {
        breadcrumbName: '用户组管理',
        component: userGroupList
    },
    childRoutes: []
}

export default routes
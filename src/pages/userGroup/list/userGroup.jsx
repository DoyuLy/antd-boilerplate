import React, {PropTypes} from 'react'
import {observer} from 'mobx-react'
import { Input, Button, Table } from 'antd';
import ajax from 'js/utils/ajax'

@observer
class userGroupList extends React.Component {
    static propTypes = {
        users: PropTypes.object
    }
    constructor(props){
        super(props)
        this.path = '/userGroup'
        this.columns = [
            {
                title: '用户组',
                dataIndex: 'name',
                key: 'name',
            }, {
                title: '操作',
                render: () => (
                    <span>
                    <a href="#">用户管理</a>
                    <span className="ant-divider" />
                    <a href="#">数据源管理</a>
                    </span>
                )
            }
        ]
  

        ajax.get({
            url: '/users'
        }).then((data) => {
            console.log(data)
        })
    }

    render(){
        const dataSource = [
            {
                key: '1',
                name: '用户组1'
            }, {
                key: '2',
                name: '用户组2'
            }
        ];

        return (
       
        <div className="main-panel">
            <h1 className="title">用户组管理页面</h1>
            <div className="ant-row">
                <div className="ant-col-4">
                    <Input placeholder="search"/>
                </div>       
                <Button className="ant-col-1" icon="search"></Button>
            </div>

            <Table className="table-bar" dataSource={dataSource} columns = {this.columns} />
        </div>
        )
    }
}

export default userGroupList
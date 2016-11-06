import React from 'react'
import {observer} from 'mobx-react'
import {Table, Switch, Select} from 'antd'

@observer
class fieldList extends React.Component {
    constructor(props){
        super(props)
        this.path = './field'
    }

    render (){
        const dataSource = [
            {
                key: '1',
                name: 'appName'
            }, {
                key: '2',
                name: 'detectType'
            }, {
                key: '3',
                name: 'whois'
            }
        ]
        const columns = [
            {
                title: '字段名',
                dataIndex: 'name'
            }, {
                title: '内容过滤',
                
            }, {
                title: '生效',
                render: () => (
                    <Switch />
                )
            }
        ]
        return (
            <div className="main-panel">
                <h1 className="title">数据源字段管理页面</h1>
                <Select style={{width: 200}}
                        showSearch
                        placeholder="搜索用户组"
                        onChange={() => {}}>
                    <Option value="jack">用户组一</Option>
                    <Option value="lucy">用户组二</Option>
                    <Option value="tom">用户组三</Option>
                    
                </Select>
                <Select style={{width: 200}}
                        showSearch
                        placeholder="搜索数据源"
                        onChange={() => {}}>
                    <Option value="jack">englog</Option>
                    <Option value="lucy">whios</Option>       
                </Select>
                <Table columns= {columns} dataSource = {dataSource}/>
            </div>
            
        )
    }
} 
export default fieldList
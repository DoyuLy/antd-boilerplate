import React from 'react'
import {observer} from 'mobx-react'
import {Table, Select} from 'antd'
@observer
class sourceList extends React.Component {
    constructor(props){
        super(props)
        this.path = './source'

    }
    render(){
        const rowSelection = {
            
        }
        const dataSource = [
            {
                key: '1',
                name: 'englog'
            }, {
                key: '2',
                name: 'Whios'
            }
        ]
        const columns = [
            {
                title: '数据源',
                dataIndex: 'name',
            }, {
                title: '状态',
                render: () => (
                    <span>
                    <a href="#">Public</a>
                    <span className="ant-divider" />
                    <a href="#">Protected</a>
                    <span className="ant-divider" />
                    <a href="#">private</a>
                    </span>
                )
            }, {
                title: '字段管理',
                render: () => (
                    <span>
                        <a href="#">编辑</a>
                    </span>
                )
            }
        ]
        return (
            <div className="main-panel">
                <h1 className="title">数据源管理页面</h1>
                <Select     showSearch
                            style={{ width: 200 }}
                            placeholder="搜索一下"
                            optionFilterProp="children"
                            onChange={() => {}}
                            notFoundContent="未找到">  
                        <Option value="jack">Jack</Option>
                        <Option value="lucy">Lucy</Option>
                        <Option value="tom">Tom</Option>
                </Select>
                <span>设置选中数据源为</span>
                <Select size="large" defaultValue="lucy" style={{ width: 200 }} onChange={() => {}}>
                        <Option value="jack">Jack</Option>
                        <Option value="lucy">Lucy</Option>
                        <Option value="tom">Tom</Option>
                </Select>
                <Table className="table-bar" rowSelection={rowSelection} dataSource={dataSource} columns = {columns} />
            </div>
        )
    }
}

export default sourceList
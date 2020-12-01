import React from 'react';
import {Table, Drawer, Button, Radio, Space} from 'antd';


function isEquivalent(a, b) {
    let aProps = Object.getOwnPropertyNames(a);
    let bProps = Object.getOwnPropertyNames(b);
    if (aProps.length !== bProps.length) {
        return false;
    }
    for (let i = 0; i < aProps.length; i++) {
        let propName = aProps[i];
        if (a[propName] !== b[propName]) {
            return false;
        }
    }
    return true;
}


class ListTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            current: this.props.searchInfo.pageNum,
            pageSize: this.props.searchInfo.pageSize,
            visible: false,
            placement: 'bottom',
            placementInfo: {}
        };
    }

    componentDidMount() {
        this.props.dispatch({
            type: 'record/fetchRecords',
            body: this.props.searchInfo
        });
    }

    componentWillReceiveProps(nextProps) {
        console.log('debug next ReceiveProps: ', nextProps.searchInfo);
        if (!isEquivalent(nextProps.searchInfo, this.props.searchInfo)) {
            let searchInfo = nextProps.searchInfo;
            if (nextProps.searchInfo.requests_path !== this.props.searchInfo.requests_path) {
                searchInfo.pageNum = 1;
                searchInfo.pageSize = 10;
                this.props.changeTableState(1, 10);
                this.setState({
                    current: 1,
                    pageSize: 10
                });
            }
            console.log('debug componentWillReceiveProps: ', searchInfo)
            this.props.dispatch({
                type: 'record/fetchRecords',
                body: searchInfo
            });
        }
    }

    onChangeCondition = (pagination, filters, sorter) => {
        this.props.changeTableState(pagination.current, pagination.pageSize);
        this.setState({
            current: pagination.current,
            pageSize: pagination.pageSize
        });
    };

    showDrawer = (info) => {
        this.setState({
            visible: true,
            placementInfo: info
        });
    };

    onClose = () => {
        this.setState({
            visible: false,
        });
    };

    render() {
    	const columns = [
            {
                title: '请求URL',
                dataIndex: 'requests_path',
                key: 'requests_path',
            },
            {
                title: '请求方式',
                dataIndex: 'method',
                key: 'method',
            },
            {
                title: '来源IP',
                dataIndex: 'source_ip',
                key: 'source_ip',
            },
            {
                title: '时间',
                dataIndex: 'datetime',
                key: 'datetime',
            },
            {
                title: '操作',
                dataIndex: 'operator',
                key: 'operator',
            }
        ];
        let recordList = this.props.record.recordList;
        let dataSource = [];
        for (let i = 0; i < recordList.length; i++) {
            let dataItem = recordList[i];
            dataItem.key = recordList[i]._id;
            dataItem.operator = <a onClick={() => {this.showDrawer(recordList[i])}}>详情</a>;
            dataSource.push(dataItem);
        }

        return (
            <div>
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    onChange={this.onChangeCondition}
                    pagination={
                        {
                            showSizeChanger: true,
                            pageSizeOptions: [10, 20, 40, 100],
                            defaultCurrent: 1,
                            total: this.props.record.recordListTotal,
                            current: this.state.current,
                            pageSize: this.state.pageSize
                        }
                    }
                />
                <Drawer
                    title="请求详情"
                    placement={this.state.placement}
                    closable={false}
                    height={512}
                    onClose={this.onClose}
                    visible={this.state.visible}
                    key={this.state.placement}
                >
                    <p>请求ID: {this.state.placementInfo.request_id}</p>
                    <br />
                    <p>请求信息：</p>
                    <p>请求时间：{this.state.placementInfo.datetime}</p>
                    <p>请求URL：{this.state.placementInfo.requests_path}</p>
                    <p>请求方式：{this.state.placementInfo.method}</p>
                    <p>来源IP：{this.state.placementInfo.source_ip}</p>
                    <p>请求头部：{this.state.placementInfo.headers}</p>
                    <p>url参数：{this.state.placementInfo.param_data}</p>
                    <p>form参数：{this.state.placementInfo.form_data}</p>
                    <p>json参数：{this.state.placementInfo.json_data}</p>
                    <p>来源IP：{this.state.placementInfo.source_ip}</p>
                    <br />
                    <p>响应信息：</p>
                    <p>响应码：{this.state.placementInfo.response_code}</p>
                    <p>响应格式：{this.state.placementInfo.response_format}</p>
                    <p>响应数据：{JSON.stringify(this.state.placementInfo.response_data)}</p>
                    <p>异常注入：{JSON.stringify(this.state.placementInfo.chaos_list)}</p>
                </Drawer>
            </div>
        );
    }
}

export default ListTable;

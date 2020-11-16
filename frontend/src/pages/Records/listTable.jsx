import React from 'react';
import {Table} from 'antd';


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
            pageSize: this.props.searchInfo.pageSize
        };
    }

    componentDidMount() {
        this.props.dispatch({
            type: 'record/fetchRecords',
            body: this.props.searchInfo
        });
    }

    componentWillReceiveProps(nextProps) {
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
            }
        ];
        let recordList = this.props.record.recordList;
        let dataSource = [];
        for (let i = 0; i < recordList.length; i++) {
            let dataItem = recordList[i];
            dataItem.key = recordList[i]._id;
            dataSource.push(dataItem);
        }

        return (
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
        );
    }
}

export default ListTable;

import React from 'react';
import {Table} from 'antd';
import ReactJson from 'react-json-view'


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
            type: 'rule/fetchRules',
            body: this.props.searchInfo
        });
    }

    componentWillReceiveProps(nextProps) {
        if (!isEquivalent(nextProps.searchInfo, this.props.searchInfo)) {
            let searchInfo = nextProps.searchInfo;
            this.props.dispatch({
                type: 'rule/fetchRules',
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
                dataIndex: 'url',
                key: 'url',
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
                title: '配置',
                dataIndex: 'config',
                key: 'configconfig',
            },
        ];
        console.log("ruleList: ", this.props.rule.ruleList)
        let ruleList = this.props.rule.ruleList;
        let dataSource = [];
        for (let i = 0; i < ruleList.length; i++) {
            let dataItem = ruleList[i];
            dataItem.key = ruleList[i]._id;
            dataItem.config = <ReactJson src={ruleList[i].config} />
            dataSource.push(dataItem);
        }

        return (
            <Table
            	columns={columns}
                dataSource={dataSource}
                pagination={
                    {
                        showSizeChanger: true,
                        pageSizeOptions: [10, 20, 40, 100],
                        defaultCurrent: 1,
                        total: this.props.rule.ruleTotal,
                        current: this.state.current,
                        pageSize: this.state.pageSize
                    }
                }
            />
        );
    }
}

export default ListTable;

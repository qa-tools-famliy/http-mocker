import React from 'react';
import {Table, Modal, Button} from 'antd';
import UpdateButton from './UpdateButton';
import CopyButton from './CopyButton';
const confirm = Modal.confirm;


function showDeleteConfirm(dispatch, dataItem, searchInfo) {
    confirm({
        title: '确认删除该MOCK规则吗？',
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        onOk() {
            let data = {
                url: dataItem.url,
            };

            if (dataItem.method !== "*") {
                data["method"] = dataItem.method
            }

            if (dataItem.source_ip !== "*") {
                data["source_ip"] = dataItem.source_ip
            }

            dispatch({
                type: 'rule/removeRule',
                body: {
                    inputData: data,
                    searchInfo: searchInfo,
                }
            });
        },
        onCancel() {
            console.log('Cancel');
        }
    });
}


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
                title: '响应配置',
                dataIndex: 'response_options',
                key: 'response_options',
            },
            {
                title: '异常注入',
                dataIndex: 'chaos_rules',
                key: 'chaos_rules',
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
            },
        ];
        console.log("ruleList: ", this.props.rule.ruleList)
        let ruleList = this.props.rule.ruleList;
        let dataSource = [];
        for (let i = 0; i < ruleList.length; i++) {
            let dataItem = ruleList[i];
            dataItem.key = ruleList[i]._id;
            dataItem.response_options = JSON.stringify(ruleList[i].response_options);
            dataItem.chaos_rules = JSON.stringify(ruleList[i].chaos_rules);
            dataItem.operation = <span>
                <UpdateButton 
                    searchInfo={this.props.searchInfo}
                    changeTableState={this.props.changeTableState}
                    dispatch={this.props.dispatch}
                    rule={this.props.rule}
                    defaultValue={dataItem}
                />
                <CopyButton
                    searchInfo={this.props.searchInfo}
                    changeTableState={this.props.changeTableState}
                    dispatch={this.props.dispatch}
                    rule={this.props.rule}
                    defaultValue={dataItem}
                />
                <Button type="link" onClick={showDeleteConfirm.bind(this, this.props.dispatch, ruleList[i], this.props.searchInfo)}>删除</Button>
            </span>
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

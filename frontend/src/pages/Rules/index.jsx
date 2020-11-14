import React, {Component} from 'react';
import { connect } from 'dva';
import { Table } from 'antd';


@connect(({rule}) => ({
    rule
}))

export default class Rules extends Component {

    componentDidMount() {
        console.log("123")
        this.props.dispatch({
            type: 'rule/fetchRules',
            body: {
                "host_ip": "192.168.1.1"
            }
        });
    }

    render() {
        console.log("this.props: ", this.props);
        const dataSource = this.props.rule.ruleList;
          
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
          ];

        return (
            <Table dataSource={dataSource} columns={columns} />
        );
    }
};

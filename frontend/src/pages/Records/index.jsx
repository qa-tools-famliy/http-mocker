import React, {Component} from 'react';
import { connect } from 'dva';
import SearchForm from './searchForm';
import ListTable from './listTable';


@connect(({record}) => ({
    record
}))

export default class records extends Component {

    constructor(props) {
        super(props);
        // 设置state
        this.state ={
            page_num: 1,
            page_size: 10,
            requests_path: '',
            method: '',
            source_ip: ''
        }
    }

    componentDidMount() {
        this.props.dispatch({
            type: 'record/fetchRecords',
            body: this.state
        });
    }

    changeSearchState(requests_path, method, source_ip) {
        this.setState({
            requests_path: requests_path,
            method: method,
            source_ip: source_ip
        })
    }

    changeTableState(page_num, page_size){
        this.setState({
            page_num: page_num,
            page_size: page_size
        })
    }

    render() {
        return (
            <div>
                <SearchForm
                    changeSearchState={this.changeSearchState.bind(this)}
                    searchInfo={{
                        "requests_path": this.state.requests_path,
                        "method": this.state.method,
                        "source_ip": this.state.source_ip,
                        "pageNum": this.state.page_num,
                        "pageSize": this.state.page_size
                    }}
                    dispatch={this.props.dispatch}
                    record={this.props.record}
                />
                <ListTable 
                    searchInfo={{
                        "requests_path": this.state.requests_path,
                        "method": this.state.method,
                        "source_ip": this.state.source_ip,
                        "pageNum": this.state.page_num,
                        "pageSize": this.state.page_size
                    }}
                    changeTableState={this.changeTableState.bind(this)}
                    dispatch={this.props.dispatch}
                    record={this.props.record}
                />
            </div>
            
        );
    }
};

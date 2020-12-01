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
            source_ip: '',
            latest_time_range: 60 * 60 * 6
        }
    }

    componentDidMount() {
        console.log('this.state: ', this.state);
        this.props.dispatch({
            type: 'record/fetchRecords',
            body: this.state
        });
    }

    changeSearchState(requests_path, method, source_ip, latest_time_range) {
        this.setState({
            requests_path: requests_path,
            method: method,
            source_ip: source_ip,
            latest_time_range: latest_time_range
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
                    searchInfo={this.state}
                    dispatch={this.props.dispatch}
                    record={this.props.record}
                />
                <ListTable 
                    searchInfo={this.state}
                    changeTableState={this.changeTableState.bind(this)}
                    dispatch={this.props.dispatch}
                    record={this.props.record}
                />
            </div>
            
        );
    }
};

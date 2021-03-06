import React, {Component} from 'react';
import { connect } from 'dva';
import SearchForm from './SearchForm';
import ListTable from './listTable';


@connect(({rule}) => ({
    rule
}))

export default class Rules extends Component {

    constructor(props) {
        super(props);
        // 设置state
        this.state ={
            page_num: 1,
            page_size: 10,
            url: "",
            method: "",
            source_ip: ""
        }
    }

    changeSearchInfo(url, method, source_ip) {
        this.setState({
            url: url,
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
        console.log("this.props: ", this.props);

        return (
            <div>
                <SearchForm
                    searchInfo={{
                        "pageNum": this.state.page_num,
                        "pageSize": this.state.page_size,
                        "url": this.state.url,
                        "method": this.state.method,
                        "source_ip": this.state.source_ip
                    }}
                    changeTableState={this.changeTableState.bind(this)}
                    changeSearchInfo={this.changeSearchInfo.bind(this)}
                    dispatch={this.props.dispatch}
                    rule={this.props.rule}
                    dataset={this.props.dataset}
                />
                <br />
                <ListTable 
                    searchInfo={{
                        "pageNum": this.state.page_num,
                        "pageSize": this.state.page_size,
                        "url": this.state.url,
                        "method": this.state.method,
                        "source_ip": this.state.source_ip
                    }}
                    changeTableState={this.changeTableState.bind(this)}
                    dispatch={this.props.dispatch}
                    rule={this.props.rule}
                />
            </div>
        );
    }
};

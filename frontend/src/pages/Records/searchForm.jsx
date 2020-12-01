import React from 'react';
import {Button, Form, Row, Col, Input, Select} from 'antd';

const Option = Select.Option;
const FormItem = Form.Item;


const SearchForm = ({ changeSearchState }) => {
    const [form] = Form.useForm();

    const onFinish = (values) => {
        console.log('debug: changeSearchState, ', values);
        changeSearchState(values.requests_path, values.method, values.source_ip, values.latest_time_range);
    };

    const handleReset = () => {
        form.resetFields();
    };

    const getFields = () => {
        const children = [];
        children.push(
            <Col span={6} key={1} style={{display: 'block'}}>
                <FormItem labelCol={{span: 5}} wrapperCol={{span: 19}} label="URL" name="requests_path">
                    <Input />
                </FormItem>
            </Col>
        );
        children.push(
            <Col span={6} key={2} style={{display: 'block'}}>
                <FormItem labelCol={{span: 10}} wrapperCol={{span: 19}} label="请求方式" name="method">
                    <Select>
                        <Option value="GET">GET</Option>
                        <Option value="POST">POST</Option>
                        <Option value="PUT">PUT</Option>
                        <Option value="DELETE">DELETE</Option>
                    </Select>
                </FormItem>
            </Col>
        );
        children.push(
            <Col span={6} key={3} style={{display: 'block'}}>
                <FormItem labelCol={{span: 5}} wrapperCol={{span: 19}} label="来源IP" name="source_ip">
                    <Input />
                </FormItem>
            </Col>
        );
        children.push(
            <Col span={6} key={3} style={{display: 'block'}}>
                <FormItem labelCol={{span: 9}} wrapperCol={{span: 15}} label="时间间隔(s)" name="latest_time_range">
                    <Input />
                </FormItem>
            </Col>
        );
        children.push(
            <Col span={8} key={4} style={{display: 'block'}}>
                <Button type="primary" htmlType="submit">Search</Button>
                <Button style={{margin: 8}} onClick={handleReset}>
                    Clear
                </Button>
            </Col>
        );
        return children;
    }

    return (
        <Form
            className="ant-advanced-search-form"
            form={form}
            onFinish={onFinish}
        >
            <Row gutter={40}>{getFields()}</Row>
        </Form>
    );
}

class SearchFormComponent extends React.Component {
    render() {
        return <SearchForm
            changeSearchState={this.props.changeSearchState}
            searchInfo={this.props.searchInfo}
            dispatch={this.props.dispatch}
        />
    }
}

export default SearchFormComponent;

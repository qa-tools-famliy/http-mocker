import React from 'react';
import {Button, Form, Row, Col, Input} from 'antd';


const FormItem = Form.Item;


class SearchForm extends React.Component {

    formRef = React.createRef();

    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            this.props.changeSearchState(values.requests_path, values.method, values.source_ip);
        });
    };

    handleReset = () => {
        this.formRef.current.setFieldsValue({
            requests_path: '',
            method: '',
            source_ip: ''
        });
    };

    getFields() {
        const children = [];
        children.push(
            <Col span={5} key={1} style={{display: 'block'}}>
                <FormItem labelCol={{span: 5}} wrapperCol={{span: 19}} label="URL" name="requests_path">
                    <Input />
                </FormItem>
            </Col>
        );
        children.push(
            <Col span={5} key={2} style={{display: 'block'}}>
                <FormItem labelCol={{span: 5}} wrapperCol={{span: 19}} label="请求方法" name="method">
                    <Input />
                </FormItem>
            </Col>
        );
        children.push(
            <Col span={5} key={3} style={{display: 'block'}}>
                <FormItem labelCol={{span: 5}} wrapperCol={{span: 19}} label="来源IP" name="source_ip">
                    <Input />
                </FormItem>
            </Col>
        );
        children.push(
            <Col span={8} key={4} style={{display: 'block'}}>
                <Button type="primary" htmlType="submit">Search</Button>
                <Button style={{margin: 8}} onClick={this.handleReset}>
                    Clear
                </Button>
            </Col>
        );
        return children;
    }

    render() {
        return (
            <Form
                className="ant-advanced-search-form"
                onSubmit={this.handleSearch}
            >
                <Row gutter={40}>{this.getFields()}</Row>
            </Form>
        );
    }
}

export default SearchForm;

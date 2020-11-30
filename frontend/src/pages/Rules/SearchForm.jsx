import React, { useState } from 'react';
import { Button, Modal, Form, Input, Select, Row, Col } from 'antd';
const Option = Select.Option;
const TextArea = Input.TextArea;
const FormItem = Form.Item;


const SearchForm = ({ changeSearchInfo }) => {
    const [form] = Form.useForm();

    const onFinish = (values) => {
        console.log('debug: changeSearchState, ', values);
        changeSearchInfo(values.url, values.method, values.source_ip);
    };

    const handleReset = () => {
        form.resetFields();
    };

    const getFields = () => {
        const children = [];
        children.push(
            <Col span={5} key={1} style={{display: 'block'}}>
                <FormItem labelCol={{span: 5}} wrapperCol={{span: 19}} label="URL" name="url">
                    <Input />
                </FormItem>
            </Col>
        );
        children.push(
            <Col span={5} key={2} style={{display: 'block'}}>
                <FormItem labelCol={{span: 5}} wrapperCol={{span: 19}} label="请求方式" name="method">
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
            <Col span={5} key={3} style={{display: 'block'}}>
                <FormItem labelCol={{span: 5}} wrapperCol={{span: 19}} label="来源IP" name="source_ip">
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

const CollectionCreateForm = ({ visible, onCreate, onCancel }) => {
    const [form] = Form.useForm();

    const checkJson = (rule, value, callback) => {
        try {
            if (value === "") {
                callback();
            }
            else if (value === undefined) {
                callback();
            }
            else {
                JSON.parse(value);
                callback();
            }
        } catch (e) {
            callback('输入需要满足JSON格式');
        }
    };

    return (
        <Modal
        visible={visible}
        title="创建Mock规则"
        okText="创建"
        cancelText="取消"
        onCancel={onCancel}
        onOk={() => {
            form
            .validateFields()
            .then((values) => {
                form.resetFields();
                onCreate(values);
            })
        }}
        >
        <Form
            form={form}
            layout="vertical"
            name="创建Mock规则"
            initialValues={{
                response_options: "[]",
                chaos_rules: "[]"
            }}
        >
            <Form.Item
                label="请求URL"
                name="url"
                rules={[{required: true}]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="请求方式"
                name="method"
            >
                <Select>
                    <Option value="GET">GET</Option>
                    <Option value="POST">POST</Option>
                    <Option value="PUT">PUT</Option>
                    <Option value="DELETE">DELETE</Option>
                </Select>
            </Form.Item>
            <Form.Item
                label="来源IP"
                name="source_ip"
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="响应配置"
                name="response_options"
                rules={[{
                    validator: checkJson
                },{required: true}]}
            >
                <TextArea />
            </Form.Item>
            <Form.Item
                label="异常注入"
                name="chaos_rules"
                rules={[{
                    validator: checkJson,
                }]}
            >
                <TextArea />
            </Form.Item>
        </Form>
        </Modal>
    );
};

const AddRuleButton = (props) => {
    const [visible, setVisible] = useState(false);

    const onCreate = (values) => {
        console.log('Received values of form: ', values);
        props.dispatch({
            type: 'rule/newRule',
            body: {
                inputData: values,
                searchInfo: props.searchInfo
            }
        });
        console.log("dispatch")
        setVisible(false);
    };

    return (
        <div>
            <SearchForm 
                changeSearchInfo={props.changeSearchInfo}
            />
            <Button
                type="primary"
                onClick={() => {
                    setVisible(true);
                }}
            >
                创建Mock规则
            </Button>
            <CollectionCreateForm
                visible={visible}
                onCreate={onCreate}
                onCancel={() => {
                    setVisible(false);
                }}
            />
        </div>
    );
};

export default AddRuleButton;

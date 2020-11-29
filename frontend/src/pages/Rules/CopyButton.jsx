import React, { useState } from 'react';
import { Button, Modal, Form, Input, Select } from 'antd';
const Option = Select.Option;
const TextArea = Input.TextArea;


const CollectionCreateForm = ({ visible, defaultValue, onCreate, onCancel }) => {
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
        title="新建Mock规则"
        okText="修改"
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
            name="新建Mock规则"
            initialValues={defaultValue}
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
                <Select >
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

const CopyRuleButton = (props) => {
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
        <Button
            type="link"
            onClick={() => {
                setVisible(true);
            }}
        >
            拷贝
        </Button>
        <CollectionCreateForm
            visible={visible}
            defaultValue={props.defaultValue}
            onCreate={onCreate}
            onCancel={() => {
                setVisible(false);
            }}
        />
        </div>
    );
};

export default CopyRuleButton;

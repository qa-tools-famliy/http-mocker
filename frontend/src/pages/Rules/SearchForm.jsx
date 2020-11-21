import React from 'react';
import {Button, Form, Modal, Input, Select} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;


class NewRuleForm extends React.Component {
    formRef = React.createRef();

    onFinish = () => {
        let searchInfo = this.props.searchInfo;
        this.props.dispatch({
            type: 'rule/newRule',
            body: {
                inputData: this.formRef.current.getFieldValue(),
                searchInfo: searchInfo
            }
        });
        this.formRef.current.resetFields();
        this.props.updateVisible(false);
    }

    onCancel = () => {
        this.props.updateVisible(false);
    }

    render() {
        const {visible} = this.props;

        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 19}
        };

        return (
            <Modal
                visible={visible}
                title="创建Mock规则"
                okText="创建"
                onCancel={this.onCancel}
                onOk={this.onFinish}
            >
                <Form ref={this.formRef}>
                    <FormItem
                        {...formItemLayout}
                        label="请求URL"
                        name="url"
                        rules={[{required: true}]}
                    >
                        <Input />
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="请求方式"
                        name="method"
                        rules={[{required: true}]}
                    >
                        <Select>
                            <Option value="GET">GET</Option>
                            <Option value="POST">POST</Option>
                            <Option value="PUT">PUT</Option>
                            <Option value="DELETE">DELETE</Option>
                        </Select>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="来源IP"
                        name="source_ip"
                        rules={[{required: true}]}
                    >
                        <Input />
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="响应配置"
                        name="response_options"
                        rules={[{required: true}]}
                    >
                        <TextArea />
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="异常注入"
                        name="chaos_rules"
                        rules={[{required: true}]}
                    >
                        <TextArea />
                    </FormItem>
                </Form>
            </Modal>
        );
    }
};


class AddRuleButton extends React.Component {

    state = {
        visible: false
    };
    showModal = () => {
        this.setState({visible: true});
    };
    updateVisible = (visible) => {
        this.setState({
            visible: visible
        })
    };
 
    render() {

        return (
            <div>
                <Button
                    type="primary"
                    style={{marginBottom: 15}}
                    onClick={this.showModal}
                >
                    创建Mock规则
                </Button>
                <NewRuleForm
                    wrappedComponentRef={this.saveFormRef}
                    visible={this.state.visible}
                    rule={this.props.rule}
                    dispatch={this.props.dispatch}
                    updateVisible={this.updateVisible}
                    searchInfo={this.props.searchInfo}
                />
            </div>
        );
    }
}

export default AddRuleButton;

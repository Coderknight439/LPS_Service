import { Form, Input, Button } from 'antd';
import {Redirect} from 'react-router-dom';
import axios from 'axios';


const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not a valid email!'
  }
};

export const EmployeeAddForm = () => {
  const url = '/api/employees/';
  const [form] = Form.useForm();
  const onFinish = (values) => {
          axios({
          url: url,
          method: 'post',
          type: 'json',
          data: values['Employee'],
        }).then(data => {
        }).catch(err => {
                console.log(err);
                console.log(err.response);
            });
      alert("Employee Created Successfully");
      form.resetFields();
  };

  return (
      <>
    <div>
        <h3>Employee Add</h3>
    </div>
  <div className={'add-form-container'}>
    <Form size='medium' name="employee-add" onFinish={onFinish} validateMessages={validateMessages} form={form}>
      <Form.Item
        name={['Employee', 'full_name']}
        label="Name"
        rules={[
          {
            required: true,
          },
        ]}
        labelAlign="left"
      >
        <Input style={{ width: 150 }}/>
      </Form.Item>
      <Form.Item
        name={['Employee', 'email']}
        label="Email"
        rules={[
          {
            type: 'email',
            required: true
          },
        ]}
        labelAlign="left"
      >
        <Input style={{ width: 150 }}/>
      </Form.Item>
      <Form.Item
        name={['Employee', 'designation']}
        label="Designation"
        labelAlign="left"
      >
        <Input style={{ width: 150 }}/>
      </Form.Item>
      <Form.Item name={['Employee', 'password']} label="Password" rules={[{ required: true, message: 'Please input password for automating user creation!' }]}>
       <Input.Password style={{ width: 150 }} />
      </Form.Item>
      <Form.Item labelAlign="left">
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  </div>
  </>
  );
};

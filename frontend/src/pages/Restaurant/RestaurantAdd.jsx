import { Form, Input, Button } from 'antd';
import axios from 'axios';


const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not a valid email!'
  }
};

export const RestaurantAddForm = () => {
  const url = '/api/restaurants/';
  const [form] = Form.useForm();
  const onFinish = (values) => {
          axios({
          url: url,
          method: 'post',
          type: 'json',
          data: values['Restaurant'],
        }).then(data => {
        }).catch(err => {
                console.log(err);
                console.log(err.response);
            });
      alert("Restaurant Created Successfully");
      form.resetFields();
  };

  return (
      <>
    <div>
        <h3>Restaurant Add</h3>
    </div>
  <div className={'add-form-container'}>
    <Form size='medium' name="restaurant-add" onFinish={onFinish} validateMessages={validateMessages} form={form}>
      <Form.Item
        name={['Restaurant', 'name']}
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
        name={['Restaurant', 'email']}
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
        name={['Restaurant', 'location']}
        label="Location"
        labelAlign="left"
      >
        <Input style={{ width: 150 }}/>
      </Form.Item>
      <Form.Item name={['Restaurant', 'password']} label="Password" rules={[{ required: true, message: 'Please input password for automating user creation!' }]}>
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

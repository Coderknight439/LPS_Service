import { Form, Input, Button } from 'antd';
import axios from 'axios';
import {updateCurrentUserData} from "../../actions/authentication";
import { useDispatch } from "react-redux";

const validateMessages = {
  required: '${label} is required!',
};

export const UploadMenuForm = ({props}) => {
  const url = '/api/restaurants_menu/';
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const onFinish = (values) => {
      values["RestaurantMenu"].restaurant_id = props?.auth?.user?.data?.party_id;
          axios({
          url: url,
          method: 'post',
          type: 'json',
          data: values['RestaurantMenu'],
        }).then(data => {
            dispatch(updateCurrentUserData({uploaded:values['RestaurantMenu']['menu']}));
        }).catch(err => {
                console.log(err);
                console.log(err?.response);
            });
  };
if(!props.auth.user.data.uploaded){
  return (
      <>
    <div>
        <h3>upload Menu</h3>
    </div>
  <div className={'add-form-container'}>
    <Form size='medium' name="restaurant-add" onFinish={onFinish} validateMessages={validateMessages} form={form}>
      <Form.Item
        name={['RestaurantMenu', 'menu']}
        label="Menu"
        rules={[
          {
            required: true,
          },
        ]}
        labelAlign="left"
      >
        <Input.TextArea style={{ width: 150 }}/>
      </Form.Item>
      <Form.Item labelAlign="left">
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  </div>
  </>
  )
}
else{
    if(props.auth.user.data.current_winner){
       return( <div>
                <h3>Current Winner is: {props.auth.user.data.current_winner}</h3>
        </div>
       )
    }
    else {
        return (
            <div>
                <h3>Already Uploaded Menu for Today. Uploaded Menu is: {props.auth.user.data.uploaded}</h3>
            </div>
        )
    }
}
};

import { NodeCollapseOutlined, PaperClipOutlined, SettingOutlined, UserSwitchOutlined } from '@ant-design/icons';
import { Menu, Popconfirm } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import classes from './siderMenu.module.css';

const { SubMenu } = Menu;

// submenu keys of first level
const rootSubmenuKeys = ['sub1', 'sub2', 'sub4', 'sub5'];
const AdminMenu = [
    <SubMenu key="sub1" icon={<UserSwitchOutlined />} title="Employees">
    <Menu.Item key="1">
        <Link to='/employees'>Employee List</Link>
    </Menu.Item>
        <Menu.Item key="2">
            <Link to='/employees/add'>Employee Add</Link>
        </Menu.Item>
    </SubMenu>,
    <SubMenu key="sub2" icon={<PaperClipOutlined />} title="Restaurants">
        <Menu.Item key="6">
            <Link to='/restaurants'>Restaurant List</Link>
        </Menu.Item>
        <Menu.Item key="5">
            <Link to='/restaurants/add'>Add Restaurant</Link>
        </Menu.Item>
    </SubMenu>,
    <Menu.Item key="3">
        <Link to='/vote'>Vote For Today</Link>
    </Menu.Item>,

];


const EmployeeMenu = [
    <Menu.Item key="1">
        <Link to='/vote'>Vote For Today</Link>
    </Menu.Item>,
    <Menu.Item key="5">
         <Link to='/winner'>Today's Winner</Link>
    </Menu.Item>
];


const RestaurantMenu = [
    <Menu.Item key="2">
        <Link to='/restaurants/upload_menu'>Upload Menu</Link>
    </Menu.Item>,
    <Menu.Item key="5">
         <Link to='/winner'>Today's Winner</Link>
    </Menu.Item>

];

function buildMenu(props) {
      if(props.auth?.user?.data?.user_type == 0){
          return AdminMenu;
      }
      else if(props.auth?.user?.data?.user_type == 1){
          return EmployeeMenu;
      }
      else{
          return RestaurantMenu;
      }
}
export const SiderMenu = ({props}) => {
  const [openKeys, setOpenKeys] = React.useState(['sub1']);

  const onOpenChange = keys => {
    const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  const submenuStyle = {
    color: 'white',
    background: '#00111e'
  };

  const menus = buildMenu(props);

  return (
    <Menu mode="inline" openKeys={openKeys} onOpenChange={onOpenChange} className={classes.menu}>
        {menus}
    </Menu>
  );
};
import { BellOutlined, MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Divider, Dropdown, Layout, Menu, Row } from 'antd';
// import "antd/dist/antd.min.css";
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, withRouter } from 'react-router-dom';
import { logoutUser } from '../../actions/authentication';
import Clock from '../../components/Clock/Clock';
import { SiderMenu } from '../../components/SiderMenu/siderMenu';
import EmployeeListListPage from '../../pages/Employee/EmployeeList';
import RestaurantListPage from '../../pages/Restaurant/RestaurantList'
import classes from './Layout.module.css';
import {EmployeeAddForm} from "../../pages/Employee/EmployeeAdd";
import {RestaurantAddForm} from "../../pages/Restaurant/RestaurantAdd";
import {UploadMenuForm} from "../../pages/Restaurant/UploadMenu";
import Home from "../Home/Home";
import RestaurantForVoteListPage from "../../pages/Vote/RestaurantForVoteList";
import CurrentWinner from "../../pages/Vote/CurrentWinner"

const { Content, Header, Footer, Sider } = Layout;
const { Item } = Menu;


class BaseLayout extends Component {
    onLogout(e) {
        e.preventDefault();
        this.props.logoutUser(this.props.history);
    }
    state = {
        collapsed: false,
    }
    toggle = () => {
        this.setState({
          collapsed: !this.state.collapsed,
        });
      };
    componentDidMount(){
        if(!this.props.auth.isAuthenticated){
            this.props.history.push('/')
        }
    }
    render() {
        const {isAuthenticated, user} = this.props.auth;
        const menu = (
          <Menu>
            <Menu.Item key="1">
              <Button onClick={this.onLogout.bind(this)}>Logout</Button>
            </Menu.Item>
          </Menu>
        );
        return (
      
      <Layout style={{height:"100vh"}}>
      <Sider trigger={null} collapsible collapsed={this.state.collapsed} className={classes.sidebar}>
          <div className={classes.logo}>
            <h3>LPS</h3>
          </div>
          <SiderMenu props={this.props}/>
      </Sider>
      <Layout className={classes['layout-site-layout']}>
      <Header className={classes['site-header']} style={{ padding: 0 }}>
      <Row justify='space-between'>
        <Col>
      {this.state.collapsed ? <MenuUnfoldOutlined className= {classes.trigger} onClick={this.toggle}></MenuUnfoldOutlined> : <MenuFoldOutlined className= {classes.trigger} onClick={this.toggle}></MenuFoldOutlined>}
      </Col>
      <Col>
      <Row justify='space-between'>
        <Col>
          <BellOutlined style={{ color: 'white', fontSize:'20px'}}/>
          <Divider type='vertical' style={{ fontWeight:'bold', background: 'white'}} />
        </Col>
        <Col>
          <Clock />
        </Col>
        <Col>
        <Dropdown
              overlay={menu}
              trigger={["click"]}
              placement="bottomLeft"
            >
              <div onClick={e => e.preventDefault()}>
                <Avatar size="small" icon={<UserOutlined />} />
              </div>
            </Dropdown>
        </Col>
      </Row>
      </Col>
      </Row>
        </Header>
        <Content style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
            }}>
            {
                user?.data?.user_type == 0 ?
                <>
                <Route exact path="/employees" render={(props) => (
                <EmployeeListListPage {...props} auth={this.props.auth}/>
              )} />
                <Route exact path="/restaurants" render={(props) => (
                <RestaurantListPage {...props} auth={this.props.auth}/>
              )} />
                <Route exact path="/employees/add" component={EmployeeAddForm}/>
                <Route exact path="/restaurants/add" component={RestaurantAddForm}/>
                <Route exact path="/vote" render={(props)=>(<RestaurantForVoteListPage {...props} props={this.props}/>)}/>
                </> : user?.data?.user_type == 1 ?
                <>
                <Route exact path="/vote" render={(props)=>(<RestaurantForVoteListPage {...props} props={this.props}/>)}/>
                <Route exact path="/winner" component={CurrentWinner}/>
                </> :
                <>
                <Route exact path="/restaurants/upload_menu" render={(props)=>(<UploadMenuForm {...props} props={this.props}/>)}/>
                <Route exact path="/winner" component={CurrentWinner}/>
                </>
            }
            <Route exact path="/home" render={(props)=>(<Home {...props} auth={this.props.auth}/>)}/>

        </Content>
        <Footer style={{ textAlign: isAuthenticated?'left':'center' }} className={classes['site-footer']}>Developed by Mahadi Hassan ©2021</Footer>
      </Layout>
    </Layout>
        );
    }
}

BaseLayout.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth
})

export default connect(mapStateToProps, { logoutUser })(withRouter(BaseLayout));
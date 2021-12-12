import { PlusOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import BaseList from "../../containers/BaseList/BaseList";
import ListConfig from '../../containers/BaseList/DataTable/ListConfig';
import PageConfig from '../../containers/Layout/PageConfig';
import {Popconfirm, Button } from 'antd';
import React, { useContext, useState, useEffect, useRef } from 'react';
import { columnMapper } from './columnMapper';
import axios from "axios/index";
import {updateCurrentUserData} from "../../actions/authentication";

const userConfig = ListConfig();
userConfig.columnMap = columnMapper;
userConfig.dataUrl = '/api/votes/';

const pageConfig = PageConfig();
pageConfig.pageTitle = 'Today\'s Available Menu' ;
pageConfig.pageButtons = [

];
class RestaurantForVoteListPage extends BaseList {
    columns = userConfig.columnMap || [];
    constructor(props){
        super(props);
        if(this.props?.auth?.user?.data?.user_type == 1) {
            this.columns = [
                ...userConfig.columnMap,
                {
                    title: 'Action',
                    dataIndex: 'action',
                    render: (_, record) =>
                        !this.props.auth.user.data.voted ? (
                            <Popconfirm title="Sure to vote?" onConfirm={() => this.handleVote(record)}>
                                <a>Vote</a>
                            </Popconfirm>
                        ) : null
                }
            ];
            this.state = {
            ...userConfig,
            ...pageConfig,
            columnMap: this.columns
            };
        }
    else {
            this.state = {
                ...userConfig,
                ...pageConfig,
                columnMap: this.columns,
                headerButtons: [
                    <Popconfirm title="Confirm to select today's winner?"
                                onConfirm={() => this.confirmWinner()}>
                        <Button>Process Today's Winner</Button>
                    </Popconfirm>
                ]
            }
        }

}


handleVote = (record) => {
    if(!record.menu){
        alert("Can't vote Without Menu");
    }
    else {
        const post_data = {
            'restaurant_id': record.id,
            'employee_id': this.props.auth.user.data.party_id
        };
        const url = '/api/votes/';
        axios({
            url: url,
            method: 'post',
            type: 'json',
            data: post_data,
        }).then(data => {
            if (data.status == 200) {
                this.props.updateCurrentUserData({voted: record.name});
                alert("Your Vote Submitted Successfully");
            }
            else {
                alert("Your Vote Submission Failed!");
            }
        }).catch(err => {
            console.log(err);
            console.log(err?.response);
        });
    }
};
confirmWinner(){
    const url = '/api/winners/';
      axios({
      url: url,
      method: 'post',
      type: 'json',
      data: {},
    }).then(data => {
        console.log(data);
        if(data.status == 200) {
            alert("Today's Winner is "+ data.data.data);
        }
        else{
            alert("Winner Selection Failed!");
        }
    }).catch(err => {
            alert(err?.response?.data?.data);
        });
}

    render(){
        if(!this.props.auth.user.data.voted ){
            if(!this.props.auth.user.data.current_winner) {
                return super.render();
            }
            else{
                return(
                    <div>
                    <h3>Place Already Selected for Today. Restaurant is: {this.props.auth.user.data.current_winner}</h3>
                 </div>
                )
            }
        }
        else{
            return (
                <div>
                    <h3>Already Voted for Today. You Voted for: {this.props.auth.user.data.voted}</h3>
                 </div>
            )
        }
    }

}
const mapStateToProps = (state) => ({
    auth: state.auth
});
export default connect(mapStateToProps, {updateCurrentUserData})(withRouter(RestaurantForVoteListPage));

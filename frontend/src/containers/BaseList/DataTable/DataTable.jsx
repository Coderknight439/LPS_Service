import { Table } from 'antd';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Component } from 'react';

const getRandomuserParams = params => ({
    results: params.pagination.pageSize,
    page: params.pagination.current,
    ...params,
  });


class DataTable extends Component {
    state = {
        data: [],
        pagination: {
          current: 1,
          pageSize: 10,
        },
        loading: false,
      };
      componentDidMount() {
        const { pagination } = this.state;
        !this.props.data ? this.fetch({ pagination }) : this.setState({
            data: this.props.data
        });
      }
    
      handleTableChange = (pagination, filters, sorter) => {
        !this.props.data? this.fetch({
          sortField: sorter.field,
          sortOrder: sorter.order,
          pagination,
          ...filters,
        }): this.setState({
            data: this.props.data
        });
      };
    
      fetch = (params = {}) => {
        this.setState({ loading: true });
        axios({
          url: this.props.dataUrl,
          method: 'get',
          type: 'json',
          data: getRandomuserParams(params),
        }).then(data => {
          this.setState({
            loading: false,
            data: data.data.data,
            pagination: {
              ...params.pagination,
              total: data.data.length,
              // 200 is mock data, you should read it from server
              // total: data.totalCount,
            },
          });
        });
      };

      rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
          this.props.onRowSelect(selectedRowKeys, selectedRows);
        }
      };

    render() {
        const { data, pagination, loading } = this.state;
        const {multiselect} = this.props;
       return (
            <Table
                bordered
                rowKey={record => record.id}
                columns={this.props.columns}
                dataSource={this.state.data}
                pagination={pagination}
                loading={loading}
                onChange={this.handleTableChange}
                {...(multiselect ? {
                  rowSelection: {
                  type: 'checkbox',
                  ...this.rowSelection,
                    }
                  } : {})
                }
                
            />
        );
    }
}
DataTable.propTypes = {
    dataUrl: PropTypes.string.isRequired,
}

export default DataTable;
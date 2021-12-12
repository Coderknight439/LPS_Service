import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import BaseList from "../../containers/BaseList/BaseList";
import ListConfig from '../../containers/BaseList/DataTable/ListConfig';
import PageConfig from '../../containers/Layout/PageConfig';
import { columnMapper } from './columnMapper';

const userConfig = ListConfig();
userConfig.columnMap = columnMapper;
userConfig.dataUrl = '/api/restaurants/';

const pageConfig = PageConfig();
pageConfig.pageTitle = 'Restaurant List';
pageConfig.pageButtons = [
];
class RestaurantListPage extends BaseList {
state = {
    ...userConfig,
    ...pageConfig,
  };

}
const mapStateToProps = (state) => ({
    auth: state.auth
});
export default connect(mapStateToProps)(withRouter(RestaurantListPage));

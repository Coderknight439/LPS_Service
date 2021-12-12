import BasePage from '../BasePage/BasePage';
import DataTable from './DataTable/DataTable';


class BaseList extends BasePage {
    constructor(props){
        super(props);
        this.state = {
            searchFormFields: []
        }
    }
    onRowSelect(selectedRowKeys, selectedRows){
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    }
    render() {
        return (
            <>
            <div style={{display: 'flex', justifyContent:'space-between'}}>
                <div>
                <h3>{this.state.pageTitle}</h3>
                </div>
                <div>
                {this.state.headerButtons}
                </div>
             </div>
            <DataTable
                dataUrl={this.state?.dataUrl}
                columns={this.state?.columnMap}
                dataSource={this.state?.dataSource}
                multiselect={this.state?.multiselect}
                onRowSelect={this.onRowSelect.bind(this)}
            />
            </>
        );
    }
}

export default BaseList;
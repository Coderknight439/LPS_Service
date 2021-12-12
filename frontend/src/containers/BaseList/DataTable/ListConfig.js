export default function ListConfig (columns, dataUrl='', dataSource=[], multiselect=false) {
    return {
        columnMap: columns,
        multiselect: multiselect,
        dataSource: dataSource,
        dataUrl: dataUrl
    }
}

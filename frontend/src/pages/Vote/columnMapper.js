export const columnMapper = [
    {
        title: 'ID',
        dataIndex: 'id',
        sorter: true,
        width: '1%',
        hidden: true
      },
    {
        title: 'Name',
        dataIndex: 'name',
        sorter: true,
        width: '33%',
      },
      {
        title: 'Menu',
        dataIndex: 'menu',
        editable: true,
        width: '33%',
      },

      {
        title: 'Vote Count',
        dataIndex: 'vote',
        editable: true,
        width: '33%',
      }
    ].filter(item => !item.hidden);
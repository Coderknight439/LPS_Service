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
        title: 'Email',
        dataIndex: 'email',
        editable: true,
        width: '33%',
      },

      {
        title: 'Location',
        dataIndex: 'location',
        editable: true,
        width: '33%',
      }
    ].filter(item => !item.hidden);
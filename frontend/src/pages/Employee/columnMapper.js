export const columnMapper = [
    {
        title: 'ID',
        dataIndex: 'id',
        sorter: true,
        width: '1%',
        hidden: true
      },
    {
        title: 'Full Name',
        dataIndex: 'full_name',
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
        title: 'Designation',
        dataIndex: 'designation',
        editable: true,
        width: '33%',
      }
    ].filter(item => !item.hidden);
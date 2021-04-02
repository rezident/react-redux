module.exports = {
  docs: [
    {
      type: 'category',
      label: 'Введение',
      collapsed: false,
      items: [
        'introduction/getting-started',
        'introduction/why-use-react-redux'
      ]
    },
    {
      type: 'category',
      label: 'Учебники',
      collapsed: false,
      items: ['tutorials/connect']
    },
    {
      type: 'category',
      label: 'Использование React Redux',
      collapsed: false,
      items: [
        'using-react-redux/usage-with-typescript',
        'using-react-redux/connect-mapstate',
        'using-react-redux/connect-mapdispatch',
        'using-react-redux/accessing-store'
      ]
    },
    {
      type: 'category',
      label: 'Справочник по API',
      items: [
        'api/provider',
        'api/hooks',
        'api/connect',
        'api/connect-advanced',
        'api/batch'
      ]
    },
    {
      type: 'category',
      label: 'Путеводители',
      items: ['troubleshooting']
    }
  ]
}

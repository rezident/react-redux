---
id: provider
title: Provider
sidebar_label: Provider
hide_title: true
---

# `Provider`

## Обзор

Компонент `<Provider>` делает хранилище (`store`) Redux доступным для любых вложенных компонентов, которым необходим доступ к хранилищу Redux.

Поскольку любой компонент React в приложении React Redux может быть подключен к хранилищу, большинство приложений будут рендерить `<Provider>` на верхнем уровне со всем деревом компонентов приложения внутри него.

Затем API-интерфейсы [Hooks](./hooks.md) и [`connect`](./connect.md) могут получить доступ к предоставленному экземпляру хранилища через механизм контекста React.

### Props

`store` ([Хранилище Redux](https://redux.js.org/api/store))
Единое хранилище (`store`) Redux в вашем приложении.

`children` (ReactElement)
Корень вашей иерархии компонентов.

`context`
Вы можете предоставить экземпляр контекста. Если вы это сделаете, вам нужно будет предоставить один и тот же экземпляр контекста для всех подключенных компонентов. Отсутствие правильного контекста приводит к ошибке выполнения:

> Инвариантное нарушение
>
> Не удалось найти "store" в контексте "Connect(MyComponent)". Либо оберните корневой компонент в `<Provider>`, либо передайте настраиваемого поставщика контекста React в `<Provider>` и соответствующего потребителя контекста React в Connect(Todo) в параметрах подключения.



### Пример использования

В приведенном ниже примере компонент `<App />` - это наш компонент корневого уровня. Это означает, что он находится на самом верху нашей иерархии компонентов.


```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import { App } from './App'
import createStore from './createReduxStore'

const store = createStore()

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```


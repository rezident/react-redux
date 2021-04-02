---
id: getting-started
title: Начало работы
hide_title: true
sidebar_label: Начало работы
---

# Начало работы с React Redux

[React Redux](https://github.com/reduxjs/react-redux) - это официальный слой привязок [React](https://reactjs.org/) UI для [Redux](https://redux.js.org/). Он позволяет вашим компонентам React считывать данные из хранилища Redux и отправлять действия в хранилище для обновления состояния.

## Установка

React Redux 7.1+ требует **React 16.8.3 или новее**, чтобы использовать React Hooks.

### Использование Create React App

Рекомендуемый способ запуска новых приложений с React Redux - использование [официального шаблона Redux+JS](https://github.com/reduxjs/cra-template-redux) для [Create React App](https://github.com/facebook/create-react-app), который использует [Redux Toolkit](https://redux-toolkit.js.org/) .

```sh
npx create-react-app my-app --template redux
```

### Существующее приложение React

Чтобы использовать React Redux с вашим приложением React, установите его как зависимость:

```bash
# If you use npm:
npm install react-redux

# Or if you use Yarn:
yarn add react-redux
```

Вам также необходимо [установить Redux](https://redux.js.org/introduction/installation) и [настроить хранилище Redux](https://redux.js.org/recipes/configuring-your-store/) в своем приложении.

Если вы используете TypeScript, типы React Redux поддерживаются отдельно в DefinitherTyped. Вам также необходимо установить их:

```bash
npm install @types/react-redux
```

## `Provider`

React Redux включает компонент `<Provider />`, который делает хранилище Redux доступным для остальной части вашего приложения:

```js
import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'
import store from './store'

import App from './App'

const rootElement = document.getElementById('root')
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
)
```

## Хуки

React Redux предоставляет пару настраиваемых перехватчиков React, которые позволяют вашим компонентам React взаимодействовать с хранилищем Redux.

`useSelector` считывает значение из состояния хранилища и подписывается на обновления, а `useDispatch` возвращает метод хранилища `dispatch`, позволяющий отправлять действия.

```js
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  decrement,
  increment,
  incrementByAmount,
  incrementAsync,
  selectCount
} from './counterSlice'
import styles from './Counter.module.css'

export function Counter() {
  const count = useSelector(selectCount)
  const dispatch = useDispatch()

  return (
    <div>
      <div className={styles.row}>
        <button
          className={styles.button}
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          +
        </button>
        <span className={styles.value}>{count}</span>
        <button
          className={styles.button}
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          -
        </button>
      </div>
      {/* omit additional rendering output here */}
    </div>
  )
}
```

## Помощь и обсуждение

The **[#redux channel](https://discord.gg/0ZcbPKXt5bZ6au5t)** of the **[Reactiflux Discord community](http://www.reactiflux.com)** is our official resource for all questions related to learning and using Redux. Reactiflux is a great place to hang out, ask questions, and learn - come join us!

You can also ask questions on [Stack Overflow](https://stackoverflow.com) using the **[#redux tag](https://stackoverflow.com/questions/tagged/redux)**.

## Переводы документации

- [Portuguese](https://fernandobelotto.github.io/react-redux)

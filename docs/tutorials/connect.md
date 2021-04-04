---
id: connect
title: "Учебник: API Connect"
hide_title: true
sidebar_label: 
---

# Учебник: Использование API `connect`

:::tip

Теперь мы рекомендуем использовать [API хуков React-Redux по умолчанию](../api/hooks.md). Однако API `connect` по-прежнему работает нормально.

В этом руководстве также показаны некоторые старые практики, которые мы больше не рекомендуем, например разделение логики Redux на папки по типу. Мы сохранили это руководство как есть для полноты, но рекомендуем прочитать [руководство «Redux Essentials»](https://redux.js.org/tutorials/essentials/part-1-overview-concepts) и [руководство по стилю Redux](https://redux.js.org/style-guide/style-guide) в документации Redux, чтобы узнать о наших текущих лучших практиках.

:::

Чтобы увидеть, как использовать React Redux на практике, мы покажем пошаговый пример, создав приложение со списком задач.

## Пример списка задач

**Перейти к**

- 🤞 [Просто покажи мне код](https://codesandbox.io/s/9on71rvnyo)
- 👆 [Предоставление хранилища](#предоставление-магазина)
- ✌️ [Подключение компонента](#connecting-the-components)

**Компоненты пользовательского интерфейса React**

Мы реализовали наши компоненты пользовательского интерфейса React следующим образом:

- `TodoApp` - это входной компонент для нашего приложения. Он отображает заголовок, компоненты `AddTodo`, `TodoList` и `VisibilityFilters`.
- `AddTodo` - это компонент, который позволяет пользователю вводить название задачи и добавлять его в список после нажатия кнопки «Добавить задачу»:
  - Он использует управляемый ввод, который устанавливает состояние по `onChange`.
  - Когда пользователь нажимает кнопку «Добавить задачу», он отправляет (dispatch) действие (которое мы предоставим с помощью React Redux) для добавления задачи в хранилище.
- `TodoList` - это компонент, который отображает список задач:
  - Он рендерит отфильтрованный список задач, когда выбран один из `VisibilityFilters`.
- `Todo` - это компонент, который рендерит один элемент todo:
  - Он рендерит содержимое задачи и показывает, что задача завершена, вычеркивая ее.
  - Он отправляет действие для переключения статуса завершения задачи при `onClick`.
- `VisibilityFilters` рендерит простой набор фильтров: _all_, _completed_ и _incomplete._ При нажатии на каждый из них выполняется фильтрация задач:
  - Он принимает свойство `activeFilter` от родителя, которое указывает, какой фильтр в настоящее время выбран пользователем. Активный фильтр отображается с подчеркиванием.
  - Он отправляет действие `setFilter` для обновления выбранного фильтра.
- `constants` содержит данные констант для нашего приложения.
- И, наконец, `index` отображает наше приложение в DOM.

<br />

**Хранилище Redux**

Часть приложения Redux была настроена с использованием [шаблонов, рекомендованных в документации Redux](https://redux.js.org):

- Хранилище
  - `todos`: нормализованный редьюсер задач. Он содержит карту `byIds` всех задач и `allIds`, которая содержит список всех идентификаторов.
  - `visibilityFilters`: простая строка `all`, `completed` или `incomplete`.
- Создатели действий
  - `addTodo` создает действие для добавления задач. Он принимает единственную строковую переменную `content` и возвращает действие `ADD_TODO` с `payload`, содержащим самоинкрементные `id` и `content`.
  - `toggleTodo` создает действие для переключения задач. Он принимает единственную числовую переменную `id` и возвращает действие `TOGGLE_TODO` с `payload`, содержащим только `id`.
  - `setFilter` создает действие для установки активного фильтра приложения. Он принимает одну строковую переменную `filter` и возвращает действие `SET_FILTER` с `payload`, содержащей сам `filter`.
- Редьюсеры
  - Редьюсер `todos`
    - Добавляет `id` в поле `allIds` и устанавливает задачу в поле `byIds` после получения действия `ADD_TODO`.
    - Переключает поле `completed` для задачи при получении действия `TOGGLE_TODO`
  - Редьюсер `visibilityFilters` устанавливает свой срез хранилища на новый фильтр, который он получает от полезной нагрузки действия `SET_FILTER`
- Типы действий
  - Мы используем файл `actionTypes.js` для хранения констант типов действий, которые будут повторно использоваться.
- Селекторы
  - `getTodoList` возвращает список `allIds` из хранилища `todos`.
  - `getTodoById` находит задачу в хранилище по заданному `id`
  - `getTodos` немного сложнее. Он берет все идентификаторы из `allIds`, находит каждую задачу в `byIds` и возвращает окончательный массив задач.
  - `getTodosByVisibilityFilter` фильтрует задачи в соответствии с фильтром видимости

Вы можете проверить [этот CodeSandbox](https://codesandbox.io/s/6vwyqrpqk3) для получения исходного кода компонентов пользовательского интерфейса и неподключенного хранилища Redux, описанного выше.

<br />

Теперь мы покажем, как подключить это хранилище к нашему приложению с помощью React Redux.

### Предоставление магазина

Сначала нам нужно сделать `store` доступным для нашего приложения. Для этого мы обертываем наше приложение с помощью API `<Provider />`, предоставляемого React Redux.

```jsx
// index.js
import React from 'react'
import ReactDOM from 'react-dom'
import TodoApp from './TodoApp'

import { Provider } from 'react-redux'
import store from './redux/store'

const rootElement = document.getElementById('root')
ReactDOM.render(
  <Provider store={store}>
    <TodoApp />
  </Provider>,
  rootElement
)
```

Обратите внимание, как наш `<TodoApp />` теперь обернут в `<Provider />` с `store`, переданным как проп.

![](https://i.imgur.com/LV0XvwA.png)

### Подключение компонентов

React Redux предоставляет вам функцию `connect` для чтения значений из хранилища Redux (и повторного чтения значений при обновлении хранилища).

Функция `connect` принимает два аргумента, оба необязательные:

- `mapStateToProps`: вызывается каждый раз при изменении состояния хранилища. Он получает все состояние хранилища и должен возвращать объект данных, который нужен этому компоненту.

- `mapDispatchToProps`: этот параметр может быть функцией или объектом.
  - Если это функция, она будет вызываться один раз при создании компонента. Он получит `dispatch` в качестве аргумента и должен вернуть объект, полный функций, которые используют `dispatch` для отправки действий.
  - Если это объект, полный создателей действий, каждый создатель действий будет преобразован в функцию prop, которая автоматически отправляет свое действие при вызове. **Примечание**: мы рекомендуем использовать эту «сокращенную» форму.

Обычно вы вызываете `connect` следующим образом:

```js
const mapStateToProps = (state, ownProps) => ({
  // ... вычисленные данные из состояния и, возможно, ownProps
})

const mapDispatchToProps = {
  // ... обычно это объект, заполненный создателями действий
}

// `connect` возвращает новую функцию, которая принимает компонент для обертывания:
const connectToStore = connect(mapStateToProps, mapDispatchToProps)
// и эта функция возвращает связанный компонент-оболочку:
const ConnectedComponent = connectToStore(Component)

// Обычно мы делаем и то, и другое за один шаг, например:
connect(mapStateToProps, mapDispatchToProps)(Component)
```

Давайте сначала поработаем над `<AddTodo />`. Он должен инициировать изменения в `store`, чтобы добавить новые задачи. Следовательно, он должен иметь возможность «отправлять» (`dispatch`) действия в хранилище. Вот как мы это делаем.

Наш конструктор действий `addTodo` выглядит так:

```js
// redux/actions.js
import { ADD_TODO } from './actionTypes'

let nextTodoId = 0
export const addTodo = (content) => ({
  type: ADD_TODO,
  payload: {
    id: ++nextTodoId,
    content,
  },
})

// ... другие действия
```

Передавая его в `connect`, наш компонент получает его как свойство и автоматически отправляет действие при его вызове.

```js
// components/AddTodo.js

// ... другой импорт
import { connect } from 'react-redux'
import { addTodo } from '../redux/actions'

class AddTodo extends React.Component {
  // ... реализация компонента
}

export default connect(null, { addTodo })(AddTodo)
```

Обратите внимание, что `<AddTodo />` заключен в оболочку с родительским компонентом с именем `<Connect (AddTodo) />`. Между тем, `<AddTodo />` теперь получает одно свойство: действие `addTodo`.

![](https://i.imgur.com/u6aXbwl.png)

Нам также необходимо реализовать функцию `handleAddTodo`, чтобы она могла отправлять действие `addTodo` и сбрасывать ввод.

```jsx
// components/AddTodo.js

import React from 'react'
import { connect } from 'react-redux'
import { addTodo } from '../redux/actions'

class AddTodo extends React.Component {
  // ...

  handleAddTodo = () => {
    // отправляет действия для добавления задачи
    this.props.addTodo(this.state.input)

    // устанавливает состояние обратно в пустую строку
    this.setState({ input: '' })
  }

  render() {
    return (
      <div>
        <input
          onChange={(e) => this.updateInput(e.target.value)}
          value={this.state.input}
        />
        <button className="add-todo" onClick={this.handleAddTodo}>
          Add Todo
        </button>
      </div>
    )
  }
}

export default connect(null, { addTodo })(AddTodo)
```

Теперь наш `<AddTodo />` подключен к хранилищу. Когда мы добавляем задачу, мы отправлям действие по изменению хранилища. Мы не видим этого в приложении, потому что остальные компоненты еще не подключены. Если у вас подключено расширение Redux DevTools, вы должны увидеть отправляемое действие:

![](https://i.imgur.com/kHvkqhI.png)

Вы также должны увидеть, что хранилище изменилось соответствующим образом:

![](https://i.imgur.com/yx27RVC.png)

Компонент `<TodoList />` отвечает за отображение списка задач. Следовательно, ему необходимо читать данные из хранилища. Мы включаем его, вызывая `connect` с параметром `mapStateToProps` с функцией, описывающей, какая часть данных нам нужна из хранилища.

Наш компонент `<Todo />` принимает элемент задачи в качестве свойства. У нас есть эта информация из поля `byIds` списка `todos`. Однако нам также нужна информация из поля `allIds` хранилища, указывающая, какие задачи и в каком порядке должны отображаться. Наша функция `mapStateToProps` может выглядеть так:

```js
// components/TodoList.js

// ...другой импорт
import { connect } from "react-redux";

const TodoList = // ... реализация компонента пользовательского интерфейса

const mapStateToProps = state => {
  const { byIds, allIds } = state.todos || {};
  const todos =
    allIds && allIds.length
      ? allIds.map(id => (byIds ? { ...byIds[id], id } : null))
      : null;
  return { todos };
};

export default connect(mapStateToProps)(TodoList);
```

К счастью, у нас есть селектор, который делает именно это. Мы можем просто импортировать селектор и использовать его здесь.

```js
// redux/selectors.js

export const getTodosState = (store) => store.todos

export const getTodoList = (store) =>
  getTodosState(store) ? getTodosState(store).allIds : []

export const getTodoById = (store, id) =>
  getTodosState(store) ? { ...getTodosState(store).byIds[id], id } : {}

export const getTodos = (store) =>
  getTodoList(store).map((id) => getTodoById(store, id))
```

```js
// components/TodoList.js

// ...другой импорт
import { connect } from "react-redux";
import { getTodos } from "../redux/selectors";

const TodoList = // ... реализация компонента пользовательского интерфейса

export default connect(state => ({ todos: getTodos(state) }))(TodoList);
```

Мы рекомендуем инкапсулировать любые сложные поисковые запросы или вычисления данных в функциях выбора. Кроме того, вы можете дополнительно оптимизировать производительность, используя [Reselect](https://github.com/reduxjs/reselect) для написания «мемоизированных» селекторов, которые могут пропускать ненужную работу. (См. [Страницу документации Redux по вычислению производных данных](https://redux.js.org/recipes/computing-derived-data#sharing-selectors-across-multiple-components) и сообщение в блоге [Idiomatic Redux: Использование повторного выбора селекторов для инкапсуляции и производительности](https://blog.isquaredsoftware.com/2017/12/idiomatic-redux-using-reselect-selectors/) для получения дополнительной информации о том, почему и как использовать функции селектора.)

Теперь наш `<TodoList />` подключен к хранилищу. Он должен получить список задач, сопоставить их и передать каждую задачу компоненту `<Todo />`. `<Todo />`, в свою очередь, отобразит их на экране. Теперь попробуйте добавить задачу. Он должен появиться в нашем списке задач!

![](https://i.imgur.com/N68xvrG.png)

Будем подключать больше компонентов. Прежде чем мы это сделаем, давайте сделаем паузу и сначала узнаем немного больше о `connect`.

### Распространенные способы вызова `connect`

В зависимости от того, с какими компонентами вы работаете, существуют разные способы вызова `connect`, наиболее распространенные из которых приведены ниже:

|                                 | Не подписываясь на хранилище                   | Подписываясь на хранилище                                 |
| ------------------------------- | ---------------------------------------------- | --------------------------------------------------------- |
| Не вставляя создетелей действий | `connect()(Component)`                         | `connect(mapStateToProps)(Component)`                     |
| Вставляя создетелей действий    | `connect(null, mapDispatchToProps)(Component)` | `connect(mapStateToProps, mapDispatchToProps)(Component)` |

#### Не подписываясь на хранилище и не вставляя создателей действий

Если вы вызовете `connect` без каких-либо аргументов, ваш компонент будет:

- _не_ перерисовываться при изменении хранилища
- получать `props.dispatch`, который можно использовать для отправки действия вручную

```js
// ... Component
export default connect()(Component) // Компонент получит `dispatch` (как и наш <TodoList />!)
```

#### Подписываясь на хранилище и не вставляя создетелей действий

Если вы вызываете `connect` только с `mapStateToProps`, ваш компонент будет:

- подписываться на значения, которые `mapStateToProps` извлекает из хранилища, и повторно рендериться только тогда, когда эти значения изменились
- получать `props.dispatch`, который можно использовать для отправки действия вручную

```js
// ... Component
const mapStateToProps = (state) => state.partOfState
export default connect(mapStateToProps)(Component)
```

#### Не подписываясь на хранилище и вставляя создетелей действий

Если вы вызываете `connect` только с `mapDispatchToProps`, ваш компонент будет:

- _не_ перерисовываться при изменении хранилища
- получать каждого из создателей действий, которые вы вставляете с помощью `mapDispatchToProps` в качестве пропса, и автоматически отправляйте действия при вызове

```js
import { addTodo } from './actionCreators'
// ... Component
export default connect(null, { addTodo })(Component)
```

#### Подписываясь на хранилище и вставляя создетелей действий

Если вы вызываете `connect` как с `mapStateToProps`, так и с `mapDispatchToProps`, ваш компонент будет:

- подписываться на значения, которые `mapStateToProps` извлекает из хранилища, и повторно отображаться только тогда, когда эти значения изменились
- получать всех создателей действий, которые вы вставляете с помощью `mapDispatchToProps` в качестве свойств, и автоматически отправлять действия при их вызове.

```js
import * as actionCreators from './actionCreators'
// ... Component
const mapStateToProps = (state) => state.partOfState
export default connect(mapStateToProps, actionCreators)(Component)
```

Эти четыре случая охватывают самые простые способы использования `connect`. Чтобы узнать больше о `connect`, продолжайте читать наш [раздел API](../api/connect.md), в котором это объясняется более подробно.

<!-- TODO: Put up link to the page that further explains connect -->

---

Теперь давайте подключим остальную часть нашего `<TodoApp />`.

Как нам реализовать взаимодействие переключения задач? У увлеченного читателя уже есть ответ. Если ваша среда настроена и вы выполнили все до этого момента, сейчас хорошее время, чтобы оставить это в стороне и реализовать эту функцию самостоятельно. Неудивительно, что мы аналогичным образом подключаем наш `<Todo />` к отправке (`dispatch`) `toggleTodo`:

```js
// components/Todo.js

// ... другой импорт
import { connect } from "react-redux";
import { toggleTodo } from "../redux/actions";

const Todo = // ... реализация компонента

export default connect(
  null,
  { toggleTodo }
)(Todo);
```

Теперь нашу задачу можно полностью переключить. Мы почти там!

![](https://i.imgur.com/4UBXYtj.png)

Наконец, давайте реализуем нашу функцию `VisibilityFilters`.

Компонент `<VisibilityFilters />` должен иметь возможность читать из хранилища, какой фильтр в данный момент активен, и отправлять действия в хранилище. Следовательно, нам нужно передать и `mapStateToProps`, и `mapDispatchToProps`. Здесь `mapStateToProps` может быть простым средством доступа к состоянию `visibilityFilter`. А `mapDispatchToProps` будет содержать создатель действия `setFilter`.

```js
// components/VisibilityFilters.js

// ... другой импорт
import { connect } from "react-redux";
import { setFilter } from "../redux/actions";

const VisibilityFilters = // ... реализация компонента

const mapStateToProps = state => {
  return { activeFilter: state.visibilityFilter };
};
export default connect(
  mapStateToProps,
  { setFilter }
)(VisibilityFilters);
```

Между тем, нам также необходимо обновить наш компонент `<TodoList />`, чтобы фильтровать задачи в соответствии с активным фильтром. Ранее `mapStateToProps`, который мы передавали вызову функции `connect` в `<TodoList />`, был просто селектором, который выбирает весь список задач. Давайте напишем еще один селектор, который поможет фильтровать задачи по их статусу.

```js
// redux/selectors.js

// ... другие селекторы
export const getTodosByVisibilityFilter = (store, visibilityFilter) => {
  const allTodos = getTodos(store)
  switch (visibilityFilter) {
    case VISIBILITY_FILTERS.COMPLETED:
      return allTodos.filter((todo) => todo.completed)
    case VISIBILITY_FILTERS.INCOMPLETE:
      return allTodos.filter((todo) => !todo.completed)
    case VISIBILITY_FILTERS.ALL:
    default:
      return allTodos
  }
}
```

И подключение к хранилищу с помощью селектора:

```js
// components/TodoList.js

// ...

const mapStateToProps = (state) => {
  const { visibilityFilter } = state
  const todos = getTodosByVisibilityFilter(state, visibilityFilter)
  return { todos }
}

export default connect(mapStateToProps)(TodoList)
```

Теперь мы закончили очень простой пример приложения todo с React Redux. Все наши компоненты связаны! Разве это не хорошо? 🎉🎊

![](https://i.imgur.com/ONqer2R.png)

## Ссылки

- [Usage with React](https://redux.js.org/basics/usage-with-react)
- [Using the React Redux Bindings](https://blog.isquaredsoftware.com/presentations/workshops/redux-fundamentals/react-redux.html)
- [Higher Order Components in Depth](https://medium.com/@franleplant/react-higher-order-components-in-depth-cf9032ee6c3e)
- [Computing Derived Data](https://redux.js.org/recipes/computing-derived-data#sharing-selectors-across-multiple-components)
- [Idiomatic Redux: Using Reselect Selectors for Encapsulation and Performance](https://blog.isquaredsoftware.com/2017/12/idiomatic-redux-using-reselect-selectors/)

## Получить больше информации

- [Reactiflux](https://www.reactiflux.com) Redux channel
- [StackOverflow](https://stackoverflow.com/questions/tagged/react-redux)
- [GitHub Issues](https://github.com/reduxjs/react-redux/issues/)

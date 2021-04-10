---
id: connect
title: Connect
sidebar_label: connect()
hide_title: true
---

# `connect()`

## Обзор

Функция `connect()` подключает компонент React к хранилищу Redux.

Он предоставляет свой связанный компонент с частями данных, которые ему нужны из хранилища, и функциями, которые он может использовать для отправки действий в хранилище.

Он не изменяет переданный ему класс компонента; вместо этого он возвращает новый связанный класс компонента, который обертывает переданный вами компонент.

```js
function connect(mapStateToProps?, mapDispatchToProps?, mergeProps?, options?)
```

`MapStateToProps` и `mapDispatchToProps` имеют дело с `state` и `dispatch` вашего хранилища Redux, соответственно. `state` и `dispatch` будут переданы вашим функциям `mapStateToProps` или `mapDispatchToProps` в качестве первого аргумента.

Возвращаемые значения `mapStateToProps` и `mapDispatchToProps` внутренне называются `stateProps` и `dispatchProps` соответственно. Они будут переданы в `mergeProps`, если они определены, как первый и второй аргумент, где третьим аргументом будет `ownProps`. Объединенный результат, обычно называемый `mergedProps`, затем будет передан вашему подключенному компоненту.

## Параметры `connect()`

`connect` принимает четыре различных параметра, все необязательные. Условно их называют:

1. `mapStateToProps?: Function`
2. `mapDispatchToProps?: Function | Object`
3. `mergeProps?: Function`
4. `options?: Object`

### `mapStateToProps?: (state, ownProps?) => Object`

Если указана функция `mapStateToProps`, новый компонент-оболочка будет подписываться на обновления хранилища Redux. Это означает, что каждый раз при обновлении хранилища будет вызываться `mapStateToProps`. Результатом `mapStateToProps` должен быть простой объект, который будет объединен со свойствами обернутого компонента. Если вы не хотите подписываться на обновления хранилища, передайте `null` или `undefined` вместо `mapStateToProps`.

#### Параметры

1. `state: Object`
2. `ownProps?: Object`

Функция `mapStateToProps` принимает максимум два параметра. Количество объявленных параметров функции (a.k.a. арность) влияет на то, когда она будет вызвана. Это также определяет, получит ли функция ownProps. См. примечания [здесь](#the-arity-of-maptoprops-functions).

##### `state`

Если ваша функция `mapStateToProps` объявлена как принимающая один параметр, она будет вызываться всякий раз, когда изменяется состояние хранилища, и каждый раз будет получать новое состояние хранилища в качестве единственного параметра.

```js
const mapStateToProps = (state) => ({ todos: state.todos })
```

##### `ownProps`

Если ваша функция `mapStateToProps` объявлена как принимающая два параметра, она будет вызываться всякий раз, когда состояние хранилища изменяется _или_ когда компонент-оболочка получает новые пропсы (на основе неглубоких сравнений равенства). В качестве первого параметра ему будет задано состояние хранилища, а в качестве второго параметра - свойства компонента оболочки.

Второй параметр обычно по соглашению называется `ownProps`.

```js
const mapStateToProps = (state, ownProps) => ({
  todo: state.todos[ownProps.id],
})
```

#### Возвращаемое значение

Ожидается, что ваши функции `mapStateToProps` вернут объект. Этот объект, обычно называемый `stateProps`, будет объединен в качестве свойств вашего подключенного компонента. Если вы определите `mergeProps`, он будет передан в качестве первого параметра в `mergeProps`.

Возврат `mapStateToProps` определяет, будет ли подключенный компонент повторно рендериться (подробности [здесь](../using-react-redux/connect-mapstate#return-values-determine-if-your-component-re-renders)).

Дополнительные сведения о рекомендуемом использовании `mapStateToProps` см. в [нашем руководстве по использованию `mapStateToProps`](../using-react-redux/connect-mapstate).

> Вы можете определить `mapStateToProps` и `mapDispatchToProps` как фабричные функции, т.е. вы возвращаете функцию вместо объекта. В этом случае ваша возвращенная функция будет рассматриваться как реальная `mapStateToProps` или `mapDispatchToProps` и будет вызываться в последующих вызовах. Вы можете увидеть примечания к [Factory Functions](#factory-functions) или в нашем руководстве по оптимизации производительности.

### `mapDispatchToProps?: Object | (dispatch, ownProps?) => Object`

Обычно называемый `mapDispatchToProps`, этот второй параметр для `connect()` может быть либо объектом, либо функцией, либо не предоставлен.

Ваш компонент получит `dispatch` по умолчанию, то есть, когда вы не предоставите второй параметр для `connect()`:

```js
// не передавайте `mapDispatchToProps`
connect()(MyComponent)
connect(mapState)(MyComponent)
connect(mapState, null, mergeProps, options)(MyComponent)
```

Если вы определяете `mapDispatchToProps` как функцию, она будет вызываться максимум с двумя параметрами.

#### Параметры

1. `dispatch: Function`
2. `ownProps?: Object`

##### `dispatch`

Если ваш `mapDispatchToProps` объявлен как функция, принимающая один параметр, ей будет предоставлена `dispatch` вашего `store`.

```js
const mapDispatchToProps = (dispatch) => {
  return {
    // отправка простых действий
    increment: () => dispatch({ type: 'INCREMENT' }),
    decrement: () => dispatch({ type: 'DECREMENT' }),
    reset: () => dispatch({ type: 'RESET' }),
  }
}
```

##### `ownProps`

Если ваша функция `mapDispatchToProps` объявлена как принимающая два параметра, она будет вызываться с `dispatch` в качестве первого параметра и пропсами, переданными компоненту-оболочке в качестве второго параметра, и будет повторно вызываться всякий раз, когда подключенный компонент получает новые свойства.

Второй параметр обычно по соглашению называется `ownProps`.

```js
// связывает при повторном рендеринге компонента
;<button onClick={() => this.props.toggleTodo(this.props.todoId)} />

// связывает при изменении `props`
const mapDispatchToProps = (dispatch, ownProps) => ({
  toggleTodo: () => dispatch(toggleTodo(ownProps.todoId)),
})
```

Количество объявленных параметров функции `mapDispatchToProps` определяет, получают ли они ownProps. См. примечания [здесь](#the-arity-of-maptoprops-functions).

#### Возвращаемое значение

Ожидается, что ваши функции `mapDispatchToProps` вернут объект. Каждое поле объекта должно быть функцией, вызов которой, как ожидается, отправит действие в хранилище.

Возврат ваших функций `mapDispatchToProps` рассматривается как `dispatchProps`. Он будет добавлен в качестве свойств к подключенному компоненту. Если вы определите `mergeProps`, он будет предоставлен в качестве второго параметра `mergeProps`.

```js
const createMyAction = () => ({ type: 'MY_ACTION' })
const mapDispatchToProps = (dispatch, ownProps) => {
  const boundActions = bindActionCreators({ createMyAction }, dispatch)
  return {
    dispatchPlainObject: () => dispatch({ type: 'MY_ACTION' }),
    dispatchActionCreatedByActionCreator: () => dispatch(createMyAction()),
    ...boundActions,
    // Вы можете вернуть `dispatch` здесь
    dispatch,
  }
}
```

Дополнительные сведения о рекомендуемом использовании см. [в нашем руководстве по использованию `mapDispatchToProps`](../using-react-redux/connect-mapdispatch).

> Вы можете определить `mapStateToProps` и `mapDispatchToProps` как фабричные функции, т.е. вы возвращаете функцию вместо объекта. В этом случае ваша возвращенная функция будет рассматриваться как реальная `mapStateToProps` или `mapDispatchToProps` и будет вызываться в последующих вызовах. Вы можете увидеть примечания к [Factory Functions](#factory-functions) или к нашему руководству по оптимизации производительности.

#### Краткая форма объекта

`mapDispatchToProps` может быть объектом, каждое поле которого является [создателем действия](https://redux.js.org/glossary#action-creator).

```js
import { addTodo, deleteTodo, toggleTodo } from './actionCreators'

const mapDispatchToProps = {
  addTodo,
  deleteTodo,
  toggleTodo,
}

export default connect(null, mapDispatchToProps)(TodoApp)
```

В этом случае React-Redux связывает `dispatch` вашего хранилища с каждым из создателей действий с помощью `bindActionCreators`. Результат будет рассматриваться как `dispatchProps`, который будет либо напрямую объединен с вашими подключенными компонентами, либо передан в `mergeProps` в качестве второго аргумента.

```js
// внутри React-Redux вызывает bindActionCreators,
// чтобы привязать создателей действий к отправке вашего хранилища.
bindActionCreators(mapDispatchToProps, dispatch)
```

У нас также есть раздел в нашем руководстве `mapDispatchToProps` об использовании сокращенной формы объекта [здесь](../using-react-redux/connect-mapdispatch#defining-mapdispatchtoprops-as-an-object).

### `mergeProps?: (stateProps, dispatchProps, ownProps) => Object`

Если указано, определяет, как определяются окончательные свойства для вашего собственного обернутого компонента. Если вы не предоставляете `mergeProps`, ваш обернутый компонент по умолчанию получает `{ ...ownProps, ...stateProps, ...dispatchProps }`.

#### Параметры

`mergeProps` следует указывать максимум с тремя параметрами. Они являются результатом `mapStateToProps()`, `mapDispatchToProps()` и `props` компонента-оболочки соответственно:

1. `stateProps`
2. `dispatchProps`
3. `ownProps`

Поля в простом объекте, который вы возвращаете из него, будут использоваться в качестве пропсов для обернутого компонента. Вы можете указать эту функцию, чтобы выбрать часть состояния на основе свойств или привязать создателей действий к определенной переменной из свойств.

#### Возвращаемое значение

Возвращаемое значение `mergeProps` называется `mergedProps`, и поля будут использоваться как пропсы для обернутого компонента.

### `options?: Object`

```js
{
  context?: Object,
  pure?: boolean,
  areStatesEqual?: Function,
  areOwnPropsEqual?: Function,
  areStatePropsEqual?: Function,
  areMergedPropsEqual?: Function,
  forwardRef?: boolean,
}
```

#### `context: Object`

> Примечание: Этот параметр поддерживается только в версии >= v6.0.

React-Redux v6 позволяет вам предоставить собственный экземпляр контекста, который будет использоваться React-Redux.
Вам необходимо передать экземпляр вашего контекста как в `<Provider />`, так и в подключенный компонент.
Вы можете передать контекст своему подключенному компоненту, передав его здесь как поле выбора или как проп для подключенного компонента при рендеринге.

```js
// const MyContext = React.createContext();
connect(mapStateToProps, mapDispatchToProps, null, { context: MyContext })(
  MyComponent
)
```

#### `pure: boolean`

- значение по умолчанию: `true`

Предполагает, что обернутый компонент является «чистым» компонентом и не полагается ни на какие входные данные или состояние, кроме его свойств и состояния выбранного хранилища Redux.

Когда `options.pure` имеет значение true, `connect` выполняет несколько проверок равенства, которые используются, чтобы избежать ненужных вызовов `mapStateToProps`, `mapDispatchToProps`, `mergeProps` и, в конечном итоге, `render`. К ним относятся `areStatesEqual`, `areOwnPropsEqual`, `areStatePropsEqual` и `areMergedPropsEqual`. Хотя значения по умолчанию, вероятно, подходят в 99% случаев, вы можете переопределить их с помощью пользовательских реализаций по соображениям производительности или по другим причинам.

В следующих разделах мы приводим несколько примеров.

#### `areStatesEqual: (next: Object, prev: Object) => boolean`

- значение по умолчанию: `strictEqual: (next, prev) => prev === next`

В чистом состоянии сравнивает входящее состояние хранилища с его предыдущим значением.

_Пример 1_

```js
const areStatesEqual = (next, prev) =>
  prev.entities.todos === next.entities.todos
```

Вы можете захотеть переопределить `areStatesEqual`, если ваша функция `mapStateToProps` требует больших вычислительных ресурсов и также касается только небольшого фрагмента вашего состояния. Приведенный выше пример будет эффективно игнорировать изменения состояния для всего, кроме этого фрагмента состояния.

_Пример 2_

Если у вас есть нечистые редьюсеры, которые изменяют состояние вашего хранилища, вы можете переопределить `areStatesEqual`, чтобы всегда возвращать false:

```js
const areStatesEqual = () => false
```

Это, вероятно, повлияет и на другие проверки равенства, в зависимости от вашей функции `mapStateToProps`.

#### `areOwnPropsEqual: (next: Object, prev: Object) => boolean`

- значение по умолчанию: `shallowEqual: (objA, objB) => boolean`
  ( возвращает `true`, когда каждое поле объектов равно )

В чистом виде сравнивает входящие свойства с предыдущим значением.

Вы можете захотеть переопределить `areOwnPropsEqual` как способ занести в белый список входящие пропсы. Вам также нужно будет реализовать `mapStateToProps`, `mapDispatchToProps` и `mergeProps`, чтобы также добавить свойства в белый список. (Может быть проще добиться этого другими способами, например, с помощью метода [перекомпоновки mapProps](https://github.com/acdlite/recompose/blob/master/docs/API.md#mapprops).)

#### `areStatePropsEqual: (next: Object, prev: Object) => boolean`

- тип: `function`
- значение по умолчанию: `shallowEqual`

В чистом виде сравнивает результат `mapStateToProps` с его предыдущим значением.

#### `areMergedPropsEqual: (next: Object, prev: Object) => boolean`

- значение по умолчанию: `shallowEqual`

В чистом виде сравнивает результат `mergeProps` с его предыдущим значением.

Вы можете захотеть переопределить `areStatePropsEqual` для использования `strictEqual`, если ваш `mapStateToProps` использует мемоизированный селектор, который будет возвращать новый объект только в том случае, если соответствующее свойство было изменено. Это было бы очень незначительным улучшением производительности, поскольку позволило бы избежать дополнительных проверок равенства для отдельных свойств при каждом вызове `mapStateToProps`.

Вы можете захотеть переопределить `areMergedPropsEqual`, чтобы реализовать `deepEqual`, если ваши селекторы создают сложные свойства. пример: вложенные объекты, новые массивы и т. д. (глубокая проверка равенства может быть быстрее, чем просто повторный рендеринг.)

#### `forwardRef: boolean`

> Примечание: Этот параметр поддерживается только в версии >= v6.0.

Если `{forwardRef : true}` был передан в `connect`, добавление ссылки в подключенный компонент-оболочку фактически вернет экземпляр обернутого компонента.

## Возвращаемое значение `connect()`

Возврат `connect()` - это функция-оболочка, которая принимает ваш компонент и возвращает компонент-оболочку с дополнительными пропсами, которые он вводит.

```js
import { login, logout } from './actionCreators'

const mapState = (state) => state.user
const mapDispatch = { login, logout }

// первый вызов: возвращает hoc, который можно использовать для обертывания любого компонента
const connectUser = connect(mapState, mapDispatch)

// второй вызов: возвращает компонент-оболочку с mergedProps
// вы можете использовать hoc, чтобы разные компоненты имели одинаковое поведение
const ConnectedUserLogin = connectUser(Login)
const ConnectedUserProfile = connectUser(Profile)
```

В большинстве случаев функция-оболочка будет вызываться сразу, без сохранения во временной переменной:

```js
import { login, logout } from './actionCreators'

const mapState = (state) => state.user
const mapDispatch = { login, logout }

// вызовите connect, чтобы сгенерировать функцию-оболочку, и немедленно вызовите
// функцию-оболочку, чтобы сгенерировать окончательный компонент оболочки.

export default connect(mapState, mapDispatch)(Login)
```

## Пример использования

Поскольку `connect` очень гибкий, вам может быть полезно увидеть некоторые дополнительные примеры того, как его можно вызвать:

- Внедрить просто `dispatch` и не слушать store

```js
export default connect()(TodoApp)
```

- Внедрить всех создателей действий (`addTodo`, `completeTodo`, ...) без подписки на хранилище

```js
import * as actionCreators from './actionCreators'

export default connect(null, actionCreators)(TodoApp)
```

- Внедрить `dispatch` и каждое поле в глобальном состоянии

> Не делай этого! Это убивает любую оптимизацию производительности, потому что `TodoApp` будет перерисовываться после каждого изменения состояния.
> Лучше иметь более детализированный `connect()` для нескольких компонентов в иерархии вашего представления, каждый из которых будет прослушивать только релевантный фрагмент состояния.

```js
// не делай этого!
export default connect((state) => state)(TodoApp)
```

- Внедрите `dispatch` и `todos`

```js
function mapStateToProps(state) {
  return { todos: state.todos }
}

export default connect(mapStateToProps)(TodoApp)
```

- Внедрите `todos` и все создатели действий

```js
import * as actionCreators from './actionCreators'

function mapStateToProps(state) {
  return { todos: state.todos }
}

export default connect(mapStateToProps, actionCreators)(TodoApp)
```

- Внедрите `todos` и все создатели действий (`addTodo`, `completeTodo`, ...) как `actions`

```js
import * as actionCreators from './actionCreators'
import { bindActionCreators } from 'redux'

function mapStateToProps(state) {
  return { todos: state.todos }
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actionCreators, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(TodoApp)
```

- Внедрите `todos` и создатель определенного действия (`addTodo`)

```js
import { addTodo } from './actionCreators'
import { bindActionCreators } from 'redux'

function mapStateToProps(state) {
  return { todos: state.todos }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ addTodo }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(TodoApp)
```

- Внедрение `todos` и конкретных создателей действий (`addTodo` и `deleteTodo`) с сокращенным синтаксисом

```js
import { addTodo, deleteTodo } from './actionCreators'

function mapStateToProps(state) {
  return { todos: state.todos }
}

const mapDispatchToProps = {
  addTodo,
  deleteTodo,
}

export default connect(mapStateToProps, mapDispatchToProps)(TodoApp)
```

- Внедрение `todos`, `todoActionCreators` как `todoActions` и `counterActionCreators` как `counterActions`.

```js
import * as todoActionCreators from './todoActionCreators'
import * as counterActionCreators from './counterActionCreators'
import { bindActionCreators } from 'redux'

function mapStateToProps(state) {
  return { todos: state.todos }
}

function mapDispatchToProps(dispatch) {
  return {
    todoActions: bindActionCreators(todoActionCreators, dispatch),
    counterActions: bindActionCreators(counterActionCreators, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TodoApp)
```

- Внедрение `todos` и todoActionCreators и counterActionCreators вместе как `actions`

```js
import * as todoActionCreators from './todoActionCreators'
import * as counterActionCreators from './counterActionCreators'
import { bindActionCreators } from 'redux'

function mapStateToProps(state) {
  return { todos: state.todos }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...todoActionCreators, ...counterActionCreators },
      dispatch
    ),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TodoApp)
```

- Внедрение `todos` и все `todoActionCreators` и `counterActionCreators` напрямую как props

```js
import * as todoActionCreators from './todoActionCreators'
import * as counterActionCreators from './counterActionCreators'
import { bindActionCreators } from 'redux'

function mapStateToProps(state) {
  return { todos: state.todos }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { ...todoActionCreators, ...counterActionCreators },
    dispatch
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(TodoApp)
```

- Внедрение `todos` определенного пользователя в зависимости от пропсов

```js
import * as actionCreators from './actionCreators'

function mapStateToProps(state, ownProps) {
  return { todos: state.todos[ownProps.userId] }
}

export default connect(mapStateToProps)(TodoApp)
```

- Внедрение `todos` определенного пользователя в зависимости от props и внедрение `props.userId` в действие

```js
import * as actionCreators from './actionCreators'

function mapStateToProps(state) {
  return { todos: state.todos }
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, ownProps, {
    todos: stateProps.todos[ownProps.userId],
    addTodo: (text) => dispatchProps.addTodo(ownProps.userId, text),
  })
}

export default connect(mapStateToProps, actionCreators, mergeProps)(TodoApp)
```

## Заметки

### Арность функций `mapToProps`

Количество объявленных параметров функции `mapStateToProps` и `mapDispatchToProps` определяет, получают ли они `ownProps`

> Примечание: `ownProps` не передается в `mapStateToProps` и `mapDispatchToProps`, если формальное определение функции содержит один обязательный параметр (функция имеет длину 1). Например, функции, определенные ниже, не получат `ownProps` в качестве второго аргумента. Если входящее значение `ownProps` - `undefined`, будет использоваться значение аргумента по умолчанию.

```js
function mapStateToProps(state) {
  console.log(state) // state
  console.log(arguments[1]) // undefined
}

const mapStateToProps = (state, ownProps = {}) => {
  console.log(state) // state
  console.log(ownProps) // {}
}
```

Функции без обязательных параметров или без двух параметров **получат `ownProps`**.

```js
const mapStateToProps = (state, ownProps) => {
  console.log(state) // state
  console.log(ownProps) // ownProps
}

function mapStateToProps() {
  console.log(arguments[0]) // state
  console.log(arguments[1]) // ownProps
}

const mapStateToProps = (...args) => {
  console.log(args[0]) // state
  console.log(args[1]) // ownProps
}
```

### Заводские функции

Если ваши функции `mapStateToProps` или `mapDispatchToProps` возвращают функцию, они будут вызываться один раз при создании экземпляра компонента, и их результаты будут использоваться как фактические функции `mapStateToProps`, `mapDispatchToProps` соответственно в их последующих вызовах.

Заводские функции обычно используются с мемоизированными селекторами. Это дает вам возможность создавать селекторы для конкретных экземпляров компонентов внутри замыкания:

```js
const makeUniqueSelectorInstance = () =>
  createSelector([selectItems, selectItemId], (items, itemId) => items[itemId])
const makeMapState = (state) => {
  const selectItemForThisComponent = makeUniqueSelectorInstance()
  return function realMapState(state, ownProps) {
    const item = selectItemForThisComponent(state, ownProps.itemId)
    return { item }
  }
}
export default connect(makeMapState)(SomeComponent)
```


## Документы устаревшей версии

Хотя API `connect` оставался почти полностью совместимым с API между всеми нашими основными версиями, были некоторые небольшие изменения в параметрах и поведении от версии к версии.

Для получения подробной информации о старых версиях 5.x и 6.x, пожалуйста, просмотрите эти заархивированные файлы в репозитории React Redux:

- [5.x `connect` API reference](https://github.com/reduxjs/react-redux/blob/v7.2.2/website/versioned_docs/version-5.x/api/connect.md)
- [6.x `connect` API reference](https://github.com/reduxjs/react-redux/blob/v7.2.2/website/versioned_docs/version-6.x/api/connect.md)
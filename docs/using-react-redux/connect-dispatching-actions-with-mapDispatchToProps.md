---
id: connect-mapdispatch
title: 'Connect: отправка действий с помощью mapDispatchToProps'
hide_title: true
sidebar_label: 'Connect: отправка действий с помощью mapDispatchToProps'
---

# Connect: отправка действий с помощью `mapDispatchToProps`

Поскольку второй аргумент передается в `connect`, `mapDispatchToProps` используется для отправки действий в хранилище.

`dispatch` - это функция хранилища Redux. Вы вызываете `store.dispatch` для отправки действия.
Это единственный способ вызвать изменение состояния.

С React Redux ваши компоненты никогда не обращаются к хранилищу напрямую - `connect` делает это за вас.
React Redux дает вам два способа разрешить компонентам отправлять действия:

- По умолчанию подключенный компонент получает `props.dispatch` и может сам отправлять действия.
- `connect` может принимать аргумент с именем `mapDispatchToProps`, который позволяет вам создавать функции, которые отправляют действия при вызове, и передавать эти функции в качестве пропсов вашему компоненту.

Функции `mapDispatchToProps` обычно для краткости называются `mapDispatch`, но фактическое используемое имя переменной может быть любым, каким вы хотите.

## Подходы к диспетчеризации

### По умолчанию: `dispatch` как проп

Если вы не укажете второй аргумент для `connect()`, ваш компонент по умолчанию получит `dispatch`. Например:

```js
connect()(MyComponent)
// что эквивалентно
connect(null, null)(MyComponent)

// или
connect(mapStateToProps /** нет второго аргумента */)(MyComponent)
```

После того, как вы подключили свой компонент таким образом, ваш компонент получит `props.dispatch`. Вы можете использовать его для отправки действий в хранилище.

```js
function Counter({ count, dispatch }) {
  return (
    <div>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
      <span>{count}</span>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>reset</button>
    </div>
  )
}
```

### Предоставление параметра `mapDispatchToProps`

Предоставление `mapDispatchToProps` позволяет вам указать, какие действия в вашем компоненте могут нуждаться в отправке. Это позволяет вам предоставлять функции диспетчеризации действий в качестве свойств. Следовательно, вместо вызова `props.dispatch(() => increment())` вы можете напрямую вызвать `props.increment()`. Есть несколько причин, по которым вы можете захотеть это сделать.

#### Более декларативный

Во-первых, инкапсуляция логики диспетчеризации в функцию делает реализацию более декларативной.
Отправка действия и разрешение хранилищу Redux обрабатывать поток данных - это _как_ реализовать поведение, а не _что_ оно делает.

Хорошим примером может служить отправка действия при нажатии кнопки. Прямое подключение кнопки, вероятно, не имеет смысла концептуально, равно как и ссылка на кнопку `dispatch`.

```js
// кнопка должна знать о "dispatch"
<button onClick={() => dispatch({ type: "SOMETHING" })} />

// кнопка не знает о "dispatch",
<button onClick={doSomething} />
```

После того, как вы обернули всех наших создателей действий функциями, которые отправляют действия, компонент избавляется от необходимости в функции `dispatch`.
Следовательно, **если вы определите свой собственный `mapDispatchToProps`, подключенный компонент больше не будет получать `dispatch`.**

#### Передача логики диспетчеризации действий (неподключенным) дочерним компонентам

Кроме того, вы также получаете возможность передавать функции диспетчеризации действий дочерним (вероятно, неподключенным) компонентам.
Это позволяет большему количеству компонентов отправлять действия, сохраняя при этом «незнание» Redux.

```jsx
// передача toggleTodo дочернему компоненту
// позволяет Todo отправлять действие toggleTodo
const TodoList = ({ todos, toggleTodo }) => (
  <div>
    {todos.map((todo) => (
      <Todo todo={todo} onClick={toggleTodo} />
    ))}
  </div>
)
```

Это то, что делает `connect` в React Redux - он инкапсулирует логику взаимодействия с хранилищем Redux и позволяет вам не беспокоиться об этом. И это то, что вы должны полностью использовать в своей реализации.

## Две формы `mapDispatchToProps`

Параметр `mapDispatchToProps` может иметь две формы. Хотя функциональная форма допускает больше настроек, объектная форма проста в использовании.

- **Функциональная форма**: позволяет больше настраивать, получает доступ к `dispatch` и, опционально, к `ownProps`
- **Сокращенная форма объекта**: более декларативная и простая в использовании.

> ⭐ **Примечание:** Мы рекомендуем использовать объектную форму `mapDispatchToProps`, если вам специально не нужно каким-либо образом настраивать поведение диспетчеризации.

## Определение `mapDispatchToProps` как функции

Определение `mapDispatchToProps` как функции дает вам максимальную гибкость в настройке функций, которые получает ваш компонент, и того, как они отправляют действия.
Вы получаете доступ к `dispatch` и `ownProps`.
Вы можете использовать эту возможность для написания пользовательских функций, которые будут вызываться подключенными компонентами.

### Аргументы

1. **`dispatch`**
2. **`ownProps` (не обязательно)**

**`dispatch`**

Функция `mapDispatchToProps` будет вызываться с `dispatch` в качестве первого аргумента.
Обычно вы используете это, возвращая новые функции, которые вызывают `dispatch()` внутри себя, и либо передают простой объект действия напрямую, либо передают результат создателя действия.

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

Вы также, вероятно, захотите переслать аргументы создателям ваших действий:

```js
const mapDispatchToProps = (dispatch) => {
  return {
    // явная пересылка аргументов
    onClick: (event) => dispatch(trackClick(event)),

    // неявная пересылка аргументов
    onReceiveImpressions: (...impressions) =>
      dispatch(trackImpressions(impressions)),
  }
}
```

**`ownProps` ( не обязательно )**

Если ваша функция `mapDispatchToProps` объявлена как принимающая два параметра, она будет вызываться с `dispatch` в качестве первого параметра и `props`, переданными подключенному компоненту в качестве второго параметра, и будет повторно вызываться всякий раз, когда подключенный компонент получает новые свойства.

Это означает, что вместо повторной привязки новых `props` к диспетчерам действий при повторном рендеринге компонента вы можете сделать это при изменении `props` вашего компонента.

**Привязка к монтированию компонентов**

```js
render() {
  return <button onClick={() => this.props.toggleTodo(this.props.todoId)} />
}

const mapDispatchToProps = dispatch => {
  return {
    toggleTodo: todoId => dispatch(toggleTodo(todoId))
  }
}
```

**Связывает при изменении `props`**

```js
render() {
  return <button onClick={() => this.props.toggleTodo()} />
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    toggleTodo: () => dispatch(toggleTodo(ownProps.todoId))
  }
}
```

### Возвращаемое значение

Ваша функция `mapDispatchToProps` должна возвращать простой объект:

- Каждое поле в объекте станет отдельным пропом для вашего собственного компонента, а значение обычно должно быть функцией, которая отправляет действие при вызове.
- Если вы используете создателей действий (в отличие от действий с обычными объектами) внутри `dispatch`, принято просто называть ключ поля тем же именем, что и создатель действия:

```js
const increment = () => ({ type: 'INCREMENT' })
const decrement = () => ({ type: 'DECREMENT' })
const reset = () => ({ type: 'RESET' })

const mapDispatchToProps = (dispatch) => {
  return {
    // отправка действий, возвращаемых создателями действий
    increment: () => dispatch(increment()),
    decrement: () => dispatch(decrement()),
    reset: () => dispatch(reset()),
  }
}
```

Возврат функции `mapDispatchToProps` будет объединен с вашим подключенным компонентом в качестве свойств. Вы можете вызвать их напрямую, чтобы отправить его действие.

```js
function Counter({ count, increment, decrement, reset }) {
  return (
    <div>
      <button onClick={decrement}>-</button>
      <span>{count}</span>
      <button onClick={increment}>+</button>
      <button onClick={reset}>reset</button>
    </div>
  )
}
```

(Полный код примера Counter [в этом CodeSandbox](https://codesandbox.io/s/yv6kqo1yw9))

### Определение функции `mapDispatchToProps` с помощью `bindActionCreators`

Оборачивание этих функций вручную утомительно, поэтому Redux предоставляет функцию, упрощающую это.

> `bindActionCreators` превращает объект, значения которого являются [создателями действий](https://redux.js.org/glossary#action-creator), в объект с теми же ключами, но с каждым создателем действия, заключенным в вызов ( [`dispatch`](https://redux.js.org/api/store#dispatch) ) диспетчеризации, поэтому они могут быть вызваны напрямую. Смотрите [Redux Docs on `bindActionCreators`](https://redux.js.org/api/bindactioncreators)

`bindActionCreators` принимает два параметра

1. **`Функция`** (создатель действия) или **`объект`** (каждое поле - создатель действия)
2. `dispatch`

Функции-оболочки, сгенерированные `bindActionCreators`, автоматически пересылают все свои аргументы, поэтому вам не нужно делать это вручную.

```js
import { bindActionCreators } from 'redux'

const increment = () => ({ type: 'INCREMENT' })
const decrement = () => ({ type: 'DECREMENT' })
const reset = () => ({ type: 'RESET' })

// привязка создателя действия
// возвращает (...args) => dispatch(increment(...args))
const boundIncrement = bindActionCreators(increment, dispatch)

// привязка объекта, полного создателей действий
const boundActionCreators = bindActionCreators(
  { increment, decrement, reset },
  dispatch
)
// возвращает
// {
//   increment: (...args) => dispatch(increment(...args)),
//   decrement: (...args) => dispatch(decrement(...args)),
//   reset: (...args) => dispatch(reset(...args)),
// }
```

Чтобы использовать `bindActionCreators` в нашей функции `mapDispatchToProps`:

```js
import { bindActionCreators } from 'redux'
// ...

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ increment, decrement, reset }, dispatch)
}

// компонент получает props.increment, props.decrement, props.reset
connect(null, mapDispatchToProps)(Counter)
```

### Вставка `dispatch` вручную

Если указан аргумент `mapDispatchToProps`, компонент больше не будет получать `dispatch` по умолчанию. Вы можете вернуть его, добавив вручную в возвращаемый объект вашего `mapDispatchToProps`, хотя в большинстве случаев этого делать не нужно:

```js
import { bindActionCreators } from 'redux'
// ...

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    ...bindActionCreators({ increment, decrement, reset }, dispatch),
  }
}
```

## Определение `mapDispatchToProps` как объекта

Вы видели, что установка для отправки действий Redux в компоненте React следует очень похожему процессу: определить создателя действия, заключить его в другую функцию, которая выглядит как `(…args) => dispatch(actionCreator(…args))` и передайте эту функцию-оболочку как проп вашему компоненту.

Поскольку это очень часто, `connect` поддерживает «сокращенную форму объекта» для аргумента `mapDispatchToProps`: если вы передадите объект, полный создателей действий, вместо функции, `connect` автоматически вызовет `bindActionCreators` для вас внутри.

**Мы рекомендуем всегда использовать «сокращенную форму объекта» `mapDispatchToProps`, если у вас нет особой причины для настройки поведения диспетчеризации.**

Обратите внимание, что:

- Каждое поле объекта `mapDispatchToProps` является создателем действия
- Ваш компонент больше не будет получать `dispatch` в пропсах

```js
// React Redux сделает это за вас автоматически
;(dispatch) => bindActionCreators(mapDispatchToProps, dispatch)
```

Следовательно, наш `mapDispatchToProps` может быть просто:

```js
const mapDispatchToProps = {
  increment,
  decrement,
  reset,
}
```

Поскольку фактическое имя переменной зависит от вас, вы можете дать ей имя вроде `actionCreators` или даже определить объект, встроенный в вызов `connect`:

```js
import { increment, decrement, reset } from './counterActions'

const actionCreators = {
  increment,
  decrement,
  reset,
}

export default connect(mapState, actionCreators)(Counter)

// or
export default connect(mapState, { increment, decrement, reset })(Counter)
```

## Общие проблемы

### Почему мой компонент не получает `dispatch`?

Также известен как

```js
TypeError: this.props.dispatch is not a function
```

Это обычная ошибка, которая возникает, когда вы пытаетесь вызвать `this.props.dispatch`, но `dispatch` не внедряется в ваш компонент.

`dispatch` вводится в ваш компонент _только_ когда:

**1. Вы не предоставляете `mapDispatchToProps`**

По умолчанию `mapDispatchToProps` просто `dispatch => ({ dispatch })`. Если вы не предоставите `mapDispatchToProps`, `dispatch` будет предоставлен, как указано выше.

Другими словами, если вы сделаете:

```js
// компонент получает `dispatch`
connect(mapStateToProps /** нет второго аргумента*/)(Component)
```

**2. Ваш настроенный возврат функции `mapDispatchToProps` конкретно содержит `dispatch`**

Вы можете вернуть `dispatch`, указав свою настраиваемую функцию `mapDispatchToProps`:

```js
const mapDispatchToProps = (dispatch) => {
  return {
    increment: () => dispatch(increment()),
    decrement: () => dispatch(decrement()),
    reset: () => dispatch(reset()),
    dispatch,
  }
}
```

Или, альтернативно, с помощью `bindActionCreators`:

```js
import { bindActionCreators } from 'redux'

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    ...bindActionCreators({ increment, decrement, reset }, dispatch),
  }
}
```

См. [эту ошибку в действии в выпуске Redux GitHub #255](https://github.com/reduxjs/react-redux/issues/255).

Ведутся дискуссии о том, следует ли предоставлять `dispatch` вашим компонентам при указании `mapDispatchToProps` ( [ответ Дэна Абрамова на #255](https://github.com/reduxjs/react-redux/issues/255#issuecomment-172089874) ). Вы можете прочитать их для дальнейшего понимания текущего намерения реализации.

### Могу ли я использовать `mapDispatchToProps` без `mapStateToProps` в Redux?

Да. Вы можете пропустить первый параметр, передав `undefined` или `null`. Ваш компонент не будет подписываться на хранилище и по-прежнему будет получать свойства отправки, определенные параметром `mapDispatchToProps`.

```js
connect(null, mapDispatchToProps)(MyComponent)
```

### Могу я вызвать `store.dispatch`?

Это анти-паттерн для взаимодействия с хранилищем непосредственно в компоненте React, будь то явный импорт хранилища или доступ к нему через контекст (см. [Запись Redux FAQ по настройке хранилища](https://redux.js.org/faq/storesetup#can-or-should-i-create-multiple-store-can-i-import-my-store-direct-and-use-it-in-components-self) для более подробной информации). Пусть `connect` React Redux обрабатывает доступ к хранилищу и использует `dispatch`, который он передает через пропсы, для отправки действий.

## Ссылки

**Учебники**

- [You Might Not Need the `mapDispatchToProps` Function](https://daveceddia.com/redux-mapdispatchtoprops-object-form/)

**Связанные документы**

- [Redux Doc on `bindActionCreators`](https://redux.js.org/api/bindactioncreators)

**Вопросы и ответы**

- [How to get simple dispatch from `this.props` using connect with Redux?](https://stackoverflow.com/questions/34458261/how-to-get-simple-dispatch-from-this-props-using-connect-w-redux)
- [`this.props.dispatch` is `undefined` if using `mapDispatchToProps`](https://github.com/reduxjs/react-redux/issues/255)
- [Do not call `store.dispatch`, call `this.props.dispatch` injected by `connect` instead](https://github.com/reduxjs/redux/issues/916)
- [Can I `mapDispatchToProps` without `mapStateToProps` in Redux?](https://stackoverflow.com/questions/47657365/can-i-mapdispatchtoprops-without-mapstatetoprops-in-redux)
- [Redux Doc FAQ: React Redux](https://redux.js.org/faq/reactredux)

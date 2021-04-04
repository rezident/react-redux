---
id: usage-with-typescript
title: Использование с TypeScript
hide_title: true
sidebar_label: Использование с TypeScript
---

# Использование с TypeScript

Сам React Redux в настоящее время написан на простом JavaScript. Однако он хорошо работает с системами статического типа, такими как TypeScript.

Определения типов React Redux - это отдельный [пакет `@types/react-redux` typedefs](https://npm.im/@types/react-redux) на NPM. Помимо набора функций библиотеки, типы также экспортируют некоторые помощники, чтобы упростить написание безопасных интерфейсов между вашим хранилищем Redux и вашими компонентами React.

**Начиная с React Redux v7.2.3, пакет `react-redux` зависит от `@types/react-redux`, поэтому определения типов будут автоматически установлены вместе с библиотекой.** В противном случае вам придется вручную установить их самостоятельно ( `npm install @types/react-redux` ).


## Стандартная настройка проекта Redux Toolkit с помощью TypeScript

Мы предполагаем, что типичный проект Redux использует вместе Redux Toolkit и React Redux.

[Redux Toolkit](https://redux-toolkit.js.org) (RTK) - стандартный подход для написания современной логики Redux. RTK уже написан на TypeScript, и его API разработан, чтобы обеспечить удобство использования TypeScript.

[Шаблон Redux+TS для Create-React-App](https://github.com/reduxjs/cra-template-redux-typescript) поставляется с уже настроенным рабочим примером этих шаблонов.

### Определение корневого состояния и типов отправки

Использование [configureStore](https://redux-toolkit.js.org/api/configureStore) не требует дополнительной типизации. Однако вы захотите извлечь тип `RootState` и тип `Dispatch`, чтобы на них можно было ссылаться по мере необходимости. Вывод этих типов из самого хранилища означает, что они правильно обновляются по мере добавления дополнительных фрагментов состояния или изменения параметров промежуточного программного обеспечения.

Поскольку это типы, их можно безопасно экспортировать прямо из установочного файла вашего хранилища, такого как `app/store.ts`, и импортировать непосредственно в другие файлы.

```ts title="app/store.ts"
import { configureStore } from '@reduxjs/toolkit'
// ...

const store = configureStore({
  reducer: {
    posts: postsReducer,
    comments: commentsReducer,
    users: usersReducer,
  }
})

// highlight-start
// Вывести типы `RootState` и `AppDispatch` из самого хранилища.
export type RootState = ReturnType<typeof store.getState>
// Предполагаемый тип: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
// highlight-end
```

### Определить типизированные хуки

Хотя можно импортировать типы `RootState` и `AppDispatch` в каждый компонент, лучше **создавать предварительно типизированные версии хуков `useDispatch` и `useSelector` для использования в вашем приложении**. Это важно по нескольким причинам:

- Для `useSelector` это избавляет вас от необходимости каждый раз типизировать `(state: RootState)`.
- Для `useDispatch` тип `Dispatch` по умолчанию не знает о переходниках или другом промежуточном программном обеспечении. Чтобы правильно отправлять преобразователи, вам необходимо использовать определенный настроенный тип `AppDispatch` из хранилища, который включает типы промежуточного программного обеспечения преобразователей, и использовать его с `useDispatch`. Добавление предварительно набранного хука `useDispatch` убережет вас от того, чтобы забыть импортировать `AppDispatch` туда, где это необходимо.

Поскольку это фактические переменные, а не типы, важно определить их в отдельном файле, таком как `app/hooks.ts`, а не в файле настройки хранилища. Это позволяет вам импортировать их в любой файл компонента, который должен использовать перехватчики, и позволяет избежать потенциальных проблем с зависимостью от циклического импорта.

```ts title="app/hooks.ts"
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store'

// highlight-start
// Используйте во всем приложении вместо обычных `useDispatch` и `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
// highlight-end
```


## Набор хуков вручную

Мы рекомендуем использовать предварительно типизированные хуки `useAppSelector` и `useAppDispatch`, показанные выше. Если вы предпочитаете не использовать их, вот как набрать хуки сами по себе.

### Типизирование хука `useSelector`

При написании селекторных функций для использования с `useSelector` вы должны явно определить тип параметра `state`. TS должен иметь возможность вывести тип возвращаемого значения селектора, который будет повторно использован в качестве типа возвращаемого значения хука `useSelector`:

```ts
interface RootState {
  isOn: boolean
}

// TS выводит тип: (state: RootState) => boolean
const selectIsOn = (state: RootState) => state.isOn

// TS предполагает, что isOn является логическим
const isOn = useSelector(selectIsOn)
```

Это также можно сделать в одной строке:

```ts
const isOn = useSelector( (state: RootState) => state.isOn)
```


### Типизирование хука `useDispatch`

По умолчанию возвращаемое значение `useDispatch` является стандартным типом `Dispatch`, определенным основными типами Redux, поэтому никаких объявлений не требуется:

```ts
const dispatch = useDispatch()
```

Если у вас есть настроенная версия типа `Dispatch`, вы можете использовать этот тип явно:

```ts
// store.ts
export type AppDispatch = typeof store.dispatch

// MyComponent.tsx
const dispatch: AppDispatch = useDispatch()
```


## Типизирование компонента более высокого порядка `connect`


### Автоматический вывод подключенных пропсов

`connect` состоит из двух функций, которые вызываются последовательно. Первая функция принимает в качестве аргументов `mapState` и `mapDispatch` и возвращает вторую функцию. Вторая функция принимает компонент, который нужно обернуть, и возвращает новый компонент-оболочку, который передает свойства из `mapState` и `mapDispatch`. Обычно обе функции вызываются вместе, например `connect(mapState, mapDispatch)(MyComponent)`.

Начиная с версии 7.1.2, пакет `@types/react-redux` предоставляет вспомогательный тип `ConnectedProps`, который может извлекать возвращаемые типы `mapStateToProps` и `mapDispatchToProps` из первой функции. Это означает, что если вы разделите вызов `connect` на два шага, все «свойства из Redux» могут быть выведены автоматически, без необходимости писать их вручную. Хотя этот подход может показаться необычным, если вы какое-то время используете React-Redux, он значительно упрощает объявления типов.

```ts
import { connect, ConnectedProps } from 'react-redux'

interface RootState {
  isOn: boolean
}

const mapState = (state: RootState) => ({
  isOn: state.isOn,
})

const mapDispatch = {
  toggleOn: () => ({ type: 'TOGGLE_IS_ON' }),
}

const connector = connect(mapState, mapDispatch)

// Предполагаемый тип будет выглядеть как:
// {isOn: boolean, toggleOn: () => void}
type PropsFromRedux = ConnectedProps<typeof connector>
```

Затем тип возвращаемого значения `ConnectedProps` можно использовать для типизирования вашего объекта props.

```tsx
interface Props extends PropsFromRedux {
  backgroundColor: string
}

const MyComponent = (props: Props) => (
  <div style={{ backgroundColor: props.backgroundColor }}>
    <button onClick={props.toggleOn}>
      Toggle is {props.isOn ? 'ON' : 'OFF'}
    </button>
  </div>
)

export default connector(MyComponent)
```

Поскольку типы могут быть определены в любом порядке, вы все равно можете объявить свой компонент перед объявлением соединителя, если хотите.

```tsx
// альтернативно, объявить `type Props = PropsFromRedux & {backgroundColor: string}`
interface Props extends PropsFromRedux {
  backgroundColor: string;
}

const MyComponent = (props: Props) => /* то же, что и выше */

const connector = connect(/* то же, что и выше*/)

type PropsFromRedux = ConnectedProps<typeof connector>

export default connector(MyComponent)
```

### Ручная типизация `connect`

Компонент более высокого порядка `connect` довольно сложно типизировать, потому что есть 3 источника свойств: `mapStateToProps`, `mapDispatchToProps` и свойства, переданные из родительского компонента. Вот полный пример того, как это выглядит вручную.

```tsx
import { connect } from 'react-redux'

interface StateProps {
  isOn: boolean
}

interface DispatchProps {
  toggleOn: () => void
}

interface OwnProps {
  backgroundColor: string
}

type Props = StateProps & DispatchProps & OwnProps

const mapState = (state: RootState) => ({
  isOn: state.isOn,
})

const mapDispatch = {
  toggleOn: () => ({ type: 'TOGGLE_IS_ON' }),
}

const MyComponent = (props: Props) => (
  <div style={{ backgroundColor: props.backgroundColor }}>
    <button onClick={props.toggleOn}>
      Toggle is {props.isOn ? 'ON' : 'OFF'}
    </button>
  </div>
)

// Типичное использование: `connect` вызывается после определения компонента
export default connect<StateProps, DispatchProps, OwnProps>(
  mapState,
  mapDispatch
)(MyComponent)
```

Также можно несколько сократить это, указав типы `mapState` и `mapDispatch`:

```ts
const mapState = (state: RootState) => ({
  isOn: state.isOn,
})

const mapDispatch = {
  toggleOn: () => ({ type: 'TOGGLE_IS_ON' }),
}

type StateProps = ReturnType<typeof mapState>
type DispatchProps = typeof mapDispatch

type Props = StateProps & DispatchProps & OwnProps
```

Однако определение типа `mapDispatch` таким способом не работает, если он определен как объект и также относится к преобразователям.


## Рекомендации

API хуков обычно проще использовать со статическими типами. **Если вы ищете самое простое решение для использования статических типов с React-Redux, используйте API хуков.**

Если вы используете `connect`, **мы рекомендуем использовать подход `ConnectedProps<T>` для вывода свойств из Redux**, так как это требует наименьшего количества явных объявлений типа.

## Ресурсы

Для получения дополнительной информации см. эти дополнительные ресурсы:

- [Redux docs: Usage with TypeScript](https://redux.js.org/recipes/usage-with-typescript): Examples of how to use Redux Toolkit, the Redux core, and React Redux with TypeScript
- [Redux Toolkit docs: TypeScript Quick start](https://redux-toolkit.js.org/tutorials/typescript): shows how to use RTK and the React-Redux hooks API with TypeScript
- [React+TypeScript Cheatsheet](https://github.com/typescript-cheatsheets/react-typescript-cheatsheet): a comprehensive guide to using React with TypeScript
- [React + Redux in TypeScript Guide](https://github.com/piotrwitek/react-redux-typescript-guide): extensive information on patterns for using React and Redux with TypeScript

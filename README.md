# Vammp

Build a DOM tree from view data defined in JavaScript. It can be used with Vue, React or Hyperapp.

## Example

```js:vammpdemo.js
import { div, button, mount, } from 'https://unpkg.com/vammp'

function app() {
  const view = [
    [div,
      [button, {style: 'color: grey;', onclick: () => console.log('cancel clicked')},
        'Cancel'
      ],
      [button, {style: 'background-color: aqua;', onclick: () => console.log('ok clicked')},
        'OK'
      ],
    ]
  ]
  mount("#app", view)
}

app()
```

```html:index.html
<html>
  <head>
    <script type="module" src="vammpdemo.js"></script>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
```

[demo](https://takahad55.github.io/vammp/example/vammptest/vammptest.html)

## Two formats

It supports two formats: function format and array format. They can be mixed.

### Function format

```js
tag([child?|props?, ...])
```

There are functions corresponding to all tags, and in Array format function calls represent element generation.
Properties are optional, can be multiple, and can be mixed with child elements.

```js
const view = [
    div(
        button({style: 'color: grey;', onclick: () => console.log('cancel clicked')},
            'Cancel'
        ),
        button({style: 'background-color: aqua;', onclick: () => console.log('ok clicked')},
            'OK'
        ),
    )
]
```

### Array format
```js
[tag, [child?|props?, ...]]
```
Array format puts the tag function and its arguments into an array instead of the function call.

```js
const view = [
    [div,
        [button, {style: 'color: grey;', onclick: () => console.log('cancel clicked')},
            'Cancel'
        ],
        [button, {style: 'background-color: aqua;', onclick: () => console.log('ok clicked')},
            'OK'
        ],
    ]
]
```

## class and style (DOM only)

Class and style can be specified in two forms: strings and objects. Mixing is not allowed in one element.

class:
```js
[div, 'hello', {c0: true, c1: false, c2: true, c3: false}]
[div, 'hello', {class: 'c0 c2'}]
```

style:
```js
[div, 'hello', {style: {color: 'grey', 'background-color': 'aqua'}}]
[div, 'hello', {style: 'color: grey; background-color: aqua;'}]
```

## alias

An element with properties and child elements can be defined as an alias that can specify additional properties and child elements.

```js
const greyFont = {style: 'color: grey;'}
const aquaBack = {style: 'background-color: aqua;'}
const cancelButton = (...args) => button('Cancel', greyFont, ...args) // alias
const okButton = (...args) => button('Ok', aquaBack, ...args) // alias
const view = [
    div(
        cancelButton({onclick: () => console.log('cancel clicked')}),
        okButton({onclick: () => console.log('ok clicked')}),
    )
]
```

## Ref (DOM only)

It supports a way to get a DOM Element reference without using getElementById(). Specify an empty object for the Ref property and any name for the Name property. DOM Element is set to ref['name'] after mount().

```js
function app() {
  // aliases
  const greyFont = {style: {color: 'grey'}, class: {greyFont: true, aquaBack: false}}
  const aquaBack = {style: {'background-color': 'aqua'}, class: {aquaBack: true}}
  const wheatBack = {style: {'background-color': 'wheat'}, class: {weatBack: true}}
  const largeFont = {style: {'font-size': 'large'}, class: {large: true}}
  const cancelButton = (...args) => button(greyFont, 'Cancel', ...args)
  const okButton = (...args) => button(aquaBack, 'OK', ...args)
  const wheatSelectArg0 = (lst, ...args) => [select, wheatBack, largeFont,
    ...lst.map(x => [option, x[0], { value: x[1], selected: x[2] }]),
    ...args
  ]
  const wheatSelectProp = (...args) => {
    const { props } = collectArgs(args)
    return [select, wheatBack, largeFont,
      ...props.Options.map(x => [option, x[0], { value: x[1], selected: x[2] }]),
      ...args
    ]
  }
  // ref
  const ref = {}
  // methods
  const toggle = () => {
    const node = ref.cancelButton
    if (!node) {
      return
    }
    const style = getStyleObj(node)
    const cls = getClassObj(node)
    if (style['font-size']) {
      style.fontSize = ''
      style.color = 'grey'
      cls.greyFont = true
      cls.redFont = false
    }
    else {
      style.fontSize = 'large'
      style.color = 'red'
      cls.greyFont = false
      cls.redFont = true
    }
    setStyle(node, style)
    setClass(node, cls)
  }
  // view
  const view = [
    [div,
      [cancelButton, { Ref: ref, Name: 'cancelButton', onclick: () => console.log('cancel clicked') }],
      [okButton, largeFont, {onclick: () => console.log('ok clicked')}],
      [br],
      [select, wheatBack, largeFont,
        [option, 'sel1', { value: 'v1', selected: true }],
        [option, 'sel2', { value: 'v2' }],
        [option, 'sel3', { value: 'v3' }],
      ],
      [wheatSelectArg0, [['sel1', 'a1'], ['sel2', 'a2', 1], ['sel3', 'a3']]],
      [wheatSelectProp,
        { Options: [['sel1', 'p1'], ['sel2', 'p2'], ['sel3', 'p3', 1],] },
      ],
      [br],
      [button, 'toggle button size', {onclick: () => toggle() }],
    ]
  ]
  mount("#app", view)
}
app()
```

## Use with Vue

You can switch the render function using setCreateElement(). For Vue, set the render function h.
Use createView() to create view.
Components should use element() to generate a tag function that can be used in vammp format.

[Vue demo](https://takahad55.github.io/vammp/example/vuetest/vuevammptest.html)

```js
import { createApp, ref, reactive, h, resolveComponent } from 'vue'
import {
  setCreateElement, createView, element, collectArgs,
  button, div, input, label 
} from 'vammp'

setCreateElement(h)

const TodoList = {
  props: { todoItems: Object, },
  setup(props) {
    const newItem = ref('')
    const newItemInput = ref()
    const addItem = () => {
      const item = {text: newItem.value, status: false}
      props.todoItems.push(item)
      newItem.value = ''
    }
    const removeItem = (index) => {
      props.todoItems.forEach((item, idx) => {
        if (idx == index) {
          props.todoItems.splice(idx, 1)
        }
      })
    }
    const aquaBack = { style: { 'background-color': 'aqua'}, class: 'aqua' }
    const largeFont = { style: { 'font-size': 'large'}, class: 'large' }
    const aquaButton = (...args) => button(aquaBack, ...args)
    const textModelInput = (...args) => {
      const { props } = collectArgs(args)
      return input({
        type: 'text', value: props.Model.value,
        onChange: (e) => {
          props.Model.value = e.target.value
        }
      }, ...args)
    }
    const checkBox = (...args) => input({ type: 'checkbox' }, ...args)
    return () => createView([
      [textModelInput, { Model: newItem, placeholder: 'New', ref: 'newItemInput'}],
      [button, 'Add', {onClick: addItem}],
      props.todoItems.map((item, index) => [div,
        [label,
          {style: {'text-decoration': item.status ? 'line-through' : ''}},
          [checkBox, { checked: item.status, onChange: (e) =>
            item.status = e.target.checked
          }],
          item.text,
        ],
        [aquaButton, 'Delete', largeFont, {onClick: () => removeItem(index)}],
      ]),
    ])
  },
  mounted() {
    const newItemInput = this.$refs.newItemInput
    if (newItemInput) {
      newItemInput.focus()
    }
  },
}

const createTodoItems = () => {
  const todoItems = [
    {text: 'todo0', status: false},
    {text: 'todo1', status: true},
  ]
  return todoItems
}

const app = createApp({
  setup(props) {
    const pageSel = ref(true)
    const todoItems = reactive(createTodoItems())
    const todoList = resolveComponent('TodoList')
    const TodoListTag = (...args) => element(todoList, ...args)
    return () => createView([
      [div,
        [button, 'Change page', { onClick: (e) => pageSel.value = !pageSel.value }],
      ],
      pageSel.value ?
      [div,
        [TodoListTag, {todoItems: todoItems}],
      ] :
      [div, 'Another page']
    ])
  },
  components: {
    TodoList,
  },
})

app.mount('#app')
```

## Use with React

For React, set the render function React.createElement with parameter {reactMode: true}.

[React demo](https://takahad55.github.io/vammp/example/reacttest/reactvammptest.html)

```js
const { useState, useEffect, useRef, createElement } = React
import {
  createView, element, collectArgs,
  button, div, input, label,
} from 'vammp'

vammp.setCreateElement(createElement, {reactMode: true})

function TodoList(props) {
  const [newItem, setNewItem] = useState('')
  const newItemInput = useRef()
  useEffect(() => newItemInput.current.focus())
  var addItem = function(e) {
    props.onAddItem(newItem)
    setNewItem('')
  }
  const aquaBack = {style: {backgroundColor: 'aqua'}, className: 'aqua'}
  const largeFont = {style: {fontSize: 'large'}, className: 'large'}
  const aquaButton = (...args) => button(aquaBack, ...args)
  const textModelInput = (...args) => {
    const { props } = collectArgs(args)
    return input({
      type: 'text', value: props.Value,
      onChange: (e) => {
        props.SetValue(e.target.value)
      }
    }, ...args)
  }
  const checkBox = (...args) => input({type: 'checkbox'}, ...args)
  return createView([div,
    [textModelInput, {
      Value: newItem, SetValue: setNewItem, placeholder: "New",
      ref: newItemInput,
    }],
    [button, 'Add', {onClick: addItem}],
    ...props.todoItems.map((item, index) => [div, { key: item.key },
      [label,
        {style: {textDecoration: item.status ? 'line-through' : ''}},
        [checkBox, { checked: item.status, onChange: () =>
          props.onStatusChange(item.key)
        }],
        item.text,
      ],
      [aquaButton, 'Delete', largeFont, { onClick: () => {
        props.onRemoveItem(item.key)
      }}],
    ]),
  ])
}

const todoItems = [
  {text: "todo0", status: false,},
  {text: "todo1", status: true,},
]
let keygen = todoItems.length

const createTodoItems = () => {
  for (var j = 0; j < todoItems.length; j++) {
    todoItems[j].key = String(j)
  }
  const [state, setState] = useState(todoItems)
  return [state, setState]
}

function App() {
  const [pageSel, setPageSel] = useState(true)
  const [todoItems, setTodoItems] = createTodoItems()
  const onAddItem = function(newItem) {
    const newItems = todoItems.concat([{text: newItem, status: false, key: String(keygen)},])
    keygen++
    setTodoItems(newItems)
  }
  const onStatusChange = function(key) {
    const idx = todoItems.findIndex(x => x.key == key)
    if (0 <= idx) {
      var items = todoItems.slice()
      const v = items[idx].status
      items[idx].status = !v
      setTodoItems(items)
    }
  }
  const onRemoveItem = function(key) {
    var items = todoItems.filter((item) => item.key != key)
    setTodoItems(items)
  }
  const TodoListTag = (...args) => element(TodoList, ...args)
  return createView([div,
    [div, [button, 'Change', { onClick: (e) => setPageSel(!pageSel) }]],
    pageSel ?
    [div,
      [TodoListTag, {
        todoItems: todoItems,
        onAddItem: onAddItem,
        onStatusChange: onStatusChange,
        onRemoveItem: onRemoveItem,
      }],
    ] :
    [div, 'Another page'],
  ])
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App, {}, null));
```

## Use with Hyperapp

For hyperapp you need to replace text() for vammp.
Do not use text() for simple strings in vammp. state requires text().
Set the render function h with parameter {textWrapper: hyperapptext}.

[Hyperapp demo](https://takahad55.github.io/vammp/example/hyperapptest/index.html)

```js
import { h, text as hyperapptext, app } from "https://unpkg.com/hyperapp"
import {
  setCreateElement, createView, rawNode,
  div, input, button, label,
} from 'vammp'

setCreateElement(h, {textWrapper: hyperapptext})
const text = (txt) => rawNode(hyperapptext(txt))

let keygen = 0

const createTodoItems = () => {
  const todoItems = [
    {text: "todo0", status: false,},
    {text: "todo1", status: true,},
  ]
  for (var j = 0; j < todoItems.length; j++) {
    todoItems[j].key = String(++keygen)
  }
  return todoItems
}

const changePage = (state) => ({
  ...state, pageSel: !state.pageSel
})

const onNewTodoChange = (state, e) => ({
  ...state, newTodo: e.target.value,
})

const statusChange = (state, key) => {
  const idx = state.todoItems.findIndex(x => x.key == key)
  if (0 <= idx) {
    state.todoItems[idx].status = !state.todoItems[idx].status
  }
  return {...state}
}

const addItem = (state) => {
  if ((!state.newTodo)||(0 == state.newTodo.length)) {
    return state
  }
  return {
    ...state, newTodo: '',
    todoItems: state.todoItems.concat(
      {status: false, text: state.newTodo, key: ++keygen}
    ),
  }
}

const removeItem = (state, key) => {
  const idx = state.todoItems.findIndex(x => x.key == key)
  if (0 <= idx) {
    state.todoItems.splice(idx, 1)
  }
  return {...state}
}

const aquaBack = {style: {backgroundColor: 'aqua'}, className: 'aqua'}
const largeFont = {style: {fontSize: 'large'}, className: 'large'}
const inputText = (...args) => input({type: 'text'}, ...args)
const inputCheckBox = (...args) => input({type: 'checkbox'}, ...args)
const aquaButton = (...args) => button(aquaBack, ...args)

const todoList = ({todoItems, newTodo}, ...args) => div(
  [inputText, {placeholder: 'New', onchange: onNewTodoChange, value: newTodo}],
  [button, 'Add', { onclick: addItem },],
  todoItems.map((item) => [div,
    [label,
      [inputCheckBox, {
        checked: item.status,
        onchange: (status) => statusChange(status, item.key)
      }],
      text(item.text),
      {style: {textDecoration: item.status ? 'line-through' : ''}},
    ],
    [aquaButton, 'Delete', largeFont, {
      onclick: (status) => removeItem(status, item.key)
    }],
  ]),
  ...args,
)

app({
  init: {
    todoItems: createTodoItems(),
    newTodo: '',
    pageSel: true,
  },
  view: ({todoItems, newTodo, pageSel}) => createView(
    [div,
      [button, 'Change', {onclick: changePage}],
      pageSel ?
      [todoList, {todoItems, newTodo}]
      :
      [div, 'Another page'],
    ]
  ),
  node: document.getElementById('app'),
})
```

## All exports

```js
{
  // tags
  html, base, head, link, meta, style, title, body,
  address, article, aside, footer, header,
  h1, h2, h3, h4, h5, h6, main, nav, section,
  blockquote, dd, div, dl, dt, figcaption, figure, hr, li,
  menu, ol, p, pre, ul, a, abbr, b, bdi, bdo, br,
  cite, code, data, dfn, em, i, kbd, mark, q, rp, rt,
  ruby, s, samp, small, span, strong, sub, sup, time, u,
  //var, // var is in conflict with js. use vammp.var.
  wbr, area, audio, img, map, track, video,
  embed, iframe, object, picture, portal, source,
  svg, math, canvas, noscript, script, del, ins,
  caption, col, colgroup, table, tbody, td, tfoot, th,
  thead, tr,
  button, datalist, fieldset, form, input, label, legend,
  meter, optgroup, option, output, progress, select, textarea,
  details, dialog, summary,
  slot, template,
  // API
  mount, createView, element, setCreateElement, collectArgs,
  setStyle, setClass, getStyleObj, getClassObj, rawNode,
  version, vammp,
} 
```

### HTML to vammp format converter in Python

Reads HTML from standard input and outputs vammp format to standard output. `pip3 install beautifulsoup4` command is required.

```Python
import sys
import bs4

INDENT = '  '
if True: # Array format
    FMT_TOP = '[{},'
    FMT_END = '],'
    FMT_ALL = '[{}],'
else: # Function format
    FMT_TOP = '{}('
    FMT_END = '),'
    FMT_ALL = '{}(),'

def parse(tag: bs4.PageElement, ofs: int) -> str:
    if isinstance(tag, bs4.element.Tag):
        done = False
        head = f'{INDENT*ofs}' + FMT_TOP.format(tag.name)
        if tag.attrs:
            done = True
            print(head)
            print(f'{INDENT*(ofs+1)}{tag.attrs},')
        if tag.children:
            for child in tag.children:
                if not done:
                    done = True
                    print(head)
                if isinstance(child, str):
                    child = child.strip()
                    if child:
                        print(f"{INDENT*(ofs+1)}'{child}',")
                parse(child, ofs + 1)
        if done:
            print(f'{INDENT*ofs}' + FMT_END)
        else:
            print(f'{INDENT*ofs}' + FMT_ALL.format(tag.name))

def html2vammp(src: str):
    soup = bs4.BeautifulSoup(src, 'html.parser')
    parse(soup, 0)

if __name__ == '__main__':
    src = sys.stdin.read()
    html2vammp(src)
```

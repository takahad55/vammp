# vammp

Build a DOM tree from view data defined in JavaScript. It can be used with Vue or React.

JavaScriptで定義したviewデータからDOMツリーを生成します。VueやReactで使うこともできます。

## Example

```js:vammpdemo.js
import vammp from 'https://unpkg.com/vammp/src/vammp.js'
const { div, button, mount,} = vammp

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

[jsfiddle](https://jsfiddle.net/1mpthLku/)

## Two formats

It supports two formats: function format and array format. They can be mixed.

関数フォーマット、配列フォーマットの２つのフォーマットをサポートしています（混在可能）。

### Function format

```js
tag([child?|props?, ...])
```

There are functions corresponding to all tags, and in Array format function calls represent element generation.
Properties are optional, can be multiple, and can be mixed with child elements.

全タグに対応する関数があり、関数フォーマットでは関数呼び出しがelement生成を表します。
プロパティは省略可能、複数可能で子要素と混在可能です。

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

配列フォーマットでは関数呼び出しの代わりにtag関数とその引数を一つの配列に入れます。

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

classとstyleは文字列とオブジェクトの２つの形式で指定できます。一つのelement指定の中で混在はできません。

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

プロパティや子要素を持つelementを、追加でプロパティや子要素指定可能なaliasとして定義できます。

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

getElementById()を使用しなくてもDOM Elementの参照を取得する方法をサポートしています。Refプロパティに空のobjectを、Nameプロパティに任意の名前を指定してください。mount後にref['name']にDOM Elementがセットされます。

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

setCreateElement()を使うとレンダー関数を切り替えられます。Vueの場合レンダー関数hをセットします。
viewの生成にはcreateView()を使用します。
コンポーネントはelement()を使ってvammpフォーマットで使用できるtag関数を生成する必要があります。

[demo](https://takahad55.github.io/vammp/example/vuetest/vuevammptest.html)

```js
import { createApp, ref, reactive, h, resolveComponent } from 'vue'

import vammp from 'vammp'
const { createView, element, collectArgs, button, div, input, label } = vammp

vammp.setCreateElement(h)

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

For React, set the render function React.createElement. Pass the parameter {reactMode: true}.

Reactの場合レンダー関数React.createElementをセットします。パラメータ{reactMode: true}を渡してください。

[demo](https://takahad55.github.io/vammp/example/reacttest/reactvammptest.html)

```js
const { useState, useEffect, useRef, createElement } = React

import vammp from 'vammp'
const {
  createView, element, collectArgs,
  button, div, input, label,
} = vammp

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

## All exports

```js
const {
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
    setStyle, setClass, getStyleObj, getClassObj,
} = vammp
```

### HTML to VAMMP format converter in Python

Reads HTML from standard input and outputs VAMMP format to standard output. `pip3 install beautifulsoup4` command is required.

標準入力からHTMLを読み込み標準出力へVAMMPフォーマットを出力します。

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

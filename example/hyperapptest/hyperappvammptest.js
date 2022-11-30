import { h, text as hyperapptext, app } from "https://unpkg.com/hyperapp"
import {
  setCreateElement, createView, rawNode,
  div, input, button, label,
} from '../../src/vammp.js'
//} from 'https://unpkg.com/vammp'

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

const addItem = (state) => ({
  ...state, newTodo: '',
  todoItems: state.todoItems.concat(
    {status: false, text: state.newTodo, key: ++keygen}
  ),
})

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

const { useState, useEffect, useRef, createElement } = React

import vammp from '../../src/vammp.js'
const {
  createView, element, collectArgs,
  button, div, input, label,
} = vammp
vammp.setCreateElement(createElement)

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
    props.todoItems.map((item, index) => [div, { key: item.key },
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
  return createView([
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

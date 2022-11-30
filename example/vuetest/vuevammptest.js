import {
  createApp, ref, reactive, h, resolveComponent,
} from 'https://unpkg.com/vue@next/dist/vue.esm-browser.prod.js'
import {
  setCreateElement, createView, element, collectArgs,
  button, div, input, label,
} from '../../src/vammp.js'
//} from 'https://unpkg.com/vammp'

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
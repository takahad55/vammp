import vammp from '../../src/vammp.js'
const { div, button, mount, br, select, option, collectArgs,
  setStyle, setClass, getStyleObj, getClassObj,
} = vammp

/*
<div>
  <button style="color: grey;">
    Cancel
  </button>
  <button style="background-color:">
    OK
  </button>
</div>
*/

const aa = 
['div', {}, [
  ['button', {style: "color: grey;"}, [
    'Cancel'
  ]],
  ['button', {style: "background-color: aqua;"}, [
    'OK'
  ]],
]]

const oa =
[{tag: 'div', props: {}, children: [
  {tag: button, props: {style: "color: grey;"}, children: [
    'Cancel'
  ]},
  {tag: button, props: {style: "background-color: aqua;"}, children: [
    'OK'
  ]},
]}]

/*
function div(props, children) {
  const obj = {
    tag: 'div',
    props: props,
    children: children,
  }
}
*/

function app0f() {
  const view = [
    div(
      button({style: 'color: grey;', onclick: () => console.log('app0f: cancel clicked')},
        'Cancel'
      ),
      button({style: 'background-color: aqua;', onclick: () => console.log('app0f: ok clicked')},
        'OK'
      ),
    )
  ]
  mount("#app", view)
}

function app1f() {
  const greyFont = {style: 'color: grey;'}
  const aquaBack = {style: 'background-color: aqua;'}
  const view = [
    div(
      button('Cancel', greyFont, {onclick: () => console.log('app1f: cancel clicked')}),
      button('OK', aquaBack, {onclick: () => console.log('app1f: ok clicked')}),
    )
  ]
  mount("#app", view)
}

function app2f() {
  const greyFont = {style: 'color: grey;'}
  const aquaBack = {style: 'background-color: aqua;'}
  const cancelButton = (...args) => button('Cancel', greyFont, ...args)
  const okButton = (...args) => button('OK', aquaBack, ...args)
  const view = [
    div(
      cancelButton({onclick: () => console.log('app2f: cancel clicked')}),
      okButton({onclick: () => console.log('app2f: ok clicked')}),
    )
  ]
  mount("#app", view)
}

/*
<div>
  <button style="color: grey; onclick="console.log('cancel clicked')">
    Cancel
  </button>
  <button style="background-color: aqua; onclick="console.log('ok clicked')">
    OK
  </button>
</div>
*/

function app0a() {
  const view = [
    [div,
      [button, {style: 'color: grey;', onclick: () => console.log('app0a: cancel clicked')},
        'Cancel'
      ],
      [button, {style: 'background-color: aqua;', onclick: () => console.log('app0a: ok clicked')},
        'OK'
      ],
    ]
  ]
  mount("#app", view)
}

function app2a() {
  const greyFont = {style: 'color: grey;'}
  const aquaBack = {style: 'background-color: aqua;'}
  const largeFont = {style: 'font-size: large;'}
  const cancelButton = (...args) => button('Cancel', greyFont, ...args)
  const okButton = (...args) => button('OK', aquaBack, ...args)
  const view = [
    [div,
      [cancelButton, {onclick: () => console.log('app2a: cancel clicked')}],
      [okButton, largeFont, {onclick: () => console.log('app2a: ok clicked')}],
    ]
  ]
  mount("#app", view)
}

function app3() {
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
      [cancelButton, { Ref: ref, Name: 'cancelButton', onclick: () => console.log('app3: cancel clicked') }],
      [okButton, largeFont, {onclick: () => console.log('app3: ok clicked')}],
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

/**/
app0f()
app1f()
app2f()
app0a()
app2a()
app3()
/**/
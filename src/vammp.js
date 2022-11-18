'use strict';
/**
 * Vammp
 * Copyright 2022 Takahashi Daishi
 * License: MIT
 */

// module globals
const glob = {
  version: '0.0.1',
  createNode: createNodeStandard,
  extCreateElement: undefined,
  createElementHasVargChild: undefined,
}

// set external createElement (export)
function setCreateElement(fn, param) {
  glob.extCreateElement = fn
  glob.createElementHasVargChild = param ? param.hasVargChild : false
  if (fn) {
    glob.createNode = createNodeExternal
  }
  else {
    glob.createNode = createNodeStandard
  }
}

// create node for standard dom
function createNodeStandard(tag, props, children) {
  const childList = []
  if (children && children.length) {
    for (let child of children) {
      const x = createItem(child)
      childList.push(x)
    }
  }
  const node = document.createElement(tag)
  if (Object.keys(props).length) {
    const { ref, name } = setProps(node, props)
    if (ref && name) {
      ref[name] = node
    }
  }
  if (childList.length > 0) {
    node.append(...childList)
  }
  return node
}

// create node for external createElement environment
function createNodeExternal(tag, props, children) {
  let childList = undefined
  if (children && children.length) {
    childList = []
    for (let child of children) {
      const v = createView(child)
      v.forEach(x => childList.push(x))
    }
  }
  excludeAliasProps(props) // exclude properties with initial capital letters
  if (glob.createElementHasVargChild) {
    const node = glob.extCreateElement(tag, props, ...childList)
    return node
  }
  const n = glob.extCreateElement(tag, props, childList)
  return n
}

// mount for standard dom
function mount(sel, view) {
  const root = document.querySelector(sel)
  if (!root) {
    console.error('not found: ' + sel)
    return
  }
  const nodes = createView(view)
  root.append(...nodes)
}

// merge property
function mergeProp(a, b) {
  if (!a) {
    return b
  }
  if (!b) {
    return a
  }
  if ((typeof a == 'string')&&(typeof b == 'string')) {
    const sep = a.length ? ' ' : ''
    return a + sep + b
  }
  else if (typeof a == 'object' && typeof b == 'object') {
    return {...a, ...b}
  }
  console.warn('mergeProp: different types are not supported')
  return a
}

// collect args to props and children (export)
function collectArgs(args) {
  if (!args) {
    return {props: {}, children: undefined}
  }
  const props = {}
  let children
  for (const arg of args) {
    if (!arg) {
      continue
    }
    if ((!Array.isArray(arg)) && (typeof arg == 'object') && !arg.tag) {
      const newClass = mergeProp(props.class, arg.class)
      const newStyle = mergeProp(props.style, arg.style)
      Object.assign(props, arg)
      if (newClass) {
        props.class = newClass
      }
      if (newStyle) {
        props.style = newStyle
      }
    }
    else {
      if (!children) {
        children = []
      }
      children.push(arg)
    }
  }
  return {props, children}
}

// create item
function createItem(item) {
  if (Array.isArray(item) && item.length) {
    const fn = item[0]
    if (typeof fn != 'function') {
      console.log('error: array[0] is not function')
      return
    }
    const r = fn.apply(undefined, item.slice(1))
    const node = createItem(r)
    return node
  } 
  if (!item.tag) {
    return item
  }
  const {props, children} = collectArgs(item.args)
  return glob.createNode(item.tag, props, children)
}

// create view
function createView(view) {
  if (typeof view == 'string' || !Array.isArray(view)) {
    return [createItem(view)]
  }
  if (view.length && typeof view[0] == 'function') {
    return [createItem(view)]
  }
  const items = []
  for (const item of view) {
    if (item === undefined) {
      continue
    }
    if (Array.isArray(item)&&(0 <item.length)&&Array.isArray(item[0])) {
      for (const itm of item) {
        items.push(createItem(itm))
      }
    }
    else {
      items.push(createItem(item))
    }    
  }
  return items
}

// set style to node
function setStyle(node, value) {
  if (value && typeof value == 'object') {
    // ex.{s0: v0, s1: v1}
    for (const [key, val] of Object.entries(value)) {
      node.style[key] = val
    }
  }
  else {
    node.style.cssText = value
  }
} 

// set class to node
function setClass(node, value) {
  if (typeof value == 'object') {
    // ex.{c0: true, c1: false, c2: true} => 'c0 c2'
    const s = Object.entries(value).filter(x => x[1]).map(x => x[0]).join(' ')
    node.className = s
  }
  else {
    node.className = value
  }
}

// exclude alias props
function excludeAliasProps(props) {
  if (!props) {
    return
  }
  const keys = Object.keys(props)
  for (const key of keys) {
    if (key[0].toUpperCase() == key[0]) {
      delete props[key]
    }
  }
  return props
}

// set properties
function setProps(node, props) {
  let ref, name
  for (const [key, value] of Object.entries(props)) {
    if (0 == key.indexOf('on')) {
      if (value) {
        node.addEventListener(key.slice(2), value)
      }
    }
    else if ('style' == key) {
      setStyle(node, value)
    }
    else if ('class' == key) {
      setClass(node, value)
    }
    else if (key[0].toUpperCase() == key[0]) {
      // alias prop
      if ('Name' == key) {
        name = value
      }
      else if ('Ref' == key) {
        ref = value
      }
      // others, used in alias
    }
    else {
      node[key] = value
    }
  }
  return { name, ref }
}

// get style object for node (export)
function getStyleObj(node) {
  if (!node) {
    return {}
  }
  const s = node.style.cssText
  if (!s) {
    return {}
  }
  const obj = {}
  const a = s.split(';').filter(x => x)
  const b = a.map(x => x.trim()).map(x => x.split(':').map(x => x.trim()))
  b.forEach(x => obj[x[0]] = x[1])
  return obj
}

// get class object for node (export)
function getClassObj(node) {
  if (!node) {
    return {}
  }
  const c = node.className
  if (!c) {
    return {}
  }
  const obj = {}
  c.split(' ').filter(x => x).forEach(x => obj[x] = true)
  return obj
}

// tag common
function element(tag, ...args) {
  const item = {
    tag: tag,
    args: args
  }
  return item
}

const tagNames = [
  'html', 'base', 'head', 'link', 'meta', 'style', 'title', 'body',
  'address', 'article', 'aside', 'footer', 'header',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'main', 'nav', 'section',
  'blockquote', 'dd', 'div', 'dl', 'dt', 'figcaption', 'figure', 'hr', 'li',
  'menu', 'ol', 'p', 'pre', 'ul',
  'a', 'abbr', 'b', 'bdi', 'bdo', 'br',
  'cite', 'code', 'data', 'dfn', 'em', 'i', 'kbd', 'mark', 'q', 'rp', 'rt',
  'ruby', 's', 'samp', 'small', 'span', 'strong', 'sub', 'sup', 'time', 'u',
  'var', 'wbr', 'area', 'audio', 'img', 'map', 'track', 'video',
  'embed', 'iframe', 'object', 'picture', 'portal', 'source',
  'svg', 'math', 'canvas', 'noscript', 'script', 'del', 'ins',
  'caption', 'col', 'colgroup', 'table', 'tbody', 'td', 'tfoot', 'th',
  'thead', 'tr',
  'button', 'datalist', 'fieldset', 'form', 'input', 'label', 'legend',
  'meter', 'optgroup', 'option', 'output', 'progress', 'select', 'textarea',
  'details', 'dialog', 'summary',
  'slot', 'template',
]

// exports
const vammp = {
  mount, createView, element, setCreateElement, collectArgs, 
  setStyle, setClass, getStyleObj, getClassObj,
}

// create and add tag functions to exports
tagNames.forEach(name =>
  vammp[name] = (...args) => element(name, ...args)
)

vammp.version = glob.version

export default vammp

/*
// one file test -------------------------------
const {
  html, base, head, link, meta, style, title, body,
  address, article, aside, footer, header,
  h1, h2, h3, h4, h5, h6, main, nav, section,
  blockquote, dd, div, dl, dt, figcaption, figure, hr, li,
  menu, ol, p, pre, ul, a, abbr, b, bdi, bdo, br,
  cite, code, data, dfn, em, i, kbd, mark, q, rp, rt,
  ruby, s, samp, small, span, strong, sub, sup, time, u,
  //var,
  wbr, area, audio, img, map, track, video,
  embed, iframe, object, picture, portal, source,
  svg, math, canvas, noscript, script, del, ins,
  caption, col, colgroup, table, tbody, td, tfoot, th,
  thead, tr,
  button, datalist, fieldset, form, input, label, legend,
  meter, optgroup, option, output, progress, select, textarea,
  details, dialog, summary,
  slot, template,
} = vammp

function _test() {
  const greyFont = {style: 'color: grey;'}
  const aquaBack = {style: 'background-color: aqua;'}
  const cancelButton = (...args) => button('Cancel', greyFont, , ...args)
  const saveButton = (...args) => button('Save', aquaBack, ...args)
  const view = [
    [div,
      [cancelButton, {onclick: () => console.log('app2a: cancel clicked')}],
      [saveButton, {onclick: () => console.log('app2a: save clicked')}],
    ]
  ]
  mount("#app", view)
}
_test()
*/
import test from 'node:test'
import assert from 'node:assert'

import {
  setCreateElement,
  createView, mount, element, collectArgs, getStyleObj, getClassObj,
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
  slot, template, vammp,
} from '../src/vammp.js'

const stubQuerySelectorNode = {
  sel: undefined,
  children: undefined,
  append: function(...args) {
    this.children = []
    args.forEach(x => this.children.push(x))
  }
}

const stubQuerySelector = (sel) => {
  stubQuerySelectorNode.sel = sel
  return stubQuerySelectorNode
}

const stubCreateElement = (tag) => {
  const obj = {
    tag: 'STUB' + tag,
    className: '',
    style: {
      cssText: '',
    },
    children: undefined,
    eventListeners: {},
    append: function(...args) {
      for (const node of args) {
        if (!node) {
          continue
        }
        if (!this.children) {
          this.children = []
        }
        this.children.push(node)
      }
    },
    addEventListener: function(event, fn) {
      if (!this.eventListeners[event]) {
        this.eventListeners[event] = new Set()
      }
      this.eventListeners[event].add(fn)
    }
  }
  return obj
}

const extCreateElement = (tag, props, children) => {
  const obj = {
    ...props,
    ...{
      tag: 'EXT' + tag,
      children: children,
    }
  }
  return obj
}

const s_e = assert.strictEqual
const d_e = assert.deepStrictEqual

global.document = {
  querySelector: stubQuerySelector,
  createElement: stubCreateElement,
}

let preTag = 'STUB'

for (const j of [0, 1]) {
  test(preTag + ' CeateElement createView 0 porps, 0 child', (t) => {
    t.test('test', () => {
      const view = [div]
      const nodes = createView(view)
      s_e(nodes.length, 1)
      s_e(nodes[0].tag, preTag + 'div')
      s_e(nodes[0].children, undefined)
    })
  })
  
  test(preTag + ' CreateElement createView 1 props, 0 child', (t) => {
    t.test('test', () => {
      const props = {value: 'VAL0'}
      const view = [div, props]
      const nodes = createView(view)
      s_e(nodes.length, 1)
      s_e(nodes[0].tag, preTag + 'div')
      s_e(nodes[0].value, props.value)
      s_e(nodes[0].children, undefined)
    })
  })
  
  test(preTag + ' CreateElement createView 2 props, 0 child', (t) => {
    t.test('test', () => {
      const props0 = {value0: 'VAL0'}
      const props1 = {value1: 'VAL1'}
      const view = [div, props0, props1]
      const nodes = createView(view)
      s_e(nodes.length, 1)
      s_e(nodes[0].tag, preTag + 'div')
      s_e(nodes[0].value0, props0.value0)
      s_e(nodes[0].value1, props1.value1)
      s_e(nodes[0].children, undefined)
    })
  })
  
  test(preTag + ' CreateElement createView 0 props, 1 text child', (t) => {
    t.test('test', () => {
      const view = [div, 'hello']
      const nodes = createView(view)
      s_e(nodes.length, 1)
      s_e(nodes[0].tag, preTag + 'div')
      d_e(nodes[0].children, ['hello'])
    })
  })  

  test(preTag + ' CreateElement createView 0 props, 2 text child', (t) => {
    t.test('test', () => {
      const view = [div, 'hello', 'world']
      const nodes = createView(view)
      s_e(nodes.length, 1)
      s_e(nodes[0].tag, preTag + 'div')
      d_e(nodes[0].children, ['hello', 'world'])
    })
  })  

  test(preTag + ' CreateElement createView 1 prop, 1 text child', (t) => {
    t.test('test', () => {
      const props = {value: 'VAL0'}
      const view = [div, props, 'hello']
      const nodes = createView(view)
      s_e(nodes.length, 1)
      s_e(nodes[0].tag, preTag + 'div')
      s_e(nodes[0].value, props.value)
      d_e(nodes[0].children, ['hello'])
    })
  })

  test(preTag + ' CreateElement createView has prop, has text child, rev', (t) => {
    t.test('test', () => {
      const props = {value: 'VAL0'}
      const view = [div, 'hello', props]
      const nodes = createView(view)
      s_e(nodes.length, 1)
      s_e(nodes[0].tag, preTag + 'div')
      s_e(nodes[0].value, props.value)
      d_e(nodes[0].children, ['hello'])
    })
  })

  test(preTag + ' CreateElement createView 1 prop, 2 text child', (t) => {
    t.test('test', () => {
      const props = {value: 'VAL0'}
      const view = [div, props, 'hello', 'world']
      const nodes = createView(view)
      s_e(nodes.length, 1)
      s_e(nodes[0].tag, preTag + 'div')
      s_e(nodes[0].value, props.value)
      d_e(nodes[0].children, ['hello', 'world'])
    })
  })

  test(preTag + ' CreateElement createView 1 prop, 2 text child, order1', (t) => {
    t.test('test', () => {
      const props = {value: 'VAL0'}
      const view = [div, 'hello', props, 'world']
      const nodes = createView(view)
      s_e(nodes.length, 1)
      s_e(nodes[0].tag, preTag + 'div')
      s_e(nodes[0].value, props.value)
      d_e(nodes[0].children, ['hello', 'world'])
    })
  })

  test(preTag + ' CreateElement createView 1 prop, 2 text child, order2', (t) => {
    t.test('test', () => {
      const props = {value: 'VAL0'}
      const view = [div, 'hello', 'world', props]
      const nodes = createView(view)
      s_e(nodes.length, 1)
      s_e(nodes[0].tag, preTag + 'div')
      s_e(nodes[0].value, props.value)
      d_e(nodes[0].children, ['hello', 'world'])
    })
  })

  test(preTag + ' CreateElement createView 2 props, 2 text child', (t) => {
    t.test('test', () => {
      const props0 = {value0: 'VAL0'}
      const props1 = {value1: 'VAL1'}
      const view = [div, 'hello', props0, 'world', props1]
      const nodes = createView(view)
      s_e(nodes.length, 1)
      s_e(nodes[0].tag, preTag + 'div')
      s_e(nodes[0].value0, props0.value0)
      s_e(nodes[0].value1, props1.value1)
      d_e(nodes[0].children, ['hello', 'world'])
    })
  })

  test(preTag + ' CreateElement createView 2 props, 2 text child, order2', (t) => {
    t.test('test', () => {
      const props0 = {value0: 'VAL0'}
      const props1 = {value1: 'VAL1'}
      const view = [div, props0, 'hello', props1, 'world']
      const nodes = createView(view)
      s_e(nodes.length, 1)
      s_e(nodes[0].tag, preTag + 'div')
      s_e(nodes[0].value0, props0.value0)
      s_e(nodes[0].value1, props1.value1)
      d_e(nodes[0].children, ['hello', 'world'])
    })
  })

  test(preTag + ' CreateElement createView 0 props, 1 node child', (t) => {
    t.test('test', () => {
      const view = [select, [option, 'sel0', {value: 0}]]
      const nodes = createView(view)
      s_e(nodes.length, 1)
      s_e(nodes[0].tag, preTag + 'select')
      s_e(nodes[0].children.length, 1)
      s_e(nodes[0].children[0].tag, preTag + 'option')
      s_e(nodes[0].children[0].value, 0)
      s_e(nodes[0].children[0].children.length, 1)
      s_e(nodes[0].children[0].children[0], 'sel0')
    })
  })  

  test(preTag + ' CreateElement createView 2 props, 2 node child', (t) => {
    t.test('test', () => {
      const props0 = {value0: 'VAL0'}
      const props1 = {value1: 'VAL1'}
      const view = [select,
        props0, props1,
        [option, 'sel0', {value: 0}],
        [option, 'sel1', {value: '001'}],
      ]
      const nodes = createView(view)
      s_e(nodes.length, 1)
      s_e(nodes[0].tag, preTag + 'select')
      s_e(nodes[0].value0, props0.value0)
      s_e(nodes[0].value1, props1.value1)
      s_e(nodes[0].children.length, 2)
      s_e(nodes[0].children[0].tag, preTag + 'option')
      s_e(nodes[0].children[0].value, 0)
      s_e(nodes[0].children[0].children.length, 1)
      s_e(nodes[0].children[0].children[0], 'sel0')
      s_e(nodes[0].children[1].tag, preTag + 'option')
      s_e(nodes[0].children[1].value, '001')
      s_e(nodes[0].children[1].children.length, 1)
      s_e(nodes[0].children[1].children[0], 'sel1')
    })
  })  

  test(preTag + ' CreateElement createView 2 props, 2 node child, change order', (t) => {
    t.test('test', () => {
      const props0 = {value0: 'VAL0'}
      const props1 = {value1: 'VAL1'}
      const view = [select,
        [option, 'sel0', {value: 0}],
        props0, props1,
        [option, 'sel1', {value: '001'}],
      ]
      const nodes = createView(view)
      s_e(nodes.length, 1)
      s_e(nodes[0].tag, preTag + 'select')
      s_e(nodes[0].value0, props0.value0)
      s_e(nodes[0].value1, props1.value1)
      s_e(nodes[0].children.length, 2)
      s_e(nodes[0].children[0].tag, preTag + 'option')
      s_e(nodes[0].children[0].value, 0)
      s_e(nodes[0].children[0].children.length, 1)
      s_e(nodes[0].children[0].children[0], 'sel0')
      s_e(nodes[0].children[1].tag, preTag + 'option')
      s_e(nodes[0].children[1].value, '001')
      s_e(nodes[0].children[1].children.length, 1)
      s_e(nodes[0].children[1].children[0], 'sel1')
    })
  })  

  test(preTag + ' CreateElement createView multiple', (t) => {
    t.test('test', () => {
      const props0 = {value0: 'VAL0'}
      const props1 = {value1: 'VAL1'}
      const view = [
        [select, props0, props1,
          [option, 'sel0', {value: 0}],
          [option, 'sel1', {value: '001'}],
        ],
        [div, 'hello'],
      ]
      const nodes = createView(view)
      s_e(nodes.length, 2)
      s_e(nodes[0].tag, preTag + 'select')
      s_e(nodes[0].value0, props0.value0)
      s_e(nodes[0].value1, props1.value1)
      s_e(nodes[0].children.length, 2)
      s_e(nodes[0].children[0].tag, preTag + 'option')
      s_e(nodes[0].children[0].value, 0)
      s_e(nodes[0].children[0].children.length, 1)
      s_e(nodes[0].children[0].children[0], 'sel0')
      s_e(nodes[0].children[1].tag, preTag + 'option')
      s_e(nodes[0].children[1].value, '001')
      s_e(nodes[0].children[1].children.length, 1)
      s_e(nodes[0].children[1].children[0], 'sel1')
      s_e(nodes[1].tag, preTag + 'div')
      s_e(nodes[1].children.length, 1)
      d_e(nodes[1].children, ['hello'])
    })
  })  

  // change to extCreateElement test
  setCreateElement(extCreateElement)
  preTag = 'EXT'
}

// change to standardCreateElement test
setCreateElement()
preTag = 'STUB'

test('mount', (t) => {
  t.test('test', () => {
    const props0 = {value0: 'VAL0'}
    const props1 = {value1: 'VAL1'}
    const view = [
      [select, props0, props1,
        [option, 'sel0', {value: 0}],
        [option, 'sel1', {value: '001'}],
      ],
      [div, 'hello'],
    ]
    const nodes = createView(view)
    mount('#app', view)
    s_e(stubQuerySelectorNode.sel, '#app')
    s_e(stubQuerySelectorNode.children.length, nodes.length)
    for (let j = 0; j < nodes.length; j++) {
      s_e(stubQuerySelectorNode.children[j].tag, nodes[j].tag)
      s_e(stubQuerySelectorNode.children[j].value0, nodes[j].value0)
      s_e(stubQuerySelectorNode.children[j].value1, nodes[j].value1)
      s_e(stubQuerySelectorNode.children[j].children.length, nodes[j].children.length)
      for (let k = 0; k < nodes[j].children.length; k++) {
        s_e(stubQuerySelectorNode.children[j].children[k].tag, nodes[j].children[k].tag)
      }
    }
  })
})

test('func style', (t) => {
  t.test('test', () => {
    const props0 = {value0: 'VAL0'}
    const props1 = {value1: 'VAL1'}
    const aview = [
      [select, props0, props1,
        [option, 'sel0', {value: 0}],
        [option, 'sel1', {value: '001'}],
      ],
      [div, 'hello'],
    ]
    const fview = [
      select(props0, props1,
        option('sel0', {value: 0}),
        option('sel1', {value: '001'}),
      ),
      div('hello'),
    ]
    const anodes = createView(aview)
    const fnodes = createView(fview)
    s_e(anodes.length, fnodes.length)
    for (let j = 0; j < anodes.length; j++) {
      s_e(anodes[j].tag, fnodes[j].tag)
      s_e(anodes[j].value0, fnodes[j].value0)
      s_e(anodes[j].value1, fnodes[j].value1)
      s_e(anodes[j].children.length, fnodes[j].children.length)
      for (let k = 0; k < anodes[j].children.length; k++) {
        s_e(anodes[j].children[k].tag, fnodes[j].children[k].tag)
      }
    }
  })
})

test('class 1 string', (t) => {
  t.test('test', () => {
    const view = [
      [div, {class: 'test-class'}, 'hello'],
    ]
    const nodes = createView(view)
    s_e(nodes.length, 1)
    s_e(nodes[0].tag, preTag + 'div')
    s_e(nodes[0].className, 'test-class')
  })
})

test('class 2 string', (t) => {
  t.test('test', () => {
    const view = [
      [div, 'hello', {class: 'test0'}, {class: 'test1'}, ],
    ]
    const nodes = createView(view)
    s_e(nodes.length, 1)
    s_e(nodes[0].tag, preTag + 'div')
    s_e(nodes[0].className, 'test0 test1')
  })
})

test('class 1 object', (t) => {
  t.test('test', () => {
    const view = [
      [div, 'hello', {class: {test0: true, test1: false, test2: true}}],
    ]
    const nodes = createView(view)
    s_e(nodes.length, 1)
    s_e(nodes[0].tag, preTag + 'div')
    s_e(nodes[0].className, 'test0 test2')
  })
})

test('class 2 object', (t) => {
  t.test('test', () => {
    const view = [
      [div, 'hello',
        {class: {test0: true, test1: false, test2: true}},
        {class: {testA: false, testB: true, testC: true}},
      ],
    ]
    const nodes = createView(view)
    s_e(nodes.length, 1)
    s_e(nodes[0].tag, preTag + 'div')
    s_e(nodes[0].className, 'test0 test2 testB testC')
  })
})

test('style 1 string', (t) => {
  t.test('test', () => {
    const view = [
      [div, {style: 'font-size: large;'}, 'hello'],
    ]
    const nodes = createView(view)
    s_e(nodes.length, 1)
    s_e(nodes[0].tag, preTag + 'div')
    s_e(nodes[0].style.cssText, 'font-size: large;')
  })
})

test('style 2 string', (t) => {
  t.test('test', () => {
    const view = [
      [div, {style: 'font-size: large;'}, 'hello', {style: 'color: grey;'}],
    ]
    const nodes = createView(view)
    s_e(nodes.length, 1)
    s_e(nodes[0].tag, preTag + 'div')
    s_e(nodes[0].style.cssText, 'font-size: large; color: grey;')
  })
})

test('style 2 object', (t) => {
  t.test('test', () => {
    const view = [
      [div, 'hello',
        {style: {'font-size': 'large'}},
        {style: {'color': 'grey'}},
      ],
    ]
    const nodes = createView(view)
    s_e(nodes.length, 1)
    s_e(nodes[0].tag, preTag + 'div')
    s_e(nodes[0].style['font-size'], 'large')
    s_e(nodes[0].style['color'], 'grey')
  })
})

test('getClassObj', (t) => {
  t.test('test', () => {
    const ref = {}
    const view = [
      [div, 'hello', 
        { class: 'test0' },
        { class: 'test1' },
        { Ref: ref, Name: 'elm'},
      ],
    ]
    const nodes = createView(view)
    s_e(nodes.length, 1)
    s_e(ref.elm != undefined, true)
    const obj = getClassObj(ref.elm)
    d_e(obj, {test0: true, test1: true})
  })
})

test('getStyleObj', (t) => {
  t.test('test', () => {
    const ref = {}
    const view = [
      [div, 'hello',
        { style: 'font-size: large;' },
        { style: 'color: grey;' },
        { Ref: ref, Name: 'elm'}
      ],
    ]
    const nodes = createView(view)
    s_e(ref.elm != undefined, true)
    const obj = getStyleObj(ref.elm)
    d_e(obj, {'font-size': 'large', color: 'grey'})
  })
})

test('collectArgs', (t) => {
  t.test('test', () => {
    const mySelect = (...args) => {
      const { props } = collectArgs(args)
      return [select,
        ...props.Options.map(x => [option, x[0], { value: x[1], selected: x[2] }]),
        ...args
      ]
    }
    const view = [
      [mySelect,
        { style: {'font-size': 'large'}},
        { Options: [['select1', 'p1'], ['select2', 'p2'], ['select3', 'p3', 1],] },
        { class: 'my-select' },
      ],
    ]
    const nodes = createView(view)
    s_e(nodes.length, 1)
    s_e(nodes[0].tag, preTag + 'select')
    s_e(nodes[0].style['font-size'], 'large')
    s_e(nodes[0].className, 'my-select')
    s_e(nodes[0].children.length, 3)
    s_e(nodes[0].children[0].tag, preTag + 'option')
    s_e(nodes[0].children[0].value, 'p1')
    s_e(nodes[0].children[0].selected, undefined)
    d_e(nodes[0].children[0].children, ['select1'])
    s_e(nodes[0].children[1].tag, preTag + 'option')
    s_e(nodes[0].children[1].value, 'p2')
    s_e(nodes[0].children[1].selected, undefined)
    d_e(nodes[0].children[1].children, ['select2'])
    s_e(nodes[0].children[2].tag, preTag + 'option')
    s_e(nodes[0].children[2].value, 'p3')
    s_e(nodes[0].children[2].selected, 1)
    d_e(nodes[0].children[2].children, ['select3'])
  })
})

test('all tags', (t) => {
  t.test('test', () => {
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
    const view = [
      html(), base(), head(), link(), meta(), style(), title(), body(),
      address(), article(), aside(), footer(), header(),
      h1(), h2(), h3(), h4(), h5(), h6(), main(), nav(), section(),
      blockquote(), dd(), div(), dl(), dt(), figcaption(), figure(), hr(), li(),
      menu(), ol(), p(), pre(), ul(), a(), abbr(), b(), bdi(), bdo(), br(),
      cite(), code(), data(), dfn(), em(), i(), kbd(), mark(), q(), rp(), rt(),
      ruby(), s(), samp(), small(), span(), strong(), sub(), sup(), time(), u(),
      vammp.var(),
      wbr(), area(), audio(), img(), map(), track(), video(),
      embed(), iframe(), object(), picture(), portal(), source(),
      svg(), math(), canvas(), noscript(), script(), del(), ins(),
      caption(), col(), colgroup(), table(), tbody(), td(), tfoot(), th(),
      thead(), tr(),
      button(), datalist(), fieldset(), form(), input(), label(), legend(),
      meter(), optgroup(), option(), output(), progress(), select(), textarea(),
      details(), dialog(), summary(),
      slot(), template(),
    ]
    const nodes = createView(view)
    s_e(nodes.length, tagNames.length)
    for (let j = 0; j < nodes.length; j++) {
      s_e(nodes[j].tag, preTag + tagNames[j])
    }
  })
})

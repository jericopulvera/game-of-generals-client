module.exports = {
  "extends": [
    "wesbos"
  ],
  rules: {
    'no-unused-vars': 0,
    'import/no-unresolved': 0,
    'react/button-has-type': 0,
    'react/prop-types': 0,    // enable this later
    'no-shadow': 0,
    'jsx-a11y/label-has-associated-control': 0,
    'jsx-a11y/label-has-for': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'react/display-name': 0,
    'react/destructuring-assignment': 0,
    'no-param-reassign': 0,
    'no-restricted-globals': 0
  },
  // env: {
  //   es6: true,
  //   node: true
  // },
  globals: {
    alert: true,
    screen: true
  }
}

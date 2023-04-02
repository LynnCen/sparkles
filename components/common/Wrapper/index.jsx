import { cloneElement } from 'react'

export default ({ element = <div />, children }) => {
  const styles = element.props.style

  return cloneElement(element, {
    style: Object.assign({}, styles, {
      maxWidth: '1100px',
      marginLeft: 'auto',
      marginRight: 'auto',
    }),
    children,
  })
}

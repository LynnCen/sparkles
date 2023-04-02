const css = require("../styles/scss/modal.scss");

export const LabelItem = ({text,children}) => {
  return <div className={css['label-item']}>
    <label className={css['label-item-label']}>{text}</label>
    {children}
  </div>
};

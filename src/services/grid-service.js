import { Fragment } from 'react';

const gridTypesConfig = [{
  textVal: 'Categories by type',
  val: 'CATEGORY'
}, {
  textVal: 'All Categories',
  val: 'ALL'
}, {
  textVal: 'App Preview',
  val: 'APP'
}]

export const renderGridTypes = function renderGridTypes(gridTypesConfig, type, setGridType) {
  return gridTypesConfig.map(config => {
    const configId = `grid-type-option-${config.val.toLowerCase()}`;
    return <Fragment key={`input-${configId}`}>
      <input type="radio" id={configId} className="btn-check" name="grid-type" autoComplete="off" />
      <label className={`btn btn-${type === config.val ? '' : `outline-`}primary`} htmlFor={configId} onClick={() => setGridType(config.val)}>{config.textVal}</label>
    </Fragment>
  })
}.bind(null, gridTypesConfig);

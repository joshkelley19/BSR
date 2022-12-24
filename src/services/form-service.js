export const setValue = (setFunction, event) => {
  setFunction(event.target.value);
}


export const renderOptions = (options, upper, label) => {
  const optionsList = options.map((val, index) => {
    return (<option key={index} value={upper ? val.toUpperCase() : val}>{val}</option>);
  });
  optionsList.unshift((<option id="select-placeholder" key="select-placeholder"> {label} </option>
  ))
  return optionsList;
}
// import React from "react"; 
// import { Grid } from "gridjs";
// import "gridjs/dist/theme/mermaid.css";
// const { useRef } = React;

console.log('use ref', useRef);
export function HoroscopeGrid(props) {
  const wrapperRef = React.useRef(null);

  const grid = new gridjs.Grid({
    columns: ['name', 'date']/* props.columns */,
    data: [['Josh', 'today']]/* props.values */
  });

  React.useEffect(() => {
    if (props.values.length) {
      grid.updateConfig({
        search: true,
        columns: props.columns,
        data: props.values
      }).forceRender();
    } else {
      grid.render(wrapperRef.current);
    }
  });

  return <div id="grid-wrapper-el" ref={wrapperRef} />;
};

// export default HoroscopeGrid;
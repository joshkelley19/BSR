// import React from "react"; 
// import { Grid } from "gridjs";
// import "gridjs/dist/theme/mermaid.css";
// const { useRef } = React;

console.log('use ref', useRef);
export function HoroscopeGrid(props) {
  const wrapperRef = React.useRef(null);


  React.useEffect(() => {
    const grid = new gridjs.Grid({
      columns: ['name', 'date']/* props.columns */,
      data: [['Josh', 'today']]/* props.values */
    });
    console.log('new grid props', props);
    grid.render(wrapperRef.current);
  }, []);

  if(props.values.length) {
    grid.updateConfig({
      search: true,
      columns: props.columns,
      data: props.values
    }).forceRender();
  }

  return <div id="grid-wrapper-el" ref={wrapperRef} />;
};

// export default HoroscopeGrid;
// import React from "react"; 
// import { Grid } from "gridjs";
// import "gridjs/dist/theme/mermaid.css";
// const { useRef } = React;

console.log('use ref', useRef);
export function HoroscopeGrid (props) {
  const wrapperRef = React.useRef(null);

  const grid = new gridjs.Grid({
    columns: props.columns,
    data: props.values
  });
  
  React.useEffect(() => {
    grid.render(wrapperRef.current);
  });
  
  return <div ref={wrapperRef} />;
};

// export default HoroscopeGrid;
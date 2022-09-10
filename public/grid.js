// import React from "react"; 
// import { Grid } from "gridjs";
// import "gridjs/dist/theme/mermaid.css";

export function HoroscopeGrid (props) {
  const wrapperRef = useRef(null);

  const grid = new Grid({
    columns: props.columns,
    data: props.values
  });
  
  useEffect(() => {
    grid.render(wrapperRef.current);
  });
  
  return <div ref={wrapperRef} />;
};

// export default HoroscopeGrid;
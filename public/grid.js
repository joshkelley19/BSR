
export function HoroscopeGrid(props) {
  const wrapperRef = React.useRef(null);
  const [grid, setGrid] = useState(new gridjs.Grid({
    columns: ['name', 'date']/* props.columns */,
    data: [['Josh', 'today']]/* props.values */,
    sort: true
  }));

  React.useEffect(() => {
    console.log('new grid props', props, grid);
    grid.render(wrapperRef.current);
  }, []);

  if (props.values.length) {
    console.log('forcing render', props, grid);
    grid.updateConfig({
      search: true,
      columns: props.columns,
      data: props.values
    }).forceRender();
  }

  return <div id="grid-wrapper-el" ref={wrapperRef} />;
};

// export default HoroscopeGrid;
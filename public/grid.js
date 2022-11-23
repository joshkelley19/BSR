
function createGridConfig(columns, data, blacklist = [], customMappers = {}, selectionFunc = null) {
  // TODO add date formatters
  const mappedColumns = columns.filter(c => !blacklist.includes(c)).map(c => Object.assign({}, {
    id: c,
    name: c,
    sort: true
  },
    !!customMappers[c] && { data: customMappers[c] }));

  mappedColumns.unshift({
    id: 'select',
    name: 'select',
    formatter: (cell, row, column) => gridjs.h('button', {
      className: 'btn btn-primary my-2',
      onClick: () => {
        row = row.toArray();
        selectionFunc(Object.assign({}, {type: row[1], sign: row[2], endDate: row[4]}))
      }
    }, 'Select')
  })
  return {
    columns: mappedColumns,
    data,
    search: true
  }
}

function getCustomMappers() {
  return {
    postings: (category) => {
      return category.postings[0].description;
    }
  }
}

export function HoroscopeGrid({ columns, values, blacklist, setCategory }) {
  const wrapperRef = React.useRef(null);
  const [grid, setGrid] = useState(new gridjs.Grid({
    columns: [],
    data: [[]]
  }));

  React.useEffect(() => {
    grid.render(wrapperRef.current);
  }, []);

  React.useEffect(() => {
    console.log('new grid props', columns, values, grid);
    const config = createGridConfig(columns, values, blacklist, getCustomMappers(), setCategory);
    grid.updateConfig(config).forceRender();
  }, [values, columns]);

  return <div id="grid-wrapper-el" ref={wrapperRef} />;
};

// export default HoroscopeGrid;
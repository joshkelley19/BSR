
function createGridConfig(columns, data, blacklist = [], whitelist = [], customMappers = {}, selectionFunc = null) {
  // TODO add date formatters
  const mappedColumns = columns.filter(c => !blacklist.includes(c)).concat(whitelist).map(c => Object.assign({}, {
    id: c,
    name: c,
    sort: true,
    formatter: (cell, row, column) => column.name == 'postings' ? gridjs.html(`<div class="overflow-scroll grid-cell">${cell}</div?`) : cell
  },
    !!customMappers[c] && { data: customMappers[c] }));

  mappedColumns.unshift({
    id: 'select',
    name: 'select',
    formatter: (cell, row, column) => gridjs.h('button', {
      className: 'btn btn-primary my-2',
      onClick: () => {
        row = row.toArray();
        selectionFunc(Object.assign({}, { type: row[1], sign: row[2], endDate: row[4], interval: row[6] }))
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
    postings: (category) => category.postings[0].description,
    // TODO remove when all db entries have converted to not use null
    interval: (category) => category.postings[0].increment || 'NONE'
  }
}

export function HoroscopeGrid({ columns, values, blacklist, whitelist, setCategory }) {
  const wrapperRef = React.useRef(null);
  const [grid, setGrid] = useState(new gridjs.Grid({
    columns: [],
    data: [[]],
    className: {
      td: 'overflow-scroll'
    }
  }));

  React.useEffect(() => {
    grid.render(wrapperRef.current);
  }, []);

  React.useEffect(() => {
    console.log('new grid props', columns, values, grid);
    const config = createGridConfig(columns, values, blacklist, whitelist, getCustomMappers(), setCategory);
    grid.updateConfig(config).forceRender();
  }, [values, columns]);

  return <div id="grid-wrapper-el" ref={wrapperRef} />;
};

// export default HoroscopeGrid;
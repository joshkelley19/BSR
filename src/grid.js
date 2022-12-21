import React, { useState, useEffect } from 'react';
import { Grid } from 'gridjs-react';
import { h, html } from 'gridjs';
import 'gridjs/dist/theme/mermaid.css';
import './grid.css';

function createGridConfig(columns, data, blacklist = [], whitelist = [], customMappers = {}, selectionFunc = null) {
  // TODO add date formatters
  const mappedColumns = columns.filter(c => !blacklist.includes(c)).concat(whitelist).map(c => Object.assign({}, {
    id: c,
    name: c,
    sort: true,
    formatter: (cell, row, column) => column.name == 'postings' ? html(`<div class="overflow-scroll grid-cell">${cell}</div?`) : cell
  },
    !!customMappers[c] && { data: customMappers[c] }));

  mappedColumns.unshift({
    id: 'select',
    name: 'select',
    formatter: (cell, row, column) => h('button', {
      className: 'btn btn-primary my-2',
      onClick: () => {
        row = row.toArray();
        selectionFunc(Object.assign({}, { type: row[1], sign: row[2], endDate: row[4], interval: row[6] }))
      }
    }, 'Select')
  })
  return {
    columns: mappedColumns,
    data
  }
}

function getCustomMappers() {
  return {
    postings: (category) => category.postings[0].description,
    // TODO remove when all db entries have converted to not use null
    interval: (category) => category.postings[0].increment || 'NONE'
  }
}

export const HoroscopeGrid = ({ columns, values, blacklist, whitelist, setCategory }) => {
  const [processedValues, setProcessValues] = useState([]);
  const [processedColumns, setProcessedColumns] = useState([[]]);

  useEffect(() => {
    const { columns: c, data: d } = createGridConfig(columns, values, blacklist, whitelist, getCustomMappers(), setCategory);
    setProcessedColumns(c);
    setProcessValues(d);
  }, [values, columns]);

  return (
    <div>
      <Grid
        data={processedValues}
        columns={processedColumns}
        pagination={{
          limit: 20,
        }}
        className={{
          td: 'overflow-scroll'
        }}
        search={true} />
    </div>
  )
};

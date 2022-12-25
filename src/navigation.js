import React from 'react'

const tabIsActive = (activeTab, tabName) => {
  return activeTab === tabName;
}

const renderNavigationTabs = (props) => {
  return <ul className="nav nav-tabs">
    {props.tabConfig.map(tab =>
      <li className="nav-item">
        <button className={`nav-link${tabIsActive(props.activeTab, tab.id) ? ' active' : ''}`} onClick={() => { props.setActiveTab(tab.id) }}>{tab.name}</button>
      </li>)}
  </ul>
}

const Navigation = (props) => {
  return (
    <div className="m-2">
      {renderNavigationTabs(props)}
    </div>
  )
}

export default Navigation;
import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { ConfigProvider, App } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import AppComponent from './App'
import './App.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN}>
      <App>
        <HashRouter>
          <AppComponent />
        </HashRouter>
      </App>
    </ConfigProvider>
  </React.StrictMode>,
)

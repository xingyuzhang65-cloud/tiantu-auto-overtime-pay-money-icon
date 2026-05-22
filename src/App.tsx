import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './components/Layout'
import ServiceList from './pages/Service'
import WaybillList from './pages/Waybill'
import SystemPage from './pages/System'
import QuoteMaintainPage from './pages/QuoteMaintain'

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/service" replace />} />
        <Route path="service" element={<ServiceList />} />
        <Route path="quote-maintain" element={<QuoteMaintainPage />} />
        <Route path="waybill" element={<WaybillList />} />
        <Route path="system" element={<SystemPage />} />
      </Route>
    </Routes>
  )
}

export default App

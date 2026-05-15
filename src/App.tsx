import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './components/Layout'
import ServiceList from './pages/Service'
import WaybillList from './pages/Waybill'

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/service" replace />} />
        <Route path="service" element={<ServiceList />} />
        <Route path="waybill" element={<WaybillList />} />
      </Route>
    </Routes>
  )
}

export default App

import './App.css'
import {AuthProvider} from "@/providers/AuthProvider.tsx";
import AppRoutes from "@/routes/AppRoutes.tsx";
import {RouterProvider} from 'react-router-dom'

function App() {

  return <AuthProvider>
      <RouterProvider router={AppRoutes} />
  </AuthProvider>
}

export default App

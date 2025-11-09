import './App.css'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {RouterProvider} from "react-router-dom"
import {Route} from "@/router/Route.tsx";

function App() {

    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 5_000
            }
        }
    })

  return (
      <QueryClientProvider client={queryClient}>
          <RouterProvider router={Route}></RouterProvider>
      </QueryClientProvider>
  )
}

export default App

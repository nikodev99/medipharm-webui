import {createBrowserRouter} from "react-router-dom";
import {Button} from "@/components/ui/button.tsx";

export const Route = createBrowserRouter([
    {
        path: "/",
        element: <div className='flex min-h-svh flex-col items-center justify-center'>
            <Button variant="default">Default</Button>
        </div>
    }
]);
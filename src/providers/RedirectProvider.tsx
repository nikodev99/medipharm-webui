import {createContext, type FC, type ReactNode, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {type RedirectFunction, setNavigate} from "../context/RedirectContext.ts";

const NavigationContext = createContext<RedirectFunction | undefined>(() => {})

const RedirectProvider: FC<{ children: ReactNode }> = ({ children }) => {

    const navigate = useNavigate()

    useEffect(() => {
        setNavigate(navigate)
    }, [navigate]);

    return(
        <NavigationContext.Provider value={undefined}>
            {children}
        </NavigationContext.Provider>
    )
}

export default RedirectProvider
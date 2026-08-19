import {createContext, useContext, useState, type ReactNode} from "react"
import type {User} from "../types/user"
interface AuthContextType {
    user :User | null;
    userId:string | null;
    login : (user:User) => void;
    logout: () => void;

}
const AuthContext = createContext<AuthContextType | undefined>(undefined)
interface AuthProvderProps{
    children:ReactNode
}
export default function AuthProvider({children}:AuthProvderProps){
    const [user,setUser] = useState<User | null>(()=> {
        const savedUser = localStorage.getItem("user")
        return savedUser ? JSON.parse(savedUser) : null
        })
    const login = (user:User) =>{
        setUser(user)
        localStorage.setItem("user",JSON.stringify(user))

    }
    const logout = () => {
        setUser(null)
        localStorage.removeItem("user")
    } 
    return(
        <AuthContext.Provider 
        value={ { user,
            userId: user? user._id :null,
            login,
            logout

        }}>
            {children}
        </AuthContext.Provider>
    )
}
export function useAuth() {

    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
}
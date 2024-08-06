import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import { loginAction } from "../components/Login/Login";

//import layouts
import RootLayout from "../Layouts/RootLayout";

//import pages
import Home from "../components/Home/Home";
import About from "../components/About/About"
//import css
import './router.css'
import login_registerAction from "../components/Login";
const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element ={<RootLayout/>} action={login_registerAction} >
            <Route index element={<Home/>}/>
            {/* <Route path='/register' action={registerAction}/> */}
            
            
            <Route path='about' element={<About />}/>
        </Route>
    )

)
export default router
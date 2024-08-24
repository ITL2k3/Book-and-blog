import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import { loginAction } from "../components/Login/Login";

//import layouts
import RootLayout from "../Layouts/RootLayout";

//import pages
import Home from "../components/Home/Home";
import About from "../components/About/About"


//import action
import login_registerAction from "../components/Login";
import Insert, { insertAction } from "../components/insert/insert";


//import css
import './router.css'
import Detail from "../components/detail/Detail";


const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element ={<RootLayout/>} action={login_registerAction} >
            <Route index element={<Home/>}/>
            <Route path='detail/:query' element={<Detail/>}/>
            <Route path='about' element={<About />}/>
            <Route path='insert-book' element={<Insert/>} action={insertAction}/>
        </Route>
    )

)
export default router
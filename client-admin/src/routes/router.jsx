import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import Login, { loginAction } from "../components/Login/Login";

//import layouts
import RootLayout from "../Layouts/RootLayout";

//import pages
import Home from "../components/Home/Home";
import About from "../components/About/About"
import Read from "../components/detail/read/index";
//import action
import login_registerAction, { Login_registerElement } from "../components/Login";
import Insert, { insertAction } from "../components/insert/insert";

//import error handler
import ErrorBoundary from "../ErrorRouter";



//import css
import './router.css'
import Detail from "../components/detail/Detail";
import UpdateBook, { updateAction } from "../components/UpdateBook/UpdateBook";
import Storage from "../components/storage";
import ChatPDF from "../components/chatPDF";
import ManageUser from "../components/ManageUser";
import DashBoardIndex from "../components/dashboard";


const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element ={<RootLayout/>}  >
            <Route index element={<Home/>}/>
            <Route path='manage-user' element={<ManageUser/>}/>
            <Route path='dashboard' element={<DashBoardIndex/>}/>
            <Route path='access' element={<Login_registerElement/>} action={login_registerAction}/>
            <Route path='detail/:query' element={<Detail/>} errorElement={<ErrorBoundary/>}/>
            <Route path='read/:query' element={<Read/>}/>
            <Route path='about' element={<About />}/>
            <Route path='storage' element={<Storage/>} action={updateAction}/>
            <Route path='insert-book' element={<Insert/>} action={insertAction}/>
           
            <Route path='chatPDF' element={<ChatPDF/>}/>
        </Route>
    )

)
export default router
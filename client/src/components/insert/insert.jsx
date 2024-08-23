import Login from '../Login/Login'
import { useEffect, useRef, useState } from 'react'
import { Form, NavLink, Outlet, useActionData } from 'react-router-dom'
import checkAuth from '../../Auth/checkAuth'


export default function Insert() {
    const actionData = useActionData()
    console.log('ad: ', actionData);
    const [isValid, setValid] = useState(null)
    const [data, setData] = useState(null)
    useEffect(() => {

        checkAuth('http://localhost:3055/v1/api/').then((res) => {
            if (res == false) {
                setValid(false)
            } else {
                setValid(true)
                setData(res)
            }
        })
    }, [])
    if (isValid == null) {
        <p>Loading...</p>

    } else {
        if (isValid) {
            return (
                <div className='insert'>
                    <h3>Thêm sách </h3>
                    <Form method='post' action="/insert-book" encType='multipart/form-data'>
                        <label>
                            <span>Tiêu đề</span>
                            <input type='text' name='title' required />
                        </label>
                        <br />
                        <label>
                            <span>Tác giả</span>
                            <input type='text' name='author' required />
                        </label>
                        <div>
                            <span>Thể loại: </span><br />
                            <input type='checkbox' name='categories01' value = 'kns' id= 'category01' />
                            <label for='category01'>Kỹ năng sống</label> <br />
                            <input type='checkbox' name='categories02' value = 'kt' id= 'category02' />
                            <label for='category02'>Kinh tế</label> <br />
                            <input type='checkbox' name='categories03' value = 'tc' id= 'category03' />
                            <label for='category03'>Tài chính</label> <br />
                            <input type='checkbox' name='categories04' value = 'cn' id= 'category04' />
                            <label for='category04'>Công nghệ</label> <br />
                            <input type='checkbox' name='categories05' value = 'nn' id= 'category05' />
                            <label for='category05'>Ngoại ngữ</label> <br />
                            <input type='checkbox' name='categories06' value = 'gt' id= 'category06' />
                            <label for='category06'>Đề cương</label> <br />
                            <input type='checkbox' name='categories07' value = 'dc' id= 'category07' />
                            <label for='category07'>Giáo trình</label> <br />
                        </div>
                        
                        <br />
                        <label>
                            <span>Mô tả</span>
                            <input type='text' name='description' />
                        </label>
                        <br />
                        <label>
                            <span>Ảnh</span>
                            <input type='file' name='thumbnail'  />
                        </label>
                        <br />
                        <label>
                            <span>File sách: </span>
                            <input type='file' accept=".pdf" name='pdf' required />
                        </label>
                        <br />

                        <button>upload</button>
                        
                        {actionData && actionData.error  &&<p>{actionData.error}</p>}
                        {actionData && actionData.success && <p>{actionData.success}, tải lại trang sau 2s </p> }
                    </Form>


                </div>
            )



        } else {
            // return <p>Loading...</p>
            return <Login />
        }
    }

}

export const insertAction = async ({request}) => {
    const formData = await request.formData()
  

    //append formdata
    const payload = new FormData()
    payload.append("title",formData.get('title') )
    payload.append("author", formData.get('author'))
    payload.append("kns", formData.get('categories01'))
    payload.append("kt", formData.get('categories02'))
    payload.append("tc", formData.get('categories03'))
    payload.append("cn", formData.get('categories04'))
    payload.append("nn", formData.get('categories05'))
    payload.append("dc", formData.get('categories06'))
    payload.append("gt", formData.get('categories07'))

    payload.append("description", formData.get('description'))

    payload.append("pdf", formData.get('pdf'))
    payload.append("img", formData.get('thumbnail'))

    const URL = 'http://localhost:3055/v1/api/post-book'
  
    let res = await fetch(URL, {
        method: "POST",
        body: payload,
       
        credentials: 'include'
    })
    console.log(res);
    res = await res.text()
    const data = await JSON.parse(res)

    console.log(data);
    if (data.statusCode == 201) {
        // setTimeout(() => {
        //     window.location.reload()
        // }, 2000)
        return {
            success: "Thêm sách thành công"
        }
    }else if(data.statusCode == 401) {
        
        window.location.reload()
    }
    else {
        return {
            error: "Sai format dữ liệu, đề nghị xem lại file Ảnh và file sách."
        }
    }
   

}
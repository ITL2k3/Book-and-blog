import multer from 'multer'
import { BadRequestError } from '../common/error.response.js';

const storage = multer.diskStorage({
  
    destination: function(req, file, cb){
        //check type before upload
        let str = file.mimetype
        const filetype = str.slice(str.indexOf('/') + 1, str.length)
        req.filetype = filetype 
        if(file.fieldname == 'pdf' && filetype == 'pdf'){
            //sve to upload
            return cb(null, 'uploads/files_pdf')
        }else if(file.fieldname == 'img' && (filetype == 'jpeg' || filetype == 'jfif' || filetype == 'png' || filetype == 'webp')){
            return cb(null, 'uploads/files_thumbnail_img')
        }else {
            return cb((err) => {
                console.log('Not pdf file!');
            },false)
        }
    },
    
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now()
        let fileName
        if(req.filetype == 'pdf'){
            fileName = uniqueSuffix + ".pdf"
            req.filePdfPath = `../../uploads/files_pdf/${fileName}`
        }else{
            fileName = uniqueSuffix + `.${req.filetype}`
            req.fileThumbnailPath = `../../uploads/files_thumbnail_img/${fileName}`
        }
        cb(null,fileName)

        
    }
})


const upload = multer({storage})

export default upload
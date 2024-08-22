import multer from 'multer'
import { BadRequestError } from '../common/error.response.js';

const storage = multer.diskStorage({
  
    destination: function(req, file, cb){
        console.log('Hello it: ', file, req.body);
        //check type before upload
        let str = file.mimetype
        const filetype = str.slice(str.indexOf('/') + 1, str.length)
        if(filetype == 'pdf'){
            //sve to upload
            return cb(null, 'uploads')
        }else{
            return cb((err) => {
                console.log('Not pdf file!');
            },false)
        }
    },
    
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now()
        const fileName = uniqueSuffix + ".pdf"
        
        req.filepath = `../../uploads/${fileName}`
        cb(null,fileName)
    }
})


const upload = multer({storage})

export default upload
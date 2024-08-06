import express from "express"
// import userRouter from "./routes/user"
import cors from "cors"
import path from "path"
import {fileURLToPath} from "url"
import multer from "multer"
const app = express()


app.use(cors())
app.use(express.json())
app.use("/user",(req,res,next)=>{
    console.log(req.body.file)
})

//multer js
// Resolve __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set storage engine
const storage = multer.diskStorage({
  destination: path.join(__dirname, 'uploads'),
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // Limit file size to 1MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).single('file');

// Check file type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

// Upload route
app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      if (req.file == undefined) {
        res.status(400).json({ error: 'No file selected' });
      } else {
        res.status(201).json("upload succesfull")
      }
    }
  });
});

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.listen(5000, ()=>{
    console.log("server running on port 5000")
})
const express = require('express');
const { Pool } = require('pg');
const mongoose = require('mongoose');
//  const multer = require('multer');
const bodyParser = require('body-parser');
const cors = require('cors');
const { ObjectId } = require('mongodb');
const keys = require("./keys");
const http_typ = keys.http_typ;
const port = keys.port;
const https = require(`https`);

const app = express();
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb' }));

if (http_typ === 'http') {
      app.use(cors());

      app.listen(port, () => {
        console.log(`Mongo service listening via ${http_typ} on port ${port}`);
      });
}

if (http_typ === 'https') {
      // Middleware
      app.use(cors({
        origin: 'https://123legal.in'
      }));

      // Logging middleware
      app.use((req, res, next) => {
        console.log("Request Body:", req.body);
        next();
      });

      const options = {
        key: fs.readFileSync('key.key'),
        cert: fs.readFileSync('crt.crt')
      };

      const server = https.createServer(options, app);

      server.listen(port, () => {
        console.log(`Mongo service listening via ${http_typ} on port ${port}`);
      });
}

// app.use(bodyParser.json());
// const upload = multer();
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.json({ limit: '50mb' })); // Increase the JSON payload limit if necessary
// app.use(express.raw({ type: '*/*', limit: '50mb' }));

// app.use(express.raw({ type: '*/*', limit: '50mb' }));

// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'postgres',
//   password: 'root',
//   port: 5432,
// });


mongoose.connect(`mongodb://${keys.mongoHost}:27017`, {
  dbName: keys.mongodbName,
  authSource: keys.mongoAuthSource,
  user: keys.mongoUser,
  pass: keys.mongoPass

});

// Connect to MongoDB
// mongoose.connect('mongodb://95.111.251.165:27017/my_db', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// Create MongoDB Schema
const fileDataSchema = new mongoose.Schema({
  files: String,
});

const FileData = mongoose.model('FileData', fileDataSchema);

const fileModalSchema = new mongoose.Schema({
  files: String,
});

const FileModal = mongoose.model('FileModal', fileModalSchema);


const fileUploadSchema = new mongoose.Schema(
  {
    files:String,
  }
)

const FileUpload = mongoose.model('FileUpload',fileUploadSchema);

const fileAudioSchema = new mongoose.Schema(
  {
    files:String,
  }
)

const FileAudio = mongoose.model('FileAudio',fileAudioSchema);





app.post('/tasks-file', async (req, res) => {
  try {
    const { files} = req.body;
    console.log(req.body)
    console.log(files);
    // console.log('file received backend previousDocumentFile', previousDocumentFile);
    // console.log('file received backend currentPattaFile', currentPattaFile);

    // Check if file is present in the request
    if (!req.body) {
      return res.status(400).json({ error: 'No file provided' });
    }


    // Insert file data into MongoDB
    const fileData = new FileData({
      files:files
    });

    const fileDataResult = await fileData.save();


    res.status(200).json({ fileId: fileDataResult._id });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/tasks-file/:id', async (req, res) => {
  try {
    const objid=req.params.id
    const fileData = await FileData.find({_id: new ObjectId(objid) });
    res.status(200).json({fileData:fileData});
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/modal-file', async (req, res) => {
  try {
    const { files} = req.body;
    console.log(req.body)
    console.log(files);
    // console.log('file received backend previousDocumentFile', previousDocumentFile);
    // console.log('file received backend currentPattaFile', currentPattaFile);

    // Check if file is present in the request
    if (!req.body) {
      return res.status(400).json({ error: 'No file provided' });
    }


    // Insert file data into MongoDB
    const fileModal = new FileModal({
      files:files
    });

    const fileModalResult = await fileModal.save();


    res.status(200).json({ fileId: fileModalResult._id });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/modal-file/:id', async (req, res) => {
  try {
    const objid=req.params.id
    const Modal = await FileModal.find({_id: new ObjectId(objid) });
    res.status(200).json({fileData:Modal});
  
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/upload-file', async (req, res) => {
  try {
    const { file} = req.body;
    console.log(req.body)
    console.log(file);
    // console.log('file received backend previousDocumentFile', previousDocumentFile);
    // console.log('file received backend currentPattaFile', currentPattaFile);

    // Check if file is present in the request
    if (!req.body) {
      return res.status(400).json({ error: 'No file provided' });
    }


    // Insert file data into MongoDB
    const fileUpload = new FileUpload({
      files:file

    });

    const fileUploadResult = await fileUpload.save();


    res.status(200).json({ fileId: fileUploadResult._id });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/upload-file/:id', async (req, res) => {
  try {
    const obid=req.params.id
    const Upload = await FileUpload.find({_id: new ObjectId(obid) });
    res.status(200).json({fileData:Upload});
  
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/uploading', async (req, res) => {
  try {
    const { audioBase64 } = req.body;

    if (!audioBase64) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const fileAudio = new FileAudio({ files: audioBase64 });
    const fileAudioResult = await fileAudio.save();

    res.status(200).json({ fileId: fileAudioResult._id, message: 'Audio uploaded successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).send('Error uploading audio');
  }
});

app.get('/audio/:id', async (req, res) => {
  try {
    const audio = await FileAudio.findById(req.params.id);

    if (!audio) {
      return res.status(404).send('Audio not found');
    }

    res.status(200).json({ audioOutput: audio.files });
  } catch (err) {
    console.log(err);
    res.status(500).send('Error retrieving audio');
  }
});

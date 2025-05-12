import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone, faMicrophoneSlash } from "@fortawesome/free-solid-svg-icons";
import './stylepage.css';

const News = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [recording, setRecording] = useState(false);
  const [mute, setMute] = useState(false);
  const mediaRecorder = useRef(null);
  const [data, setData] = useState(null);
  const canvasRef = useRef(null);
  const animationId = useRef(null);
  const audioContext = useRef(null);
  const mediaStream = useRef(null);
  const recognition = useRef(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [id,setOrgNames]=useState([]);
  const http_typ = process.env.REACT_APP_HTTP_TYP;
                const host_name_3001 = process.env.REACT_APP_HOST_NAME_3001;
                const host_name_3002 = process.env.REACT_APP_HOST_NAME_3002;

  useEffect(() => {
    const adminFromStorage = JSON.parse(sessionStorage.getItem('admin'));
    setOrgNames(adminFromStorage);
  }, []);


useEffect(() => {
  const adminFromStorage = JSON.parse(sessionStorage.getItem('admin'));
  console.log(adminFromStorage);
}, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let analyser;
    let dataArray;

    const draw = () => {
      if (mute) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / dataArray.length) * 2.5;
      let x = 0;

      dataArray.forEach((data, index) => {
        const barHeight = data / 2;
        ctx.fillStyle = `rgb(127, 0, 0,${barHeight + 100})`;
        ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight);
        x += barWidth + 1;
      });

      animationId.current = requestAnimationFrame(draw);
    };

    if (recording && mediaStream.current) {
      if (!audioContext.current) {
        audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      analyser = audioContext.current.createAnalyser();
      analyser.fftSize = 256;
      dataArray = new Uint8Array(analyser.frequencyBinCount);
      const source = audioContext.current.createMediaStreamSource(mediaStream.current);
      source.connect(analyser);
      draw();
    }

    return () => {
      cancelAnimationFrame(animationId.current);
    };
  }, [recording, mute]);

  const fetchData = async (filename) => {
    try {
      const response = await axios.get(`${http_typ}://${host_name_3002}/audio/${filename}`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    fetchData(uploadedFile.name);
  };

  const startRecording = () => {
    const constraints = { audio: true };

    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        const recorder = new MediaRecorder(stream);
        mediaRecorder.current = recorder;
        const chunks = [];

        recorder.ondataavailable = (e) => {
          chunks.push(e.data);
        };

        recorder.onstop = () => {
          const audioBlob = new Blob(chunks, { type: "audio/webm" });
          setFile(audioBlob);
          const audioUrl = URL.createObjectURL(audioBlob);
          setAudioUrl(audioUrl); // Set audio URL to the recorded blob
        };

        recorder.start();
        setRecording(true);
        mediaStream.current = stream;
      })
      .catch((err) => {
        console.error("Error accessing microphone:", err);
        setError("Error accessing microphone.");
      });
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
      mediaRecorder.current.stop();
      setRecording(false);
    }
  };
  const toggleMute = () => {
    setMute((prevMute) => {
      console.log("muted", !prevMute);
      return !prevMute; // Toggle the mute state
    });
  
    if (!mute && mediaStream.current) {
      // Pause recording if not muted
      mediaRecorder.current.pause();
    } else if (mediaStream.current) {
      // Resume recording if muted
      mediaRecorder.current.resume();
    }
  
    if (!mute && mediaStream.current) {
      mediaStream.current.getAudioTracks().forEach((track) => {
        track.enabled = false; // Mute the microphone
      });
    } else if (mediaStream.current) {
      mediaStream.current.getAudioTracks().forEach((track) => {
        track.enabled = true; // Unmute the microphone
      });
    }
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result.split(',')[1]);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const base64format = await convertFileToBase64(file);
    const audioBase64 = base64format;

    try {
      const fileDataResponse = await axios.post(`${http_typ}://${host_name_3002}/uploading`, { audioBase64 });

      if (fileDataResponse.status === 200) {
        const fileId = fileDataResponse.data.fileId;
        const textDataResponse = await axios.post(`${http_typ}://${host_name_3001}/uploading`, { fileId,id});
        if (textDataResponse.status === 200) {
          alert("Audio submitted successfully");
          window.location.reload();
        } else {
          console.error("Text data submission failed");
        }
      } else {
        console.error("File data submission failed");
      }
    } catch (err) {
      console.error("Error uploading audio:", err);
      setError("Error uploading audio. Please try again later.");
    }
  };

  useEffect(() => {
    recognition.current = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.current.lang = "en-US";
    recognition.current.interimResults = false;
    recognition.current.maxAlternatives = 1;

    recognition.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setData((prevData) => (prevData ? prevData + "<br>" + transcript : transcript));
    };

    recognition.current.onerror = (event) => {
      if (event.error === "no-speech") {
        setError(false);
      }
    };

    recognition.current.onend = () => {
      if (!mute && mediaStream.current) {
        recognition.current.start();
      }
    };

    recognition.current.start();

    return () => {
      if (recognition.current) {
        recognition.current.stop();
      }
    };
  }, [mute]);

  return (
    <div className="Addtask">
      <h2>Upload Audio</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="audio/*" onChange={handleFileChange} />
        <button type="button" className='voice'onClick={startRecording} disabled={recording}>
          {recording ? "Recording..." : "Record Voice"}
        </button>
        {recording && (
          <button type="button" className='voice' onClick={stopRecording}>
            Stop Recording
          </button>
        )}
        <button type="button" className='voice' onClick={toggleMute}>
          {mute ? <FontAwesomeIcon icon={faMicrophoneSlash} /> : <FontAwesomeIcon icon={faMicrophone} />}
        </button>
         <canvas ref={canvasRef} />
      {error && <p style={{ color: "red" }}>{error}</p>}
      

        {data && <p dangerouslySetInnerHTML={{ __html: data.replace(/\n/g, "<br>") }} />}
      {audioUrl && <audio controls src={audioUrl} />} {/* Render the audio element */}
      {success && <p style={{ color: "green" }}>Audio uploaded successfully!</p>}
        <button type="submit" disabled={recording}>
          Assisgn News
        </button>
      </form>
     
    </div>
  );
};

export default News;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './stylepage2.css';
import { useParams } from 'react-router-dom';


const AudioPlayer = () => {
  const [audioList, setAudioList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const http_typ = process.env.REACT_APP_HTTP_TYP;
  const host_name_3001 = process.env.REACT_APP_HOST_NAME_3001;
 
  // const location = useLocation();
  // const queryParams = new URLSearchParams(location.search);
  // const userEmail = queryParams.get('userEmail');
  const {userEmail}=useParams();
console.log("13",userEmail);

  useEffect(() => {
    const fetchAudioList = async () => {
      try {
        const response =  await axios.get(`${http_typ}://${host_name_3001}/getting_audio/${userEmail}`);
        if (response.data) {
          setAudioList(response.data);
        } else {
          throw new Error('No audio data found in response');
        }
      } catch (error) {
        console.error('Error fetching audio data:', error);
        setError('No News');
      } finally {
        setLoading(false);
      }
    };

    fetchAudioList();
  }, []);

  if (loading) {
    return <p>Loading audio...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className='audio-table'>
      {audioList.length > 0 ? (
        <table>
          <thead>
            <tr>
            <th>Date</th>
            <th>Time</th>
              
              <th>Audio</th>
            </tr>
          </thead>
          <tbody>
            {audioList.map((audio) => (
              <AudioPlayerItem key={audio.fileid} audio={audio} />
            ))}
          </tbody>
        </table>
      ) : (
        <p>No audio found</p>
      )}
    </div>
  );
};

const AudioPlayerItem = ({ audio }) => {
  const [audioUrl, setAudioUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const http_typ = process.env.REACT_APP_HTTP_TYP;
  const host_name_3002 = process.env.REACT_APP_HOST_NAME_3002;

  useEffect(() => {
    const fetchAudio = async () => {
      try {
        const response = await axios.get(`${http_typ}://${host_name_3002}/audio/${audio.fileid}`);
        if (response.data && response.data.audioOutput) {
          setAudioUrl(`data:audio/mp3;base64,${response.data.audioOutput}`);
        } else {
          throw new Error(`Audio URL not found for ID: ${audio.fileId}`);
        }
      } catch (error) {
        console.error('Error fetching audio:', error);
        setError('Failed to load audio');
      } finally {
        setLoading(false);
      }
    };

    fetchAudio();
  }, [audio.fileId]);


  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
  };

  return (
    <tr>
      <td>{new Date(audio.created_at).toLocaleDateString()}</td>
      <td>{new Date(audio.created_at).toLocaleTimeString()}</td>
      <td>
        {loading ? (
          <p>Loading audio...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <div>
            {isPlaying ? (
              <audio controls autoPlay src={audioUrl} type="audio/webm" onEnded={handleAudioEnd} />
            ) : (
              <button className='working-buttons' onClick={handlePlay}>Play</button>
            )}
          </div>
        )}
      </td>
    </tr>
  );
};
export default AudioPlayer;

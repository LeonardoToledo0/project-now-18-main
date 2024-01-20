import React, { useState, useEffect } from 'react';
import '../../styles/CronometroMini.css';

import iconPausar from "../../icons/icon-pausar.png";
import iconPlay from "../../icons/icon-play.png";
import iconReiniciar from "../../icons/icon-reiniciar.png";
import iconMarcar from "../../icons/icon-marcar.png";

function App() {
    const [running, setRunning] = useState(false);
    const [time, setTime] = useState(0);
    const [laps, setLaps] = useState([]);

    useEffect(() => {
        let interval;

        if (running) {
            interval = setInterval(() => {
                setTime((prevTime) => prevTime + 10);
            }, 10);
        } else {
            clearInterval(interval);
        }

        return () => {
            clearInterval(interval);
        };
    }, [running]);

    const handleStartStop = () => {
        setRunning(!running);
    };

    const handleReset = () => {
        setRunning(false);
        setTime(0);
        setLaps([]);
    };

    const handleLap = () => {
        setLaps((prevLaps) => [...prevLaps, time]);
    };

    const formatTime = (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');
        const formattedMilliseconds = String(milliseconds % 1000).padStart(3, '0');

        return `${formattedMinutes}:${formattedSeconds}.${formattedMilliseconds}`;
    };

    return (
        <div className="CronometroMini">
            <div className="timer">{formatTime(time)}</div>
            <div className="laps">
                {laps.map((lap, index) => (
                    <div key={index} className="lap">
                        {index + 1}º Lugar : {formatTime(lap)}
                    </div>
                ))}
            </div>
            <div className="buttons">
                {running ? (
                    <img src={iconPausar} onClick={handleStartStop} className='icon-button' />
                ) : (
                    <img src={iconPlay} onClick={handleStartStop} className='icon-button' />
                )}
                <img src={iconReiniciar} onClick={handleReset} className='icon-button' />
                <img src={iconMarcar} onClick={handleLap} className='icon-button' />
            </div>
        </div>
    );
}

export default App;

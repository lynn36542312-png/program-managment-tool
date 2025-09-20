import React, { useState, useEffect, useCallback, useMemo } from 'react';

const PomodoroTimer: React.FC = () => {
    const [workMinutes, setWorkMinutes] = useState(25);
    const [breakMinutes, setBreakMinutes] = useState(5);
    const [mode, setMode] = useState<'work' | 'break'>('work');
    const [timeLeft, setTimeLeft] = useState(workMinutes * 60);
    const [isActive, setIsActive] = useState(false);
    const [isMinimized, setIsMinimized] = useState(true);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | null = null;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prevTime => prevTime - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            new Audio("https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg").play();
            if (mode === 'work') {
                setMode('break');
                setTimeLeft(breakMinutes * 60);
            } else {
                setMode('work');
                setTimeLeft(workMinutes * 60);
            }
            setIsActive(true); // Automatically start the next session
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, timeLeft, mode, workMinutes, breakMinutes]);

    const toggleTimer = useCallback(() => {
        setIsActive(prev => !prev);
    }, []);

    const resetTimer = useCallback(() => {
        setIsActive(false);
        setMode('work');
        setTimeLeft(workMinutes * 60);
    }, [workMinutes]);

    const handleWorkDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDuration = Math.max(1, parseInt(e.target.value, 10) || 1);
        setWorkMinutes(newDuration);
        if (mode === 'work' && !isActive) {
            setTimeLeft(newDuration * 60);
        }
    };

    const handleBreakDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDuration = Math.max(1, parseInt(e.target.value, 10) || 1);
        setBreakMinutes(newDuration);
        if (mode === 'break' && !isActive) {
            setTimeLeft(newDuration * 60);
        }
    };

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    const totalDuration = (mode === 'work' ? workMinutes : breakMinutes) * 60;
    const progress = totalDuration > 0 ? (totalDuration - timeLeft) / totalDuration : 0;
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference * (1 - progress);

    if (isMinimized) {
        return (
             <button onClick={() => setIsMinimized(false)} className="fixed bottom-5 right-5 w-16 h-16 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-transform transform hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </button>
        )
    }

    return (
        <div className="fixed bottom-5 right-5 bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-80 p-6 transition-all duration-300">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white">Pomodoro Timer</h3>
                    <p className={`text-sm font-semibold ${mode === 'work' ? 'text-blue-500' : 'text-green-500'}`}>
                        {mode === 'work' ? 'Time to Focus' : 'Time for a Break'}
                    </p>
                </div>
                <button onClick={() => setIsMinimized(true)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg>
                </button>
            </div>

            <div className="relative my-4 flex justify-center items-center">
                <svg className="w-40 h-40 transform -rotate-90">
                    <circle cx="80" cy="80" r="45" strokeWidth="10" stroke="currentColor" className="text-gray-200 dark:text-gray-700" fill="transparent" />
                    <circle
                        cx="80"
                        cy="80"
                        r="45"
                        strokeWidth="10"
                        stroke="currentColor"
                        className={mode === 'work' ? 'text-blue-500' : 'text-green-500'}
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        style={{ transition: 'stroke-dashoffset 0.5s linear' }}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute text-4xl font-mono font-bold text-gray-800 dark:text-white">
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </div>
            </div>
            
            {!isActive && (
                <div className="mb-4 flex justify-around items-center text-sm px-2">
                    <div className="flex flex-col items-center">
                        <label htmlFor="work-duration" className="font-medium text-gray-600 dark:text-gray-400 mb-1">Work (min)</label>
                        <input
                            id="work-duration"
                            type="number"
                            value={workMinutes}
                            onChange={handleWorkDurationChange}
                            className="w-20 p-1 text-center bg-gray-100 dark:bg-gray-700 rounded-md border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                            min="1"
                        />
                    </div>
                    <div className="flex flex-col items-center">
                        <label htmlFor="break-duration" className="font-medium text-gray-600 dark:text-gray-400 mb-1">Break (min)</label>
                         <input
                            id="break-duration"
                            type="number"
                            value={breakMinutes}
                            onChange={handleBreakDurationChange}
                            className="w-20 p-1 text-center bg-gray-100 dark:bg-gray-700 rounded-md border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                            min="1"
                        />
                    </div>
                </div>
            )}

            <div className="flex justify-center space-x-4">
                <button onClick={toggleTimer} className={`w-24 px-4 py-2 rounded-lg font-semibold text-white transition-colors ${isActive ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                    {isActive ? 'Pause' : 'Start'}
                </button>
                <button onClick={resetTimer} className="w-24 px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                    Reset
                </button>
            </div>
        </div>
    );
};

export default PomodoroTimer;

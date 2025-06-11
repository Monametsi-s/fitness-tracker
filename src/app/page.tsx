'use client';

import { useState, useEffect } from 'react';
import { FaDumbbell, FaClock, FaFire, FaExclamationTriangle, FaDownload, FaChartLine } from 'react-icons/fa';
import WorkoutHistory from './components/WorkoutHistory';
import WorkoutPresets from './components/WorkoutPresets';

type WorkoutType = 'walking' | 'running' | 'cycling' | 'swimming' | 'weightlifting' | 'yoga' | string;
type Intensity = 'low' | 'medium' | 'high';

interface Workout {
  id: string;
  type: WorkoutType;
  duration: number;
  calories: number;
  date: string;
  intensity: Intensity;
}

interface WorkoutStats {
  totalWorkouts: number;
  totalCalories: number;
  totalDuration: number;
  avgCaloriesPerWorkout: number;
  avgDuration: number;
  mostFrequentWorkout: string;
}

export default function Home() {
  const [workout, setWorkout] = useState<WorkoutType>('');
  const [duration, setDuration] = useState('');
  const [intensity, setIntensity] = useState<Intensity>('medium');
  const [calories, setCalories] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [showAnalysis, setShowAnalysis] = useState(false);

  useEffect(() => {
    // Load workouts from localStorage on component mount
    const savedWorkouts = localStorage.getItem('workouts');
    if (savedWorkouts) {
      try {
        const parsedWorkouts = JSON.parse(savedWorkouts) as Workout[];
        setWorkouts(parsedWorkouts);
      } catch (error) {
        console.error('Error parsing saved workouts:', error);
        setWorkouts([]);
      }
    }
  }, []);

  const saveWorkout = (newWorkout: Workout) => {
    const updatedWorkouts = [...workouts, newWorkout];
    setWorkouts(updatedWorkouts);
    localStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
  };

  const deleteWorkout = (id: string) => {
    const updatedWorkouts = workouts.filter(w => w.id !== id);
    setWorkouts(updatedWorkouts);
    localStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
  };

  const exportWorkouts = () => {
    const dataStr = JSON.stringify(workouts, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `workout-data-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const exportCSV = () => {
    const headers = ['Date', 'Workout Type', 'Duration (min)', 'Calories', 'Intensity'];
    const csvContent = [
      headers.join(','),
      ...workouts.map(workout => [
        new Date(workout.date).toLocaleDateString(),
        workout.type,
        workout.duration,
        workout.calories,
        workout.intensity
      ].join(','))
    ].join('\n');

    const dataUri = 'data:text/csv;charset=utf-8,'+ encodeURIComponent(csvContent);
    const exportFileDefaultName = `workout-data-${new Date().toISOString().split('T')[0]}.csv`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const getWorkoutStats = (): WorkoutStats | null => {
    if (workouts.length === 0) return null;

    const totalCalories = workouts.reduce((sum, w) => sum + w.calories, 0);
    const totalDuration = workouts.reduce((sum, w) => sum + w.duration, 0);
    const avgCaloriesPerWorkout = Math.round(totalCalories / workouts.length);
    const avgDuration = Math.round(totalDuration / workouts.length);

    const workoutsByType = workouts.reduce((acc, w) => {
      acc[w.type] = (acc[w.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostFrequentWorkout = Object.entries(workoutsByType)
      .sort(([,a], [,b]) => b - a)[0][0];

    return {
      totalWorkouts: workouts.length,
      totalCalories,
      totalDuration,
      avgCaloriesPerWorkout,
      avgDuration,
      mostFrequentWorkout
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/calculate-calories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workoutType: workout,
          duration: parseInt(duration),
          intensity: intensity,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to calculate calories');
      }

      setCalories(data.calories);
      
      // Save the workout
      const newWorkout: Workout = {
        id: Date.now().toString(),
        type: workout,
        duration: parseInt(duration),
        calories: data.calories,
        date: new Date().toISOString(),
        intensity: intensity,
      };
      saveWorkout(newWorkout);
    } catch (error) {
      console.error('Error calculating calories:', error);
      setError(error instanceof Error ? error.message : 'Failed to calculate calories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePresetSelect = (name: WorkoutType, defaultDuration: number) => {
    setWorkout(name);
    setDuration(defaultDuration.toString());
    setIntensity('medium');
  };

  const stats = getWorkoutStats();

  return (
    <main className="min-h-screen p-8 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Fitness Tracker
        </h1>
        
        <WorkoutPresets onSelectPreset={handlePresetSelect} />
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6 bg-white p-6 rounded-lg shadow-md">
          <div className="space-y-4">
            <div>
              <label htmlFor="workout" className="block text-sm font-medium text-gray-700 mb-2">
                <FaDumbbell className="inline mr-2" />
                Workout Type
              </label>
              <input
                type="text"
                id="workout"
                value={workout}
                onChange={(e) => setWorkout(e.target.value)}
                placeholder="e.g., Running, Swimming, Weight Training"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                <FaClock className="inline mr-2" />
                Duration (minutes)
              </label>
              <input
                type="number"
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Enter duration in minutes"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                min="1"
              />
            </div>

            <div>
              <label htmlFor="intensity" className="block text-sm font-medium text-gray-700 mb-2">
                <FaFire className="inline mr-2" />
                Intensity
              </label>
              <select
                id="intensity"
                value={intensity}
                onChange={(e) => setIntensity(e.target.value as Intensity)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Calculating...' : 'Calculate Calories'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md flex items-start">
            <FaExclamationTriangle className="mt-1 mr-2 flex-shrink-0" />
            <div>
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
              {error.includes('GOOGLE_API_KEY') && (
                <p className="text-sm mt-2">
                  Please create a .env.local file in the root of your project and add your Google API key:
                  <br />
                  <code className="bg-gray-100 px-2 py-1 rounded mt-1 inline-block">
                    GOOGLE_API_KEY=your_api_key_here
                  </code>
                </p>
              )}
            </div>
          </div>
        )}

        {calories !== null && (
          <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
              <FaFire className="inline mr-2 text-orange-500" />
              Calories Burned
            </h2>
            <p className="text-4xl font-bold text-center text-blue-600">
              {calories} kcal
            </p>
          </div>
        )}

        {stats && (
          <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                <FaChartLine className="inline mr-2" />
                Workout Analysis
              </h2>
              <div className="space-x-2">
                <button
                  onClick={exportWorkouts}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <FaDownload className="inline mr-2" />
                  Export JSON
                </button>
                <button
                  onClick={exportCSV}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  <FaDownload className="inline mr-2" />
                  Export CSV
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Total Workouts</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalWorkouts}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Total Calories</p>
                <p className="text-2xl font-bold text-green-600">{stats.totalCalories} kcal</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600">Total Duration</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalDuration} min</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <p className="text-sm text-gray-600">Avg. Calories/Workout</p>
                <p className="text-2xl font-bold text-orange-600">{stats.avgCaloriesPerWorkout} kcal</p>
              </div>
              <div className="p-4 bg-pink-50 rounded-lg">
                <p className="text-sm text-gray-600">Avg. Duration</p>
                <p className="text-2xl font-bold text-pink-600">{stats.avgDuration} min</p>
              </div>
              <div className="p-4 bg-indigo-50 rounded-lg">
                <p className="text-sm text-gray-600">Most Frequent</p>
                <p className="text-2xl font-bold text-indigo-600">{stats.mostFrequentWorkout}</p>
              </div>
            </div>
          </div>
        )}

        <WorkoutHistory workouts={workouts} onDeleteWorkout={deleteWorkout} />
      </div>
    </main>
  );
}

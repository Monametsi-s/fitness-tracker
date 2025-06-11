import { FaHistory, FaTrash } from 'react-icons/fa';

type WorkoutType = 'walking' | 'running' | 'cycling' | 'swimming' | 'weightlifting' | 'yoga' | string;
type Intensity = 'low' | 'medium' | 'high';

interface Workout {
  id: string;
  type: WorkoutType;
  duration: number;
  calories: number;
  date: string;
  intensity?: Intensity; // Make intensity optional
}

interface WorkoutHistoryProps {
  workouts: Workout[];
  onDeleteWorkout: (id: string) => void;
}

export default function WorkoutHistory({ workouts, onDeleteWorkout }: WorkoutHistoryProps) {
  if (workouts.length === 0) {
    return (
      <div className="mt-8 p-6 bg-white rounded-lg shadow-md text-center text-gray-500">
        <FaHistory className="inline-block text-4xl mb-4" />
        <p>No workouts recorded yet. Start tracking your fitness journey!</p>
      </div>
    );
  }

  const formatIntensity = (intensity?: Intensity): string => {
    if (!intensity) return 'Medium'; // Default to Medium if not specified
    return intensity.charAt(0).toUpperCase() + intensity.slice(1);
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        <FaHistory className="inline mr-2" />
        Workout History
      </h2>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Workout</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Intensity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Calories</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {workouts.map((workout) => (
                <tr key={workout.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(workout.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {workout.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {workout.duration} min
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatIntensity(workout.intensity)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {workout.calories} kcal
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => onDeleteWorkout(workout.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FaTrash className="inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 
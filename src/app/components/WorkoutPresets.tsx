import React from 'react';
import { FaRunning, FaSwimmer, FaBiking, FaDumbbell, FaWalking } from 'react-icons/fa';

type WorkoutType = 'walking' | 'running' | 'cycling' | 'swimming' | 'weightlifting' | 'yoga' | string;

interface WorkoutPreset {
  name: WorkoutType;
  icon: JSX.Element;
  defaultDuration: number;
}

const presets: WorkoutPreset[] = [
  { name: 'Running', icon: <FaRunning />, defaultDuration: 30 },
  { name: 'Swimming', icon: <FaSwimmer />, defaultDuration: 45 },
  { name: 'Cycling', icon: <FaBiking />, defaultDuration: 40 },
  { name: 'Weight Training', icon: <FaDumbbell />, defaultDuration: 60 },
  { name: 'Walking', icon: <FaWalking />, defaultDuration: 30 },
];

interface WorkoutPresetsProps {
  onSelectPreset: (name: WorkoutType, duration: number) => void;
}

export default function WorkoutPresets({ onSelectPreset }: WorkoutPresetsProps) {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Quick Start</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {presets.map((preset) => (
          <button
            key={preset.name}
            onClick={() => onSelectPreset(preset.name, preset.defaultDuration)}
            className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <span className="text-2xl text-blue-600 mb-2">{preset.icon}</span>
            <span className="text-sm font-medium text-gray-700">{preset.name}</span>
            <span className="text-xs text-gray-500">{preset.defaultDuration} min</span>
          </button>
        ))}
      </div>
    </div>
  );
} 
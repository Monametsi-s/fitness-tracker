import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

type WorkoutType = 'walking' | 'running' | 'cycling' | 'swimming' | 'weightlifting' | 'yoga';
type Intensity = 'low' | 'medium' | 'high';

// Check if API key exists
if (!process.env.GOOGLE_API_KEY) {
  throw new Error('GOOGLE_API_KEY is not set in environment variables');
}

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export async function POST(request: Request) {
  try {
    const { workoutType, duration, intensity } = await request.json();

    // Input validation
    if (!workoutType || !duration || !intensity) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Use the gemini-2.0-flash model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `Calculate the approximate calories burned for a ${workoutType} workout lasting ${duration} minutes with ${intensity} intensity. Consider factors like intensity and provide a reasonable estimate. Return only the number of calories as a single integer.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const calories = parseInt(response.text().trim());

    if (isNaN(calories)) {
      // Fallback calculation if AI response is not a valid number
      const baseCaloriesPerMinute = {
        walking: 4,
        running: 10,
        cycling: 8,
        swimming: 7,
        weightlifting: 5,
        yoga: 3,
        default: 6
      }[workoutType.toLowerCase() as WorkoutType] || 6;

      const intensityMultiplier = {
        low: 0.8,
        medium: 1,
        high: 1.2
      }[intensity.toLowerCase() as Intensity] || 1;

      const fallbackCalories = Math.round(baseCaloriesPerMinute * duration * intensityMultiplier);
      return NextResponse.json({ calories: fallbackCalories });
    }

    return NextResponse.json({ calories });
  } catch (error) {
    console.error('Error calculating calories:', error);
    return NextResponse.json(
      { error: 'Failed to calculate calories', details: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
} 
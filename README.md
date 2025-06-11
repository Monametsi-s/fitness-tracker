# Fitness Tracker

A modern web application built with Next.js for tracking workouts and calculating calories burned. The app uses the Google Gemini API for intelligent calorie calculations and provides a beautiful, responsive user interface.

## Features

- **Workout Tracking**
  - Record different types of workouts (running, swimming, cycling, etc.)
  - Track workout duration and intensity
  - Calculate calories burned using AI-powered estimation
  - Quick start presets for common workouts

- **Data Analysis**
  - View total workouts, calories, and duration
  - Track average calories per workout
  - Monitor average workout duration
  - Identify most frequent workout types

- **Data Export**
  - Export workout data in JSON format
  - Export workout data in CSV format for spreadsheet analysis
  - Automatic data persistence using localStorage

- **User Interface**
  - Clean, modern design with Tailwind CSS
  - Responsive layout for all devices
  - Interactive workout history
  - Real-time calorie calculations

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn
- Google Gemini API key

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd fitness-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory and add your Google API key:
   ```
   GOOGLE_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Adding a Workout

1. Select a workout type from the quick start presets or enter a custom workout
2. Enter the duration in minutes
3. Select the intensity level (low, medium, high)
4. Click "Calculate Calories" to get the estimated calories burned

### Viewing History

- All workouts are automatically saved and displayed in the history section
- View detailed information about each workout
- Delete workouts as needed

### Exporting Data

- Click "Export JSON" to download all workout data in JSON format
- Click "Export CSV" to download data in CSV format for spreadsheet analysis
- Files are named with the current date (e.g., `workout-data-2024-03-21.json`)

## Technical Details

### Built With

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Google Gemini API](https://ai.google.dev/) - AI-powered calculations
- [React Icons](https://react-icons.github.io/react-icons/) - UI icons

### Project Structure

```
fitness-tracker/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── calculate-calories/
│   │   │       └── route.ts
│   │   ├── components/
│   │   │   ├── WorkoutHistory.tsx
│   │   │   └── WorkoutPresets.tsx
│   │   ├── page.tsx
│   │   └── layout.tsx
│   └── styles/
├── public/
├── .env.local
└── package.json
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Google Gemini API for providing the AI capabilities
- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework

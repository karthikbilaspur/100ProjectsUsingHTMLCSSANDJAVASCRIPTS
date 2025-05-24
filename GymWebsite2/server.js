
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/fitforge', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
});

const User = mongoose.model('User', userSchema);

const workoutLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    workoutType: String,
    workoutDuration: Number,
    workoutDate: Date,
});

const WorkoutLog = mongoose.model('WorkoutLog', workoutLogSchema);

app.use(express.json());

const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, 'secretkey');
        const user = await User.findOne({ _id: decoded.userId });
        if (!user) {
            throw new Error();
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Please authenticate' });
    }
};

app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        const token = jwt.sign({ userId: user._id }, 'secretkey', { expiresIn: '1h' });
        res.json({ success: true, token });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

function generateExercises(goals, level, time) {
    let exercises = [];

    if (goals === 'weight-loss') {
        if (level === 'beginner') {
            exercises = [
                { name: 'Brisk Walking', duration: 30 },
                { name: 'Bodyweight Squats', sets: 3, reps: 10 },
                { name: 'Push-ups', sets: 3, reps: 10 },
            ];
        } else if (level === 'intermediate') {
            exercises = [
                { name: 'Jogging', duration: 30 },
                { name: 'Dumbbell Lunges', sets: 3, reps: 10 },
                { name: 'Incline Dumbbell Press', sets: 3, reps: 10 },
            ];
        } else {
            exercises = [
                { name: 'Running', duration: 30 },
                { name: 'Barbell Squats', sets: 3, reps: 10 },
                { name: 'Bench Press', sets: 3, reps: 10 },
            ];
        }
    } else if (goals === 'muscle-gain') {
        if (level === 'beginner') {
            exercises = [
                { name: 'Bodyweight Squats', sets: 3, reps: 10 },
                { name: 'Push-ups', sets: 3, reps: 10 },
                { name: 'Dumbbell Bicep Curls', sets: 3, reps: 10 },
            ];
        } else if (level === 'intermediate') {
            exercises = [
                { name: 'Dumbbell Lunges', sets: 3, reps: 10 },
                { name: 'Incline Dumbbell Press', sets: 3, reps: 10 },
                { name: 'Barbell Rows', sets: 3, reps: 10 },
            ];
        } else {
            exercises = [
                { name: 'Barbell Squats', sets: 3, reps: 10 },
                { name: 'Bench Press', sets: 3, reps: 10 },
                { name: 'Deadlifts', sets: 3, reps: 10 },
            ];
        }
    } else {
        // endurance goals
        exercises = [
            { name: 'Jogging', duration: 30 },
            { name: 'Cycling', duration: 30 },
            { name: 'Swimming', duration: 30 },
        ];
    }

    // adjust exercises based on available workout time
    if (time < 30) {
        exercises = exercises.slice(0, 2);
    }

    return exercises;
}

app.post('/api/workout-plan', authenticate, async (req, res) => {
    try {
        const { fitnessGoals, currentFitnessLevel, availableWorkoutTime } = req.body;
        const workoutPlan = {
            goals: fitnessGoals,
            level: currentFitnessLevel,
            time: availableWorkoutTime,
            exercises: generateExercises(fitnessGoals, currentFitnessLevel, availableWorkoutTime),
        };
        res.json(workoutPlan);
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate workout plan' });
    }
});

app.post('/api/log-workout', authenticate, async (req, res) => {
    try {
        const { workoutType, workoutDuration, workoutDate } = req.body;
        const user = req.user;

        const workoutLog = new WorkoutLog({
            userId: user._id,
            workoutType,
            workoutDuration,
            workoutDate,
        });

        await workoutLog.save();

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to log workout' });
    }
});

app.get('/api/workout-history', authenticate, async (req, res) => {
    try {
        const user = req.user;
        const workoutHistory = await WorkoutLog.find({ userId: user._id });
        res.json(workoutHistory);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get workout history' });
    }
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
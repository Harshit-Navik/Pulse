import Groq from "groq-sdk";

const getGroqAI = () => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey === "your_groq_api_key_here") {
    return null;
  }
  return new Groq({ apiKey });
};

const withTimeout = (promise, ms) => {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error("AI_TIMEOUT")), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
};

/**
 * POST /api/chat
 * Handle a single chat message exchange.
 * Body: { message: string, history: Array<{role, parts}> }
 */
export async function handleChatMessage(req, res) {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    const groq = getGroqAI();
    if (!groq) {
      return res.status(503).json({
        error: "AI service not configured",
        fallback: true,
        reply: "I'm currently running in offline mode. Please ask the admin to configure the GROQ_API_KEY in the server .env file.",
      });
    }

    const messages = history.map((msg) => ({
      role: msg.role === "model" ? "assistant" : msg.role,
      content: msg.text,
    }));
    messages.push({ role: "user", content: message });

    const response = await withTimeout(
      groq.chat.completions.create({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages,
        max_tokens: 1024,
        temperature: 0.7,
      }),
      15000
    );

    const reply = response.choices[0].message.content;

    return res.json({ reply });
  } catch (error) {
    console.error("Chat error:", error.message);

    let statusCode = 500;
    let errorMessage = "Failed to get AI response";
    let fallbackReply = "Sorry, I encountered an internal error. Please try again.";

    if (error.message === "AI_TIMEOUT") {
      statusCode = 504;
      errorMessage = "AI generation timed out";
      fallbackReply = "I'm currently experiencing heavy load and timed out. Please try your message again!";
    } else if (error.status === 429) {
      statusCode = 429;
      errorMessage = "AI Quota Exceeded";
      fallbackReply = "I'm currently out of capacity due to rate limits. Please try again in a few minutes.";
    } else if (error.status === 403 || error.status === 401) {
      statusCode = 403;
      errorMessage = "API Configuration Error";
      fallbackReply = "My communication lines are blocked (API key or region restriction).";
    }

    return res.status(statusCode).json({
      error: errorMessage,
      reply: fallbackReply,
      fallback: true,
    });
  }
}

/**
 * POST /api/chat/generate-plan
 * Generate a personalized diet + workout plan.
 * Body: { age, gender, height, weight, goal, activityLevel, dietaryPreference }
 */
export async function generatePlan(req, res) {
  try {
    const { age, gender, height, weight, goal, activityLevel, dietaryPreference } = req.body;

    // Validate required fields
    if (!age || !gender || !height || !weight || !goal || !activityLevel || !dietaryPreference) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const groq = getGroqAI();
    if (!groq) {
      // Return a static fallback plan when API key is not configured
      return res.json({
        fallback: true,
        plan: generateFallbackPlan({ age, gender, height, weight, goal, activityLevel, dietaryPreference }),
      });
    }

    const prompt = `You are Pulse AI Coach, a professional fitness and nutrition expert.
Based on the following user profile, generate a personalized daily diet plan and workout plan.

User Profile:
- Age: ${age}
- Gender: ${gender}
- Height: ${height} cm
- Weight: ${weight} kg
- Fitness Goal: ${goal}
- Activity Level: ${activityLevel}
- Dietary Preference: ${dietaryPreference}
- BMI: ${(weight / ((height / 100) ** 2)).toFixed(1)}

Respond in this exact JSON format (no markdown, just raw JSON):
{
  "summary": "Brief 1-2 sentence personalized summary",
  "dailyCalories": number,
  "macros": { "protein": "Xg", "carbs": "Xg", "fats": "Xg" },
  "diet": [
    { "meal": "Breakfast", "time": "8:00 AM", "items": ["item1", "item2"], "calories": number },
    { "meal": "Snack", "time": "10:30 AM", "items": ["item1"], "calories": number },
    { "meal": "Lunch", "time": "1:00 PM", "items": ["item1", "item2"], "calories": number },
    { "meal": "Snack", "time": "4:00 PM", "items": ["item1"], "calories": number },
    { "meal": "Dinner", "time": "7:00 PM", "items": ["item1", "item2"], "calories": number }
  ],
  "workout": [
    { "exercise": "name", "sets": number, "reps": "X-X", "rest": "Xs" }
  ],
  "tips": ["tip1", "tip2", "tip3"]
}`;

    const response = await withTimeout(
      groq.chat.completions.create({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [{ role: "user", content: prompt }],
      }),
      15000
    );
    let text = response.choices[0].message.content;

    text = text.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();

    // Secondary fallback cleanup to catch rogue markdown formatting
    if (text.startsWith("{") && !text.endsWith("}")) {
      const lastBrace = text.lastIndexOf("}");
      if (lastBrace > -1) text = text.substring(0, lastBrace + 1);
    }

    try {
      const plan = JSON.parse(text);
      return res.json({ plan });
    } catch (parseError) {
      console.error("AI JSON Parse Error:", parseError.message);
      // If JSON parsing fails, return the fallback plan
      return res.json({
        fallback: true,
        plan: generateFallbackPlan({ age, gender, height, weight, goal, activityLevel, dietaryPreference }),
        rawResponse: text,
      });
    }
  } catch (error) {
    console.error("Plan generation error:", error.message);

    let statusCode = 500;
    let errorMessage = "Failed to generate plan";

    if (error.message === "AI_TIMEOUT") {
      statusCode = 504;
      errorMessage = "AI generation timed out";
    } else if (error.status === 429) {
      statusCode = 429;
      errorMessage = "AI Quota Exceeded";
    } else if (error.status === 403 || error.status === 401) {
      statusCode = 403;
      errorMessage = "API Configuration Error";
    }

    return res.status(statusCode).json({
      error: errorMessage,
      fallback: true,
      plan: generateFallbackPlan(req.body),
    });
  }
}

/**
 * Generate a static fallback plan when API is unavailable
 */
function generateFallbackPlan({ age, gender, height, weight, goal, activityLevel, dietaryPreference }) {
  const bmi = (weight / ((height / 100) ** 2)).toFixed(1);
  const isVeg = dietaryPreference?.toLowerCase().includes("veg");

  let dailyCalories = 2000;
  if (goal === "Fat Loss") dailyCalories = 1600;
  else if (goal === "Muscle Gain") dailyCalories = 2500;

  if (activityLevel === "Very Active") dailyCalories += 300;
  else if (activityLevel === "Sedentary") dailyCalories -= 200;

  return {
    summary: `Based on your BMI of ${bmi} and goal of ${goal.toLowerCase()}, here's your personalized plan. ${gender === "Male" ? "Protein intake is prioritized" : "Balanced macro distribution"} for optimal results.`,
    dailyCalories,
    macros: {
      protein: `${Math.round(dailyCalories * 0.3 / 4)}g`,
      carbs: `${Math.round(dailyCalories * 0.4 / 4)}g`,
      fats: `${Math.round(dailyCalories * 0.3 / 9)}g`,
    },
    diet: [
      { meal: "Breakfast", time: "8:00 AM", items: isVeg ? ["Oatmeal with berries & almond butter", "Green smoothie"] : ["Scrambled eggs with spinach", "Whole wheat toast", "Black coffee"], calories: Math.round(dailyCalories * 0.25) },
      { meal: "Morning Snack", time: "10:30 AM", items: isVeg ? ["Mixed nuts & dried fruits"] : ["Greek yogurt with honey"], calories: Math.round(dailyCalories * 0.1) },
      { meal: "Lunch", time: "1:00 PM", items: isVeg ? ["Quinoa bowl with roasted vegetables", "Lentil soup"] : ["Grilled chicken breast", "Brown rice", "Steamed broccoli"], calories: Math.round(dailyCalories * 0.3) },
      { meal: "Afternoon Snack", time: "4:00 PM", items: isVeg ? ["Hummus with carrot sticks"] : ["Protein shake", "Apple"], calories: Math.round(dailyCalories * 0.1) },
      { meal: "Dinner", time: "7:00 PM", items: isVeg ? ["Tofu stir-fry with vegetables", "Brown rice"] : ["Salmon fillet", "Sweet potato", "Mixed salad"], calories: Math.round(dailyCalories * 0.25) },
    ],
    workout: goal === "Fat Loss" ? [
      { exercise: "Jump Rope", sets: 3, reps: "60 sec", rest: "30s" },
      { exercise: "Bodyweight Squats", sets: 4, reps: "15-20", rest: "45s" },
      { exercise: "Push-ups", sets: 3, reps: "12-15", rest: "45s" },
      { exercise: "Mountain Climbers", sets: 3, reps: "30 sec", rest: "30s" },
      { exercise: "Plank", sets: 3, reps: "45 sec", rest: "30s" },
      { exercise: "Burpees", sets: 3, reps: "10-12", rest: "60s" },
    ] : [
      { exercise: "Barbell Squat", sets: 4, reps: "8-10", rest: "90s" },
      { exercise: "Bench Press", sets: 4, reps: "8-10", rest: "90s" },
      { exercise: "Bent-over Row", sets: 4, reps: "8-12", rest: "75s" },
      { exercise: "Overhead Press", sets: 3, reps: "10-12", rest: "75s" },
      { exercise: "Romanian Deadlift", sets: 3, reps: "10-12", rest: "90s" },
      { exercise: "Plank", sets: 3, reps: "60 sec", rest: "45s" },
    ],
    tips: [
      "Stay hydrated — aim for 3+ liters of water daily",
      "Get 7-8 hours of quality sleep for optimal recovery",
      `${goal === "Fat Loss" ? "Maintain a caloric deficit of 300-500 kcal" : "Focus on progressive overload in your workouts"}`,
    ],
  };
}

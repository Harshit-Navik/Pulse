export interface Exercise {
  id: string;
  name: string;
  image: string;
  targetMuscle: string;
  secondaryMuscles: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  description: string;
  steps: string[];
  mistakes: string[];
  tips: string[];
  formImages: string[];
}

export const exercises: Exercise[] = [
  // CHEST
  {
    id: "chest-bench-press",
    name: "Barbell Bench Press",
    image: "/images/exercises/bench-press.jpg",
    targetMuscle: "Chest",
    secondaryMuscles: ["Triceps", "Front Deltoids"],
    difficulty: "Intermediate",
    description: "The classic compound movement for building upper body pushing strength and chest hypertrophy.",
    steps: [
      "Lie flat on the bench with your eyes directly under the bar.",
      "Grip the bar slightly wider than shoulder-width apart.",
      "Unrack the bar by straightening your arms.",
      "Lower the bar to your mid-chest with control, keeping your elbows tucked at around 45 degrees.",
      "Press the bar back up to the starting position."
    ],
    mistakes: [
      "Bouncing the bar off the chest.",
      "Flaring elbows horizontally (increases shoulder injury risk).",
      "Lifting hips off the bench during the push."
    ],
    tips: [
      "Squeeze your shoulder blades together to create a stable base.",
      "Drive through your feet to engage your lower body."
    ],
    formImages: []
  },
  {
    id: "chest-incline-db-press",
    name: "Incline Dumbbell Press",
    image: "/images/exercises/incline-db-press.jpg",
    targetMuscle: "Chest",
    secondaryMuscles: ["Front Deltoids", "Triceps"],
    difficulty: "Intermediate",
    description: "An isolation-compound hybrid targeting the upper fibers of the pectoralis major.",
    steps: [
      "Set an adjustable bench to a 30-45 degree incline.",
      "Sit back with a dumbbell in each hand resting on your thighs.",
      "Kick the weights up to shoulder level.",
      "Press the dumbbells straight up until your arms are fully extended.",
      "Lower the weights slowly until you feel a deep stretch in your chest."
    ],
    mistakes: [
      "Setting the bench too high (shifts focus entirely to front delts).",
      "Clanging the dumbbells together at the top (loss of tension)."
    ],
    tips: [
      "Keep a slight bend in your arms at the top to maintain tension.",
      "Lower the weight slowly (2-3 seconds) to maximize hypertrophy."
    ],
    formImages: []
  },
  {
    id: "chest-fly",
    name: "Cable Chest Fly",
    image: "/images/exercises/chest-fly.jpg",
    targetMuscle: "Chest",
    secondaryMuscles: ["Front Deltoids"],
    difficulty: "Beginner",
    description: "An isolation movement that maintains constant tension on the chest through the entire range of motion.",
    steps: [
      "Set the cable pulleys at chest height or slightly above.",
      "Grab the handles and step forward in a staggered stance.",
      "Keep a slight bend in your elbows and open your arms wide.",
      "Squeeze your chest to bring your hands together in front of you.",
      "Slowly return to the starting position."
    ],
    mistakes: [
      "Bending the arms too much, turning it into a press.",
      "Using momentum by swinging the torso."
    ],
    tips: [
      "Imagine hugging a massive tree.",
      "Pause for a split second at peak contraction."
    ],
    formImages: []
  },
  {
    id: "chest-pushup",
    name: "Push-up",
    image: "/images/exercises/pushup.jpg",
    targetMuscle: "Chest",
    secondaryMuscles: ["Triceps", "Core", "Front Deltoids"],
    difficulty: "Beginner",
    description: "The fundamental bodyweight pushing exercise.",
    steps: [
      "Start in a high plank position with your hands slightly wider than shoulder-width.",
      "Lower your body until your chest is just above the floor.",
      "Push back up to the starting position."
    ],
    mistakes: [
      "Sagging the lower back.",
      "Flaring elbows 90 degrees out.",
      "Half-reps (not going fully down)."
    ],
    tips: [
      "Keep your core and glutes squeezed tight.",
      "Tuck elbows slightly (arrow shape instead of T shape)."
    ],
    formImages: []
  },

  // BACK
  {
    id: "back-pullup",
    name: "Pull-ups",
    image: "/images/exercises/pullup.jpg",
    targetMuscle: "Back",
    secondaryMuscles: ["Biceps", "Lats", "Core"],
    difficulty: "Advanced",
    description: "The king of upper body pulling exercises, building a wide 'V-taper' back.",
    steps: [
      "Grip the pull-up bar with an overhand grip slightly wider than shoulder-width.",
      "Hang with your arms fully extended (dead hang).",
      "Pull yourself up by driving your elbows down and back until your chin clears the bar.",
      "Lower yourself with control back to the dead hang."
    ],
    mistakes: [
      "Using swinging momentum (kipping) instead of strict strength.",
      "Not completing the full range of motion.",
      "Rounding the shoulders forward at the top."
    ],
    tips: [
      "Think about pulling your elbows to your waist rather than pulling your chin over the bar.",
      "Keep your core tight and feet together to prevent swinging."
    ],
    formImages: []
  },
  {
    id: "back-lat-pulldown",
    name: "Lat Pulldown",
    image: "/images/exercises/lat-pulldown.jpg",
    targetMuscle: "Back",
    secondaryMuscles: ["Biceps", "Rear Deltoids"],
    difficulty: "Beginner",
    description: "A machine-based vertical pull excellent for isolating the latissimus dorsi.",
    steps: [
      "Sit at a pulldown machine and adjust the knee pad so you are locked in.",
      "Grip the bar slightly wider than shoulder-width.",
      "Pull the bar down to your upper chest while leaning slightly back.",
      "Squeeze your lats at the bottom, then slowly return the bar to the top."
    ],
    mistakes: [
      "Using too much momentum by throwing the torso back.",
      "Pulling the bar behind the neck (dangerous for rotator cuffs).",
      "Using the biceps too much instead of the back."
    ],
    tips: [
      "Use a thumbless 'hook' grip to reduce bicep involvement.",
      "Lead the pull with your elbows, not your hands."
    ],
    formImages: []
  },
  {
    id: "back-deadlift",
    name: "Conventional Deadlift",
    image: "/images/exercises/deadlift.jpg",
    targetMuscle: "Back",
    secondaryMuscles: ["Glutes", "Hamstrings", "Core"],
    difficulty: "Advanced",
    description: "The ultimate test of total body strength, hitting the entire posterior chain.",
    steps: [
      "Stand with your mid-foot under the barbell.",
      "Bend over and grab the bar with a shoulder-width grip.",
      "Bend your knees until your shins touch the bar.",
      "Lift your chest to straighten your lower back.",
      "Take a deep breath, brace your core, and stand up with the weight."
    ],
    mistakes: [
      "Rounding the lower back during the pull.",
      "Letting the bar drift away from the legs.",
      "Jerking the bar off the floor instead of creating tension first."
    ],
    tips: [
      "Drag the bar up your shins and thighs.",
      "Think 'push the floor away' with your feet rather than 'pulling' the bar."
    ],
    formImages: []
  },
  {
    id: "back-barbell-row",
    name: "Barbell Row",
    image: "/images/exercises/barbell-row.jpg",
    targetMuscle: "Back",
    secondaryMuscles: ["Biceps", "Lats", "Rhomboids"],
    difficulty: "Intermediate",
    description: "A heavy horizontal pulling movement that builds back thickness.",
    steps: [
      "Hold a barbell with an overhand grip slightly wider than shoulder-width.",
      "Hinge at the hips until your torso is roughly parallel to the floor.",
      "Pull the barbell toward your lower ribs or belly button.",
      "Squeeze your shoulder blades together at the top, then lower the bar with control."
    ],
    mistakes: [
      "Standing up too upright (turns it into a shrug).",
      "Using momentum to swing the weight up.",
      "Rounding the lower back."
    ],
    tips: [
      "Keep your head neutral; don't crane your neck backward.",
      "Pull with your elbows to maximize back engagement."
    ],
    formImages: []
  },
  {
    id: "back-cable-row",
    name: "Seated Cable Row",
    image: "/images/exercises/cable-row.jpg",
    targetMuscle: "Back",
    secondaryMuscles: ["Biceps", "Mid-back"],
    difficulty: "Beginner",
    description: "A stable horizontal pull perfect for intermediate back volume.",
    steps: [
      "Sit at the machine with your feet on the platforms and knees slightly bent.",
      "Grab the V-bar handle and sit up straight with your shoulders pulled back.",
      "Pull the handle toward your stomach by driving your elbows backward.",
      "Extend your arms fully to return the weight while allowing a slight stretch in your back."
    ],
    mistakes: [
      "Swinging the torso wildly backward and forward.",
      "Rounding the shoulders forward at the contraction."
    ],
    tips: [
      "Keep your chest proud and stationary.",
      "Squeeze a pencil between your shoulder blades at the peak contraction."
    ],
    formImages: []
  },

  // LEGS
  {
    id: "legs-squats",
    name: "Barbell Back Squat",
    image: "/images/exercises/squats.jpg",
    targetMuscle: "Legs",
    secondaryMuscles: ["Glutes", "Core", "Lower Back"],
    difficulty: "Intermediate",
    description: "The undisputed king of leg exercises for overall lower body mass and strength.",
    steps: [
      "Step under the barbell and rest it across your upper back/traps.",
      "Unrack the weight and step back, placing your feet shoulder-width apart.",
      "Brace your core and push your hips back to begin the descent.",
      "Squat down until your hips are below your knees (or parallel).",
      "Drive through your mid-foot to stand back up."
    ],
    mistakes: [
      "Knees caving inward (valgus collapse) during the ascent.",
      "Heels lifting off the ground.",
      "Rounding the lower back (butt wink) excessively."
    ],
    tips: [
      "Keep your chest up and look straight ahead.",
      "Drive your knees actively outward in the same direction as your toes."
    ],
    formImages: []
  },
  {
    id: "legs-leg-press",
    name: "Leg Press",
    image: "/images/exercises/leg-press.jpg",
    targetMuscle: "Legs",
    secondaryMuscles: ["Glutes", "Hamstrings"],
    difficulty: "Beginner",
    description: "A machine-based leg builder that allows for heavy loads without stressing the spine.",
    steps: [
      "Sit in the leg press machine and place your feet shoulder-width apart on the sled.",
      "Unrack the weight and slowly lower the sled towards your chest.",
      "Stop when your knees hit a 90-degree angle.",
      "Press the sled back up without completely locking out your knees."
    ],
    mistakes: [
      "Hyperextending and locking out the knees under heavy load.",
      "Lowering the weight too far until the lower back rounds off the pad.",
      "Half-repping with too much weight."
    ],
    tips: [
      "Place your feet lower on the platform for more quad emphasis, higher for more glute/ham emphasis.",
      "Keep your lower back pressed firmly against the seat at all times."
    ],
    formImages: []
  },
  {
    id: "legs-lunges",
    name: "Walking Lunges",
    image: "/images/exercises/lunges.jpg",
    targetMuscle: "Legs",
    secondaryMuscles: ["Glutes", "Core"],
    difficulty: "Intermediate",
    description: "A unilateral movement essential for leg symmetry and balance.",
    steps: [
      "Stand tall holding dumbbells in each hand (optional).",
      "Take a large step forward with your right leg.",
      "Lower your hips until both knees are bent at a 90-degree angle.",
      "Push off your right foot to step forward with your left leg into the next lunge."
    ],
    mistakes: [
      "Stepping too narrow, acting like a tightrope walker (lose balance).",
      "Letting the front knee bash into the floor."
    ],
    tips: [
      "Lean the torso forward slightly to target the glutes more.",
      "Keep your core tight to prevent wobbling."
    ],
    formImages: []
  },
  {
    id: "legs-rdl",
    name: "Romanian Deadlift",
    image: "/images/exercises/rdl.jpg",
    targetMuscle: "Legs",
    secondaryMuscles: ["Hamstrings", "Glutes", "Lower Back"],
    difficulty: "Intermediate",
    description: "A hip-hinge exercise that strictly isolates the hamstrings and glutes.",
    steps: [
      "Hold a barbell or dumbbells in front of your thighs with a shoulder-width grip.",
      "Keep your legs relatively straight with just a slight, soft bend in the knees.",
      "Push your hips straight backward, lowering the weight until you feel a deep stretch in the hamstrings.",
      "Squeeze your glutes to drive your hips forward and return to the start."
    ],
    mistakes: [
      "Bending the knees too much (turns it into a squat).",
      "Rounding the upper or lower back.",
      "Reaching for the floor instead of pushing the hips back."
    ],
    tips: [
      "Keep the bar dragging lightly against your legs the entire time.",
      "Look down as you hinge, keeping your neck neutral."
    ],
    formImages: []
  },
  {
    id: "legs-calf-raises",
    name: "Standing Calf Raises",
    image: "/images/exercises/calf-raises.jpg",
    targetMuscle: "Legs",
    secondaryMuscles: ["Calves"],
    difficulty: "Beginner",
    description: "The primary isolation movement for developing the gastrocnemius muscle.",
    steps: [
      "Stand on an elevated edge inside a calf raise machine or holding a dumbbell.",
      "Lower your heels as far down as possible to get a deep stretch.",
      "Push through the balls of your feet to raise your heels as high as possible.",
      "Hold the peak contraction for a second, then lower slowly."
    ],
    mistakes: [
      "Bouncing the weight up and down rapidly (uses Achilles tendon instead of the muscle).",
      "Not getting a full stretch at the bottom."
    ],
    tips: [
      "Pause for 2 full seconds at the bottom stretch phase of every rep.",
      "Focus on pushing through your big toe."
    ],
    formImages: []
  },
  {
    id: "legs-extension",
    name: "Leg Extensions",
    image: "/images/exercises/leg-extension.jpg",
    targetMuscle: "Legs",
    secondaryMuscles: ["Quadriceps"],
    difficulty: "Beginner",
    description: "An isolation exercise that puts massive tension on the quadriceps.",
    steps: [
      "Sit on the machine so the pad rests on your lower shins, just above the feet.",
      "Grip the handles firmly.",
      "Extend your legs fully to lift the weight.",
      "Squeeze your quads hard at the top before slowly lowering the weight."
    ],
    mistakes: [
      "Using too much weight and throwing the body backward.",
      "Not locking out at the peak."
    ],
    tips: [
      "Point your toes slightly outward to target the vastus medialis (teardrop).",
      "This is a detail exercise; focus on control, not massive weight."
    ],
    formImages: []
  },

  // SHOULDERS
  {
    id: "shoulders-overhead-press",
    name: "Overhead Barbell Press",
    image: "/images/exercises/overhead-press.jpg",
    targetMuscle: "Shoulders",
    secondaryMuscles: ["Triceps", "Upper Chest", "Core"],
    difficulty: "Intermediate",
    description: "A foundational strength movement for massive, functional shoulders.",
    steps: [
      "Hold the barbell at shoulder height, gripping it slightly wider than your shoulders.",
      "Brace your core and squeeze your glutes.",
      "Press the bar straight up overhead, moving your head slightly back to clear the bar.",
      "Once the bar clears your head, push your head through 'the window' created by your arms.",
      "Lower the bar under control back to your chest/shoulders."
    ],
    mistakes: [
      "Leaning back excessively, turning it into a standing incline chest press.",
      "Using leg drive (turns it into a push press rather than a strict press)."
    ],
    tips: [
      "Keep your forearms perfectly vertical when viewing from the front and side.",
      "Squeeze your glutes to protect your lower back from overarching."
    ],
    formImages: []
  },
  {
    id: "shoulders-lateral-raises",
    name: "Dumbbell Lateral Raises",
    image: "/images/exercises/lateral-raises.jpg",
    targetMuscle: "Shoulders",
    secondaryMuscles: ["Side Deltoids", "Traps"],
    difficulty: "Beginner",
    description: "The absolute best isolation exercise to build width (the 'boulder shoulder' look).",
    steps: [
      "Stand holding a dumbbell in each hand by your sides.",
      "Keep a slight bend in your elbows and lean slightly forward.",
      "Raise the dumbbells out to the sides until your arms are parallel to the floor.",
      "Slowly lower the dumbbells back to the starting position."
    ],
    mistakes: [
      "Using momentum to swing heavy weight up.",
      "Raising the dumbbells higher than your shoulders (engages traps instead).",
      "Locking elbows completely straight."
    ],
    tips: [
      "Imagine pouring water out of two pitchers at the top to target the side delt.",
      "Lift the weight slightly in front of your body (the scapular plane), not directly to the sides."
    ],
    formImages: []
  },
  {
    id: "shoulders-front-raises",
    name: "Cable Front Raises",
    image: "/images/exercises/front-raises.jpg",
    targetMuscle: "Shoulders",
    secondaryMuscles: ["Front Deltoids", "Upper Chest"],
    difficulty: "Beginner",
    description: "An isolation exercise specifically targeting the anterior (front) head of the deltoids.",
    steps: [
      "Attach a straight bar to a low cable pulley.",
      "Stand facing away from the pulley, cable running between your legs.",
      "With straight arms, raise the bar up in front of you to shoulder level.",
      "Lower it with strict control."
    ],
    mistakes: [
      "Swinging the body backward to lift the bar.",
      "Using excessive weight, shifting tension to the traps."
    ],
    tips: [
      "Since bench pressing targets front delts heavily, this is usually needed only for advanced aesthetic isolation.",
      "Keep your shoulders depressed down; do not shrug."
    ],
    formImages: []
  },
  {
    id: "shoulders-face-pulls",
    name: "Cable Face Pulls",
    image: "/images/exercises/face-pulls.jpg",
    targetMuscle: "Shoulders",
    secondaryMuscles: ["Rear Deltoids", "Rotator Cuff", "Traps"],
    difficulty: "Intermediate",
    description: "A crucial exercise for shoulder health, posture, and rear deltoid development.",
    steps: [
      "Set a cable pulley to upper chest height and attach a rope.",
      "Grab the rope with an overhand grip, thumbs pointing back toward you.",
      "Pull the rope directly toward your face, letting your hands split apart past your ears.",
      "At the peak, externally rotate your shoulders so your hands are higher than your elbows.",
      "Return the weight with control."
    ],
    mistakes: [
      "Pulling too heavy, leading to a rowing motion instead of external rotation.",
      "Keeping the elbows lower than the hands."
    ],
    tips: [
      "Think about pulling the center of the rope to the bridge of your nose.",
      "Perform these with higher reps (12-20) for shoulder health."
    ],
    formImages: []
  },

  // ARMS
  {
    id: "arms-bicep-curl",
    name: "Dumbbell Bicep Curl",
    image: "/images/exercises/bicep-curl.jpg",
    targetMuscle: "Arms",
    secondaryMuscles: ["Biceps", "Forearms"],
    difficulty: "Beginner",
    description: "The classic isolation exercise for the biceps brachii.",
    steps: [
      "Stand holding a dumbbell in each hand, palms facing forward (supinated).",
      "Keep your elbows pinned to your sides.",
      "Curl the weights up toward your shoulders, squeezing the biceps hard.",
      "Lower the dumbbells all the way down to full arm extension."
    ],
    mistakes: [
      "Swinging the back to heave the weight up (cheat curls).",
      "Letting the elbows drift forward (takes tension off the bicep).",
      "Not extending the arm fully at the bottom."
    ],
    tips: [
      "Keep your wrists straight to prevent forearm fatigue before your biceps.",
      "Squeeze your triceps at the very bottom of the movement to guarantee full extension."
    ],
    formImages: []
  },
  {
    id: "arms-hammer-curl",
    name: "Hammer Curl",
    image: "/images/exercises/hammer-curl.jpg",
    targetMuscle: "Arms",
    secondaryMuscles: ["Brachialis", "Forearms"],
    difficulty: "Beginner",
    description: "A variation that builds the brachialis muscle, adding width to the arm.",
    steps: [
      "Hold a dumbbell in each hand with palms facing each other (neutral grip).",
      "Keeping your elbows fixed at your sides, curl the weights up.",
      "Squeeze at the top, then lower slowly back to the start."
    ],
    mistakes: [
      "Swinging the weight.",
      "Dropping the weights down uncontrollably."
    ],
    tips: [
      "Curl slightly across your body for a stronger contraction.",
      "You can typically lift slightly more weight with hammer curls than standard curls."
    ],
    formImages: []
  },
  {
    id: "arms-tricep-dips",
    name: "Tricep Dips",
    image: "/images/exercises/tricep-dips.jpg",
    targetMuscle: "Arms",
    secondaryMuscles: ["Triceps", "Lower Chest", "Front Deltoids"],
    difficulty: "Intermediate",
    description: "An exceptional bodyweight compound movement heavily taxing the triceps.",
    steps: [
      "Mount the dip bars holding yourself in the air with locked arms.",
      "Keep your torso completely vertical (do not lean forward).",
      "Lower your body by bending your elbows until they reach a 90-degree angle.",
      "Press through the heel of your palms to raise yourself back up."
    ],
    mistakes: [
      "Leaning forward (this shifts focus to the chest).",
      "Going down too low, placing extreme stress on the shoulder capsule.",
      "Flaring elbows completely outward."
    ],
    tips: [
      "Keep your elbows tucked in close to your ribs.",
      "If you cannot perform a bodyweight dip, use an assisted dip machine."
    ],
    formImages: []
  },
  {
    id: "arms-tricep-pushdown",
    name: "Cable Tricep Pushdown",
    image: "/images/exercises/tricep-pushdown.jpg",
    targetMuscle: "Arms",
    secondaryMuscles: ["Triceps"],
    difficulty: "Beginner",
    description: "A cable isolation exercise strictly targeting the triceps.",
    steps: [
      "Attach a rope or V-bar to a high pulley.",
      "Grab the attachment and bring your elbows down to the sides of your body.",
      "Push the attachment down until your arms are fully locked out.",
      "Squeeze the triceps hard, then return until your forearms are parallel to the floor."
    ],
    mistakes: [
      "Letting the elbows drift forward and up during the eccentric phase.",
      "Using the torso to press the weight down."
    ],
    tips: [
      "If using a rope, pull the ends apart at the absolute bottom for a sharper contraction.",
      "Pretend your elbows are bolted to your ribs."
    ],
    formImages: []
  },
  {
    id: "arms-skull-crushers",
    name: "Skull Crushers",
    image: "/images/exercises/skull-crushers.jpg",
    targetMuscle: "Arms",
    secondaryMuscles: ["Triceps"],
    difficulty: "Intermediate",
    description: "A supine extension movement targeting all three heads of the triceps.",
    steps: [
      "Lie flat on a bench holding an EZ curl bar straight up over your chest.",
      "Keeping your upper arms perfectly still, bend your elbows to lower the bar toward your forehead.",
      "Stop when the bar is an inch from your skull (or slightly behind your head for a deeper stretch).",
      "Extend your arms back to the starting position."
    ],
    mistakes: [
      "Moving the upper arms (turning it into a pullover).",
      "Flaring elbows excessively."
    ],
    tips: [
      "Lower the bar slightly behind the head instead of exactly on the forehead to keep constant tension.",
      "Use an EZ bar instead of a straight bar to protect your wrists."
    ],
    formImages: []
  },

  // CORE
  {
    id: "core-plank",
    name: "Forearm Plank",
    image: "/images/exercises/plank.jpg",
    targetMuscle: "Core",
    secondaryMuscles: ["Abs", "Lower Back", "Shoulders"],
    difficulty: "Beginner",
    description: "An isometric hold that builds endurance across the entire core musculature.",
    steps: [
      "Start face down on the floor resting on your forearms and knees.",
      "Step your feet back to form a straight line from your head to your heels.",
      "Squeeze your core, glutes, and quads.",
      "Hold this position without letting your hips drop or spike up."
    ],
    mistakes: [
      "Hips sagging toward the floor (strains the lower back).",
      "Piking the hips straight up in the air into a V-shape.",
      "Looking straight up or holding your breath."
    ],
    tips: [
      "Actively pull your elbows toward your toes to massively increase abdominal tension.",
      "Focus on slow, controlled breathing while remaining extremely tight."
    ],
    formImages: []
  },
  {
    id: "core-crunches",
    name: "Crunches",
    image: "/images/exercises/crunches.jpg",
    targetMuscle: "Core",
    secondaryMuscles: ["Abs"],
    difficulty: "Beginner",
    description: "The traditional isolation exercise for hitting the upper rectus abdominis.",
    steps: [
      "Lie on your back with knees bent and feet flat on the floor.",
      "Place your hands lightly behind your head without pulling your neck.",
      "Contract your abs to curl your shoulders off the floor.",
      "Pause for a second, then resist gravity on the way back down."
    ],
    mistakes: [
      "Yanking the neck forward with the hands.",
      "Going entirely up into a sit-up and losing tension on the abs."
    ],
    tips: [
      "Imagine sliding your ribcage down toward your pelvis.",
      "Exhale hard at the top of the crunch."
    ],
    formImages: []
  },
  {
    id: "core-russian-twists",
    name: "Russian Twists",
    image: "/images/exercises/russian-twists.jpg",
    targetMuscle: "Core",
    secondaryMuscles: ["Obliques"],
    difficulty: "Intermediate",
    description: "A rotational core movement excellent for building oblique strength.",
    steps: [
      "Sit on the floor with knees bent, leaning back slightly to form a V-shape.",
      "Lift your feet slightly off the floor (or keep them planted for an easier version).",
      "Clasp your hands together or hold a medicine ball.",
      "Twist your torso to the right, tapping the ground by your hip.",
      "Twist back to the left side and repeat."
    ],
    mistakes: [
      "Only moving the arms and not rotating the actual torso.",
      "Jerking rapidly to bounce the weight."
    ],
    tips: [
      "Keep your eyes on your hands so your shoulders rotate naturally.",
      "Slow down the movement to eliminate momentum and maximize the burn."
    ],
    formImages: []
  },
  {
    id: "core-hanging-leg-raises",
    name: "Hanging Leg Raises",
    image: "/images/exercises/hanging-leg-raises.jpg",
    targetMuscle: "Core",
    secondaryMuscles: ["Lower Abs", "Hip Flexors"],
    difficulty: "Advanced",
    description: "A brutally effective movement targeting the lower portion of the abdominal wall.",
    steps: [
      "Hang completely straight from a pull-up bar with an overhand grip.",
      "Keeping your legs perfectly straight, contract your abs to pull your legs up.",
      "Raise them until they are parallel to the floor (or higher until feet touch the bar).",
      "Lower incredibly slowly to avoid swinging."
    ],
    mistakes: [
      "Swinging wildly to create momentum.",
      "Slightly leaning back rather than curling the pelvis up.",
      "Dropping the legs quickly instead of controlling the descent."
    ],
    tips: [
      "If you are swinging, pause at the bottom dead hang before starting the next rep.",
      "If straight legs are too difficult, perform hanging *knee* raises."
    ],
    formImages: []
  }
];

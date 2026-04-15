import mongoose from 'mongoose';
import bcrypt    from 'bcryptjs';
import crypto    from 'crypto';
import dotenv    from 'dotenv';
import path      from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

import User    from './src/models/User.js';
import Project from './src/models/Project.js';
import Event   from './src/models/Event.js';
import Funnel  from './src/models/Funnel.js';


let seedValue = 20260415;

function random() {
  seedValue = (seedValue * 1664525 + 1013904223) & 0xffffffff;
  return (seedValue >>> 0) / 4294967296;
}

function randomInt(min, max) {
  return Math.floor(random() * (max - min + 1)) + min;
}

function pickRandom(array) {
  return array[Math.floor(random() * array.length)];
}

function timestampDaysAgo(daysAgo, minutesOffset = 0) {
  if (daysAgo < 0) daysAgo = 0;
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(randomInt(8, 22), randomInt(0, 59), randomInt(0, 59), 0);
  return new Date(date.getTime() + minutesOffset * 60_000);
}


const pageList     = ['/', '/pricing', '/features', '/docs', '/blog', '/dashboard'];
const browserList  = ['Chrome', 'Safari', 'Firefox', 'Edge'];
const osList       = ['macOS', 'Windows', 'iOS', 'Android'];
const countryList  = ['US', 'IN', 'GB', 'DE', 'CA', 'AU', 'FR', 'JP'];

const eventTypes = [
  'page_view', 'button_click', 'feature_used',
  'settings_opened', 'video_played', 'error_occurred',
];

function randomUserProperties() {
  return {
    page:    pickRandom(pageList),
    browser: pickRandom(browserList),
    os:      pickRandom(osList),
    country: pickRandom(countryList),
  };
}


async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGO_URL);
  console.log('Connected.\n');

  const existingDemoUser = await User.findOne({ email: 'demo@gmail.com' });
  if (existingDemoUser) {
    const existingDemoProject = await Project.findOne({ owner: existingDemoUser._id });
    if (existingDemoProject) {
      await Event.deleteMany({ projectId: existingDemoProject._id });
      await Funnel.deleteMany({ projectId: existingDemoProject._id });
      await Project.deleteOne({ _id: existingDemoProject._id });
    }
    await User.deleteOne({ _id: existingDemoUser._id });
    console.log('Old demo data cleared.\n');
  }

  const hashedPassword = await bcrypt.hash('demo123', 10);
  const demoUser = await User.create({
    name:     'Demo User',
    email:    'demo@gmail.com',
    password: hashedPassword,
  });

  const apiKey      = crypto.randomBytes(24).toString('hex');
  const demoProject = await Project.create({
    name:  'Demo App',
    owner: demoUser._id,
    apiKey,
  });

  console.log('Demo user and project created.');
  console.log('API Key:', apiKey, '\n');

  const projectId  = demoProject._id;
  const allEvents  = [];
  let   userNumber = 1;


  console.log('Seeding daily traffic events...');

  for (let daysBack = 90; daysBack >= 0; daysBack--) {
    let eventsPerDay;
    if (daysBack < 7)       eventsPerDay = randomInt(42, 60);
    else if (daysBack < 30) eventsPerDay = randomInt(25, 42);
    else                    eventsPerDay = randomInt(10, 24);

    for (let eventIndex = 0; eventIndex < eventsPerDay; eventIndex++) {
      allEvents.push({
        projectId,
        name:       pickRandom(eventTypes),
        userId:     `anon_${randomInt(1, 100)}`,
        properties: randomUserProperties(),
        timestamp:  timestampDaysAgo(daysBack),
      });
    }
  }


  console.log('Seeding cohort retention events...');

  const retentionCohorts = [
    { weekStart: 126, numberOfUsers: 8  },
    { weekStart: 119, numberOfUsers: 10 },
    { weekStart: 112, numberOfUsers: 7  },
    { weekStart: 105, numberOfUsers: 11 },
    { weekStart: 98,  numberOfUsers: 14 },
    { weekStart: 91,  numberOfUsers: 12 },
    { weekStart: 84,  numberOfUsers: 10 },
    { weekStart: 77,  numberOfUsers: 12 },
    { weekStart: 70,  numberOfUsers: 9  },
    { weekStart: 63,  numberOfUsers: 14 },
    { weekStart: 56,  numberOfUsers: 11 },
    { weekStart: 49,  numberOfUsers: 13 },
    { weekStart: 42,  numberOfUsers: 16 },
    { weekStart: 35,  numberOfUsers: 12 },
    { weekStart: 28,  numberOfUsers: 18 },
    { weekStart: 21,  numberOfUsers: 15 },
    { weekStart: 14,  numberOfUsers: 20 },
    { weekStart:  7,  numberOfUsers: 22 },
    { weekStart:  2,  numberOfUsers: 14 },
    { weekStart:  0,  numberOfUsers: 10 },
  ];

  for (const cohort of retentionCohorts) {
    for (let userIndex = 0; userIndex < cohort.numberOfUsers; userIndex++) {
      const userId      = `user_${userNumber++}`;
      const joinedDaysAgo = cohort.weekStart + randomInt(0, 6);
      const userProps   = randomUserProperties();

      allEvents.push({ projectId, name: 'page_view',        userId, properties: userProps, timestamp: timestampDaysAgo(joinedDaysAgo) });
      allEvents.push({ projectId, name: 'signup_started',   userId, properties: userProps, timestamp: timestampDaysAgo(joinedDaysAgo, 10) });
      allEvents.push({ projectId, name: 'signup_completed', userId, properties: userProps, timestamp: timestampDaysAgo(joinedDaysAgo, 45) });

      if (random() < 0.85 && joinedDaysAgo - 1 >= 0) {
        allEvents.push({ projectId, name: 'page_view',    userId, properties: userProps, timestamp: timestampDaysAgo(joinedDaysAgo - 1) });
        allEvents.push({ projectId, name: 'feature_used', userId, properties: userProps, timestamp: timestampDaysAgo(joinedDaysAgo - 1, 20) });
      }

      if (random() < 0.70 && joinedDaysAgo - 3 >= 0) {
        allEvents.push({ projectId, name: 'page_view',    userId, properties: userProps, timestamp: timestampDaysAgo(joinedDaysAgo - 3) });
        allEvents.push({ projectId, name: 'button_click', userId, properties: userProps, timestamp: timestampDaysAgo(joinedDaysAgo - 3, 15) });
      }

      if (random() < 0.55 && joinedDaysAgo - 7 >= 0) {
        allEvents.push({ projectId, name: 'page_view',       userId, properties: userProps, timestamp: timestampDaysAgo(joinedDaysAgo - 7) });
        allEvents.push({ projectId, name: 'feature_used',    userId, properties: userProps, timestamp: timestampDaysAgo(joinedDaysAgo - 7, 30) });
        allEvents.push({ projectId, name: 'settings_opened', userId, properties: userProps, timestamp: timestampDaysAgo(joinedDaysAgo - 7, 90) });
      }

      if (random() < 0.40 && joinedDaysAgo - 14 >= 0) {
        allEvents.push({ projectId, name: 'page_view',    userId, properties: userProps, timestamp: timestampDaysAgo(joinedDaysAgo - 14) });
        allEvents.push({ projectId, name: 'feature_used', userId, properties: userProps, timestamp: timestampDaysAgo(joinedDaysAgo - 14, 50) });
      }

      if (random() < 0.25 && joinedDaysAgo - 30 >= 0) {
        allEvents.push({ projectId, name: 'page_view',          userId, properties: userProps, timestamp: timestampDaysAgo(joinedDaysAgo - 30) });
        allEvents.push({ projectId, name: 'checkout_started',   userId, properties: userProps, timestamp: timestampDaysAgo(joinedDaysAgo - 30, 25) });
        allEvents.push({ projectId, name: 'checkout_completed', userId, properties: userProps, timestamp: timestampDaysAgo(joinedDaysAgo - 30, 75) });
      }
    }
  }


  console.log('Seeding funnel conversion events...');

  for (let funnelUserIndex = 1; funnelUserIndex <= 200; funnelUserIndex++) {
    const userId        = `funnel_user_${funnelUserIndex}`;
    const signupDate    = timestampDaysAgo(randomInt(5, 35));

    allEvents.push({ projectId, name: 'page_view',         userId, properties: {}, timestamp: new Date(signupDate) });

    if (random() < 0.75) {
      allEvents.push({ projectId, name: 'signup_completed',  userId, properties: {}, timestamp: new Date(signupDate.getTime() +  180_000) });

      if (random() < 0.60) {
        allEvents.push({ projectId, name: 'checkout_started', userId, properties: {}, timestamp: new Date(signupDate.getTime() +  600_000) });

        if (random() < 0.75) {
          allEvents.push({ projectId, name: 'checkout_completed', userId, properties: {}, timestamp: new Date(signupDate.getTime() + 900_000) });
        }
      }
    }
  }

  await Event.insertMany(allEvents);
  console.log(`Inserted ${allEvents.length} total events.\n`);

  await Funnel.create({
    projectId,
    name:           'Signup to Checkout',
    steps:          ['page_view', 'signup_completed', 'checkout_started', 'checkout_completed'],
    timeWindowDays: 30,
  });


  console.log('Seed complete!');
  console.log('   Login email : demo@gmail.com');
  console.log('   Password    : demo123');
  console.log('   Project     : Demo App');


  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  mongoose.disconnect();
  process.exit(1);
});

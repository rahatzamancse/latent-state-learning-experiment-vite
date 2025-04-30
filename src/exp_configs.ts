export const FIREBASE_API_KEY = import.meta.env.VITE_FIREBASE_API_KEY ? import.meta.env.VITE_FIREBASE_API_KEY : "";
export const PROLIFIC_CODE = import.meta.env.VITE_PROLIFIC_CODE ? import.meta.env.VITE_PROLIFIC_CODE : "";
export const DEBUGGING = (import.meta.env.VITE_DEBUGGING && import.meta.env.VITE_DEBUGGING === 'true') ? true : false;
export const PROLIFIC = (import.meta.env.VITE_PROLIFIC && import.meta.env.VITE_PROLIFIC === 'false') ? false : true;
export const TRACK_EYE = (import.meta.env.VITE_TRACK_EYE && import.meta.env.VITE_TRACK_EYE === 'false') ? false : true;
export const UPLOAD_FIRESTORE = (import.meta.env.VITE_UPLOAD_FIRESTORE && import.meta.env.VITE_UPLOAD_FIRESTORE === 'false') ? false : true;
export const UPLOAD_SUPABASE = (import.meta.env.VITE_UPLOAD_SUPABASE && import.meta.env.VITE_UPLOAD_SUPABASE === 'false') ? false : true;
export const AUDIO = (import.meta.env.VITE_AUDIO && import.meta.env.VITE_AUDIO === 'false') ? false : true;
export const DOWNLOAD_AT_END = (import.meta.env.VITE_DOWNLOAD_AT_END && import.meta.env.VITE_DOWNLOAD_AT_END === 'true') ? true : false;

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ? import.meta.env.VITE_SUPABASE_URL : "";
export const SUPABASE_API_KEY = import.meta.env.VITE_SUPABASE_API_KEY ? import.meta.env.VITE_SUPABASE_API_KEY : "";

export const REWARD_PROBABILITY = 1;

if (!import.meta.env.VITE_FIREBASE_API_KEY) {
    console.error("Firebase API key not found. Please set the VITE_FIREBASE_API_KEY environment variable.");
    throw new Error("Firebase API key not found.");
}

if (!import.meta.env.VITE_SUPABASE_API_KEY) {
    console.error("Supabase API key not found. Please set the VITE_SUPABASE_API_KEY environment variable.");
    throw new Error("Supabase API key not found.");
}

if (!import.meta.env.VITE_SUPABASE_URL) {
    console.error("Supabase URL not found. Please set the VITE_SUPABASE_URL environment variable.");
    throw new Error("Supabase URL not found.");
}

// TODO: Add instruction to keep laptop/camera stable. And How to use it.


if (UPLOAD_FIRESTORE && FIREBASE_API_KEY === "") {
    console.error("Firebase API key not found. Please set the VITE_FIREBASE_API_KEY environment variable.");
    throw new Error("Firebase API key not found.");
}

if (UPLOAD_SUPABASE && SUPABASE_API_KEY === "") {
    console.error("Supabase API key not found. Please set the VITE_SUPABASE_API_KEY environment variable.");
    throw new Error("Supabase API key not found.");
}

// Initialize Firebase
export const firebaseConfig = {
    apiKey: FIREBASE_API_KEY,
    authDomain: "latent-state-learning.firebaseapp.com",
    projectId: "latent-state-learning",
    storageBucket: "latent-state-learning.appspot.com",
    messagingSenderId: "926544010648",
    appId: "1:926544010648:web:e6fb2ab9a3bc299ce31fed"
};

export const supabaseConfig = {
    url: SUPABASE_URL,
    anonKey: SUPABASE_API_KEY,
};


export const all_context_state_names = [
    ["Arcane Crystals", "Ethereal Blossoms", "Draconic Scales", "Lunar Pearls"], // tutorial
    ['Quixot', 'Wyvern', 'Eronimo', 'Rochar', 'Tynix', 'Yrton', 'Urono', 'Izor', 'Oronim', 'Pexis', 'Arctis', 'Syber'], // context 1
    ['Dynax', 'Fyxis', 'Gyron', 'Hyxel', 'Jaltra', 'Kavra', 'Lyris', 'Nexor', 'Pyloth', 'Raxor', 'Syntor', 'Virox'], // context 2
    []
    // ['Zandor', 'Bravik', 'Caldor', 'Dorath', 'Evrix', 'Fraxen', 'Glonar', 'Hesper', 'Ilmara', 'Jorath', 'Kyxen', 'Lomir'], // context 3
];
export const all_context_assigned_indices = [0, 0, 0, 0];

export const tutorial_baskets = [
    {
        image: "images/tutorial/buckets/tutorial_basket-1.png",
        name: "Bag 1",
    },
    {
        image: "images/tutorial/buckets/tutorial_basket-2.png",
        name: "Bag 2",
    },
    {
        image: "images/tutorial/buckets/tutorial_basket-3.png",
        name: "Bag 3",
    },
    {
        image: "images/tutorial/buckets/tutorial_basket-4.png",
        name: "Bag 4",
    },
];
export const BASKETS_TMP = [
    {
        color: "green",
        image: "images/baskets/basket-green.png",
        name: "Emerald Vault",
    },
    {
        color: "blue",
        image: "images/baskets/basket-blue.png",
        name: "Azure Haven",
    },
    {
        color: "red",
        image: "images/baskets/basket-red.png",
        name: "Crimson Nook",
    },
    {
        color: "yellow",
        image: "images/baskets/basket-yellow.png",
        name: "Golden Repository",
    },
];
// const BASKETS = RANDOMIZE_ACTION_ASSIGNMENTS ? shuffleIndices(4).map(i => BASKETS_TMP[i]) : BASKETS_TMP;
export const BASKETS = BASKETS_TMP;

export const tutorial_stimulus = [
    [1, 1], // stimuli, basket
    [2, 2],
    [3, 3],
    [4, 4],
].map(i => ({
    image: `images/tutorial/stimulus/tutorial_treasures-${i[0]}.png`,
    correct_action: i[1] - 1,
}));
export const context1_stimulus = [
    [1, "blue", 0] as [number, string, number],
    [2, "blue", 0] as [number, string, number],
    [3, "green", 1] as [number, string, number],
    [4, "green", 1] as [number, string, number],
].map(i => ({
    image: `images/stimulus/animal_${i[0]}.png`,
    correct_action: i[2],
}));
export const context2_stimulus = [
    [5, "red", 0] as [number, string, number],
    [6, "red", 0] as [number, string, number],
    [7, "yellow", 1] as [number, string, number],
    [8, "yellow", 1] as [number, string, number],
].map(i => ({
    image: `images/stimulus/animal_${i[0]}.png`,
    correct_action: i[2],
}));
export const context3_stimulus = [
    [1, "blue", 0] as [number, string, number],
    [2, "blue", 0] as [number, string, number],
    [3, "green", 1] as [number, string, number],
    [4, "green", 1] as [number, string, number],
    [5, "red", 2] as [number, string, number],
    [6, "red", 2] as [number, string, number],
    [7, "yellow", 3] as [number, string, number],
    [8, "yellow", 3] as [number, string, number],
].map(i => ({
    image: `images/stimulus/animal_${i[0]}.png`,
    correct_action: i[2],
}));

export const rewards = {
    correct: "images/reward/diamond-blue.png",
    incorrect: "images/reward/nodiamond.png",
}

export const AUDIO_DURATIONS = {
    cam_calibration: 8,
    cam_calibration_2: 10,
    colorland: 19,
    colorland_4bags: 11,
    colorland_help: 14,
    context_1_good_job: 9,
    context_2_good_job: 14,
    fullscreen: 7,
    great_job: 16,
    intro: 4,
    intro_2: 8,
    intro_3: 11,
    quest: 17,
    quest_bag: 13,
    relic1_bag1: 6,
    relic1_bag1_2: 7,
    relic3_bag3: 10,
    relic4_bag4: 10,
    relic4_bag4_2: 7,
    relic_1: 10,
    relic_2: 10,
    relic_3: 7,
    relic2_bag2: 6,
    relic_3_bag3_2: 6,
    relic_4: 10,
    survey_question: 11,
    task: 20,
    webgazer_calibration: 5,
}

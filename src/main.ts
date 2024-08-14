import { initJsPsych } from 'jspsych';
import jsPsychExtensionWebgazer from '@jspsych/extension-webgazer';
import jsPsychExtensionMouseTracking from '@jspsych/extension-mouse-tracking';
import jsPsychWebgazerInitCamera from '@jspsych/plugin-webgazer-init-camera';
import jsPsychWebgazerCalibrate from '@jspsych/plugin-webgazer-calibrate';
import jsPsychWebgazerValidate from '@jspsych/plugin-webgazer-validate';
import jsPsychPreload from '@jspsych/plugin-preload';
import jsPsychHtmlKeyboardResponse from './plugins/plugin-html-keyboard-response';
// import jsPsychInstructions from '@jspsych/plugin-instructions';
import jsPsychFullscreen from '@jspsych/plugin-fullscreen';
import jsPsychSurveyMultiSelect from '@jspsych/plugin-survey-multi-select';
import jsPsychHtmlButtonResponse from './plugins/plugin-html-button-response';
import jsPsychBrowserCheck from '@jspsych/plugin-browser-check';
import jsPsychDragndrop from './plugins/plugin-dragndrop';
import jsPsychPlayAudio from './extension-play-audio';
// import jsPsychAudioKeyboardResponse from '@jspsych/plugin-audio-keyboard-response';
import jsPsychCallFunction from '@jspsych/plugin-call-function';

import { initializeApp } from "firebase/app";
import { getFirestore, updateDoc, collection, doc, setDoc, arrayUnion } from "firebase/firestore";

import { getShuffledArray } from './utils';

import './styles.css';

if (!import.meta.env.VITE_FIREBASE_API_KEY) {
    console.error("Firebase API key not found. Please set the VITE_FIREBASE_API_KEY environment variable.");
    throw new Error("Firebase API key not found.");
}

const DEBUGGING = import.meta.env.VITE_DEBUGGING ? true : false;
// const DEBUGGING = false;
const TRACK_EYE = true;
const UPLOAD_FIRESTORE = DEBUGGING ? false : true;
const AUDIO = true;

// Initialize Extensions
const extensions = [];
if (TRACK_EYE) {
    extensions.push({
        type: jsPsychExtensionWebgazer,
        params: {
            auto_initialize: false,
        }
    });
}
extensions.push({
    type: jsPsychExtensionMouseTracking,
    params: {
        minimum_sample_time: 100,
    }
})
if (AUDIO)
    extensions.push({
        type: jsPsychPlayAudio,
    })

// Initialize Firebase
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "latent-state-learning.firebaseapp.com",
    projectId: "latent-state-learning",
    storageBucket: "latent-state-learning.appspot.com",
    messagingSenderId: "926544010648",
    appId: "1:926544010648:web:e6fb2ab9a3bc299ce31fed"
};
const db = UPLOAD_FIRESTORE ? getFirestore(initializeApp(firebaseConfig)) : undefined;
const docRef = UPLOAD_FIRESTORE ? doc(collection(db!, "experiments")) : undefined;

let NUMBER_OF_WRITES = 0;
if (UPLOAD_FIRESTORE) {
    setDoc(docRef!, {
        trials: [],
        date: new Date().toISOString().split('T')[0],
        time: new Date().toISOString().split('T')[1].split('.')[0],
        local_testing: import.meta.env.VITE_LOCAL_TESTING ? true : false,
    }).catch(e => {
        console.error("Error creating document: ", e);
    }).then(() => {
        console.log("Document successfully created!");
        NUMBER_OF_WRITES++;
    })
}

// const INACTIVE_TIMEOUT = 30 * 60 * 1000;
// function trialTimeOut(trial: any) {
//     console.error(`Trial timed out: ${trial}`);
//     jsPsych.endCurrentTimeline();
// }

// Initialize jsPsych
const jsPsych = initJsPsych({
    extensions: extensions,
    on_data_update: (data: any) => {
        // check if fullscreen
        // const interaction_data = jsPsych.data.getInteractionData();
        // const blur_events = interaction_data.filter({ event: 'blur' });
        // const focus_events = interaction_data.filter({ event: 'focus' });
        // const fullscreenenter_events = interaction_data.filter({ event: 'fullscreenenter' });
        // const fullscreenexit_events = interaction_data.filter({ event: 'fullscreenexit' });
        // jsPsych.data.get().addToLast({ interactions: interaction_data.csv() });
        // jsPsych.data.get().addToLast({ blur_events: blur_events.csv() });
        // jsPsych.data.get().addToLast({ focus_events: focus_events.csv() });
        // jsPsych.data.get().addToLast({ fullscreenenter_events: fullscreenenter_events.csv() });
        // jsPsych.data.get().addToLast({ fullscreenexit_events: fullscreenexit_events.csv() });
        // 






        const trialData = JSON.parse(JSON.stringify(data));
        // check if trialData has a property 'no_upload' and if it is true
        if (trialData.no_upload) {
            delete trialData.no_upload;
            return trialData;
        }
        function convertNestedArrays(obj: any) {
            for (const key in obj) {
                if (Array.isArray(obj[key])) {
                    obj[key] = obj[key].reduce((acc: any, val: any, i: number) => {
                        acc[i] = val;
                        return acc;
                    }, {});
                } else if (typeof obj[key] === "object") {
                    convertNestedArrays(obj[key]);
                }
            }
        }
        convertNestedArrays(trialData);
        if (UPLOAD_FIRESTORE) {
            updateDoc(docRef!, {
                trials: arrayUnion(trialData),
            }).catch(e => { console.error("Error storing Data: ", e) }
            ).then(() => {
                console.log("Added trial data: ", trialData);
                NUMBER_OF_WRITES++;
            });
        }
        else {
            console.log("Dry run: ", trialData);
        }
        return trialData;
    },
    on_finish: () => {
        console.log("Number of writes to Firestore: ", NUMBER_OF_WRITES);
        if (DEBUGGING)
            jsPsych.data.get().localSave('json', 'data.json');
    },
    on_trial_start: (trial: any) => {
        // trial.inactive_timeout = setTimeout(() => trialTimeOut(trial), INACTIVE_TIMEOUT);
    },
    on_trial_finish: (trial: any) => {
        // clearTimeout(trial.inactive_timeout);
    },
});


const all_context_state_names = [
    ["Arcane Crystals", "Ethereal Blossoms", "Draconic Scales", "Lunar Pearls"], // tutorial
    ['Quixot', 'Wyvern', 'Eronimo', 'Rochar', 'Tynix', 'Yrton', 'Urono', 'Izor', 'Oronim', 'Pexis', 'Arctis', 'Syber'], // context 1
    ['Dynax', 'Fyxis', 'Gyron', 'Hyxel', 'Jaltra', 'Kavra', 'Lyris', 'Nexor', 'Pyloth', 'Raxor', 'Syntor', 'Virox'], // context 2
    []
    // ['Zandor', 'Bravik', 'Caldor', 'Dorath', 'Evrix', 'Fraxen', 'Glonar', 'Hesper', 'Ilmara', 'Jorath', 'Kyxen', 'Lomir'], // context 3
];
const all_context_assigned_indices = [0, 0, 0, 0];

const tutorial_baskets = [
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
const BASKETS_TMP = [
    {
        color: "blue",
        image: "images/baskets/basket-blue.png",
        name: "Emerald Vault",
    },
    {
        color: "green",
        image: "images/baskets/basket-green.png",
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
const BASKETS = BASKETS_TMP;

const tutorial_stimulus = [
    [1, 1], // stimuli, basket
    [2, 2],
    [3, 3],
    [4, 4],
].map(i => ({
    image: `images/tutorial/stimulus/tutorial_treasures-${i[0]}.png`,
    correct_action: i[1] - 1,
}));
const context1_stimulus = [
    [1, "blue", 0],
    [2, "blue", 0],
    [3, "green", 1],
    [4, "green", 1],
].map(i => ({
    image: `images/stimulus/animal_${i[0]}.png`,
    correct_action: i[2],
}));
const context2_stimulus = [
    [5, "red", 0],
    [6, "red", 0],
    [7, "yellow", 1],
    [8, "yellow", 1],
].map(i => ({
    image: `images/stimulus/animal_${i[0]}.png`,
    correct_action: i[2],
}));
const context3_stimulus = [
    [1, "blue", 0],
    [2, "blue", 0],
    [3, "green", 1],
    [4, "green", 1],
    [5, "red", 2],
    [6, "red", 2],
    [7, "yellow", 3],
    [8, "yellow", 3],
].map(i => ({
    image: `images/stimulus/animal_${i[0]}.png`,
    correct_action: i[2],
}));

const rewards = {
    correct: "images/reward/diamond.png",
    incorrect: "images/reward/nodiamond.png",
}

// Utility functions
function getOutcome() {
    return jsPsych
        .data.get()
        .filter({ trial_type: 'dragndrop' })
        .last(1)
        .values()[0]
        .is_correct
}
function getStateEstimation() {
    return jsPsych
        .data.get()
        .filter({ trial_type: 'html-button-response' })
        .last(1)
        .values()[0]
        .estimated_state;
}
function getLastTrialTreasureName(all_treasure_names: string[]) {
    return jsPsych.data.get()
        .filter({ trial_type: 'html-button-response' })
        .last(1)
        .values()[0]
        ['estimated_state'];
}

const AUDIO_DURATIONS = {
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



const STIMULI_SIZE = 0.5;
// const BUCKET_SIZE = 200;

// Preload assets
const preload = {
    type: jsPsychPreload,
    images: [
        ...["blue", "green", "red", "yellow"].map(c => `images/baskets/basket-${c}.png`),
        ...[1, 2, 3, 4].map(i => `images/tutorial/stimulus/tutorial_treasures-${i}.png`),
        ...[1, 2, 3, 4].map(i => `images/tutorial/buckets/tutorial_basket-${i}.png`),
        ...[1, 2, 3, 4, 5, 6, 7, 8].map(i => `images/stimulus/animal_${i}.png`),
        ...["diamond", "nodiamond"].map(r => `images/reward/${r}.png`),
    ],
    audio: ["quest_bag.mp3", "cam_calibration_2.mp3", "cam_calibration.mp3", "colorland_4bags.mp3", "colorland_help.mp3", "colorland.mp3", "context-1-good-job.mp3", "context-2-good-job.mp3", "fullscreen.mp3", "great_job.mp3", "intro_2.mp3", "intro_3.mp3", "intro.mp3", "quest.mp3", "relic1_bag1_2.mp3", "relic1_bag1.mp3", "relic_1.mp3", "relic_2_bag2_2.mp3", "relic_2_bag_2.mp3", "relic_2.mp3", "relic_3_bag3_2.mp3", "relic3_bag3.mp3", "relic_3.mp3", "relic4_bag4_2.mp3", "relic4_bag4.mp3", "relic_4.mp3", "survey-question.mp3", "task.mp3", "webgazer-calibration.mp3", "camtest.mp3"].map(a => `audio/${a}`),
    video: [],
};


const welcome = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<h1>Welcome to the experiment!</h1><p>Press any key to continue.</p>`,
}

const experiment_information = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<h1>Experiment</h1>
<p>In this experiment, you will play a treasure sorting game.</p>
    <p>Press any key to continue.</p>`,
    input_register_after: DEBUGGING ? 10 : AUDIO_DURATIONS.intro * 1000,
    trial_duration: 10000,
    extensions: AUDIO ? [
        {
            type: jsPsychPlayAudio,
            params: {
                audio_path: 'audio/intro.mp3',
            }
        }
    ]: [],
}


const recording_info = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<h1>Experiment</h1>
<p>During the playing, your activity and eye movements will be recorded.</p><p>However, your video will not be recorded.</p>
    <p>Press any key to continue.</p>`,
    input_register_after: DEBUGGING ? 10 : AUDIO_DURATIONS.intro_2 * 1000,
    extensions: AUDIO ? [
        {
            type: jsPsychPlayAudio,
            params: {
                audio_path: 'audio/intro_2.mp3',
            }
        }
    ] : [],
}

const eye_calibration_intro = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<h1>Experiment</h1>
<p>In the next screen, your camera will be calibrated to track your eye properly.</p><p>Please follow the instructions properly to help us get the most accurate experiment results.</p>
    <p>Press any key to continue.</p>`,
    input_register_after: DEBUGGING ? 10 : AUDIO_DURATIONS.intro_3 * 1000,
    extensions: AUDIO? [
        {
            type: jsPsychPlayAudio,
            params: {
                audio_path: 'audio/intro_3.mp3',
            }
        }
    ] : [],
};


// Switch to fullscreen
const fullscreen = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<h1>Fullscreen</h1>
<p>For best accuracy and your attention, it is highly recommended that you play the game in fullscreen.</p>
<p>Press any key to fullscreen and continue to camera calibration.</p>`,
    input_register_after: DEBUGGING ? 10 : AUDIO_DURATIONS.fullscreen * 1000,
    extensions: AUDIO ? [
        {
            type: jsPsychPlayAudio,
            params: {
                audio_path: 'audio/fullscreen.mp3',
            }
        }
    ] : [],
}
// TODO: Always validate if the fullscreen is enabled, if not, ask them again to go fullscreen or cancel the experiment.

const browser_check = {
    type: jsPsychBrowserCheck,
    minimum_width: 1000,
    minimum_height: 600,
    inclusion_function: (data: any) => {
        return data.mobile === false && data.webcam === true
    },
    exclusion_message: (data: any) => {
        if (data.mobile) {
            return '<p>You must use a desktop/laptop computer to participate in this experiment.</p>';
        } else if (!data.webcam) {
            return '<p>You must have an active webcam for this experiment. Make sure to allow your browser to access your camera at the beginning of the experiment.</p>'
        } else if (data.width < 1000 || data.height < 600) {
            return '<p>Your screen is too small to participate in this experiment. Please use a larger screen with at least resolutions of 1000x600 pixels.</p>';
        }
    },
}


const cam_warning = {
    type: jsPsychHtmlKeyboardResponse,
    trial_duration: 2000,
    stimulus: `<h1>Please allow camera access for eye tracking.</h1><h1><span style="color: red">No video will be recorded.</span> </h1>`
}

const cam_check = {
    type: jsPsychWebgazerInitCamera,
    extensions: AUDIO ? [
        {
            type: jsPsychPlayAudio,
            params: {
                audio_path: 'audio/camtest.mp3',
            }
        }
    ] : [],
}

const calibration_guide = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<h1>Camera Calibration</h1>
    <p>Before we start the experiment, we need to calibrate your camera.</p><p>Please follow the instructions carefully.</p>
    <p>Press any key to continue.</p>`,
    input_register_after: DEBUGGING ? 10 : AUDIO_DURATIONS.cam_calibration * 1000,
    extensions: AUDIO ? [
        {
            type: jsPsychPlayAudio,
            params: {
                audio_path: 'audio/cam_calibration.mp3',
            }
        }
    ] : [],
}

const cam_calibration = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<h1>Camera Calibration</h1>
    <p>During the calibration, you will see a few dots on the screen.</p><p>Please look at the dots as they appear.</p><p>Then you need to click them with your mouse.</p>
    <p>Press any key to continue.</p>`,
    input_register_after: DEBUGGING ? 10 : AUDIO_DURATIONS.cam_calibration_2 * 1000,
    extensions: AUDIO ? [
        {
            type: jsPsychPlayAudio,
            params: {
                audio_path: 'audio/cam_calibration_2.mp3',
            }
        }
    ] : [],
}

const calibration_points = {
    type: jsPsychWebgazerCalibrate,
    calibration_points: [[25, 50], [50, 50], [75, 50], [50, 25], [50, 75]],
    calibration_mode: 'click',
    randomize_calibration_order: true,
    extensions: AUDIO ? [
        {
            type: jsPsychPlayAudio,
            params: {
                audio_path: 'audio/webgazer-calibration.mp3',
            }
        }
    ] : [],
}


// Welcome screen
const tutorial_welcome = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<h1>The Quest for the Lost Relics</h1>
<p>In a time long forgotten, the kingdom of Eldoria was known for its powerful and enchanting relics.</p><p>These relics, known as the Arcane Crystals, Ethereal Blossoms, Draconic Scales, and Lunar Pearls, were the source of magic that kept the kingdom in harmony.</p>`,
    input_register_after: DEBUGGING ? 10 : AUDIO_DURATIONS.quest * 1000,
    extensions: AUDIO? [
        {
            type: jsPsychPlayAudio,
            params: {
                audio_path: 'audio/quest.mp3',
            }
        }
    ] : [],
};
const tutorial_intro = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<p>The wise sages of Eldoria created four special bags, each designed to house one type of specific relic.</p><p>However, over the centuries, the knowledge of their correct bags was lost.</p>
        <img src="images/tutorial/buckets/tutorial_basket-1.png" width="10%" />
        <img src="images/tutorial/buckets/tutorial_basket-2.png" width="10%" />
        <img src="images/tutorial/buckets/tutorial_basket-3.png" width="10%" />
        <img src="images/tutorial/buckets/tutorial_basket-4.png" width="10%" />`,
    input_register_after: DEBUGGING ? 10 : AUDIO_DURATIONS.quest_bag * 1000,
    extensions: AUDIO? [
        {
            type: jsPsychPlayAudio,
            params: {
                audio_path: 'audio/quest_bag.mp3',
            }
        }
    ] : [],
};
const tutorial_task = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<p>Your task is to venture into the Enchanted Forest and restore the magic of Eldoria.</p><p>You will be provided with the four bags.</p><p>Each bag must contain only specific types of relics to preserve its magical energy.</p><p>After putting a relic in the correct bag, you will receive a diamond reward.</p><p>If the relic is put into a wrong bag, you will not receive any diamond.</p>`,
    input_register_after: DEBUGGING ? 10 : AUDIO_DURATIONS.task * 1000,
    extensions: AUDIO? [
        {
            type: jsPsychPlayAudio,
            params: {
                audio_path: 'audio/task.mp3',
            }
        }
    ] : [],
};


// Tutorial start
const tutorialFixationPoint = {
    type: jsPsychWebgazerValidate,
    validation_points: [[0, 0]],
    validation_point_coordinates: 'center-offset-pixels',
    roi_radius: 100,
    show_validation_data: DEBUGGING ? true : false,
    data: {
        my_trial_type: 'fixation-point',
    }
}

const tutorialStateEstimation = {
    type: jsPsychHtmlButtonResponse,
    stimulus: () => `<img src="${jsPsych.timelineVariable('stimuli_path')}" width="${STIMULI_SIZE * 100}%" />
<p>This is ${jsPsych.timelineVariable('correct_bucket_index') == 0 ? "a" : "another"} relic. </p>
<p>Let us assume the name of the relic is "${all_context_state_names[jsPsych.timelineVariable('context')][jsPsych.timelineVariable('correct_bucket_index')]}".</p>
<p>Press the button below to assign the name of the relic.</p>`,
    choices: () => [all_context_state_names[jsPsych.timelineVariable('context')][jsPsych.timelineVariable('correct_bucket_index')]],
    data: { my_trial_type: 'state-estimation' },
    on_finish: (data: any) => {
        const tutorial_states = all_context_state_names[jsPsych.timelineVariable('context')];
        data.new_state = true;
        all_context_assigned_indices[jsPsych.timelineVariable('context')]++;
        data.estimated_state = tutorial_states[jsPsych.timelineVariable('correct_bucket_index')];
    },
    // extensions: [
    //     ... AUDIO ? [{
    //         type: jsPsychPlayAudio,
    //         params: {
    //             audio_path: 'audio/relic_1.mp3',
    //         }
    //     }] : [],
    // ],
}

const tutorialActionSelection = {
    type: jsPsychDragndrop,
    element: jsPsych.timelineVariable('stimuli_path'),
    show_element_label: true,
    element_label: () => getLastTrialTreasureName(all_context_state_names[jsPsych.timelineVariable('context')]),
    buckets: () => jsPsych.timelineVariable('buckets').map((b: { image: string; }) => b.image),
    show_labels: true,
    bucket_labels: tutorial_baskets.map(b => b.name),
    correct_bucket_index: jsPsych.timelineVariable('correct_bucket_index'),
    track_dragging: true,
    randomize_bucket_order: false,
    text_prompt: () => `This relic belongs to the <b>${tutorial_baskets[jsPsych.timelineVariable('correct_bucket_index')].name}</b>. Drag the treasure to that basket.`,
    data: { my_trial_type: 'dragndrop' },
    // extensions: [
    //     ... AUDIO ? [{
    //         type: jsPsychPlayAudio,
    //         params: {
    //             audio_path: 'audio/relic_1.mp3',
    //         }
    //     }] : [],
    // ],
};
const tutorialRewardTrial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: () => getOutcome() ? `
    <img src="${rewards.correct}" width="30%" />
    <p>Well done! You have earned a magical reward!</p>` : `
    <img src="${rewards.incorrect}" width="30%" /> <p>Oops! You have not earned a magical reward this time. You should drag the relic to the correct bag. </p>`,
    choices: DEBUGGING ? "ALL_KEYS" : "NO_KEYS",
    trial_duration: 2000,
    data: { my_trial_type: 'reward' },
};
const tutorialActionSelection2 = {
    type: jsPsychDragndrop,
    element: jsPsych.timelineVariable('stimuli_path'),
    show_element_label: true,
    element_label: () => getLastTrialTreasureName(all_context_state_names[jsPsych.timelineVariable('context')]),
    buckets: () => jsPsych.timelineVariable('buckets').map((b: { image: string; }) => b.image),
    show_labels: true,
    bucket_labels: tutorial_baskets.map(b => b.name),
    correct_bucket_index: jsPsych.timelineVariable('correct_bucket_index'),
    track_dragging: true,
    randomize_bucket_order: false,
    text_prompt: () => `Good job on your previous relic sorting!</p><p>Let's drag the relic one more time to <b>${tutorial_baskets[jsPsych.timelineVariable('correct_bucket_index')].name}</b>.`,
    data: { my_trial_type: 'dragndrop' },
};

const tutorialCorrectLoop = {
    timeline: [tutorialActionSelection, tutorialRewardTrial],
    loop_function: () => !getOutcome(),
};
const tutorial2CorrectLoop = {
    timeline: [tutorialActionSelection2, tutorialRewardTrial],
    loop_function: () => !getOutcome(),
};
const tutorialProcedure = {
    timeline: [
        ... TRACK_EYE ? [tutorialFixationPoint] : [],
        tutorialStateEstimation,
        tutorialCorrectLoop,
        ... TRACK_EYE ? [tutorialFixationPoint] : [],
        tutorial2CorrectLoop,
    ],
    timeline_variables: [
        {
            stimuli: `<img src="${tutorial_stimulus[0].image}" width="${STIMULI_SIZE * 100}%" />`,
            correct_bucket_index: tutorial_stimulus[0].correct_action,
            stimuli_path: tutorial_stimulus[0].image,
            buckets: [tutorial_baskets[0]],
            bucket_start_angle: 0,
            context: 0, 
        },
        {
            stimuli: `<img src="${tutorial_stimulus[1].image}" width="${STIMULI_SIZE * 100}%" />`,
            correct_bucket_index: tutorial_stimulus[1].correct_action,
            stimuli_path: tutorial_stimulus[1].image,
            buckets: [tutorial_baskets[0], tutorial_baskets[1]],
            bucket_start_angle: 0,
            context: 0, 
        },
        {
            stimuli: `<img src="${tutorial_stimulus[2].image}" width="${STIMULI_SIZE * 100}%" />`,
            correct_bucket_index: tutorial_stimulus[2].correct_action,
            stimuli_path: tutorial_stimulus[2].image,
            buckets: [tutorial_baskets[0], tutorial_baskets[1], tutorial_baskets[2]],
            bucket_start_angle: 0,
            context: 0, 
        },
        {
            stimuli: `<img src="${tutorial_stimulus[3].image}" width="${STIMULI_SIZE * 100}%" />`,
            correct_bucket_index: tutorial_stimulus[3].correct_action,
            stimuli_path: tutorial_stimulus[3].image,
            buckets: [tutorial_baskets[0], tutorial_baskets[1], tutorial_baskets[2], tutorial_baskets[3]],
            bucket_start_angle: 0,
            context: 0, 
        },
    ],
    randomize_order: false,
    repetitions: 1,
    data: {
        context: 0,
        tutorial: true,
    }
}


// Main Experiment intro
const tutorial_outro = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<h1>Great job!</h1>
<p>You have successfully completed the tutorial. Now, you will be presented with the main experimental game.</p>
<p>This time you won't know where to drag each element. You have to do that based on your assumption.</p>
<p>Press any key to continue.</p>`,
    input_register_after: DEBUGGING ? 10 : AUDIO_DURATIONS.great_job * 1000,
    extensions: AUDIO ? [
        {
            type: jsPsychPlayAudio,
            params: {
                audio_path: 'audio/great_job.mp3',
            }
        }
    ] : [],
}

const main_game_intro = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<h1>The Lost Treasures of Colorland</h1>
<p>Welcome to Colorland, a vibrant kingdom where every shape, color, and pattern contributes to its festivals.</p><p>This year, a whirlwind has mixed up all the decorations needed for the grand Festival of Patterns.</p><p>Without these decorations in their right places, the festival cannot start.</p>`,
    input_register_after: DEBUGGING ? 10 : AUDIO_DURATIONS.colorland * 1000,
    extensions: AUDIO ? [
        {
            type: jsPsychPlayAudio,
            params: {
                audio_path: 'audio/colorland.mp3',
            }
        }
    ] : [],
}

const main_game_intro2 = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<p>To save the Festival of Patterns, we need your special skills.</p><p>We have four magical buckets, each dedicated to collecting specific types of festival decorations.</p>
        <img src="images/baskets/basket-blue.png" width="10%" />
        <img src="images/baskets/basket-green.png" width="10%" />
        <img src="images/baskets/basket-red.png" width="10%" />
        <img src="images/baskets/basket-yellow.png" width="10%" />`,
    input_register_after: DEBUGGING ? 10 : AUDIO_DURATIONS.colorland_4bags * 1000,
    extensions: AUDIO ? [
        {
            type: jsPsychPlayAudio,
            params: {
                audio_path: 'audio/colorland_4bags.mp3',
            }
        }
    ] : [],
}
const main_game_intro3 = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<p>Here’s how you can help: We will show you one special decoration at a time.</p><p>You need to assign name for that treasure, and then drop it in the right bucket.</p><p>If you place it correctly, a magical reward will appear! </p>`,
    input_register_after: DEBUGGING ? 10 : AUDIO_DURATIONS.colorland_help * 1000,
    extensions: AUDIO ? [
        {
            type: jsPsychPlayAudio,
            params: {
                audio_path: 'audio/colorland_help.mp3',
            }
        }
    ] : [],
}
const main_game_intro4 = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<h1>Let the Treasure Hunting Begin!</h1><p>Press any key to start the game.</p>`,
}



const fixationPoint = {
    type: jsPsychWebgazerValidate,
    validation_points: [[0, 0]],
    validation_point_coordinates: 'center-offset-pixels',
    roi_radius: 100,
    data: { my_trial_type: 'fixation-point' },
}

let choiceOrders: number[] = [];

const stateEstimation = {
    type: jsPsychHtmlButtonResponse,
    stimulus: jsPsych.timelineVariable('stimuli'),
    show_button_after: 4000, 
    on_start: (trial: any) => {
        const shuffleResult = getShuffledArray(
            all_context_state_names[jsPsych.timelineVariable('context')]
                .slice(0, all_context_assigned_indices[jsPsych.timelineVariable('context')] + 1));
        if (jsPsych.timelineVariable('context') !== 3)
            trial.choices = shuffleResult.shuffledArray.concat("Assign new treasure state");
        else
            trial.choices = shuffleResult.shuffledArray;
        choiceOrders = shuffleResult.originalIndices;
    },
    choices: [],
    prompt: "",
    on_finish: (data: any) => {
        const currentContext = jsPsych.timelineVariable('context');
        const context_state_names = all_context_state_names[currentContext];
        const response = choiceOrders[data.response];
        // delete data.choiceOriginalIndices;
        delete data.choiceOriginalIndices;

        if (response <= all_context_assigned_indices[currentContext]) {
            data.estimated_state = context_state_names[response];
            data.new_state = false;
        }
        else {
            all_context_assigned_indices[currentContext]++;
            data.estimated_state = context_state_names[all_context_assigned_indices[currentContext]];
            data.new_state = true;
        }
    },
    extensions: [ 
        ... TRACK_EYE ? [{
            type: jsPsychExtensionWebgazer,
            params: {
                targets: [
                    'img',
                ],
            }
        }]:[],
        {
            type: jsPsychExtensionMouseTracking,
        }
    ],
    data: { my_trial_type: 'state-estimation' },
}
const showIfNewState = {
    timeline: [{
        type: jsPsychHtmlKeyboardResponse,
        stimulus: () => `${jsPsych.timelineVariable('stimuli')}
    <p>The new name of this treasure is <b>${getStateEstimation()}</b>.</p>
    <p>Press any key to continue.</p>`,
    }],
    conditional_function: () => jsPsych
        .data.get()
        .filter({ trial_type: 'html-button-response' })
        .last(1)
        .values()[0]
        .new_state
}

const actionSelection = {
    type: jsPsychDragndrop,
    element: jsPsych.timelineVariable('stimuli_path'),
    show_element_label: true,
    element_label: () => getLastTrialTreasureName(all_context_state_names[jsPsych.timelineVariable('context')]),
    buckets: () => jsPsych.timelineVariable('buckets').map((b: { image: string; }) => b.image),
    bucket_start_angle: jsPsych.timelineVariable('bucket_start_angle'),
    show_labels: true,
    bucket_labels: BASKETS.map(b => b.name),
    correct_bucket_index: jsPsych.timelineVariable('correct_bucket_index'),
    track_dragging: true,
    randomize_bucket_order: false,
    extensions: [ 
        ... TRACK_EYE ? [{
            type: jsPsychExtensionWebgazer,
            params: {
                targets: [
                    '#jspsych-dragndrop-bucket-0',
                    '#jspsych-dragndrop-bucket-1',
                    '#jspsych-dragndrop-bucket-2',
                    '#jspsych-dragndrop-bucket-3',
                    '#jspsych-dragndrop-element',
                ],
            }
        }]:[],
        {
            type: jsPsychExtensionMouseTracking,
            params: {
                targets: [
                    '#jspsych-dragndrop-element img',
                    '#jspsych-dragndrop-bucket-0 img',
                    '#jspsych-dragndrop-bucket-1 img',
                    '#jspsych-dragndrop-bucket-2 img',
                    '#jspsych-dragndrop-bucket-3 img',
                ],
            }
        }
    ],
    data: { my_trial_type: 'dragndrop' },
}

const rewardTrial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: () => getOutcome() ? `
    <img src="${rewards.correct}" width="30%" />` : `<img src="${rewards.incorrect}" width="30%" />`,
    choices: DEBUGGING ? "ALL_KEYS" : "NO_KEYS",
    trial_duration: 2000,
    data: { my_trial_type: 'reward' },
};

// Context 1
const context1Procedure = {
    timeline: [
        ... TRACK_EYE ? [fixationPoint] : [],
        stateEstimation,
        showIfNewState,
        actionSelection,
        rewardTrial,
    ],
    timeline_variables: Array.from({ length: 4 }).map((_, i) => (
        {
            stimuli: `<img src="${context1_stimulus[i].image}" width="${STIMULI_SIZE * 100}%" />`,
            correct_bucket_index: context1_stimulus[i].correct_action,
            stimuli_path: context1_stimulus[i].image,
            context: 1,
            buckets: [BASKETS[0], BASKETS[1]],
            bucket_start_angle: 0,
        }
    )),
    randomize_order: true,
    repetitions: 3,
    data: { context: 1 },
}

// Context 2 Intro
const context2Intro = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<h1>Good job!</h1>
<p>You have sorted the first set of treasures.</p><p>Now, you will be presented with a new set of treasures. Best of luck!</p>
<p>Press any key to continue.</p>`,
    extensions: AUDIO ? [
        {
            type: jsPsychPlayAudio,
            params: {
                audio_path: 'audio/context-1-good-job.mp3',
            }
        }
    ] : [],
}

// Context 2
const context2Procedure = {
    timeline: [
        ... TRACK_EYE ? [fixationPoint] : [],
        stateEstimation,
        showIfNewState,
        actionSelection,
        rewardTrial,
    ],
    timeline_variables: Array.from({ length: 4 }).map((_, i) => (
        {
            stimuli: `<img src="${context2_stimulus[i].image}" width="${STIMULI_SIZE * 100}%" />`,
            correct_bucket_index: context2_stimulus[i].correct_action,
            stimuli_path: context2_stimulus[i].image,
            context: 2,
            buckets: [BASKETS[2], BASKETS[3]],
            bucket_start_angle: 90,
        }
    )),
    randomize_order: true,
    repetitions: 3,
    data: { context: 2 },
}

// Context 3 Intro
const context3Intro = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<h1>Good job!</h1>
<p>You have sorted the second set of treasures!</p>
<p>At the last stage, you will encounter all the treasures you have seen so far throughout Colorland.</p>
<p>As you are already familiar with these treasures, we will not show any reward feedback.</p>
<p>The fate of colorland depends on you. Best of luck!</p>
<p>Press any key to continue.</p>`,
    extensions: AUDIO ? [
        {
            type: jsPsychPlayAudio,
            params: {
                audio_path: 'audio/context-2-good-job.mp3',
            }
        }
    ] : [],
}

// Populate context 3 state names
const populate_context3_state_names = {
    type: jsPsychCallFunction,
    func: () => {
        // the the used context 1 and context 2 states to the last context
        all_context_state_names[3] = all_context_state_names[1].slice(0, all_context_assigned_indices[1] + 1)
            .concat(all_context_state_names[2].slice(0, all_context_assigned_indices[2] + 1));
        
        all_context_assigned_indices[3] = all_context_assigned_indices[1] + all_context_assigned_indices[2] + 2;
    }
};

// Context 3
const context3Procedure = {
    timeline: [
        ... TRACK_EYE ? [fixationPoint] : [],
        stateEstimation,
        showIfNewState,
        actionSelection,
        // rewardTrial,
    ],
    timeline_variables: Array.from({ length: 8 }).map((_, i) => (
        {
            stimuli: `<img src="${context3_stimulus[i].image}" width="${STIMULI_SIZE * 100}%" />`,
            correct_bucket_index: context3_stimulus[i].correct_action,
            stimuli_path: context3_stimulus[i].image,
            context: 3,
            buckets: [BASKETS[0], BASKETS[1], BASKETS[2], BASKETS[3]],
            bucket_start_angle: 0,
        }
    )),
    randomize_order: true,
    repetitions: 3,
    data: { context: 3 },
}


const stateSurvey = {
    type: jsPsychSurveyMultiSelect,
    questions: [
        {
            prompt: "After observing all the treasures and their reaction to certain buckets, you have assigned names to each types of treasures. Which of your name assignments do you think are actually real? ",
            name: 'realTreasures',
            options: () => all_context_state_names[1].slice(0, all_context_assigned_indices[1] + 1)
                .concat(all_context_state_names[2].slice(0, all_context_assigned_indices[2] + 1)),
            required: true,
            horizontal: true
        },
    ],
    extensions: AUDIO ? [
        {
            type: jsPsychPlayAudio,
            params: {
                audio_path: 'audio/survey-question.mp3',
            }
        }
    ] : [],
}


// outro
const outro = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<h1>Thank you for playing and participating in this experiment!</h1><p>You may now close the window.</p>`,
};


const timeline = [
    preload,
    welcome,
    browser_check,
    experiment_information,
    recording_info,
    eye_calibration_intro,

    fullscreen,
    ... DEBUGGING ? [] : [{ type: jsPsychFullscreen, fullscreen_mode: true }],

    ... TRACK_EYE ? [
        cam_warning,
        cam_check,
        calibration_guide,
        cam_calibration,
        calibration_points,
    ] : [],
    
    tutorial_welcome,
    tutorial_intro,
    tutorial_task,
    tutorialProcedure,
    tutorial_outro,
    
    main_game_intro,
    main_game_intro2,
    main_game_intro3,
    main_game_intro4,
    
    context1Procedure,
    context2Intro,
    context2Procedure,
    context3Intro,
    populate_context3_state_names,
    context3Procedure,
    
    stateSurvey,
    outro,

    ... DEBUGGING ? [] : [{ type: jsPsychFullscreen, fullscreen_mode: false }],
];


jsPsych.run(timeline);


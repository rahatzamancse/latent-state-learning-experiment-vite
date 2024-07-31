import { initJsPsych } from 'jspsych';
import jsPsychExtensionWebgazer from '@jspsych/extension-webgazer';
import jsPsychExtensionMouseTracking from '@jspsych/extension-mouse-tracking';
import jsPsychWebgazerInitCamera from '@jspsych/plugin-webgazer-init-camera';
import jsPsychWebgazerCalibrate from '@jspsych/plugin-webgazer-calibrate';
import jsPsychWebgazerValidate from '@jspsych/plugin-webgazer-validate';
import jsPsychPreload from '@jspsych/plugin-preload';
import jsPsychHtmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';
// import jsPsychInstructions from '@jspsych/plugin-instructions';
import jsPsychFullscreen from '@jspsych/plugin-fullscreen';
import jsPsychSurveyMultiSelect from '@jspsych/plugin-survey-multi-select';
import jsPsychHtmlButtonResponse from '@jspsych/plugin-html-button-response';
import jsPsychBrowserCheck from '@jspsych/plugin-browser-check';
import jsPsychDragndrop from './plugin-dragndrop';
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

// const DEBUGGING = import.meta.env.VITE_DEBUGGING ? true : false;
const DEBUGGING = false;
const TRACK_EYE = true;
const UPLOAD_FIRESTORE = DEBUGGING ? false : true;
const AUDIO = false;

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
        const trialData = JSON.parse(JSON.stringify(data));
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
        return {};
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
        name: "Basket 1",
    },
    {
        image: "images/tutorial/buckets/tutorial_basket-2.png",
        name: "Basket 2",
    },
    {
        image: "images/tutorial/buckets/tutorial_basket-3.png",
        name: "Basket 3",
    },
    {
        image: "images/tutorial/buckets/tutorial_basket-4.png",
        name: "Basket 4",
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
    [1, "blue"],
    [2, "blue"],
    [3, "green"],
    [4, "green"],
].map(i => ({
    image: `images/stimulus/animal_${i[0]}.png`,
    correct_action: BASKETS.findIndex(b => b.color === i[1]),
}));
const context2_stimulus = [
    [5, "red"],
    [6, "red"],
    [7, "yellow"],
    [8, "yellow"],
].map(i => ({
    image: `images/stimulus/animal_${i[0]}.png`,
    correct_action: BASKETS.findIndex(b => b.color === i[1]),
}));
const context3_stimulus = [
    [1, "blue"],
    [2, "blue"],
    [3, "green"],
    [4, "green"],
    [5, "red"],
    [6, "red"],
    [7, "yellow"],
    [8, "yellow"],
].map(i => ({
    image: `images/stimulus/animal_${i[0]}.png`,
    correct_action: BASKETS.findIndex(b => b.color === i[1]),
}));
const all_context_stimulus = [
    tutorial_stimulus,
    context1_stimulus,
    context2_stimulus,
    context3_stimulus,
];

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
    // return all_treasure_names[
    //     jsPsych.data.get()
    //         .filter({ trial_type: 'html-button-response' })
    //         .last(1)
    //         .values()[0]
    //         ['response']
    // ];
    
    return jsPsych.data.get()
        .filter({ trial_type: 'html-button-response' })
        .last(1)
        .values()[0]
        ['estimated_state'];

}



const STIMULI_SIZE = 0.5;
// const BUCKET_SIZE = 200;

const timeline = [];

// Preload assets
timeline.push({
    type: jsPsychPreload,
    images: [
        ...["blue", "green", "red", "yellow"].map(c => `images/baskets/basket-${c}.png`),
        ...[1, 2, 3, 4].map(i => `images/tutorial/stimulus/tutorial_treasures-${i}.png`),
        ...[1, 2, 3, 4].map(i => `images/tutorial/buckets/tutorial_basket-${i}.png`),
        ...[1, 2, 3, 4, 5, 6, 7, 8].map(i => `images/stimulus/animal_${i}.png`),
        ...["diamond", "nodiamond"].map(r => `images/reward/${r}.png`),
    ],
    audio: ['intro', 'eye-calibration-intro', 'eye-track-recorded', 'full-screen', 'webgazer-calibration', 'colorland-intro', 'colorland-instructions', 'tutorial-relics', 'tutorial-relics-instructions'].map(a => `audio/${a}.mp3`),
    video: [],
});


timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<h1>Welcome to the experiment!</h1><p>Press any key to continue.</p>`,
})

timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<h1>Experiment</h1>
<p>In this experiment, you will play a treasure sorting game.</p>
    <p>Press any key to continue.</p>`,
    trial_duration: 10000,
    extensions: AUDIO ? [
        {
            type: jsPsychPlayAudio,
            params: {
                audio_path: 'audio/intro.mp3',
            }
        }
    ]: [],
})


timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<h1>Experiment</h1>
<p>During the playing, your activity and eye movements will be recorded.</p><p>However, your video will not be recorded.</p>
    <p>Press any key to continue.</p>`,
    extensions: AUDIO ? [
        {
            type: jsPsychPlayAudio,
            params: {
                audio_path: 'audio/eye-track-recorded.mp3',
            }
        }
    ] : [],
})

timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<h1>Experiment</h1>
<p>In the next screen, your camera will be calibrated to track your eye properly.</p><p>Please follow the instructions properly to help us get the most accurate experiment results.</p>
    <p>Press any key to continue.</p>`,
    extensions: AUDIO? [
        {
            type: jsPsychPlayAudio,
            params: {
                audio_path: 'audio/eye-calibration-intro.mp3',
            }
        }
    ] : [],
});


// Switch to fullscreen
timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<h1>Fullscreen</h1>
<p>For best accuracy and your attention, it is highly recommended that you play the game in fullscreen.</p>
<p>Press any key to fullscreen and continue to camera calibration.</p>`,
    extensions: AUDIO ? [
        {
            type: jsPsychPlayAudio,
            params: {
                audio_path: 'audio/full-screen.mp3',
            }
        }
    ] : [],
})
if (!DEBUGGING)
    timeline.push({
        type: jsPsychFullscreen,
        fullscreen_mode: true,
    });
// TODO: Always validate if the fullscreen is enabled, if not, ask them again to go fullscreen or cancel the experiment.

timeline.push({
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
})


// initialize eye tracking
if (TRACK_EYE) {
    timeline.push({
        type: jsPsychHtmlKeyboardResponse,
        trial_duration: 2000,
        stimulus: `<h1>Please allow camera access for eye tracking.</h1><h1><span style="color: red">No video will be recorded.</span> </h1>`
    })

    timeline.push({
        type: jsPsychWebgazerInitCamera,
    })

    timeline.push({
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `<h1>Camera Calibration</h1>
        <p>Before we start the experiment, we need to calibrate your camera.</p><p>Please follow the instructions carefully.</p>
        <p>Press any key to continue.</p>`,
    })

    timeline.push({
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `<h1>Camera Calibration</h1>
        <p>During the calibration, you will see a few dots on the screen.</p><p>Please look at the dots as they appear.</p><p>Then you need to click them with your mouse.</p>
        <p>Press any key to continue.</p>`,
    })

    timeline.push({
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
    })
}


// Welcome screen
timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<h1>The Quest for the Lost Relics</h1>
<p>In a time long forgotten, the kingdom of Eldoria was known for its powerful and enchanting relics.</p><p>These relics, known as the Arcane Crystals, Ethereal Blossoms, Draconic Scales, and Lunar Pearls, were the source of magic that kept the kingdom in harmony.</p><p>Each relic had to be carefully placed in its own unique bag to maintain its magical potency.</p>`,
    extensions: AUDIO? [
        {
            type: jsPsychPlayAudio,
            params: {
                audio_path: 'audio/tutorial-relics.mp3',
            }
        }
    ] : [],
});
timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<p>The wise sages of Eldoria created four special bags, each designed to house one specific relic.</p><p>These bags, known as the Vessels of Power, were hidden throughout the Enchanted Forest to protect the relics from falling into the wrong hands.</p><p>However, over the centuries, the knowledge of their correct bags was lost.</p>
        <img src="images/tutorial/buckets/tutorial_basket-1.png" width="100px" />
        <img src="images/tutorial/buckets/tutorial_basket-2.png" width="100px" />
        <img src="images/tutorial/buckets/tutorial_basket-3.png" width="100px" />
        <img src="images/tutorial/buckets/tutorial_basket-4.png" width="100px" />`,
    extensions: AUDIO? [
        {
            type: jsPsychPlayAudio,
            params: {
                audio_path: 'audio/tutorial-relics-instructions.mp3',
            }
        }
    ] : [],
});
timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<p>Your task is to venture into the Enchanted Forest and restore the magic of Eldoria.</p><p>You will be provided with the four Vessels of Power.</p><p>Each vessel must contain only specific types of relics to preserve its magical energy.</p><p>After putting a relic in the correct bag, you will receive a diamond reward.</p><p>If the relic is put into a wrong bag, you will not receive any diamond.</p>`,
    extensions: AUDIO? [
        {
            type: jsPsychPlayAudio,
            params: {
                audio_path: 'audio/tutorial-relics-instructions.mp3',
            }
        }
    ] : [],
});


// Tutorial start
const tutorialFixationPoint = {
    type: jsPsychWebgazerValidate,
    validation_points: [[0, 0]],
    validation_point_coordinates: 'center-offset-pixels',
    roi_radius: 100,
    show_validation_data: DEBUGGING ? true : false,
    data: {
        tutorial: true,
        my_trial_type: 'fixation-point',
    }
}

const tutorialStateEstimation = {
    type: jsPsychHtmlButtonResponse,
    stimulus: () => `<img src="${jsPsych.timelineVariable('stimuli_path')}" width="${STIMULI_SIZE * 50}%" />
<p>This is ${jsPsych.timelineVariable('correct_bucket_index') == 0 ? "a" : "another"} relic. </p>
<p>Let us assume the name of the relic is "${all_context_state_names[jsPsych.timelineVariable('context')][jsPsych.timelineVariable('correct_bucket_index')]}".</p>
<p>Press the button below to assign the name of the relic.</p>`,
    choices: () => [all_context_state_names[jsPsych.timelineVariable('context')][jsPsych.timelineVariable('correct_bucket_index')]],
    data: { tutorial: true, my_trial_type: 'state-estimation' },
    on_finish: (data: any) => {
        const tutorial_states = all_context_state_names[jsPsych.timelineVariable('context')];
        data.new_state = true;
        all_context_assigned_indices[jsPsych.timelineVariable('context')]++;
        data.estimated_state = tutorial_states[jsPsych.timelineVariable('correct_bucket_index')];
    }
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
    text_prompt: () => `This treasure belongs to the <b>${tutorial_baskets[jsPsych.timelineVariable('correct_bucket_index')].name}</b>. Drag the treasure to that basket.`,
    data: { tutorial: true, my_trial_type: 'dragndrop' },
};
const tutorialRewardTrial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: () => getOutcome() ? `
    <img src="${rewards.correct}" width="500px" />
    <p>Well done! You have earned a magical reward!</p>` : `
    <img src="${rewards.incorrect}" width="500px" /> <p>Oops! You have not earned a magical reward this time. You should drag the relic to the correct bag. </p>`,
    choices: DEBUGGING ? "ALL_KEYS" : "NO_KEYS",
    trial_duration: 2000,
    data: { tutorial: true, my_trial_type: 'reward' },
};

const tutorialCorrectLoop = {
    timeline: [tutorialActionSelection, tutorialRewardTrial],
    loop_function: () => !getOutcome(),
};
const tutorialProcedure = {
    timeline: [
        ... TRACK_EYE ? [tutorialFixationPoint] : [],
        tutorialStateEstimation,
        tutorialCorrectLoop,
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
}
timeline.push(tutorialProcedure);


// Main Experiment intro
timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<h1>Great job!</h1>
<p>You have successfully completed the tutorial. Now, you will be presented with the main experimental game.</p>
<p>This time you won't know where to drag each element. You have to do that based on your assumption.</p>
<p>Press any key to continue.</p>`,
    extensions: AUDIO ? [
        {
            type: jsPsychPlayAudio,
            params: {
                audio_path: 'audio/tutorial-outro.mp3',
            }
        }
    ] : [],
})

timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<h1>The Lost Treasures of Colorland</h1>
<p>Welcome to Colorland, a vibrant kingdom where every shape, color, and pattern contributes to its festivals.</p><p>This year, a whirlwind has mixed up all the decorations needed for the grand Festival of Patterns.</p><p>Without these decorations in their right places, the festival cannot start.</p>`,
    extensions: AUDIO ? [
        {
            type: jsPsychPlayAudio,
            params: {
                audio_path: 'audio/colorland-intro.mp3',
            }
        }
    ] : [],
})

timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<p>To save the Festival of Patterns, we need your special skills.</p><p>We have four magical buckets, each dedicated to collecting specific types of festival decorations.</p>
        <img src="images/baskets/basket-blue.png" width="100px" />
        <img src="images/baskets/basket-green.png" width="100px" />
        <img src="images/baskets/basket-red.png" width="100px" />
        <img src="images/baskets/basket-yellow.png" width="100px" />`,
    extensions: AUDIO ? [
        {
            type: jsPsychPlayAudio,
            params: {
                audio_path: 'audio/colorland-instructions-1.mp3',
            }
        }
    ] : [],
})
timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<p>Here’s how you can help: We will show you one special decoration at a time.</p><p>You need to assign name for that treasure, and then drop it in the right bucket.</p><p>If you place it correctly, a magical reward will appear! </p>`,
    extensions: AUDIO ? [
        {
            type: jsPsychPlayAudio,
            params: {
                audio_path: 'audio/colorland-instructions-2.mp3',
            }
        }
    ] : [],
})
timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<h1>Let the Treasure Hunting Begin!</h1><p>Press any key to start the game.</p>`,
})



const fixationPoint = {
    type: jsPsychWebgazerValidate,
    validation_points: [[0, 0]],
    validation_point_coordinates: 'center-offset-pixels',
    roi_radius: 100,
    data: { my_trial_type: 'fixation-point' },
}

const showStimuli = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: jsPsych.timelineVariable('stimuli'),
    trial_duration: 4000,
    choices: DEBUGGING ? "ALL_KEYS" : "NO_KEYS",
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
        }
    ],
    data: { my_trial_type: 'show-stimuli' },
}

let choiceOrders: number[] = [];

const stateEstimation = {
    type: jsPsychHtmlButtonResponse,
    stimulus: jsPsych.timelineVariable('stimuli'),
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
    <img src="${rewards.correct}" width="500px" />` : `<img src="${rewards.incorrect}" width="500px" />`,
    choices: DEBUGGING ? "ALL_KEYS" : "NO_KEYS",
    trial_duration: 2000,
    data: { my_trial_type: 'reward' },
};

// Context 1
const context1Procedure = {
    timeline: [
        ... TRACK_EYE ? [fixationPoint] : [],
        showStimuli,
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
    repetitions: 1,
    data: { context: 1 },
}
timeline.push(context1Procedure);

// Context 2 Intro
timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<h1>Good job!</h1>
<p>You have sorted the first set of treasures.</p><p>Now, you will be presented with a new set of treasures. Best of luck!</p>
<p>Press any key to continue.</p>`,
})

// Context 2
const context2Procedure = {
    timeline: [
        ... TRACK_EYE ? [fixationPoint] : [],
        showStimuli,
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
    repetitions: 1,
    data: { context: 2 },
}
timeline.push(context2Procedure);

// Context 3 Intro
timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<h1>Good job!</h1>
<p>You have sorted the second set of treasures!</p>
<p>At the last stage, you will encounter all the treasures you have seen so far throughout Colorland.</p><p>The fate of colorland depends on you. Best of luck!</p>
<p>Press any key to continue.</p>`,
})

// Populate context 3 state names
timeline.push({
    type: jsPsychCallFunction,
    func: () => {
        // the the used context 1 and context 2 states to the last context
        all_context_state_names[3] = all_context_state_names[1].slice(0, all_context_assigned_indices[1] + 1)
            .concat(all_context_state_names[2].slice(0, all_context_assigned_indices[2] + 1));
        
        all_context_assigned_indices[3] = all_context_assigned_indices[1] + all_context_assigned_indices[2] + 2;
    }
});

// Context 3
const context3Procedure = {
    timeline: [
        ... TRACK_EYE ? [fixationPoint] : [],
        showStimuli,
        stateEstimation,
        showIfNewState,
        actionSelection,
        rewardTrial,
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
    repetitions: 1,
    data: { context: 3 },
}
timeline.push(context3Procedure);


timeline.push({
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
})


// outro
timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<h1>Thank you for playing and participating in this experiment!</h1><p>You may now close the window.</p>`,
});


jsPsych.run(timeline);


import { initJsPsych } from 'jspsych';
import jsPsychExtensionWebgazer from '@jspsych/extension-webgazer';
import jsPsychWebgazerInitCamera from '@jspsych/plugin-webgazer-init-camera';
import jsPsychWebgazerCalibrate from '@jspsych/plugin-webgazer-calibrate';
// import jsPsychWebgazerValidate from '@jspsych/plugin-webgazer-validate';
import jsPsychPreload from '@jspsych/plugin-preload';
import jsPsychHtmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';
import jsPsychInstructions from '@jspsych/plugin-instructions';
import jsPsychFullscreen from '@jspsych/plugin-fullscreen';
import jsPsychSurveyMultiSelect from '@jspsych/plugin-survey-multi-select';
import jsPsychHtmlButtonResponse from '@jspsych/plugin-html-button-response';
import jsPsychBrowserCheck from '@jspsych/plugin-browser-check';


import { shuffleIndices } from './utils';

import jsPsychDragndrop from './plugin-dragndrop';
// import jsPsychPlayAudio from './extension-play-audio';
import { initializeApp } from "firebase/app";
import { getFirestore, updateDoc, collection, doc, setDoc, arrayUnion } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyC6C0XcUlxzCv8_xXJlyBli55cDAbG16-s",
    authDomain: "latent-state-learning.firebaseapp.com",
    projectId: "latent-state-learning",
    storageBucket: "latent-state-learning.appspot.com",
    messagingSenderId: "926544010648",
    appId: "1:926544010648:web:e6fb2ab9a3bc299ce31fed"
};


const TRACK_EYE = true;

const extensions = [];
if (TRACK_EYE) {
    extensions.push({
        type: jsPsychExtensionWebgazer,
        params: {
            auto_initialize: false,
        }
    });
}
// extensions.push({
//     type: jsPsychPlayAudio,
// })


const db = getFirestore(initializeApp(firebaseConfig));
const docRef = doc(collection(db, "experiments"));

setDoc(docRef, {
    trials: [],
}).catch(e => {
    console.error("Error creating document: ", e);
}).then(() => {
    console.log("Document successfully created!");
})



const jsPsych = initJsPsych({
    extensions: extensions,
    on_data_update: (data: any) => {
        const trialData = JSON.parse(JSON.stringify(data));
        console.log("Updated Data: ", data);
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
        updateDoc(docRef, {
            trials: arrayUnion(trialData),
        }).catch(e => { console.error("Error storing Data: ", e) }
        ).then(() => { console.log("Added trial data: ", trialData); });
        return {};
    },
    on_finish: () => {
        jsPsych.data.get().localSave('json', 'data.json');
    },
});


const timeline = [];

// Preload assets
timeline.push({
    type: jsPsychPreload,
    images: [
        ...["blue", "green", "red", "yellow"].map(c => `images/baskets/basket-${c}.png`),
        ...[1, 2, 3, 4, 5, 6, 7, 8].map(i => `images/stimulus/animal_${i}.png`),
        ...["diamond", "nodiamond"].map(r => `images/reward/${r}.png`),
    ],
    audio: ['audio/intro.mp3'],
    video: [],
});


timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<h1>Welcome to the psychiatric experiment!</h1><p>Press any key to continue.</p>`,
})

timeline.push({
    type: jsPsychInstructions,
    pages: [
        `<h1>Experiment</h1>
<p>In this experiment, you will play a small treasure sorting game.</p>
<p>During the playing, your activity and eye movement will be recorded. However, your video will not be recorded.</p>
<p>In the next screen, your camera will be calibrated to track your eye properly. Please follow the instructions properly to help us get the most accurate experiment results.</p>`,
    ],
    show_clickable_nav: true,
    // extensions: [
    //     {
    //         type: jsPsychPlayAudio,
    //         params: {
    //             audio_path: 'audio/intro.mp3',
    //         }
    //     }
    // ]
});


timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<h1>Fullscreen</h1>
<p>For best accuracy and your attention, it is highly recommended that you play the game in fullscreen.</p>
<p>Press any key to fullscreen and continue to camera calibration.</p>`,
})
// Switch to fullscreen
timeline.push({
    type: jsPsychFullscreen,
    fullscreen_mode: true,
});

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
        stimulus: `<h1>Reminder: No video will be recorded in this session. </h1>`
    })

    timeline.push({
        type: jsPsychWebgazerInitCamera,
    })

    timeline.push({
        type: jsPsychInstructions,
        pages: [
            `<h1>Camera Calibration</h1>
        <p>Before we start the experiment, we need to calibrate your camera. Please follow the instructions carefully.</p>`,
            `<h1>Camera Calibration</h1>
        <p>During the calibration, you will see a few dots on the screen. Please look at the dots as they appear. Then you need to click them with your mouse.</p>`,
        ],
        show_clickable_nav: true
    })

    timeline.push({
        type: jsPsychWebgazerCalibrate,
        calibration_points: [[25, 50], [50, 50], [75, 50], [50, 25], [50, 75]],
        calibration_mode: 'click',
        randomize_calibration_order: true,
    })
    // timeline.push({
    //     type: jsPsychWebgazerValidate,
    //     validation_points: [[-300,300], [300,300],[-300,-300],[300,-300]],
    //     validation_point_coordinates: 'center-offset-pixels',
    //     roi_radius: 100,
    //     extensions: [ FirebaseExtension ]
    // })
}

// Welcome screen
timeline.push({
    type: jsPsychInstructions,
    pages: [
        `<h1>The Lost Treasures of Colorland</h1>
<p>Welcome to Colorland, a vibrant kingdom where every shape, color, and pattern contributes to its enchanting festivals. This year, a whirlwind has mixed up all the decorations needed for the grand Festival of Patterns. Without these decorations in their right places, the festival cannot start.</p>`,
        `<p>To save the Festival of Patterns, we need your special skills. We have four magical buckets, each dedicated to collecting specific types of festival decorations</p>
<p>Here’s how you can help: We will show you one special decoration at a time. For the first item, we'll tell you exactly which bucket it belongs to. If you place it correctly, a magical reward will appear! For the other items, we won't tell you their buckets, but if you remember the clues and use your best judgment, you’ll earn more rewards each time you choose correctly.</p>`
    ],
    show_clickable_nav: true
})

const treasure_names = ['Quixot', 'Wyvern', 'Eronimo', 'Rochar', 'Tynix', 'Yrton', 'Urono', 'Izor', 'Oronim', 'Pexis', 'Arctis', 'Syber', 'Dynax', 'Fyxis', 'Gyron', 'Hyxel', 'Jaltra', 'Kavra', 'Lyris'];

const BASKETS = shuffleIndices(4).map(i => [
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
][i]);

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
const context3_stimulus = [...context1_stimulus, ...context2_stimulus];

let currentAssignedTreasure = 0;

const rewards = {
    correct: "images/reward/diamond.png",
    incorrect: "images/reward/nodiamond.png",
}

const STIMULI_SIZE = 0.5;
// const BUCKET_SIZE = 200;

timeline.push({
    type: jsPsychHtmlButtonResponse,
    stimulus: `<img src="${context1_stimulus[0].image}" width="${STIMULI_SIZE * 100}%" />
<p>This is a treasure. Each treasure has 5 features at 5 corners.</p>
<p>Let us assume the name of the treasure is "${treasure_names[0]}".</p>
<p>Press the button below to assign the name of the treasure.</p>`,
    choices: [treasure_names[0]],
    extensions: TRACK_EYE ? [
        {
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
        },
    ] : [],
    data: { tutorial: true },
});

function unnestDragData(data: any) {
    const drag_data_obj: { [key: number]: { x: number, y: number, t: number } } = {};
    data.drag_data.forEach((d: any, i: number) => {
        drag_data_obj[i] = d;
    });
    data.drag_data = drag_data_obj;
}

const firstTrial = {
    type: jsPsychDragndrop,
    element: context1_stimulus[0].image,
    show_labels: true,
    buckets: BASKETS.map(b => b.image),
    bucket_labels: BASKETS.map(b => b.name),
    correct_bucket_index: 0,
    randomize_bucket_order: true,
    text_prompt: `This treasure belongs to the <b>${BASKETS[0].name}</b>. Drag the treasure to that basket.`,
    extensions: TRACK_EYE ? [
        {
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
        },
    ] : [],
    on_finish: unnestDragData,
    data: { tutorial: true },
};

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

const rewardTrial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: () => getOutcome() ? `<img src="${rewards.correct}" width="500px" /><p>Well done! You have earned a magical reward!</p>` : `<img src="${rewards.incorrect}" width="500px" /><p>Oops! You have not earned a magical reward this time. Please try again.</p>`,
    // choices: "NO_KEYS",
    trial_duration: 2000,
};

const fixationPoint = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<div style="font-size: 48px;">+</div>`,
    trial_duration: 600,
    choices: "NO_KEYS",
}

const showStimuli = {
    type: jsPsychHtmlButtonResponse,
    stimulus: jsPsych.timelineVariable('stimuli'),
    choices: () => treasure_names.slice(0, currentAssignedTreasure + 1).concat("Assign new treasure state"),
    prompt: "",
    on_finish: function (data: any) {
        if (data.response <= currentAssignedTreasure) {
            data.estimated_state = treasure_names[data.response];
            data.new_state = false;
        }
        else {
            currentAssignedTreasure++;
            data.estimated_state = treasure_names[currentAssignedTreasure];
            data.new_state = true;
        }
    },
    extensions: TRACK_EYE ? [
        {
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
        },
    ] : [],
}
const actionSelection = {
    type: jsPsychDragndrop,
    element: jsPsych.timelineVariable('stimuli_path'),
    buckets: BASKETS.map(b => b.image),
    show_labels: true,
    bucket_labels: BASKETS.map(b => b.name),
    correct_bucket_index: jsPsych.timelineVariable('correct_bucket_index'),
    track_dragging: true,
    randomize_bucket_order: true,
    extensions: TRACK_EYE ? [
        {
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
        },
    ] : [],
    on_finish: unnestDragData
}

const firstLoop = {
    timeline: [firstTrial, rewardTrial],
    loop_function: () => !getOutcome(),
};
timeline.push(firstLoop);


// Context 1
const context1Procedure = {
    timeline: [
        fixationPoint,
        showStimuli,
        showIfNewState,
        actionSelection,
        rewardTrial,
    ],
    timeline_variables: Array.from({ length: 4 }).map((_, i) => (
        {
            stimuli: `<img src="${context1_stimulus[i].image}" width="${STIMULI_SIZE * 100}%" />`,
            correct_bucket_index: context1_stimulus[i].correct_action,
            stimuli_path: context1_stimulus[i].image
        }
    )),
    randomize_order: true,
    repetitions: 1,
}
timeline.push(context1Procedure);

// Context 2 Intro
timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<h1>Good job!</h1>
<p>You have sorted the first set of treasures. Now, you will be presented with a new set of treasures. Best of luck!</p>
<p>Press any key to continue.</p>`,
})

// Context 2
const context2Procedure = {
    timeline: [
        fixationPoint,
        showStimuli,
        showIfNewState,
        actionSelection,
        rewardTrial,
    ],
    timeline_variables: Array.from({ length: 4 }).map((_, i) => (
        {
            stimuli: `<img src="${context2_stimulus[i].image}" width="${STIMULI_SIZE * 100}%" />`,
            correct_bucket_index: context2_stimulus[i].correct_action,
            stimuli_path: context2_stimulus[i].image
        }
    )),
    randomize_order: true,
    repetitions: 1,
}
timeline.push(context2Procedure);

// Context 3 Intro
timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<h1>Good job!</h1>
<p>You have sorted the second set of treasures!</p>
<p>At the last stage, you will encounter all the treasures you have seen so far throughout Colorland. The fate of colorland depends on you. Best of luck!</p>
<p>Press any key to continue.</p>`,
})


// Context 3
const context3Procedure = {
    timeline: [
        fixationPoint,
        showStimuli,
        showIfNewState,
        actionSelection,
        rewardTrial,
    ],
    timeline_variables: Array.from({ length: 8 }).map((_, i) => (
        {
            stimuli: `<img src="${context3_stimulus[i].image}" width="${STIMULI_SIZE * 100}%" />`,
            correct_bucket_index: context3_stimulus[i].correct_action,
            stimuli_path: context3_stimulus[i].image
        }
    )),
    randomize_order: true,
    repetitions: 1,
}
timeline.push(context3Procedure);


timeline.push({
    type: jsPsychSurveyMultiSelect,
    questions: [
        {
            prompt: "After observing all the treasures and their reaction to certain buckets, you have assigned names to each types of treasures. Which of your name assignments do you think are actually real? ",
            name: 'realTreasures',
            options: () => treasure_names.slice(0, currentAssignedTreasure + 1),
            required: true,
            horizontal: true
        },
        {
            prompt: "And which of the treasures are made up? They should be named as the same as the treasures you think are real.",
            name: 'madeupTreasures',
            options: () => treasure_names.slice(0, currentAssignedTreasure + 1),
            required: true,
            horizontal: true
        }
    ],
})


// outro
timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<h1>Thank you for playing and participating in this experiment!</h1>`,
});


jsPsych.run(timeline);


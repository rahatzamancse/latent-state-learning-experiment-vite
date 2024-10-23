// Import the jspsych module
import { initJsPsych } from 'jspsych';

// Import all the jspsych plugins used in the experiment
import jsPsychExtensionWebgazer from '@jspsych/extension-webgazer';
import jsPsychExtensionMouseTracking from '@jspsych/extension-mouse-tracking';
import jsPsychWebgazerInitCamera from '@jspsych/plugin-webgazer-init-camera';
import jsPsychWebgazerCalibrate from '@jspsych/plugin-webgazer-calibrate';
import jsPsychWebgazerValidate from '@jspsych/plugin-webgazer-validate';
import jsPsychPreload from '@jspsych/plugin-preload';
import jsPsychFullscreen from '@jspsych/plugin-fullscreen';
import jsPsychSurveyMultiSelect from '@jspsych/plugin-survey-multi-select';
import jsPsychSurveyMultiChoice from '@jspsych/plugin-survey-multi-choice';
import jsPsychHtmlButtonResponse from './plugins/plugin-html-button-response';
import jsPsychBrowserCheck from '@jspsych/plugin-browser-check';

// Import our developed plugins and extensions, these can be found in the ./plugins and ./extensions directories
import jsPsychDragndrop from './plugins/plugin-dragndrop';
import jsPsychPlayAudio from './extensions/extension-play-audio';
import jsPsychHelpButton from './extensions/extension-help-button';
// import jsPsychAudioKeyboardResponse from '@jspsych/plugin-audio-keyboard-response';
import jsPsychCallFunction from '@jspsych/plugin-call-function';
import jsPsychProlificData from './plugins/plugin-save-prolific-data';
import jsPsychProlificFinish from './plugins/plugin-prolific-completed';
import jsPsychHtmlKeyboardResponse from './plugins/plugin-html-keyboard-response';

// Initialize the firebase app and the firestore database
import { initializeApp } from "firebase/app";
import { getFirestore, updateDoc, collection, doc, setDoc, arrayUnion } from "firebase/firestore";

// Import the experiment configurations
import * as configs from "./exp_configs";

// Import some utility functions
import { getShuffledArray, addObjectInRange, findMaxIndex, createProbabilisticDistribution, pickProbabilisticIndex } from './utils';

// Import the styles for the experiment
import './styles.css';

// Initialize the firestore database with the API key
const db = configs.UPLOAD_FIRESTORE ? getFirestore(initializeApp(configs.firebaseConfig)) : undefined;
const docRef = configs.UPLOAD_FIRESTORE ? doc(collection(db!, "experiments")) : undefined;

// Firebase charges by the number of reads/writes. To track that per experiments, we use this NUMBER_OF_WRITES variable
let NUMBER_OF_WRITES = 0;
// Initialize the experiment document in firestore
// The document will store the trials, the date, the time, and whether the experiment is running locally
if (configs.UPLOAD_FIRESTORE) {
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

// Initialize Extensions
const extensions = [];
if (configs.TRACK_EYE) {
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
extensions.push({
    type: jsPsychHelpButton,
    params: {}
})
if (configs.AUDIO)
    extensions.push({
        type: jsPsychPlayAudio,
    })

// const INACTIVE_TIMEOUT = 30 * 60 * 1000;
// function trialTimeOut(trial: any) {
//     console.error(`Trial timed out: ${trial}`);
//     jsPsych.endCurrentTimeline();
// }
// 

// let lastInteractionDataIndex = 0;

// Initialize jsPsych
const jsPsych = initJsPsych({
    extensions: extensions,
    // After each trial, we push the trial data to firestore
    on_data_update: (data: any) => {
        // Check if fullscreen.
        // Note: This is replaced with the fullscreenIfTrial.
        // const interaction_data = jsPsych.data.getInteractionData()
        // if (interaction_data.values().slice(lastInteractionDataIndex).some((v: any) => v.event === "fullscreenexit")) {
        //     jsPsych.endExperiment("The experiment has ended because you exited fullscreen mode.");
        // }
        // lastInteractionDataIndex = interaction_data.values().length;


        const trialData = JSON.parse(JSON.stringify(data));
        // check if trialData has a property 'no_upload' and if it is true
        if (trialData.no_upload) {
            delete trialData.no_upload;
            return trialData;
        }
        // Firebase does not support nested arrays, so we need to convert them to a flat js object structure
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
        // If the experiment is set to upload the data to firestore, we do so
        if (configs.UPLOAD_FIRESTORE) {
            updateDoc(docRef!, {
                trials: arrayUnion(trialData),
            }).catch(e => { console.error("Error storing Data: ", e) }
            ).then(() => {
                console.log("Added trial data: ", trialData);
                NUMBER_OF_WRITES++;
            });
        }
        // Otherwise we just print the data to the console
        else {
            console.log("Dry run: ", trialData);
        }
        return trialData;
    },
    // After the experiment is finished, we print the number of writes to firestore and download the data as a json file if the user wants to
    on_finish: () => {
        console.log("Number of writes to Firestore: ", NUMBER_OF_WRITES);
        if (configs.DOWNLOAD_AT_END)
            jsPsych.data.get().localSave('json', 'data.json');
    },
    on_trial_start: (trial: any) => {
        // trial.inactive_timeout = setTimeout(() => trialTimeOut(trial), INACTIVE_TIMEOUT);
    },
    on_trial_finish: (trial: any) => {
        // clearTimeout(trial.inactive_timeout);
    },
});

// Debugging convenient functionality that help to skip to certain parts of the experiment
const skip_to = parseInt(jsPsych.data.getURLVariable('SKIP'));
if (configs.DEBUGGING && skip_to > 1) {
    // simulate context 1
    configs.all_context_assigned_indices[1] = 2;
}
if (configs.DEBUGGING && skip_to > 2) {
    configs.all_context_assigned_indices[2] = 2;
}

// Utility functions
// Get the outcome of the last dragndrop trial
function getOutcome() {
    return jsPsych
        .data.get()
        .filter({ trial_type: 'dragndrop' })
        .last(1)
        .values()[0]
        .is_correct
}
// Get the outcome of the last state estimation trial
function getLastTrialTreasureName(all_treasure_names: string[]) {
    return jsPsych.data.get()
        .filter({ my_trial_type: 'state-estimation' })
        .last(1)
        .values()[0]
        ['estimated_state'];
}


// const BUCKET_SIZE = 200;

// prolific data
const prolific_data_trial = {
    type: jsPsychProlificData,
    data: {
        my_trial_type: 'prolific-data',
    }
}

const fullscreenIfTrial = {
    timeline: [
        {
            type: jsPsychFullscreen,
            fullscreen_mode: true,
            message: `<h1>Fullscreen</h1>
<p>For best accuracy and your attention, it is highly recommended that you play the game in fullscreen.</p>`,
            button_label: "Continue",
        }
    ],
    conditional_function: () => !document.fullscreenElement,
    data: {
        my_trial_type: 'fullscreen',
    }
}

// Preload assets
const preload = {
    type: jsPsychPreload,
    images: [
        ...["blue", "green", "red", "yellow"].map(c => `images/baskets/basket-${c}.png`),
        ...[1, 2, 3, 4].map(i => `images/tutorial/stimulus/tutorial_treasures-${i}.png`),
        ...[1, 2, 3, 4].map(i => `images/tutorial/buckets/tutorial_basket-${i}.png`),
        ...[1, 2, 3, 4, 5, 6, 7, 8].map(i => `images/stimulus/animal_${i}.png`),
        ...["diamond-blue", "nodiamond"].map(r => `images/reward/${r}.png`),
        ...["webcam-laptop-removebg", "webcam-pc-removebg", "not-allowed-removebg", "well-lit-removebg"].map(i => `images/tutorial/${i}.png`),
    ],
    audio: ["quest_bag.mp3", "cam_calibration_2.mp3", "cam_calibration.mp3", "colorland_4bags.mp3", "colorland_help.mp3", "colorland.mp3", "context-1-good-job.mp3", "context-2-good-job.mp3", "fullscreen.mp3", "great_job.mp3", "intro_2.mp3", "intro_3.mp3", "intro.mp3", "quest.mp3", "relic1_bag1_2.mp3", "relic1_bag1.mp3", "relic_1.mp3", "relic_2_bag2_2.mp3", "relic_2_bag_2.mp3", "relic_2.mp3", "relic_3_bag3_2.mp3", "relic3_bag3.mp3", "relic_3.mp3", "relic4_bag4_2.mp3", "relic4_bag4.mp3", "relic_4.mp3", "survey-question.mp3", "task.mp3", "webgazer-calibration.mp3", "camtest.mp3"].map(a => `audio/${a}`),
    video: [],
};


const TUTORIAL_CONTENT = `<p style="font-size: 2vh">At the center, you will see the treasure. You can use your mouse to drag and drop it in any of the treasure baskets.</p>
<p style="font-size: 2vh">Here is a small demonstration.</p>
<div style="display: flex; justify-content: center; background-color: white">
    <img src="images/modal/dragndrop-tutorial.gif" height="80%" alt="dragndrop-tutorial" />
</div>`;

const welcome = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `<h1>Welcome to the Game!</h1>`,
    choices: ["Continue"],
}

const experiment_information = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `<h1>The Game</h1>
<p>You will play a treasure sorting game.</p>`,
    choices: ["Continue"],
    show_button_after: configs.DEBUGGING ? 10 : configs.AUDIO_DURATIONS.intro * 1000,
    extensions: [
        // TODO: Update the audio
        // ... AUDIO ? [{
        //     type: jsPsychPlayAudio,
        //     params: {
        //         audio_path: 'audio/intro.mp3',
        //     }
        // }]: [],
    ]
}

const audio_tests = [
    {
        correct_answer_index: 4,
        correct_answer_audio: 'tiger',
    },
    {
        correct_answer_index: 2,
        correct_answer_audio: 'shark',
    },
].map(t => ({
    timeline: [{
        type: jsPsychHtmlButtonResponse,
        stimulus: 'Click on the animal that you just heard. If you need to, adjust your volume and try again.',
        choices: ['repeat', 'turtle', 'shark', 'fish', 'tiger'],
        button_html: (choice: string) => {
            if (choice === 'repeat') {
                return '<img src="images/audio_test/replay.png" height="200px" width="200px"/>';
            }
            return `<img src="images/audio_test/${choice}.png" height="200px" width="200px"/>`;
        },
        data: {
            my_trial_type: 'audio-test',
            correct_answer: t.correct_answer_index,
        },
        extensions: configs.AUDIO ? [
            {
                type: jsPsychPlayAudio,
                params: {
                    audio_path: `audio/${t.correct_answer_audio}.mp3`,
                }
            }
        ] : [],
    }],
    loop_function: () => {
        const last_trial = jsPsych.data.get().filter({ my_trial_type: 'audio-test' }).last(1).values()[0];
        return last_trial.response !== last_trial.correct_answer;
    },
}));


const preparation_1 = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `<h1>Before you start</h1>
    <p>Please make sure you have at least 20 minutes to complete the game.</p>
    <img src="images/tutorial/time.png" width="220px" height="220px" style="margin-left: 40px; margin-right: 40px" />`,
    choices: ["Continue"],
    // show_button_after: configs.DEBUGGING ? 10 : configs.AUDIO_DURATIONS.intro_2 * 1000,
    // extensions: [
    //     ... AUDIO ? [{
    //         type: jsPsychPlayAudio,
    //         params: {
    //             audio_path: 'audio/intro.mp3',
    //         }
    //     }]: [],
    // ]
}

const preparation_2 = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `<h1>Before you start</h1>
    <p>Though this game will not record any video, please make sure you have a <b>working webcam positioned at the horizontal-center of the screen</b> to record your eye movements.</p>
    <img src="images/tutorial/webcam-laptop-removebg.png" width="220px" height="220px" style="margin-left: 40px; margin-right: 40px" />
    <img src="images/tutorial/webcam-pc-removebg.png" width="220px" height="220px" style="margin-left: 40px; margin-right: 40px" />
    `,
    choices: ["Continue"],
}

const preparation_3 = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `<h1>Before you start</h1>
    <p>Please make sure not to wear any eye glasses.</p>
    <p>Tablets and phones are not allowed. Make sure your screen and camera is not moving.</p>
    <img src="images/tutorial/not-allowed-removebg.png" width="220px" height="220px" style="margin-left: 40px; margin-right: 40px" />`,
    choices: ["Continue"],
}

const preparation_4 = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `<h1>Before you start</h1>
    <p>Please make sure your room is well-lit.</p>
    <img src="images/tutorial/well-lit-removebg.png" width="220px" height="220px" style="margin-left: 40px; margin-right: 40px" />`,
    choices: ["Continue"],
}

const all_preparations = [
    preparation_1,
    preparation_2,
    preparation_3,
    preparation_4,
]


const recording_info = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `<h1>The Game</h1>
<p>During the playing, your activity and eye movements will be recorded.</p><p>However, your video will not be recorded.</p>`,
    choices: ["Continue"],
    show_button_after: configs.DEBUGGING ? 10 : configs.AUDIO_DURATIONS.intro_2 * 1000,
    extensions: configs.AUDIO ? [
        {
            type: jsPsychPlayAudio,
            params: {
                audio_path: 'audio/intro_2.mp3',
            }
        }
    ] : [],
}

const eye_calibration_intro = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `<h1>The Game</h1>
<p>In the next screen, your camera will be calibrated to track your eye properly.</p><p>Please follow the instructions to help us get the most accurate results.</p>`,
    choices: ["Continue"],
    show_button_after: configs.DEBUGGING ? 10 : configs.AUDIO_DURATIONS.intro_3 * 1000,
    extensions: configs.AUDIO? [
        {
            type: jsPsychPlayAudio,
            params: {
                audio_path: 'audio/intro_3.mp3',
            }
        }
    ] : [],
};


// Switch to fullscreen
// TODO: Safari does not work keyboard input in fullscree. Need to test on other browsers (and safari again).
const fullscreen = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `<h1>Fullscreen</h1>
<p>For best accuracy and your attention, it is mandatory that you play the game in fullscreen.</p>`,
    choices: ["Continue"],
    show_button_after: configs.DEBUGGING ? 10 : configs.AUDIO_DURATIONS.fullscreen * 1000,
    extensions: configs.AUDIO ? [
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
            return '<p>You must use a desktop/laptop computer to participate in this game.</p>';
        } else if (!data.webcam) {
            return '<p>You must have an active webcam for this game. Make sure to allow your browser to access your camera at the beginning of the game.</p>'
        } else if (data.width < 1000 || data.height < 600) {
            return '<p>Your screen is too small to participate in this game. Please use a larger screen with at least resolutions of 1000x600 pixels.</p>';
        }
    },
}


const cam_warning = {
    type: jsPsychHtmlKeyboardResponse,
    trial_duration: 2000,
    stimulus: `<h1>Please allow camera access for eye tracking.</h1><h1><span style="color: red">No video will be recorded.</span> </h1>`
}


const cam_font_size = 2;
const cam_check = {
    type: jsPsychWebgazerInitCamera,
    instructions: `<p style="font-size: ${cam_font_size}vh">Position your head so that the webcam has a good view of your eyes.</p>
<p style="font-size:${cam_font_size}vh">Center your face in the box and look directly towards the camera.</p>

<p style="font-size:${cam_font_size}vh">It is important that you try and keep your head reasonably still throughout the game, so please take a moment to adjust your setup to be comfortable.</p>

<p style="font-size:${cam_font_size}vh">When your face is centered in the box and the box is green, you can click to continue.</p>`,
    extensions: configs.AUDIO ? [
        {
            type: jsPsychPlayAudio,
            params: {
                audio_path: 'audio/camtest.mp3',
            }
        }
    ] : [],
}

const calibration_guide = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `<h1>Camera Calibration</h1>
    <p>Before we start the game, we need to calibrate your camera.</p><p>Please follow the instructions carefully.</p>`,
    choices: ["Continue"],
    show_button_after: configs.DEBUGGING ? 10 : configs.AUDIO_DURATIONS.cam_calibration * 1000,
    extensions: configs.AUDIO ? [
        {
            type: jsPsychPlayAudio,
            params: {
                audio_path: 'audio/cam_calibration.mp3',
            }
        }
    ] : [],
}

const cam_calibration = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `<h1>Camera Calibration</h1>
    <p>During the calibration, you will see a few dots on the screen.</p><p>Please look at the dots as they appear.</p><p>Then you need to click them with your mouse.</p>`,
    choices: ["Continue"],
    show_button_after: configs.DEBUGGING ? 10 : configs.AUDIO_DURATIONS.cam_calibration_2 * 1000,
    extensions: configs.AUDIO ? [
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
    repitation_per_point: 1,
    extensions: configs.AUDIO ? [
        {
            type: jsPsychPlayAudio,
            params: {
                audio_path: 'audio/webgazer-calibration.mp3',
            }
        }
    ] : [],
}

// MARK: Tutorial Start
// Welcome screen
const tutorial_welcome = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `<h1>The Quest for the Lost Relics</h1>
<p>In a time long forgotten, the kingdom of Eldoria was known for its powerful and enchanting relics.</p><p>These relics, known as the Arcane Crystals, Ethereal Blossoms, Draconic Scales, and Lunar Pearls, were the source of magic that kept the kingdom in harmony.</p>`,
    choices: ["Continue"],
    show_button_after: configs.DEBUGGING ? 10 : configs.AUDIO_DURATIONS.quest * 1000,
    data: {
        tutorial: true,
    },
    extensions: configs.AUDIO? [
        {
            type: jsPsychPlayAudio,
            params: {
                audio_path: 'audio/quest.mp3',
            }
        }
    ] : [],
};
const tutorial_intro = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `<p>The wise sages of Eldoria created four special bags, each designed to house one type of specific relic.</p><p>However, over the centuries, the knowledge of their correct bags was lost.</p>
        <img src="images/tutorial/buckets/tutorial_basket-1.png" width="10%" />
        <img src="images/tutorial/buckets/tutorial_basket-2.png" width="10%" />
        <img src="images/tutorial/buckets/tutorial_basket-3.png" width="10%" />
        <img src="images/tutorial/buckets/tutorial_basket-4.png" width="10%" />`,
    choices: ["Continue"],
    show_button_after: configs.DEBUGGING ? 10 : configs.AUDIO_DURATIONS.quest_bag * 1000,
    data: {
        tutorial: true,
    },
    extensions: configs.AUDIO? [
        {
            type: jsPsychPlayAudio,
            params: {
                audio_path: 'audio/quest_bag.mp3',
            }
        }
    ] : [],
};
const tutorial_task = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `<p>Your task is to venture into the Enchanted Forest and restore the magic of Eldoria.</p><p>You will be provided with the four bags.</p><p>Each bag must contain only specific types of relics to preserve its magical energy.</p><p>After putting a relic in the correct bag, you will receive a diamond reward.</p><p>If the relic is put into a wrong bag, you will not receive any diamond.</p>`,
    choices: ["Continue"],
    show_button_after: configs.DEBUGGING ? 10 : configs.AUDIO_DURATIONS.task * 1000,
    data: {
        tutorial: true,
    },
    extensions: configs.AUDIO? [
        {
            type: jsPsychPlayAudio,
            params: {
                audio_path: 'audio/task.mp3',
            }
        }
    ] : [],
};


// MARK: Tutorial
// Tutorial start
const tutorialFixationPoint = {
    type: jsPsychWebgazerValidate,
    validation_points: [[0, 0]],
    validation_point_coordinates: 'center-offset-pixels',
    roi_radius: 100,
    show_validation_data: false,
    data: {
        my_trial_type: 'fixation-point',
        tutorial: true
    }
}

const tutorialStateEstimation = {
    type: jsPsychHtmlButtonResponse,
    stimulus: () => `<img src="${jsPsych.timelineVariable('stimuli_path')}" width="25%" />
<p>This is ${findMaxIndex(jsPsych.timelineVariable('bucket_probabilities')) === 0 ? "a" : "another"} relic. </p>
<p>As we have not named the relic yet, assign a new name to this relic.</p>`,
    choices: () => [
        // all previous relics
        ...configs.all_context_state_names[jsPsych.timelineVariable('context')].slice(0, configs.all_context_assigned_indices[jsPsych.timelineVariable('context')]),
        'Assign new relic name'
    ],
    button_html: (choice: string) => {
        if (choice === configs.all_context_state_names[jsPsych.timelineVariable('context')][jsPsych.timelineVariable('correct_state_index')]) {
            return `<button class="jspsych-btn tutorial-state-estimation-btn">${choice}</button>`;
        }
        if (choice === 'Assign new relic name') {
            return `<button class="jspsych-btn tutorial-state-estimation-btn">${choice}</button>`;
        }
        return `<button class="jspsych-btn tutorial-state-estimation-btn" disabled>${choice}</button>`;
    },
    data: { my_trial_type: 'state-estimation', tutorial: true },
    on_finish: (data: any) => {
        const tutorial_states = configs.all_context_state_names[jsPsych.timelineVariable('context')];
        data.new_state = true;
        configs.all_context_assigned_indices[jsPsych.timelineVariable('context')]++;
        data.estimated_state = tutorial_states[findMaxIndex(jsPsych.timelineVariable('bucket_probabilities'))];
    }
}

const tutorialShowIfNewState = {
    timeline: [{
        type: jsPsychHtmlButtonResponse,
        stimulus: () => `<img src="${jsPsych.timelineVariable('stimuli_path')}" width="25%" />
        <p>The new name is <b>${getLastTrialTreasureName(configs.all_context_state_names[jsPsych.timelineVariable('context')])}</b>.</p>`,
        choices: ["Continue"],
    }],
    data: {
        tutorial: true
    },
    conditional_function: () => jsPsych
        .data.get()
        .filter({ my_trial_type: 'state-estimation' })
        .last(1)
        .values()[0]
        .new_state,
}

const tutorialActionSelection = {
    type: jsPsychDragndrop,
    element: jsPsych.timelineVariable('stimuli_path'),
    show_element_label: true,
    element_label: () => getLastTrialTreasureName(configs.all_context_state_names[jsPsych.timelineVariable('context')]),
    buckets: () => jsPsych.timelineVariable('buckets').map((b: { image: string; }) => b.image),
    show_labels: true,
    bucket_labels: configs.tutorial_baskets.map(b => b.name),
    track_dragging: true,
    bucket_start_angle: jsPsych.timelineVariable('bucket_start_angle'),
    randomize_bucket_order: false,
    text_prompt: () => `This relic belongs to the <b>${configs.tutorial_baskets[findMaxIndex(jsPsych.timelineVariable('bucket_probabilities'))].name}</b>. Drag the treasure to that bag.`,
    data: { my_trial_type: 'dragndrop', tutorial: true },
    on_finish: (data: any) => {
        const bucket_probs = jsPsych.timelineVariable('bucket_probabilities');
        const correct_bucket_index = pickProbabilisticIndex(bucket_probs);
        data.bucket_probs = bucket_probs;
        data.correct_bucket_index = correct_bucket_index;
        data.is_correct = data.drop_bucket == correct_bucket_index;
    }
};
const tutorialRewardTrial = {
    type: jsPsychHtmlButtonResponse,
    stimulus: () => getOutcome() ? `
    <img src="${configs.rewards.correct}" width="30%" />
    <p>Well done! You have earned a magical reward!</p>` : `
    <img src="${configs.rewards.incorrect}" width="30%" /> <p>Oops! You have not earned a magical reward this time. You should drag the relic to the correct bag. </p>`,
    choices: ['Continue'],
    data: { my_trial_type: 'reward', tutorial: true },
};

const tutorialStateEstimation2 = {
    type: jsPsychHtmlButtonResponse,
    stimulus: () => `<img src="${jsPsych.timelineVariable('stimuli_path')}" width="25%" />
<p>This is the same relic. </p>
<p>So assign the same name to it.</p>`,
    choices: () => [
        ...configs.all_context_state_names[jsPsych.timelineVariable('context')].slice(0, jsPsych.timelineVariable('correct_state_index')+1),
        'Assign new relic name'
    ],
    button_html: (choice: string) => choice === configs.all_context_state_names[jsPsych.timelineVariable('context')][jsPsych.timelineVariable('correct_state_index')] ? `<button class="jspsych-btn tutorial-state-estimation-btn">${choice}</button>` : `<button class="jspsych-btn tutorial-state-estimation-btn" disabled>${choice}</button>`,
    data: { my_trial_type: 'state-estimation', tutorial: true },
    on_finish: (data: any) => {
        const tutorial_states = configs.all_context_state_names[jsPsych.timelineVariable('context')];
        data.new_state = false;
        data.estimated_state = tutorial_states[findMaxIndex(jsPsych.timelineVariable('bucket_probabilities'))];
    }
}


const tutorialActionSelection2 = {
    type: jsPsychDragndrop,
    element: jsPsych.timelineVariable('stimuli_path'),
    show_element_label: true,
    element_label: () => getLastTrialTreasureName(configs.all_context_state_names[jsPsych.timelineVariable('context')]),
    buckets: () => jsPsych.timelineVariable('buckets').map((b: { image: string; }) => b.image),
    show_labels: true,
    bucket_labels: configs.tutorial_baskets.map(b => b.name),
    bucket_start_angle: jsPsych.timelineVariable('bucket_start_angle'),
    track_dragging: true,
    randomize_bucket_order: false,
    text_prompt: () => `Good job on your previous relic sorting!</p><p>Let's drag the relic one more time to <b>${configs.tutorial_baskets[findMaxIndex(jsPsych.timelineVariable('bucket_probabilities'))].name}</b>.`,
    data: { my_trial_type: 'dragndrop', tutorial: true },
    on_finish: (data: any) => {
        const bucket_probs = jsPsych.timelineVariable('bucket_probabilities');
        const correct_bucket_index = pickProbabilisticIndex(bucket_probs);
        data.bucket_probs = bucket_probs;
        data.correct_bucket_index = correct_bucket_index;
        data.is_correct = data.drop_bucket == correct_bucket_index;
    }
};

const tutorialCorrectLoop = {
    timeline: [tutorialActionSelection, tutorialRewardTrial],
    loop_function: () => !getOutcome(),
};
const tutorialCorrectLoop2 = {
    timeline: [tutorialActionSelection2, tutorialRewardTrial],
    loop_function: () => !getOutcome(),
};
    
const tutorialTimeline = [
    ... configs.TRACK_EYE ? [tutorialFixationPoint] : [],
    tutorialStateEstimation,
    tutorialShowIfNewState,
    tutorialCorrectLoop,

    ... configs.TRACK_EYE ? [tutorialFixationPoint] : [],
    tutorialStateEstimation2,
    tutorialCorrectLoop2,
]
const tutorialProcedure = {
    timeline: !configs.DEBUGGING ? addObjectInRange(tutorialTimeline, fullscreenIfTrial, 1, tutorialTimeline.length - 1) : tutorialTimeline,
    timeline_variables: [
        {
            stimuli: `<img src="${configs.tutorial_stimulus[0].image}" width="50%" />`,
            bucket_probabilities: [1],
            stimuli_path: configs.tutorial_stimulus[0].image,
            buckets: [configs.tutorial_baskets[0]],
            bucket_start_angle: 0,
            correct_state_index: 0,
            context: 0, 
        },
        {
            stimuli: `<img src="${configs.tutorial_stimulus[1].image}" width="50%" />`,
            bucket_probabilities: [0, 1],
            stimuli_path: configs.tutorial_stimulus[1].image,
            buckets: [configs.tutorial_baskets[0], configs.tutorial_baskets[1]],
            bucket_start_angle: 0,
            correct_state_index: 1,
            context: 0, 
        },
        {
            stimuli: `<img src="${configs.tutorial_stimulus[2].image}" width="50%" />`,
            bucket_probabilities: [0, 0, 1],
            stimuli_path: configs.tutorial_stimulus[2].image,
            buckets: [configs.tutorial_baskets[0], configs.tutorial_baskets[1], configs.tutorial_baskets[2]],
            bucket_start_angle: 30,
            correct_state_index: 2,
            context: 0, 
        },
        {
            stimuli: `<img src="${configs.tutorial_stimulus[3].image}" width="50%" />`,
            bucket_probabilities: [0, 0, 0, 1],
            stimuli_path: configs.tutorial_stimulus[3].image,
            buckets: [configs.tutorial_baskets[0], configs.tutorial_baskets[1], configs.tutorial_baskets[2], configs.tutorial_baskets[3]],
            bucket_start_angle: 45,
            context: 0, 
            correct_state_index: 3,
        },
    ],
    randomize_order: false,
    repetitions: 1,
    data: {
        context: 0,
        tutorial: true,
    }
}

const tutorial_prob_intro = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `<p>Sometimes, even if you select the right bag for a relic, you might not get a reward.</p>
    <p>For the next 5 relics, they will all belong to "${configs.tutorial_baskets[0].name}".</p>
    <p>However, for approximately 1 out of 5 relics, you may not receive a reward after selecting the correct bag.</p>
    <p>You will see when you put all the relics in "${configs.tutorial_baskets[0].name}"</p>`,
    choices: ['Continue'],
    show_button_after: configs.DEBUGGING ? 10: 1000,
}
const tutorial_prob_action_selection = {
    type: jsPsychDragndrop,
    element: jsPsych.timelineVariable('stimulus'),
    show_element_label: true,
    element_label: configs.all_context_state_names[0][0],
    buckets: () => jsPsych.timelineVariable('buckets').map((b: any) => b.image),
    show_labels: true,
    bucket_start_angle: jsPsych.timelineVariable('start_angle'),
    bucket_labels: () => jsPsych.timelineVariable('buckets').map((b: any) => b.name),
    track_dragging: true,
    randomize_bucket_order: false,
    text_prompt: () => `<p>This relic belongs to <b>${jsPsych.timelineVariable('correct_bucket_name')}</b>. Drag the treasure to that bag.</p>
    <p>${jsPsych.timelineVariable('incorrect_times')}/${jsPsych.timelineVariable('total_times')} times, you will not be rewarded.</p>`,
    data: { my_trial_type: 'dragndrop', tutorial: true },
    on_finish: (data: any) => {
        data.is_correct = data.drop_bucket === jsPsych.timelineVariable('correct_bucket_index') && jsPsych.timelineVariable('is_correct');
    }
};

const tutorial_prob_reward_trial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: () => getOutcome() ? `
    <img src="${configs.rewards.correct}" width="30%" />` : `<img src="${configs.rewards.incorrect}" width="30%" />`,
    choices: configs.DEBUGGING ? "ALL_KEYS" : "NO_KEYS",
    trial_duration: 2000,
    data: { my_trial_type: 'reward', tutorial: true },
};

const tutorial_prob_stage1 = {
    timeline: [tutorial_prob_action_selection, tutorial_prob_reward_trial],
    repetitions: 1,
    randomize_order: false,
    timeline_variables: [
        ...Array.from({ length: 1 }, () => ({
            is_correct: false,
            correct_bucket_index: 0,
            correct_bucket_name: configs.tutorial_baskets[0].name,
            start_angle: 0,
            buckets: [configs.tutorial_baskets[0]],
            stimulus: configs.tutorial_stimulus[0].image,
            incorrect_times: 1,
            total_times: 5
        })),
        ...Array.from({ length: 4 }, () => ({
            is_correct: true,
            correct_bucket_index: 0,
            correct_bucket_name: configs.tutorial_baskets[0].name,
            start_angle: 0,
            buckets: [configs.tutorial_baskets[0]],
            stimulus: configs.tutorial_stimulus[0].image,
            incorrect_times: 1,
            total_times: 5
        })),
    ],
}

const tutorial_prob_intro2 = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `<p>For the next 5 relics, they will all belong to "${configs.tutorial_baskets[1].name}"</p>
    <p>However, for approximately 4 out of 5 relics, you may not receive a reward after selecting the correct bag.</p>
    <p>You will see when you put all the relics in "${configs.tutorial_baskets[1].name}"</p>`,
    choices: ['Continue'],
    show_button_after: configs.DEBUGGING ? 10: 1000,
}

const tutorial_prob_stage2 = {
    timeline: [tutorial_prob_action_selection, tutorial_prob_reward_trial],
    repetitions: 1,
    randomize_order: true,
    timeline_variables: [
        ...Array.from({ length: 1 }, () => ({
            is_correct: true,
            correct_bucket_index: 0,
            correct_bucket_name: configs.tutorial_baskets[1].name,
            start_angle: 180,
            buckets: [configs.tutorial_baskets[1]],
            stimulus: configs.tutorial_stimulus[1].image,
            incorrect_times: 4,
            total_times: 5
        })),
        ...Array.from({ length: 4 }, () => ({
            is_correct: false,
            correct_bucket_index: 0,
            correct_bucket_name: configs.tutorial_baskets[1].name,
            start_angle: 180,
            buckets: [configs.tutorial_baskets[1]],
            stimulus: configs.tutorial_stimulus[1].image,
            incorrect_times: 4,
            total_times: 5
        })),
    ],
}

const tutorial_prob_intro3 = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `<p>Finally in the next 10 rounds, you will see both relics.</p>
    <p>For each relic, it will belong to their corresponding bags.</p>
    <p>However, for approximately 1 out of 5 times for each relic, you may not receive a reward even after selecting the correct bag.</p>`,
    choices: ['Continue'],
    show_button_after: configs.DEBUGGING ? 10: 1000,
}

const tutorial_prob_stage3 = {
    timeline: [tutorial_prob_action_selection, tutorial_prob_reward_trial],
    repetitions: 1,
    randomize_order: true,
    timeline_variables: [
        ...Array.from({ length: 4 }, () => ({
            start_angle: 0,
            buckets: [configs.tutorial_baskets[0], configs.tutorial_baskets[1]],
            stimulus: configs.tutorial_stimulus[0].image,
            correct_bucket_name: configs.tutorial_baskets[0].name,
            correct_bucket_index: 0,
            is_correct: true,
            incorrect_times: 2,
            total_times: 10
        })),
        ...Array.from({ length: 1 }, () => ({
            start_angle: 0,
            buckets: [configs.tutorial_baskets[0], configs.tutorial_baskets[1]],
            stimulus: configs.tutorial_stimulus[0].image,
            correct_bucket_name: configs.tutorial_baskets[0].name,
            correct_bucket_index: 0,
            is_correct: false,
            incorrect_times: 2,
            total_times: 10
        })),
        ...Array.from({ length: 4 }, () => ({
            start_angle: 0,
            buckets: [configs.tutorial_baskets[0], configs.tutorial_baskets[1]],
            stimulus: configs.tutorial_stimulus[1].image,
            correct_bucket_name: configs.tutorial_baskets[1].name,
            correct_bucket_index: 1,
            is_correct: true,
            incorrect_times: 2,
            total_times: 10
        })),
        ...Array.from({ length: 1 }, () => ({
            start_angle: 0,
            buckets: [configs.tutorial_baskets[0], configs.tutorial_baskets[1]],
            stimulus: configs.tutorial_stimulus[1].image,
            correct_bucket_name: configs.tutorial_baskets[1].name,
            correct_bucket_index: 1,
            is_correct: false,
            incorrect_times: 2,
            total_times: 10
        })),
    ],
}


// MARK: Main Intro
// Main game intro
const tutorial_outro = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `<h1>Great job!</h1>
<p>You have successfully completed the tutorial. Now, you will be presented with the main game.</p>
<p>This time you won't know where to drag each element. You have to learn where to drag the elements by trying options and see which work.</p>`,
    choices: ["Continue"],
    show_button_after: configs.DEBUGGING ? 10 : configs.AUDIO_DURATIONS.great_job * 1000,
    extensions: configs.AUDIO ? [
        {
            type: jsPsychPlayAudio,
            params: {
                audio_path: 'audio/great_job.mp3',
            }
        }
    ] : [],
}

const main_game_intro = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `<h1>The Lost Treasures of Colorland</h1>
<p>Welcome to Colorland, a vibrant kingdom where every shape, color, and pattern contributes to its festivals.</p><p>This year, a whirlwind has mixed up all the decorations needed for the grand Festival of Patterns.</p><p>Without these decorations in their right places, the festival cannot start.</p>`,
    choices: ["Continue"],
    show_button_after: configs.DEBUGGING ? 10 : configs.AUDIO_DURATIONS.colorland * 1000,
    extensions: configs.AUDIO ? [
        {
            type: jsPsychPlayAudio,
            params: {
                audio_path: 'audio/colorland.mp3',
            }
        }
    ] : [],
}

const main_game_intro2 = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `<p>To save the Festival of Patterns, we need your special skills.</p><p>We have four magical buckets, each dedicated to collecting specific types of festival decorations.</p>
        <img src="images/baskets/basket-blue.png" width="10%" />
        <img src="images/baskets/basket-green.png" width="10%" />
        <img src="images/baskets/basket-red.png" width="10%" />
        <img src="images/baskets/basket-yellow.png" width="10%" />`,
    choices: ["Continue"],
    show_button_after: configs.DEBUGGING ? 10 : configs.AUDIO_DURATIONS.colorland_4bags * 1000,
    extensions: configs.AUDIO ? [
        {
            type: jsPsychPlayAudio,
            params: {
                audio_path: 'audio/colorland_4bags.mp3',
            }
        }
    ] : [],
}
const main_game_intro3 = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `<p>Here’s how you can help: We will show you one special decoration at a time.</p><p>You need to assign name for that treasure, and then drop it in the right bucket.</p><p>If you place it correctly, a magical reward will appear! </p>`,
    choices: ["Continue"],
    show_button_after: configs.DEBUGGING ? 10 : configs.AUDIO_DURATIONS.colorland_help * 1000,
    extensions: configs.AUDIO ? [
        {
            type: jsPsychPlayAudio,
            params: {
                audio_path: 'audio/colorland_help.mp3',
            }
        }
    ] : [],
}
const main_game_intro4 = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `<h1>Let the Treasure Hunting Begin!</h1>`,
    show_button_after: configs.DEBUGGING ? 10 : 1000,
    choices: ["Start"],
}


// MARK: Main game Start
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
    show_button_after: configs.DEBUGGING ? 0:4000, 
    on_start: (trial: any) => {
        const shuffleResult = getShuffledArray(
            configs.all_context_state_names[jsPsych.timelineVariable('context')]
                .slice(0, configs.all_context_assigned_indices[jsPsych.timelineVariable('context')]));
        if (jsPsych.timelineVariable('context') !== 3)
            trial.choices = shuffleResult.shuffledArray.concat("Assign new treasure name");
        else
            trial.choices = shuffleResult.shuffledArray;
        choiceOrders = shuffleResult.originalIndices;
    },
    choices: [],
    prompt: "",
    on_finish: (data: any) => {
        const currentContext = jsPsych.timelineVariable('context');
        const context_state_names = configs.all_context_state_names[currentContext];
        const response = choiceOrders[data.response];
        delete data.choiceOriginalIndices;

        if (response < configs.all_context_assigned_indices[currentContext]) {
            data.estimated_state = context_state_names[response];
            data.new_state = false;
        }
        else {
            data.estimated_state = context_state_names[configs.all_context_assigned_indices[currentContext]];
            configs.all_context_assigned_indices[currentContext]++;
            data.new_state = true;
        }
    },
    extensions: [ 
        ... configs.TRACK_EYE ? [{
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
        type: jsPsychHtmlButtonResponse,
        stimulus: () => `<img src="${jsPsych.timelineVariable('stimuli_path')}" width="25%" />
    <p>The new name of this treasure is <b>${getLastTrialTreasureName(configs.all_context_state_names[jsPsych.timelineVariable('context')])}</b>.</p>`,
    }],
    choices: ['Continue'],
    conditional_function: () => jsPsych
        .data.get()
        .filter({ my_trial_type: 'state-estimation' })
        .last(1)
        .values()[0]
        .new_state
}


const actionSelection = {
    type: jsPsychDragndrop,
    element: jsPsych.timelineVariable('stimuli_path'),
    show_element_label: true,
    element_label: () => getLastTrialTreasureName(configs.all_context_state_names[jsPsych.timelineVariable('context')]) + (configs.DEBUGGING ? ` (${configs.BASKETS[findMaxIndex(jsPsych.timelineVariable('bucket_probabilities'))].name})` : ""),
    buckets: () => jsPsych.timelineVariable('buckets').map((b: { image: string; }) => b.image),
    bucket_start_angle: jsPsych.timelineVariable('bucket_start_angle'),
    show_labels: true,
    bucket_labels: () => jsPsych.timelineVariable('buckets').map((b: { name: string; }, i: number) => b.name + (configs.DEBUGGING ? ` (${Math.round(jsPsych.timelineVariable('bucket_probabilities')[i]*100)/100})` : "")),
    track_dragging: true,
    randomize_bucket_order: false,
    extensions: [ 
        ... configs.TRACK_EYE ? [{
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
        },
        {
            type: jsPsychHelpButton,
            params: {
                header: "Drag-n-drop Tutorial",
                content: TUTORIAL_CONTENT,
            }
        }
    ],
    data: { my_trial_type: 'dragndrop' },
    on_finish: (data: any) => {
        const bucket_probs = jsPsych.timelineVariable('bucket_probabilities');
        const correct_bucket_index = pickProbabilisticIndex(bucket_probs);
        data.bucket_probs = bucket_probs;
        data.correct_bucket_index = correct_bucket_index;
        data.is_correct = data.drop_bucket == correct_bucket_index;
    }
}

const rewardTrial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: () => getOutcome() ? `
    <img src="${configs.rewards.correct}" width="30%" />` : `<img src="${configs.rewards.incorrect}" width="30%" />`,
    choices: configs.DEBUGGING ? "ALL_KEYS" : "NO_KEYS",
    trial_duration: 2000,
    data: { my_trial_type: 'reward' },
};

// MARK: Context 1
// Context 1
const context1Timeline = [
    ... configs.TRACK_EYE ? [fixationPoint] : [],
    stateEstimation,
    showIfNewState,
    actionSelection,
    rewardTrial,
]

const context1Procedure = {
    timeline: !configs.DEBUGGING ? addObjectInRange(context1Timeline, fullscreenIfTrial, 1, context1Timeline.length - 1) : context1Timeline,
    timeline_variables: Array.from({ length: 4 }).map((_, i) => (
        {
            stimuli: `<img src="${configs.context1_stimulus[i].image}" width="50%" />`,
            bucket_probabilities: createProbabilisticDistribution(configs.REWARD_PROBABILITY, configs.context1_stimulus[i].correct_action, 2),
            stimuli_path: configs.context1_stimulus[i].image,
            context: 1,
            buckets: [configs.BASKETS[0], configs.BASKETS[1]],
            bucket_start_angle: 0,
        }
    )),
    randomize_order: true,
    repetitions: 3,
    data: { context: 1 },
}

// MARK: Context 2
// Context 2 Intro
const context2Intro = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `<h1>Good job!</h1>
<p>You have sorted the first set of treasures.</p><p>Now, you will be presented with a new set of treasures. Best of luck!</p>`,
    choices: ["Continue"],
    show_button_after: configs.DEBUGGING ? 10 : 1000,
    extensions: configs.AUDIO ? [
        {
            type: jsPsychPlayAudio,
            params: {
                audio_path: 'audio/context-1-good-job.mp3',
            }
        }
    ] : [],
}

// Context 2
const context2Timeline = [
    ... configs.TRACK_EYE ? [fixationPoint] : [],
    stateEstimation,
    showIfNewState,
    actionSelection,
    rewardTrial,
]
const context2Procedure = {
    timeline: !configs.DEBUGGING ? addObjectInRange(context2Timeline, fullscreenIfTrial, 1, context2Timeline.length - 1) : context2Timeline,
    timeline_variables: Array.from({ length: 4 }).map((_, i) => (
        {
            stimuli: `<img src="${configs.context2_stimulus[i].image}" width="50%" />`,
            bucket_probabilities: createProbabilisticDistribution(configs.REWARD_PROBABILITY, configs.context2_stimulus[i].correct_action, 2),
            stimuli_path: configs.context2_stimulus[i].image,
            context: 2,
            buckets: [configs.BASKETS[2], configs.BASKETS[3]],
            bucket_start_angle: 90,
        }
    )),
    randomize_order: true,
    repetitions: 3,
    data: { context: 2 },
}

// MARK: Context 3
// Context 3 Intro
const context3Intro = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `<h1>Good job!</h1>
<p>You have sorted the second set of treasures!</p>
<p>At the last stage, you will encounter all the treasures you have seen so far throughout Colorland.</p>
<p>As you are already familiar with these treasures, we will not show any reward feedback.</p>
<p>The fate of colorland depends on you. Best of luck!</p>`,
    choices: ["Continue"],
    show_button_after: configs.DEBUGGING ? 10 : 1000,
    extensions: configs.AUDIO ? [
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
        // Use context 1 and context 2 states to the last context
        configs.all_context_state_names[3] = configs.all_context_state_names[1].slice(0, configs.all_context_assigned_indices[1])
            .concat(configs.all_context_state_names[2].slice(0, configs.all_context_assigned_indices[2]));
        
        configs.all_context_assigned_indices[3] = configs.all_context_assigned_indices[1] + configs.all_context_assigned_indices[2];
    }
};

// Context 3
const context3Timeline = [
    ... configs.TRACK_EYE ? [fixationPoint] : [],
    stateEstimation,
    showIfNewState,
    actionSelection,
    // rewardTrial,
]
const context3Procedure = {
    timeline: !configs.DEBUGGING ? addObjectInRange(context3Timeline, fullscreenIfTrial, 1, context3Timeline.length - 1) : context3Timeline,
    timeline_variables: Array.from({ length: 8 }).map((_, i) => (
        {
            stimuli: `<img src="${configs.context3_stimulus[i].image}" width="50%" />`,
            bucket_probabilities: createProbabilisticDistribution(configs.REWARD_PROBABILITY, configs.context3_stimulus[i].correct_action, 4),
            stimuli_path: configs.context3_stimulus[i].image,
            context: 3,
            buckets: [configs.BASKETS[0], configs.BASKETS[1], configs.BASKETS[2], configs.BASKETS[3]],
            bucket_start_angle: 45,
        }
    )),
    randomize_order: true,
    repetitions: 3,
    data: { context: 3 },
}

// MARK: Survey
const stateSurvey = {
    type: jsPsychSurveyMultiSelect,
    questions: [
        {
            prompt: "After observing all the treasures and their reaction to certain buckets, you have assigned names to each types of treasures. Which of your name assignments do you think are actually real? (You may need to scroll down to see all options)",
            name: 'realTreasures',
            options: () => configs.all_context_state_names[1].slice(0, configs.all_context_assigned_indices[1])
                .concat(configs.all_context_state_names[2].slice(0, configs.all_context_assigned_indices[2])),
            required: true,
            horizontal: true
        },
    ],
    extensions: configs.AUDIO ? [
        {
            type: jsPsychPlayAudio,
            params: {
                audio_path: 'audio/survey-question.mp3',
            }
        }
    ] : [],
}

const stateActionSurvey = {
    type: jsPsychSurveyMultiChoice,
    questions: () => jsPsych.data.get().filter({ trial_type: 'survey-multi-select' }).last(1).values()[0].response.realTreasures.map((t: string) => ({
        prompt: `For the treasure named "<b>${t}</b>", which bucket do you think it belongs to?`,
        name: t,
        options: configs.BASKETS.map(b => b.name),
        required: true,
    })),
}

const prolificFinishTrial = {
    type: jsPsychProlificFinish,
    code: "CFH86CJA",
    data: {
        my_trial_type: 'prolific-finish',
    }
}

// outro
const outro = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<h1>Thank you for playing and participating in this game!</h1><p>You may now close the window.</p>`,
};


// MARK: Timeline
const timeline: any[] = [
    ... configs.PROLIFIC ? [prolific_data_trial] : [],
    preload,

    ...!(configs.DEBUGGING && skip_to >= 0) ? [
        welcome,
        ...audio_tests,
        ...all_preparations,
        fullscreen,
        browser_check,
        experiment_information,
        recording_info,
        eye_calibration_intro,

        ... configs.DEBUGGING ? [] : [{ type: jsPsychFullscreen, fullscreen_mode: true }],
        // { type: jsPsychFullscreen, fullscreen_mode: true },
    ]: [],

    ... configs.TRACK_EYE ? [
        cam_warning,
        cam_check,
        calibration_guide,
        cam_calibration,
        calibration_points,
    ] : [],
    
    ... !(configs.DEBUGGING && skip_to >= 1) ? [
        tutorial_welcome,
        tutorial_intro,
        tutorial_task,
        tutorialProcedure,
        tutorial_prob_intro,
        tutorial_prob_stage1,
        tutorial_prob_intro2,
        tutorial_prob_stage2,
        tutorial_prob_intro3,
        tutorial_prob_stage3,
        tutorial_outro,
    ] : [],
    
    ... !(configs.DEBUGGING && skip_to >= 2) ? [
        main_game_intro,
        main_game_intro2,
        main_game_intro3,
        main_game_intro4,
    
        context1Procedure,
    ] : [],

    ... !(configs.DEBUGGING && skip_to >= 3) ? [
        context2Intro,
        context2Procedure,
    ] : [],

    ... !(configs.DEBUGGING && skip_to >= 4) ? [
        context3Intro,
        populate_context3_state_names,
        context3Procedure,
    ] : [],
    
    stateSurvey,
    stateActionSurvey,
    ... configs.PROLIFIC ? [prolificFinishTrial] : [],
    outro,

    ... configs.DEBUGGING ? [] : [{ type: jsPsychFullscreen, fullscreen_mode: false }],
];

jsPsych.run(!configs.DEBUGGING ? addObjectInRange(timeline, fullscreenIfTrial, 7, timeline.length - 1) : timeline);


import jsPsychSurvey from '@jspsych/plugin-survey';

/**
 * Interface for survey question choices
 */
interface QuestionChoice {
    value: string;
    text: string;
}

/**
 * Interface for matrix question columns
 */
interface MatrixColumn {
    value: string;
    text: string;
}

/**
 * Interface for matrix question rows
 */
interface MatrixRow {
    value: string;
    text: string;
}

/**
 * Base interface for all question types
 */
interface BaseQuestion {
    type: "text" | "radiogroup" | "comment" | "rating" | "dropdown" | "checkbox" | "boolean" | "multipletext" | "matrix";
    name: string;
    title: string;
    isRequired?: boolean;
    visibleIf?: string;
}

/**
 * Interface for matrix questions
 */
interface MatrixQuestion extends BaseQuestion {
    type: "matrix";
    columns: MatrixColumn[];
    rows: MatrixRow[];
    rowTitleWidth?: string;
    alternateRows?: boolean;
}

/**
 * Interface for choice-based questions
 */
interface ChoiceQuestion extends BaseQuestion {
    type: "radiogroup" | "checkbox" | "dropdown";
    choices: QuestionChoice[];
    showNoneItem?: boolean;
    showOtherItem?: boolean;
    showSelectAllItem?: boolean;
    colCount?: number;
}

/**
 * Interface for text input questions
 */
interface TextQuestion extends BaseQuestion {
    type: "text";
    inputType?: string;
    min?: number;
    max?: number;
    step?: number;
}

/**
 * Interface for boolean questions
 */
interface BooleanQuestion extends BaseQuestion {
    type: "boolean";
    swapOrder?: boolean;
}

/**
 * Union type for all possible question types
 */
type Question = MatrixQuestion | ChoiceQuestion | TextQuestion | BooleanQuestion;

/**
 * Interface for a survey page
 */
interface SurveyPage {
    name: string;
    title?: string;
    description?: string;
    elements: Question[];
}

/**
 * Interface for the complete survey configuration
 */
interface SurveyConfig {
    showQuestionNumbers: boolean;
    title: string;
    description: string;
    completeText: string;
    pageNextText: string;
    pagePrevText: string;
    showPreviewBeforeComplete: boolean;
    pages: SurveyPage[];
}

const demographicQuestionnaire: SurveyPage = {
    name: "demographicQuestionnaire",
    title: "Demographic Questionnaire",
    description: "Please fill out the following questionnaire to help us understand your demographic information.",
    elements: [
        {
            type: "radiogroup",
            name: "demographicQuestionnaire_question_1",
            title: "What gender do you identify as?",
            isRequired: true,
            "choices": [
                {
                    "value": "female",
                    "text": "Female"
                },
                {
                    "value": "male",
                    "text": "Male"
                },
                {
                    "value": "trans_male",
                    "text": "Trans Male/Trans Man"
                },
                {
                    "value": "trans_female",
                    "text": "Trans Female/Trans Woman"
                },
                {
                    "value": "genderqueer",
                    "text": "Genderqueer/Gender NonConforming"
                },
                {
                    "value": "none",
                    "text": "Prefer not to say"
                }
            ]
        },
        {
            "type": "text",
            "name": "demographicQuestionnaire_question_2",
            "title": "What is your age?",
            "isRequired": true,
            "inputType": "number",
            "min": 18,
            "max": 100,
            "step": 1
        },
        {
            "type": "radiogroup",
            "name": "demographicQuestionnaire_question_3",
            "title": "How would you rate your sleep quality?",
            "isRequired": true,
            "choices": [
                {
                    "value": "bad",
                    "text": "Bad"
                },
                {
                    "value": "fair",
                    "text": "Fair"
                },
                {
                    "value": "good",
                    "text": "Good"
                }
            ]
        },
        {
            "type": "text",
            "name": "demographicQuestionnaire_question_4",
            "title": "How many hours of sleep did you get last night?",
            "isRequired": true,
            "inputType": "number",
            "min": 0,
            "max": 24
        },
        {
            "type": "dropdown",
            "name": "demographicQuestionnaire_question_5",
            "title": "What is your highest level of education?",
            "isRequired": true,
            "choices": [
                {
                    "value": "<highschool",
                    "text": "Some Highschool"
                },
                {
                    "value": "highschool",
                    "text": "Highschool Graduate"
                },
                {
                    "value": "<college",
                    "text": "Some College"
                },
                {
                    "value": "college",
                    "text": "College Graduate"
                },
                {
                    "value": "postgrad",
                    "text": "Postgraduate"
                }
            ]
        },
        {
            "type": "radiogroup",
            "name": "demographicQuestionnaire_question_6",
            "title": "How difficult was it to fall asleep?",
            "isRequired": true,
            "choices": [
                {
                    "value": "easy",
                    "text": "Easy"
                },
                {
                    "value": "medium",
                    "text": "Medium"
                },
                {
                    "value": "hard",
                    "text": "Hard"
                }
            ]
        },
        {
            "type": "checkbox",
            "name": "demographicQuestionnaire_question_7",
            "title": "Have you consumed any of these substances in the last 24 hours?",
            "isRequired": true,
            "choices": [
                {
                    "value": "none",
                    "text": "None"
                },
                {
                    "value": "adhd_stimulants",
                    "text": "ADHD medication (e.g. Ritalin)"
                },
                {
                    "value": "alcohol",
                    "text": "Alcohol"
                },
                {
                    "value": "tobacco",
                    "text": "Tobacco"
                },
                {
                    "value": "marijuana",
                    "text": "Marijuana"
                },
                {
                    "value": "opioids",
                    "text": "Opioids"
                },
                {
                    "value": "illicit_stimulants",
                    "text": "Cocaine or meth"
                },
                {
                    "value": "other",
                    "text": "Other performance-alterning substances not listed"
                }
            ]
        },
        {
            "type": "checkbox",
            "name": "demographicQuestionnaire_question_8",
            "title": "Have you consumed any caffeine today? If yes, what type?",
            "isRequired": true,
            "choices": [
                {
                    "value": "coffee",
                    "text": "Coffee"
                },
                {
                    "value": "tea",
                    "text": "Tea"
                },
                {
                    "value": "energy_drink",
                    "text": "Energy drink"
                },
                {
                    "value": "soda",
                    "text": "Soda"
                },
                {
                    "value": "caffeine_pill",
                    "text": "Caffeine pill"
                }
            ],
            "showOtherItem": true,
            "showNoneItem": true,
            "showSelectAllItem": true
        },
        {
            "type": "radiogroup",
            "name": "demographicQuestionnaire_question_9",
            "visibleIf": "{demographicQuestionnaire_question_7} anyof ['alcohol']",
            "title": "How many alcoholic drinks have you consumed in the last 24 hours?",
            "isRequired": true,
            "choices": [
                {
                    "value": "none",
                    "text": "None"
                },
                {
                    "value": "1",
                    "text": "One drink"
                },
                {
                    "value": "2",
                    "text": "Two drinks"
                },
                {
                    "value": "3+",
                    "text": "Three or more drinks"
                }
            ]
        },
        {
            "type": "checkbox",
            "name": "demographicQuestionnaire_question_10",
            "title": "Have you ever been diagnosed with any of these conditions? Your answers will remain confidential.",
            "isRequired": true,
            "choices": [
                {
                    "value": "asd",
                    "text": "Autism spectrum disorder"
                },
                {
                    "value": "adhd",
                    "text": "Attention deficit hyperactivity disorder"
                },
                {
                    "value": "ocd",
                    "text": "Obsessive compulsive disorder"
                },
                {
                    "value": "depression",
                    "text": "Depression"
                },
                {
                    "value": "bipolar",
                    "text": "Bipolar disorder"
                },
                {
                    "value": "schizophrenia",
                    "text": "Schizophrenia"
                },
                {
                    "value": "schizotypy",
                    "text": "Schizotypal personality"
                },
                {
                    "value": "addiction",
                    "text": "Substance use disorder"
                }
            ],
            "showSelectAllItem": true
        }
    ]
}

const OCI: SurveyPage = {
    "name": "OCI",
    "title": "Obsessional Compulsive Inventory",
    "description": "The following statements refer to experiences that many people have in their everyday lives. Select the option that best describes how much that experience has distressed or bothered you during the PAST MONTH.",
    "elements": [
        {
            "rowTitleWidth": "40%",
            "alternateRows": true,
            "type": "matrix",
            "name": "OCI_question_1",
            "title": "Please rate the following statements on how much they apply to you.",
            "isRequired": true,
            "columns": [
                {
                    "value": "0",
                    "text": "Not at all"
                },
                {
                    "value": "1",
                    "text": "A little"
                },
                {
                    "value": "2",
                    "text": "Moderately"
                },
                {
                    "value": "3",
                    "text": "A lot"
                },
                {
                    "value": "4",
                    "text": "Extremely"
                }
            ],
            "rows": [
                {
                    "value": "saved",
                    "text": "I have saved up so many things that they get in the way."
                },
                {
                    "value": "check",
                    "text": "I check things more often than necessary."
                },
                {
                    "value": "get upset",
                    "text": "I get upset if objects are not arranged properly."
                },
                {
                    "value": "compelled",
                    "text": "I feel compelled to count while I am doing things."
                },
                {
                    "value": "find difficult",
                    "text": " find it difficult to touch an object when I know it has been touched by strangers or certain people."
                },
                {
                    "value": "difficult to control",
                    "text": "I find it difficult to control my own thoughts."
                },
                {
                    "value": "collect",
                    "text": "I collect things I don't need."
                },
                {
                    "value": "check repeadtedly",
                    "text": "I repeatedly check doors, windows, drawers, etc."
                },
                {
                    "value": "upset",
                    "text": "I get upset if others change the way I have arranged things."
                },
                {
                    "value": "repeat",
                    "text": "I feel I have to repeat certain numbers."
                },
                {
                    "value": "contaminated",
                    "text": "I sometimes have to wash or clean myself simply because I feel contaminated."
                },
                {
                    "value": "unpleasant",
                    "text": "I am upset by unpleasant thoughts that come into my mind against my will."
                },
                {
                    "value": "avoid",
                    "text": "I avoid throwing things away because I am afraid I might need them later."
                },
                {
                    "value": "Row 14repeatedl;y check",
                    "text": "I repeatedly check gas and water taps and light switches after turning them off."
                },
                {
                    "value": "need",
                    "text": "I need things to be arranged in a particular order."
                },
                {
                    "value": "feel",
                    "text": "I feel that there are good and bad numbers."
                },
                {
                    "value": "wash",
                    "text": "I wash my hands more often and longer than necessary."
                },
                {
                    "value": "get nasty",
                    "text": "I frequently get nasty thoughts and have difficulty in getting rid of them."
                }
            ]
        }
    ]
}

// @ts-ignore: Unused variable
const BAPQ: SurveyPage = {
    "name": "BAPQ",
    "title": "Broader Autism Phenotype Questionnaire (BAPQ)",
    "description": "You are about to fill out a series of statements related to personality and lifestyle. For each question, select an answer that best describes how often that statement applies to you. Many of these questions ask about your interactions with other people. Please think about the way you are with most people, rather than special relationships you may have with spouses or significant others, children, siblings, and parents.\n\nEveryone changes over time, which can make it hard to fill out questions about personality. Think about the way you have been the majority of your adult life, rather than the way you were as a teenager, or times you may have felt different than normal. You must answer each question, and give only one answer per question. If you are confused, please give it your best guess.",
    "elements": [
        {
            "type": "matrix",
            "name": "BAPQ_question_1",
            "title": "The Broader Autism Phenotype Questionnaire\n",
            "columns": [
                {
                    "value": "1",
                    "text": "Very rarely"
                },
                {
                    "value": "2",
                    "text": "Rarely"
                },
                {
                    "value": "3",
                    "text": "Occasionally"
                },
                {
                    "value": "4",
                    "text": "Somewhat often"
                },
                {
                    "value": "5",
                    "text": "Often"
                },
                {
                    "value": "6",
                    "text": "Very often"
                }
            ],
            "rows": [
                {
                    "value": "Row 1",
                    "text": " like being around other people."
                },
                {
                    "value": "Row 2",
                    "text": "I find it hard to get my words out smoothly"
                },
                {
                    "value": "Row 3",
                    "text": "I am comfortable with unexpected changes in plans."
                },
                {
                    "value": "Row 4",
                    "text": "It's hard for me to avoid getting sidetracked in conversation."
                },
                {
                    "value": "Row 5",
                    "text": "I would rather talk to people to get information than to socialize."
                },
                {
                    "value": "Row 6",
                    "text": "People have to talk me into trying something new."
                },
                {
                    "value": "Row 7",
                    "text": "I am 'in-tune' with the other person during conversation***."
                },
                {
                    "value": "Row 8",
                    "text": "I have to warm myself up to the idea of visiting an unfamiliar place."
                },
                {
                    "value": "Row 9",
                    "text": "I enjoy being in social situations."
                },
                {
                    "value": "Row 10",
                    "text": "My voice has a flat or monotone sound to it."
                },
                {
                    "value": "Row 11",
                    "text": "I  feel disconnected or 'out of sync' in conversations with others***.'"
                },
                {
                    "value": "Row 12",
                    "text": "People find it easy to approach me***."
                },
                {
                    "value": "Row 13",
                    "text": "I feel a strong need for sameness from day to day."
                },
                {
                    "value": "Row 14",
                    "text": "People ask me to repeat things I've said because they don't understand."
                },
                {
                    "value": "Row 15",
                    "text": "I am flexible about how things should be done."
                },
                {
                    "value": "Row 16",
                    "text": "I look forward to situations where I can meet new people."
                },
                {
                    "value": "Row 17",
                    "text": "I have been told that I talk too much about certain topics."
                },
                {
                    "value": "Row 18",
                    "text": "When I make conversation it is just to be polite***."
                },
                {
                    "value": "Row 19",
                    "text": "I look forward to trying new things."
                },
                {
                    "value": "Row 20",
                    "text": "I speak too loudly or softly."
                },
                {
                    "value": "Row 21",
                    "text": "I can tell when someone is not interested in what I am saying***."
                },
                {
                    "value": "Row 22",
                    "text": "I have a hard time dealing with changes in my routine."
                },
                {
                    "value": "Row 23",
                    "text": "I am good at making small talk***."
                },
                {
                    "value": "Row 24",
                    "text": "I act very set in my ways."
                },
                {
                    "value": "Row 25",
                    "text": "I feel like I am really connecting with other people."
                },
                {
                    "value": "Row 26",
                    "text": "People get frustrated by my unwillingness to bend."
                },
                {
                    "value": "Row 27",
                    "text": "Conversation bores me***."
                },
                {
                    "value": "Row 28",
                    "text": "I am warm and friendly in my interactions with others***."
                }
            ]
        },
        {
            "type": "matrix",
            "name": "BAPQ_question_2",
            "title": "The Broader Autism Phenotype Questionnaire\n",
            "columns": [
                {
                    "value": "1",
                    "text": "Very rarely"
                },
                {
                    "value": "2",
                    "text": "Rarely"
                },
                {
                    "value": "3",
                    "text": "Occasionally"
                },
                {
                    "value": "4",
                    "text": "omewhat often"
                },
                {
                    "value": "5",
                    "text": "Often"
                },
                {
                    "value": "6",
                    "text": "Very often"
                }
            ],
            "rows": [
                {
                    "value": "Row 1",
                    "text": "I leave long pauses in conversation."
                },
                {
                    "value": "Row 2",
                    "text": "I alter my daily routine by trying something different."
                },
                {
                    "value": "Row 3",
                    "text": "I prefer to be alone rather than with others."
                },
                {
                    "value": "Row 4",
                    "text": "I lose track of my original point when talking to people."
                },
                {
                    "value": "Row 5",
                    "text": "I like to closely follow a routine while working."
                },
                {
                    "value": "Row 6",
                    "text": "I can tell when it is time to change topics in conversation***."
                },
                {
                    "value": "Row 7",
                    "text": "When checked if I'm reading questions closely (like now), I select 'often' as my response."
                },
                {
                    "value": "Row 8",
                    "text": "I keep doing things the way I know, even if another way might be better."
                },
                {
                    "value": "Row 9",
                    "text": "I enjoy chatting with people***."
                }
            ]
        }
    ]
}

const connersScalesForADHDScreener: SurveyPage = {
    "name": "connersScalesForADHDScreener",
    "title": "Conners ADHD Scale",
    "description": "For each item decide how much or how frequently each item describes you recently. You can select the number that corresponds your choice.",
    "elements": [
        {
            "type": "matrix",
            "name": "connersScalesForADHDScreener_question_1",
            "title": "Conner's Scales for ADHD - Screener",
            "columns": [
                {
                    "value": "0",
                    "text": "Not at all, never"
                },
                {
                    "value": "1",
                    "text": "Just a little, once in a while"
                },
                {
                    "value": "2",
                    "text": "Pretty much, often"
                },
                {
                    "value": "3",
                    "text": "Very much, very frequently"
                }
            ],
            "rows": [
                {
                    "value": "Row 1",
                    "text": "I lose things necessary for tasks or activities (e.g. to-do lists, pencils, books or tools)."
                },
                {
                    "value": "Row 2",
                    "text": "I talk too much."
                },
                {
                    "value": "Row 3",
                    "text": "I am always on the go, as if driven by a motor."
                },
                {
                    "value": "Row 4",
                    "text": "I have trouble doing leisure activities quietly."
                },
                {
                    "value": "Row 5",
                    "text": "I have a short fuse/hot temper."
                },
                {
                    "value": "Row 6",
                    "text": "I leave my seat when I am not supposed to."
                },
                {
                    "value": "Row 7",
                    "text": "I still throw tantrums."
                },
                {
                    "value": "Row 8",
                    "text": "I have trouble waiting in line or taking turns with others."
                },
                {
                    "value": "Row 9",
                    "text": "I have trouble keeping my attention focused when working."
                },
                {
                    "value": "Row 10",
                    "text": "I avoid new challenges because I lack faith in my abilities."
                },
                {
                    "value": "Row 11",
                    "text": "I feel restless inside even if I am sitting still."
                },
                {
                    "value": "Row 12",
                    "text": "Things I hear or see distract me from what I'm doing."
                },
                {
                    "value": "Row 13",
                    "text": "I am forgetful in my daily activities."
                },
                {
                    "value": "Row 14",
                    "text": "I have trouble listening to what other people are saying."
                }
            ]
        },
        {
            "type": "matrix",
            "name": "connersScalesForADHDScreener_question_2",
            "title": "Conner's Scales for ADHD - Screener continued",
            "columns": [
                {
                    "value": "0",
                    "text": "Not at all, never"
                },
                {
                    "value": "1",
                    "text": "Just a little, once in a while"
                },
                {
                    "value": "2",
                    "text": "Pretty much, often"
                },
                {
                    "value": "3",
                    "text": "Very much, very frequently"
                }
            ],
            "rows": [
                {
                    "value": "Row 1",
                    "text": "I am an underachiever."
                },
                {
                    "value": "Row 2",
                    "text": "I am always on the go."
                },
                {
                    "value": "Row 3",
                    "text": "I can't get things done unless there's an absolute deadline."
                },
                {
                    "value": "Row 4",
                    "text": "I fidget (with my hands or feet) or squirm in my seat."
                },
                {
                    "value": "Row 5",
                    "text": "I make careless mistakes or have trouble paying close attention to detail."
                },
                {
                    "value": "Row 6",
                    "text": "I intrude on others' activities"
                },
                {
                    "value": "Row 7",
                    "text": "I don't like homework or job activities where I have to think a lot."
                },
                {
                    "value": "Row 8",
                    "text": "I am restless or overactive."
                },
                {
                    "value": "Row 9",
                    "text": "Sometimes my attention narrows so much that I'm oblivious to everything else; other times it's so broad that everything distracts me."
                },
                {
                    "value": "Row 10",
                    "text": "I can't keep my mind on something unless it's really interesting."
                },
                {
                    "value": "Row 11",
                    "text": "I give answers to questions before the questions have been completed."
                },
                {
                    "value": "Row 12",
                    "text": "I have trouble finishing job tasks or school work."
                },
                {
                    "value": "Row 13",
                    "text": "I interrupt other when they are working or playing."
                },
                {
                    "value": "Row 14",
                    "text": "My past failures make it hard for me to believe in myself."
                },
                {
                    "value": "Row 15",
                    "text": "I am distracted when things are going on around me."
                },
                {
                    "value": "Row 16",
                    "text": "I have problems organizing my tasks and activities."
                }
            ]
        }
    ]
}


const connersScalesForADHDFull: SurveyPage = {
    "name": "connersScalesForADHDFull",
    "title": "Conners ADHD Scale (Full)",
    "description": "For each item decide how much or how frequently each item describes you recently. You can select the number that corresponds your choice.",
    "elements": [
        {
            "type": "matrix",
            "name": "connersScalesForADHDFull_question_1",
            "title": "Conner's Scales for ADHD - Full\n",
            "columns": [
                {
                    "value": "0",
                    "text": "Not at all, never"
                },
                {
                    "value": "1",
                    "text": "Just a little, once in a while"
                },
                {
                    "value": "2",
                    "text": "Pretty much, often"
                },
                {
                    "value": "3",
                    "text": "Very much, very frequently"
                }
            ],
            "rows": [
                {
                    "value": "Row 1",
                    "text": "I like to be doing active things."
                },
                {
                    "value": "Row 2",
                    "text": "I lose things necessary for tasks or activities (e.g. to-do lists, pencils, books or tools)."
                },
                {
                    "value": "Row 3",
                    "text": "I don't plan ahead"
                },
                {
                    "value": "Row 4",
                    "text": "I blurt out things."
                },
                {
                    "value": "Row 5",
                    "text": "I am a risk-taker or a daredevil."
                },
                {
                    "value": "Row 6",
                    "text": "I get down on myself."
                },
                {
                    "value": "Row 7",
                    "text": "I don't finish things I start."
                },
                {
                    "value": "Row 8",
                    "text": "I don't finish things I start."
                },
                {
                    "value": "Row 9",
                    "text": "I talk too much."
                },
                {
                    "value": "Row 10",
                    "text": "I am always on the go, as if driven by a motor."
                },
                {
                    "value": "Row 11",
                    "text": "I'm disorganized."
                },
                {
                    "value": "Row 12",
                    "text": "I say things without thinking."
                },
                {
                    "value": "Row 13",
                    "text": "I say things without thinking."
                },
                {
                    "value": "Row 14",
                    "text": "It's hard for me to stay in one place very long."
                },
                {
                    "value": "Row 15",
                    "text": "I have trouble doing leisure activities quietly."
                }
            ]
        },
        {
            "type": "matrix",
            "name": "connersScalesForADHDFull_question_2",
            "title": "Conner's Scales for ADHD - Full continued",
            "columns": [
                {
                    "value": "0",
                    "text": "Not at all, never"
                },
                {
                    "value": "1",
                    "text": "Just a little, once in a while"
                },
                {
                    "value": "2",
                    "text": "Pretty much, often"
                },
                {
                    "value": "3",
                    "text": "Very much, very frequently"
                }
            ],
            "rows": [
                {
                    "value": "Row 1",
                    "text": "I'm not sure of myself"
                },
                {
                    "value": "Row 2",
                    "text": "It's hard for me to keep track of several things at once."
                },
                {
                    "value": "Row 3",
                    "text": "I'm always moving even when I should be still'."
                },
                {
                    "value": "Row 4",
                    "text": "I forget to remember things'."
                },
                {
                    "value": "Row 5",
                    "text": "I have a short fuse/hot temper."
                },
                {
                    "value": "Row 6",
                    "text": "I'm bored easily."
                },
                {
                    "value": "Row 7",
                    "text": "I leave my seat when I am not supposed to."
                },
                {
                    "value": "Row 8",
                    "text": "I have trouble waiting in line or taking turns with others."
                },
                {
                    "value": "Row 9",
                    "text": "I still throw tantrums."
                },
                {
                    "value": "Row 10",
                    "text": "I have trouble keeping my attention focused when working."
                },
                {
                    "value": "Row 11",
                    "text": "I seek out fast paced, exciting activities."
                },
                {
                    "value": "Row 12",
                    "text": "I avoid new challenges because I lack faith in my abilities."
                },
                {
                    "value": "Row 13",
                    "text": "I feel restless inside even if I am sitting still."
                },
                {
                    "value": "Row 14",
                    "text": "Things I hear or see distract me from what I'm doing."
                },
                {
                    "value": "Row 15",
                    "text": "I am forgetful in my daily activities."
                },
                {
                    "value": "Row 16",
                    "text": "Many things set me off easily."
                },
                {
                    "value": "Row 17",
                    "text": "I dislike quiet, introspective activities."
                },
                {
                    "value": "Row 18",
                    "text": "I lose things that I need."
                },
                {
                    "value": "Row 19",
                    "text": "I have trouble listening to what other people are saying."
                },
                {
                    "value": "Row 20",
                    "text": "I am an underachiever."
                },
                {
                    "value": "Row 21",
                    "text": "I interrupt others when talking."
                },
                {
                    "value": "Row 22",
                    "text": "I change plans/jobs in midstream."
                },
                {
                    "value": "Row 23",
                    "text": "I act okay on the outside, but inside I'm unsure of myself."
                },
                {
                    "value": "Row 24",
                    "text": "I am always on the go."
                },
                {
                    "value": "Row 25",
                    "text": "I make comments/remarks that I wish I could take back."
                },
                {
                    "value": "Row 26",
                    "text": "I can't get things done unless there's an absolute deadline."
                },
                {
                    "value": "Row 27",
                    "text": "I fidget (with my hands or feet) or squirm in my seat."
                }
            ]
        },
        {
            "type": "matrix",
            "name": "connersScalesForADHDFull_question_3",
            "title": "Conner's Scales for ADHD - Full continued",
            "columns": [
                {
                    "value": "0",
                    "text": "Not at all, never"
                },
                {
                    "value": "1",
                    "text": "Just a little, once in a while"
                },
                {
                    "value": "2",
                    "text": "Pretty much, often"
                },
                {
                    "value": "3",
                    "text": "Very much, very frequently"
                }
            ],
            "rows": [
                {
                    "value": "Row 1",
                    "text": "I make careless mistakes or have trouble paying close attention to detail."
                },
                {
                    "value": "Row 2",
                    "text": "I step on people's toes without meaning to."
                },
                {
                    "value": "Row 3",
                    "text": "I have trouble getting started on a task."
                },
                {
                    "value": "Row 4",
                    "text": "I intrude on others' activities."
                },
                {
                    "value": "Row 5",
                    "text": "It takes a great deal of effort for me to sit still."
                },
                {
                    "value": "Row 6",
                    "text": "My moods are unpredictable"
                },
                {
                    "value": "Row 7",
                    "text": "I don't like homework or job activities where I have to think a lot."
                },
                {
                    "value": "Row 8",
                    "text": "I'm absent-minded in daily activities."
                },
                {
                    "value": "Row 9",
                    "text": "I am restless or overactive."
                },
                {
                    "value": "Row 10",
                    "text": "I depend on others to keep my life in order and attend to the details."
                },
                {
                    "value": "Row 11",
                    "text": "I annoy other people without meaning to."
                },
                {
                    "value": "Row 12",
                    "text": "Sometimes my attention narrows so much that I'm obvlivious to everything else; other times it's so broad that everything distracts me."
                },
                {
                    "value": "Row 13",
                    "text": "I tend to squirm or fidget."
                },
                {
                    "value": "Row 14",
                    "text": "I can't keep my mind on something unless it's really interesting."
                },
                {
                    "value": "Row 15",
                    "text": "I wish I had greater confidence in my abilities."
                },
                {
                    "value": "Row 16",
                    "text": "I can't sit still for very long."
                },
                {
                    "value": "Row 17",
                    "text": "I give answers to questions before the questions have been completed."
                },
                {
                    "value": "Row 18",
                    "text": "I like to be up and on the go rather than be in one place."
                },
                {
                    "value": "Row 19",
                    "text": "I have trouble finishing job tasks or school work."
                },
                {
                    "value": "Row 20",
                    "text": "I am irritable."
                },
                {
                    "value": "Row 21",
                    "text": "I interrupt other when they are working or playing."
                },
                {
                    "value": "Row 22",
                    "text": "My past failures make it hard for me to believe in myself."
                },
                {
                    "value": "Row 23",
                    "text": "I am distracted when things are going on around me."
                },
                {
                    "value": "Row 24",
                    "text": "I have problems organizing my tasks and activities."
                },
                {
                    "value": "Row 25",
                    "text": "I misjudge how long it takes to do something or go somewhere."
                }
            ]
        }
    ]
}


const ASRS_SCREEN: SurveyPage = {
    "name": "ASRS_SCREEN",
    "title": "Adult ADHD Self-Report Scale (ASRS-v1.1) Symptom Checklist",
    "description": "Please answer the questions below, rating yourself on each of the criteria shown. Please choose the answer that best describes how you have felt and conducted yourself over the past 6 months.",
    "elements": [
        {
            "type": "matrix",
            "name": "ASRS_SCREEN_question_1",
            "title": "The World Health Organization adult ADHD self-report scale (Screener)",
            "columns": [
                {
                    "value": "0",
                    "text": "Never"
                },
                {
                    "value": "1",
                    "text": "Rarely"
                },
                {
                    "value": "2",
                    "text": "Sometimes"
                },
                {
                    "value": "3",
                    "text": "Often"
                },
                {
                    "value": "4",
                    "text": "Very often"
                }
            ],
            "rows": [
                {
                    "value": "Row 1",
                    "text": "How often do you have trouble wrapping up the fine details of a project, once the challenging parts have been done?"
                },
                {
                    "value": "Row 2",
                    "text": "How often do you have difficulty getting things in order when you have to do a task that requires organization?"
                },
                {
                    "value": "Row 3",
                    "text": "When you have a task that requires a lot of thought, how often do you avoid or delay getting started?"
                },
                {
                    "value": "Row 4",
                    "text": "How often do you have problems remembering appointments or obligations?"
                },
                {
                    "value": "Row 5",
                    "text": "How often do you fidget or squirm with your hands or your feet when you have to sit down for a long time?"
                },
                {
                    "value": "Row 6",
                    "text": "How often do you feel overly active and compelled to do things, like you were driven by a motor?"
                }
            ]
        }
    ]
}

const ASRS: SurveyPage = {
    "name": "ASRS",
    "title": "Adult ADHD Self-Report Scale (ASRS-v1.1) Symptom Checklist (Full)",
    "description": "Please answer the questions below, rating yourself on each of the criteria shown. Please choose the answer that best describes how you have felt and conducted yourself over the past 6 months.",
    "elements": [
        {
            "type": "matrix",
            "name": "ASRS_question_1",
            "title": "The World Health Organization adult ADHD self-report scale (Full)\n",
            "columns": [
                {
                    "value": "Column 1",
                    "text": "Never"
                },
                {
                    "value": "Column 2",
                    "text": "Rarely"
                },
                {
                    "value": "Column 3",
                    "text": "Sometimes"
                },
                {
                    "value": "Column 4",
                    "text": "Often"
                },
                {
                    "value": "Column 5",
                    "text": "Very often"
                }
            ],
            "rows": [
                {
                    "value": "Row 1",
                    "text": "How often do you make careless mistakes when you have to work on a boring or difficult project?"
                },
                {
                    "value": "Row 2",
                    "text": "How often do you have difficulty keeping your attention when you are doing boring or repetitive work?"
                },
                {
                    "value": "Row 3",
                    "text": "How often do you have difficulty concentrating on what people say to you, even when they are speaking to you directly?"
                },
                {
                    "value": "Row 4",
                    "text": "How often do you have trouble wrapping up the fine details of a project, once the challenging parts have been done?"
                },
                {
                    "value": "Row 5",
                    "text": "How often do you have difficulty getting things in order when you have to do a task that requires organization?"
                },
                {
                    "value": "Row 6",
                    "text": "When you have a task that requires a lot of thought, how often do you avoid or delay getting started?"
                },
                {
                    "value": "Row 7",
                    "text": "How often do you misplace or have difficulty finding things at home or at work?"
                },
                {
                    "value": "Row 8",
                    "text": "How often are you distracted by activity or noise around you?"
                },
                {
                    "value": "Row 9",
                    "text": "How often do you have problems remembering appointments or obligations?"
                },
                {
                    "value": "Row 10",
                    "text": "How often do you fidget or squirm with your hands or your feet when you have to sit down for a long time?"
                },
                {
                    "value": "Row 11",
                    "text": "How often do you leave your seat in meetings or other situations in which you are expected to remain seated?"
                },
                {
                    "value": "Row 12",
                    "text": "How often do you feel restless or fidgety?"
                },
                {
                    "value": "Row 13",
                    "text": "How often do you have difficulty unwinding and relaxing when you have time to yourself?"
                },
                {
                    "value": "Row 14",
                    "text": "How often do you feel overly active and compelled to do things, like you were driven by a motor?"
                },
                {
                    "value": "Row 15",
                    "text": "How often do you find yourself talking too much when you are in a social situation?"
                },
                {
                    "value": "Row 16",
                    "text": "When you're in a conversation, how often do you find yourself finishing the sentences of the people that you are talking to, before they can finish them themselves?"
                },
                {
                    "value": "Row 17",
                    "text": "How often do you have difficulty waiting your turn in situations when turn-taking is required?"
                },
                {
                    "value": "Row 18",
                    "text": "How often do you interrupt others when they are busy?"
                }
            ]
        }
    ]
}

const PHQ9: SurveyPage = {
    "name": "PHQ9",
    "title": "Patient Health Questionnaire-9 (PHQ-9)",
    "description": "Over the last 2 weeks, how often have you been bothered by any of the following problems?",
    "elements": [
        {
            "type": "matrix",
            "name": "PHQ9_question_1",
            "title": "Patient Health Questionnaire-9\n",
            "columns": [
                {
                    "value": "Column 1",
                    "text": "Never"
                },
                {
                    "value": "Column 2",
                    "text": "Rarely"
                },
                {
                    "value": "Column 3",
                    "text": "Sometimes"
                },
                {
                    "value": "Column 4",
                    "text": "Often"
                },
                {
                    "value": "Column 5",
                    "text": "Very often"
                }
            ],
            "rows": [
                {
                    "value": "Row 1",
                    "text": "How often in the past two weeks have you had little interest or pleasure in doing things?"
                },
                {
                    "value": "Row 2",
                    "text": "How often in the past two weeks have you felt down, depressed, or hopeless?"
                },
                {
                    "value": "Row 3",
                    "text": "How often in the past two weeks have you had trouble falling or staying asleep, or sleeping too much?"
                },
                {
                    "value": "Row 4",
                    "text": "How often in the past two weeks have you felt tired or had little energy?"
                },
                {
                    "value": "Row 5",
                    "text": "How often in the past two weeks have you had poor appetite or overeating?"
                },
                {
                    "value": "Row 6",
                    "text": "How often in the past two weeks have you been feeling bad about yourself — or that you are a failure or have let yourself or your family down?"
                },
                {
                    "value": "Row 7",
                    "text": "How often in the past two weeks have you had trouble concentrating on things, such as reading the newspaper or watching television?"
                },
                {
                    "value": "Row 8",
                    "text": "How often in the past two weeks have you been moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual?"
                },
                {
                    "value": "Row 9",
                    "text": "How often in the past two weeks have you had thoughts that you would be better off dead or of hurting yourself in some way?"
                }
            ]
        }
    ]
}


const OLIFES: SurveyPage = {
    "name": "OLIFES",
    "title": "Oxford-Liverpool Inventory of Feelings and Experiences (OLIFE-S)",
    "description": "For each statement, say whether it applies to you or not",
    "elements": [
        {
            "type": "boolean",
            "name": "OLIFES_question_1",
            "title": "When in the dark do you often see shapes and forms even though there is nothing there?",
            "swapOrder": true
        },
        {
            "type": "boolean",
            "name": "OLIFES_question_2",
            "title": "Are your thoughts sometimes so strong that you can almost hear them?",
            "swapOrder": true
        },
        {
            "type": "boolean",
            "name": "OLIFES_question_3",
            "title": "Have you ever thought that you had special, almost magical powers?",
            "swapOrder": true
        },
        {
            "type": "boolean",
            "name": "OLIFES_question_4",
            "title": "Have you sometimes sensed an evil presence around you, even though you could not see it?",
            "swapOrder": true
        },
        {
            "type": "boolean",
            "name": "OLIFES_question_5",
            "title": "Do you think that you could learn to read other's minds if you wanted to?"
        },
        {
            "type": "boolean",
            "name": "OLIFES_question_6",
            "title": "When you look in the mirror does your face sometimes seem quite different from usual?",
            "swapOrder": true
        },
        {
            "type": "boolean",
            "name": "OLIFES_question_7",
            "title": "Do ideas and insights sometimes come to you so fast that you cannot express them all?",
            "swapOrder": true
        },
        {
            "type": "boolean",
            "name": "OLIFES_question_8",
            "title": "Can some people make you aware of them just by thinking about you?",
            "swapOrder": true
        },
        {
            "type": "boolean",
            "name": "OLIFES_question_9",
            "title": "Does a passing thought ever seem so real it frightens you?",
            "swapOrder": true
        },
        {
            "type": "boolean",
            "name": "OLIFES_question_10",
            "title": "Do you feel that your accidents are caused by mysterious forces?",
            "swapOrder": true
        },
        {
            "type": "boolean",
            "name": "OLIFES_question_11",
            "title": "Do you ever have a sense of vague danger or sudden dread for reasons that you do not understand?",
            "swapOrder": true
        },
        {
            "type": "boolean",
            "name": "OLIFES_question_12",
            "title": "Does your sense of smell sometimes become unusually strong?",
            "swapOrder": true
        },
        {
            "type": "boolean",
            "name": "OLIFES_question_13",
            "title": "Are you easily confused if too much happens at the same time?",
            "swapOrder": true
        },
        {
            "type": "boolean",
            "name": "OLIFES_question_14",
            "title": "Do you frequently have difficulty in starting to do things?",
            "swapOrder": true
        },
        {
            "type": "boolean",
            "name": "OLIFES_question_15",
            "title": "Are you a person whose mood goes up and down easily?",
            "swapOrder": true
        },
        {
            "type": "boolean",
            "name": "OLIFES_question_16",
            "title": "Do you dread going into a room by yourself where other people have already gathered and are talking?\n",
            "swapOrder": true
        },
        {
            "type": "boolean",
            "name": "OLIFES_question_17",
            "title": "Do you find it difficult to keep interested in the same thing for a long time?",
            "swapOrder": true
        },
        {
            "type": "boolean",
            "name": "OLIFES_question_18",
            "title": "Do you often have difficulties in controlling your thoughts?",
            "swapOrder": true
        },
        {
            "type": "boolean",
            "name": "OLIFES_question_19",
            "title": "Are you easily distracted from work by daydreams?",
            "swapOrder": true
        },
        {
            "type": "boolean",
            "name": "OLIFES_question_20",
            "title": "Do you ever feel that your speech is difficult to understand because the words are all mixed up and don't make sense?\n",
            "swapOrder": true
        },
        {
            "type": "boolean",
            "name": "OLIFES_question_21",
            "title": "Are you easily distracted when you read or talk to someone?",
            "swapOrder": true
        },
        {
            "type": "boolean",
            "name": "OLIFES_question_22",
            "title": "Is it hard for you to make decisions?",
            "swapOrder": true
        },
        {
            "type": "boolean",
            "name": "OLIFES_question_23",
            "title": "When in a crowded room, do you often have difficulty in following a conversation?",
            "swapOrder": true
        },
        {
            "type": "boolean",
            "name": "OLIFES_question_24",
            "title": "Are there very few things that you have ever enjoyed doing?'",
            "swapOrder": true
        },
        {
            "type": "boolean",
            "name": "OLIFES_question_25",
            "title": "Are you much too independent to get involved with other people?",
            "swapOrder": true
        },
        {
            "type": "boolean",
            "name": "OLIFES_question_26",
            "title": "Do you love having your back massaged?",
            "swapOrder": true
        },
        {
            "type": "boolean",
            "name": "OLIFES_question_27",
            "title": "Do you find the bright lights of a city exciting to look at?",
            "swapOrder": true
        },
        {
            "type": "boolean",
            "name": "OLIFES_question_28",
            "title": "Do you feel very close to your friends?",
            "swapOrder": true
        },
        {
            "type": "boolean",
            "name": "OLIFES_question_29",
            "title": "Has dancing or the idea of it always seemed dull to you?",
            "isRequired": true,
            "swapOrder": true
        },
        {
            "type": "boolean",
            "name": "OLIFES_question_30",
            "title": "Do you like mixing with people?'",
            "isRequired": true,
            "swapOrder": true
        },
        {
            "type": "boolean",
            "name": "OLIFES_question_31",
            "title": "Is trying new foods something you have always enjoyed?",
            "isRequired": true,
            "swapOrder": true
        },
        {
            "type": "boolean",
            "name": "OLIFES_question_32",
            "title": "Have you often felt uncomfortable when your friends touch you?",
            "isRequired": true,
            "swapOrder": true
        },
        {
            "type": "boolean",
            "name": "OLIFES_question_33",
            "title": "Do you prefer watching television to going out with people?",
            "isRequired": true,
            "swapOrder": true
        },
        {
            "type": "boolean",
            "name": "OLIFES_question_34",
            "title": "Do you consider yourself to be pretty much an average sort of person?",
            "isRequired": true,
            "swapOrder": true
        },
        {
            "type": "boolean",
            "name": "OLIFES_question_35",
            "title": "Would you like other people to be afraid of you?",
            "isRequired": true,
            "swapOrder": true
        },
        {
            "type": "boolean",
            "name": "OLIFES_question_36",
            "title": "Do you often feel the impulse to spend money which you know you can't afford?",
            "isRequired": true,
            "swapOrder": true
        },
        {
            "type": "boolean",
            "name": "OLIFES_question_37",
            "title": "Are you usually in an average kind of mood, not too high and not too low?\n",
            "isRequired": true,
            "swapOrder": true
        },
        {
            "type": "boolean",
            "name": "OLIFES_question_38",
            "title": "Do you at times have an urge to do something harmful or shocking?",
            "isRequired": true,
            "swapOrder": true
        },
        {
            "type": "boolean",
            "name": "OLIFES_question_39",
            "title": "Do you stop to think things over before doing anything?",
            "isRequired": true,
            "swapOrder": true
        },
        {
            "type": "boolean",
            "name": "OLIFES_question_40",
            "title": "Do you often overindulge in alcohol or food?",
            "isRequired": true,
            "swapOrder": true
        },
        {
            "type": "boolean",
            "name": "OLIFES_question_41",
            "title": "Do you ever have the urge to break or smash things?",
            "isRequired": true,
            "swapOrder": true
        },
        {
            "type": "boolean",
            "name": "OLIFES_question_42",
            "title": "Have you ever felt the urge to injure yourself?",
            "isRequired": true,
            "swapOrder": true
        },
        {
            "type": "boolean",
            "name": "OLIFES_question_43",
            "title": "Do you often feel like doing the opposite of what other people suggest even though you know they are right?\n",
            "isRequired": true,
            "swapOrder": true
        }
    ]
}


const RBQ2A: SurveyPage = {
    "name": "RBQ2A",
    "title": "Repetitive Behaviours Questionnaire-2 (RBQ-2A)",
    "description": "Read each question carefully and choose the answer you feel is most representative. There are no right or wrong answers, or trick questions.",
    "elements": [
        {
            "type": "matrix",
            "name": "RBQ2A_question_1",
            "title": "QUESTIONNAIRE_RBQ2A",
            "isRequired": true,
            "columns": [
                {
                    "value": "1",
                    "text": "Never or rarely"
                },
                {
                    "value": "2",
                    "text": "One or more times daily"
                },
                {
                    "value": "3",
                    "text": "15 or more times daily"
                }
            ],
            "rows": [
                {
                    "value": "Row 1",
                    "text": "Do you like to arrange items in rows or patterns?"
                },
                {
                    "value": "Row 2",
                    "text": "Do you repetitively fiddle with items (e.g. spin, twiddle, bang, tap, twist, or flick anything repeatedly)?"
                },
                {
                    "value": "Row 3",
                    "text": "Do you like to spin yourself around and around?"
                },
                {
                    "value": "Row 4",
                    "text": "Do you rock backwards and forwards, or side to side, either when sitting or when standing?"
                },
                {
                    "value": "Row 5",
                    "text": "Do you pace or move around repetitively (e.g. walk to and fro across a room, or around the same path in the garden)?"
                },
                {
                    "value": "Row 6",
                    "text": "Do you make repetitive hand and/or finger movements (e.g. flap, wave, or flick your hands or fingers repetitively)"
                }
            ]
        },
        {
            "type": "matrix",
            "name": "RBQ2A_question_2",
            "title": "QUESTIONNAIRE_RBQ2A (continued)",
            "isRequired": true,
            "columns": [
                {
                    "value": "1",
                    "text": "Never or rarely"
                },
                {
                    "value": "2",
                    "text": "Mild or occasionally"
                },
                {
                    "value": "3",
                    "text": "Marked or notable"
                }
            ],
            "rows": [
                {
                    "value": "Row 1",
                    "text": "Do you have a fascination with specific objects (e.g. trains, road signs, or other things)?"
                },
                {
                    "value": "Row 2",
                    "text": "Do you like to look at objects from particular or unusual angles?"
                },
                {
                    "value": "Row 3",
                    "text": "Do you have a special interest in the smell of people or objects?"
                },
                {
                    "value": "Row 4",
                    "text": "Do you have a special interest in the feel of different surfaces?"
                },
                {
                    "value": "Row 5",
                    "text": "Do you have any special objects you like to carry around?"
                },
                {
                    "value": "Row 6",
                    "text": "Do you collect or hoard items of any sort?"
                }
            ]
        },
        {
            "type": "matrix",
            "name": "RBQ2A_question_3",
            "title": "QUESTIONNAIRE_RBQ2A (continued)",
            "isRequired": true,
            "columns": [
                {
                    "value": "1",
                    "text": "Never or rarely"
                },
                {
                    "value": "2",
                    "text": "Mild or occasional (does not affect others)"
                },
                {
                    "value": "3",
                    "text": "Marked or notable (occasionally affects others)"
                }
            ],
            "rows": [
                {
                    "value": "Row 1",
                    "text": "Do you insist on things at home remaining the same (e.g. furniture staying in the same place, things being kept in certain places, or arranged in certain ways)?"
                },
                {
                    "value": "Row 2",
                    "text": "Do you get upset about minor changes to objects (e.g. flecks of dirt on your clothes, minor scratches on objects)?"
                },
                {
                    "value": "Row 3",
                    "text": "Do you insist that aspects of daily routine must remain the same?"
                },
                {
                    "value": "Row 4",
                    "text": "Do you insist on doing things in a certain way or re-doing things until they are 'just right'?"
                }
            ]
        },
        {
            "type": "matrix",
            "name": "RBQ2A_question_4",
            "title": "QUESTIONNAIRE_RBQ2A (continued)",
            "isRequired": true,
            "columns": [
                {
                    "value": "1",
                    "text": "Never or rarely"
                },
                {
                    "value": "2",
                    "text": "Mild or occasional (not entirely resistant to change or new things)"
                },
                {
                    "value": "3",
                    "text": "Marked or notable (will tolerate changes when necessary)"
                }
            ],
            "rows": [
                {
                    "value": "Row 1",
                    "text": "Do you play the same music, game or video, or read the same book repeatedly?"
                },
                {
                    "value": "Row 2",
                    "text": "Do you insist on wearing the same clothes or refuse to wear new clothes?"
                },
                {
                    "value": "Row 3",
                    "text": "Do you insist on eating the same foods, or a very small range of foods, at every meal?"
                }
            ]
        },
        {
            "type": "matrix",
            "name": "RBQ2A_question_5",
            "title": "QUESTIONNAIRE_RBQ2A (continued)",
            "isRequired": true,
            "columns": [
                {
                    "value": "1",
                    "text": "A range of different and flexible self-chosen activities"
                },
                {
                    "value": "2",
                    "text": "Some varied and flexible interests but commonly choose the same activities"
                },
                {
                    "value": "3",
                    "text": "Almost always choose from a restricted range of repetitive activities"
                }
            ],
            "rows": [
                {
                    "value": "Row 1",
                    "text": "If you are left to occupy yourself, will you choose from a restricted range of repetitive activities?"
                }
            ]
        }
    ]
}

const CAPE_severity: SurveyPage = {
    "name": "CAPE_severity",
    "title": "Community Assessment of Psychic Experiences (CAPE)",
    "description": "Please answer the following questions about your experiences.",
    "elements": [
        {
            "type": "matrix",
            "name": "CAPE_severity_question_1",
            "title": "CAPE for psychotic traits",
            "isRequired": true,
            "columns": [
                {
                    "value": "1",
                    "text": "Never"
                },
                {
                    "value": "2",
                    "text": "Sometimes"
                },
                {
                    "value": "3",
                    "text": "Often"
                },
                {
                    "value": "4",
                    "text": "Nearly always"
                }
            ],
            "rows": [
                {
                    "value": "Row 1",
                    "text": "Do you ever feel sad?"
                },
                {
                    "value": "Row 2",
                    "text": "Do you ever feel as if people seem to drop hints about you or say things with a double meaning?"
                },
                {
                    "value": "Row 3",
                    "text": "Do you ever feel that you are not a very animated person?"
                },
                {
                    "value": "Row 4",
                    "text": "Do you ever feel that you are not much of a talker when you are conversing with other people?"
                },
                {
                    "value": "Row 5",
                    "text": "Do you ever feel as if things in magazines or on TV were written especially for you?"
                },
                {
                    "value": "Row 6",
                    "text": "Do you ever feel as if some people are not what they seem to be?"
                },
                {
                    "value": "Row 7",
                    "text": "Do you ever feel as if you are being persecuted in some way?"
                },
                {
                    "value": "Row 8",
                    "text": "Do you ever feel that you experience few or no emotions at important events?"
                },
                {
                    "value": "Row 9",
                    "text": "Do you ever feel pessimistic about everything?"
                },
                {
                    "value": "Row 10",
                    "text": "Do you ever feel as if there is a conspiracy against you?"
                },
                {
                    "value": "Row 11",
                    "text": "Do you ever feel as if you are destined to be someone very important?"
                },
                {
                    "value": "Row 12",
                    "text": "Do you ever feel as if there is no future for you?"
                },
                {
                    "value": "Row 13",
                    "text": "Do you ever feel that you are a very special or unusual person?"
                },
                {
                    "value": "Row 14",
                    "text": "Do you ever feel as if you do not want to live anymore?"
                },
                {
                    "value": "Row 15",
                    "text": "Do you ever think that people can communicate telepathically?"
                },
                {
                    "value": "Row 16",
                    "text": "Do you ever feel that you have no interest to be with other people?"
                },
                {
                    "value": "Row 17",
                    "text": "Do you ever feel as if electrical devices such as computers can influence the way you think?"
                },
                {
                    "value": "Row 18",
                    "text": "Do you ever feel that you are lacking in motivation to do things?"
                },
                {
                    "value": "Row 19",
                    "text": "Do you ever cry about nothing?"
                },
                {
                    "value": "Row 20",
                    "text": "Do you believe in the power of witchcraft, voodoo or the occult?"
                },
                {
                    "value": "Row 21",
                    "text": "Do you ever feel that you are lacking in energy?"
                },
                {
                    "value": "Row 22",
                    "text": "Do you ever feel that people look at you oddly because of your appearance?"
                },
                {
                    "value": "Row 23",
                    "text": "Do you ever feel that your mind is empty?"
                },
                {
                    "value": "Row 24",
                    "text": "Do you ever feel as if the thoughts in your head are being taken away from you?"
                },
                {
                    "value": "Row 25",
                    "text": "Do you ever feel that you are spending all your days doing nothing?"
                },
                {
                    "value": "Row 26",
                    "text": "Do you ever feel as if the thoughts in your head are not your own?"
                },
                {
                    "value": "Row 27",
                    "text": "Do you ever feel that your feelings are lacking in intensity?"
                },
                {
                    "value": "Row 28",
                    "text": "Have your thoughts ever been so vivid that you were worried other people would hear them?"
                },
                {
                    "value": "Row 29",
                    "text": "Do you ever feel that you are lacking in spontaneity?"
                },
                {
                    "value": "Row 30",
                    "text": "Do you ever hear your own thoughts being echoed back to you?"
                },
                {
                    "value": "Row 31",
                    "text": "Do you ever feel as if you are under the control of some force or power other than yourself?"
                },
                {
                    "value": "Row 32",
                    "text": "Do you ever feel that your emotions are blunted?"
                },
                {
                    "value": "Row 33",
                    "text": "Do you ever hear voices when you are alone?"
                },
                {
                    "value": "Row 34",
                    "text": "Do you ever hear voices talking to each other when you are alone?"
                },
                {
                    "value": "Row 35",
                    "text": "Do you ever feel that you are neglecting your appearance or personal hygiene?"
                },
                {
                    "value": "Row 36",
                    "text": "Do you ever feel that you can never get things done?"
                },
                {
                    "value": "Row 37",
                    "text": "Do you ever feel that you have only few hobbies or interests?"
                },
                {
                    "value": "Row 38",
                    "text": "Do you ever feel guilty?"
                },
                {
                    "value": "Row 39",
                    "text": "Do you ever feel like a failure?"
                },
                {
                    "value": "Row 40",
                    "text": "Do you ever feel tense?"
                },
                {
                    "value": "Row 41",
                    "text": "Do you ever feel as if a double has taken the place of a family member, friend or acquaintance?"
                },
                {
                    "value": "Row 42",
                    "text": "Do you ever see objects, people or animals that other people cannot see?"
                }
            ]
        }
    ]
}


const OCI_R: SurveyPage = {
    "name": "OCI_R",
    "title": "Obsessional Compulsive Inventory - Revised (OCI-R)",
    "description": "The following statements refer to experiences that many people have in their everyday lives. Select the option that best describes how much that experience has distressed or bothered you during the PAST MONTH.",
    "elements": [
        {
            "type": "matrix",
            "name": "OCI_R_question_1",
            "title": "Obsessional Compulsive Inventory - Revised",
            "isRequired": true,
            "columns": [
                {
                    "value": "0",
                    "text": "Not at all"
                },
                {
                    "value": "1",
                    "text": "A little"
                },
                {
                    "value": "2",
                    "text": "Moderately"
                },
                {
                    "value": "3",
                    "text": "A lot"
                },
                {
                    "value": "4",
                    "text": "Extremely"
                }
            ],
            "rows": [
                {
                    "value": "Row 1",
                    "text": "I  have saved up so many things that they get in the way."
                },
                {
                    "value": "Row 2",
                    "text": "I check things more often than necessary."
                },
                {
                    "value": "Row 3",
                    "text": "I get upset if objects are not arranged properly."
                },
                {
                    "value": "Row 4",
                    "text": "I feel compelled to count while I am doing things."
                },
                {
                    "value": "Row 5",
                    "text": "I find it difficult to touch an object when I know it has been touched by strangers or certain people."
                },
                {
                    "value": "Row 6",
                    "text": "I find it difficult to control my own thoughts."
                },
                {
                    "value": "Row 7",
                    "text": "I collect things I don't need."
                },
                {
                    "value": "Row 8",
                    "text": "I repeatedly check doors, windows, drawers, etc."
                },
                {
                    "value": "Row 9",
                    "text": "I get upset if others change the way I have arranged things."
                },
                {
                    "value": "Row 10",
                    "text": "I feel I have to repeat certain numbers."
                },
                {
                    "value": "Row 11",
                    "text": " sometimes have to wash or clean myself simply because I feel contaminated."
                },
                {
                    "value": "Row 12",
                    "text": "I am upset by unpleasant thoughts that come into my mind against my will."
                },
                {
                    "value": "Row 13",
                    "text": "I avoid throwing things away because I am afraid I might need them later."
                },
                {
                    "value": "Row 14",
                    "text": "I repeatedly check gas and water taps and light switches after turning them off."
                },
                {
                    "value": "Row 15",
                    "text": "I need things to be arranged in a particular way."
                },
                {
                    "value": "Row 16",
                    "text": "I feel that there are good and bad numbers."
                },
                {
                    "value": "Row 17",
                    "text": "I wash my hands more often and longer than necessary."
                },
                {
                    "value": "Row 18",
                    "text": "I frequently get nasty thoughts and have difficulty in getting rid of them."
                }
            ]
        }
    ]
}


const BFI_10: SurveyPage = {
    "name": "BFI_10",
    "title": "Big Five Inventory-10",
    "elements": [
        {
            "type": "matrix",
            "name": "BFI_10_question_1",
            "title": "Big Five Inventory-10",
            "isRequired": true,
            "columns": [
                {
                    "value": "1",
                    "text": "Disagree strongly"
                },
                {
                    "value": "2",
                    "text": "Disagree a little"
                },
                {
                    "value": "3",
                    "text": "Neither agree nor disagree"
                },
                {
                    "value": "4",
                    "text": "Agree a little"
                },
                {
                    "value": "5",
                    "text": "Agree strongly"
                }
            ],
            "rows": [
                {
                    "value": "Row 1",
                    "text": "I see myself as someone who is generally trusting."
                },
                {
                    "value": "Row 2",
                    "text": "I see myself as someone who is outgoing, sociable."
                },
                {
                    "value": "Row 3",
                    "text": "I see myself as someone who does a thorough job."
                },
                {
                    "value": "Row 4",
                    "text": "I see myself as someone who gets nervous easily."
                },
                {
                    "value": "Row 5",
                    "text": "I see myself as someone who has an active imagination."
                }
            ]
        },
        {
            "type": "matrix",
            "name": "BFI_10_question_2",
            "title": "Big Five Inventory-10 (continued)",
            "isRequired": true,
            "columns": [
                {
                    "value": "5",
                    "text": "Disagree strongly"
                },
                {
                    "value": "4",
                    "text": "Disagree a little"
                },
                {
                    "value": "3",
                    "text": "Neither agree nor disagree"
                },
                {
                    "value": "2",
                    "text": "Agree a little"
                },
                {
                    "value": "1",
                    "text": "Agree strongly"
                }
            ],
            "rows": [
                {
                    "value": "Row 1",
                    "text": "I see myself as someone who is reserved."
                },
                {
                    "value": "Row 2",
                    "text": "I see myself as someone who tends to be lazy."
                },
                {
                    "value": "Row 3",
                    "text": "I see myself as someone who is relaxed, handles stress well."
                },
                {
                    "value": "Row 4",
                    "text": "I see myself as someone who has few artistic interests."
                },
                {
                    "value": "Row 5",
                    "text": "I see myself as someone who tends to find fault with others."
                }
            ]
        }
    ]
}


const C_SSRS: SurveyPage = {
    "name": "C_SSRS",
    "title": "Columbia Suicide Severity Rating Scale (C-SSRS)",
    "elements": [
        {
            "type": "boolean",
            "name": "C_SSRS_question_1",
            "title": "In the past month, have you wished you were dead or wished you could go to sleep and not wake up?",
            "isRequired": true,
            "swapOrder": true
        },
        {
            "type": "boolean",
            "name": "C_SSRS_question_2",
            "title": "In the past month, have you actually had any thoughts of killing yourself?",
            "isRequired": true,
            "swapOrder": true
        },
        {
            "type": "boolean",
            "name": "C_SSRS_question_3",
            "title": "Have you thought about how you might do this? (For example, \"I thought about taking an overdose but I never' +\n    ' worked out the details about when, where, and how I would do that and I would never act on these thoughts.\")",
            "isRequired": true,
            "swapOrder": true
        },
        {
            "type": "boolean",
            "name": "C_SSRS_question_4",
            "title": "Have you had any intention of acting on these thoughts of killing yourself, as opposed to you have the thoughts, '+\n    'but you definitely would not act on them? (For example, \"I had the thought of killing myself by taking an ' +\n    'overdose and am not sure whether I would do it or not.\")",
            "isRequired": true,
            "swapOrder": true
        },
        {
            "type": "boolean",
            "name": "C_SSRS_question_5",
            "title": "Have you started to work out, or worked out, the specific details of how to kill yourself and did you intend '+\n    'to carry out that plan? (For example, \"I am planning to take 3 bottles of my sleep medication this Saturday when '+\n    'no one is around to stop me.\")",
            "isRequired": true,
            "swapOrder": true
        },
        {
            "type": "boolean",
            "name": "C_SSRS_question_6",
            "title": "Have you ever done anything, started to do anything, or prepared to do anything to end your life? (For example: '+\n    'took pills, tried to shoot yourself, cut yourself, tried to hang yourself, took out pills but did not swallow ' +\n    'any, held a gun but changed your mind about hurting yourself or it was grabbed from your hand, went to the roof ' +  'to jump but did not, collected pills, obtained a gun, gave away valuables, wrote a will or suicide note, etc.)",
            "isRequired": true,
            "swapOrder": true
        },
        {
            "type": "boolean",
            "name": "C_SSRS_question_7",
            "title": "If YES, did this occur in the past 3 months? ",
            "isRequired": true,
            "swapOrder": true
        }
    ]
}


const ATTENTION_CHECK: SurveyPage = {
    "name": "ATTENTION_CHECK",
    "title": "Check to see if subjects are paying attention",
    "elements": [
        {
            "type": "matrix",
            "name": "ATTENTION_CHECK_question_1",
            "title": "Check to see if subjects are paying attention",
            "isRequired": true,
            "columns": [
                {
                    "value": "0",
                    "text": "Very rarely"
                },
                {
                    "value": "1",
                    "text": "Rarely"
                },
                {
                    "value": "2",
                    "text": "Occasionally"
                },
                {
                    "value": "3",
                    "text": "Somewhat often"
                },
                {
                    "value": "4",
                    "text": "Often"
                },
                {
                    "value": "5",
                    "text": "Very often"
                }
            ],
            "rows": [
                {
                    "value": "Row 1",
                    "text": "I pay attention during online experiments, choose very often as your answer."
                },
                {
                    "value": "Row 2",
                    "text": "I am consistent in paying attention, choose the same answer as the last question."
                }
            ]
        }
    ]
}

const CONDITIONALTEST_severity: SurveyPage = {
    "name": "CONDITIONALTEST_severity",
    "title": "Conditional test",
    "elements": [
        {
            "type": "matrix",
            "name": "CONDITIONALTEST_severity_question_1",
            "title": "Conditional test",
            "isRequired": true,
            "columns": [
                {
                    "value": "1",
                    "text": "Never"
                },
                {
                    "value": "2",
                    "text": "Sometimes"
                },
                {
                    "value": "3",
                    "text": "Often"
                },
                {
                    "value": "4",
                    "text": "Nearly always"
                }
            ],
            "rows": [
                {
                    "value": "Row 1",
                    "text": "Do you ever feel sad?"
                },
                {
                    "value": "Row 2",
                    "text": "Do you ever feel as if people seem to drop hints about you or say things with a double meaning?Row 2"
                }
            ]
        }
    ]
}

const PHQ1: SurveyPage = {
    "name": "PHQ1",
    "title": "Patient Health Questionnaire-1",
    "elements": [
        {
            "type": "matrix",
            "name": "PHQ1_question_1",
            "title": "Patient Health Questionnaire-1",
            "isRequired": true,
            "columns": [
                {
                    "value": "0",
                    "text": "Not at all"
                },
                {
                    "value": "1",
                    "text": "Several days"
                },
                {
                    "value": "2",
                    "text": "More than half the days"
                },
                {
                    "value": "3",
                    "text": "Nearly every day"
                }
            ],
            "rows": [
                {
                    "value": "Row 1",
                    "text": "How often in the past two weeks have you had little interest or pleasure in doing things?"
                }
            ]
        }
    ]
}

/**
 * Configuration for the demographic survey
 */
export const demographicSurvey = {
    type: jsPsychSurvey,
    survey_json: {
        showQuestionNumbers: true,
        title: 'Before the game starts, we need to collect some information about you',
        description: 'Please fill out the following questionnaire to help us understand your personality and preferences.',
        completeText: 'Done!',
        pageNextText: 'Continue',
        pagePrevText: 'Previous',
        showPreviewBeforeComplete: false,
        pages: [
            demographicQuestionnaire,
            OCI,
            BAPQ,
            connersScalesForADHDScreener,
            connersScalesForADHDFull,
            ASRS_SCREEN,
            ASRS,
            PHQ9,
            OLIFES,
            RBQ2A,
            CAPE_severity,
            OCI_R,
            BFI_10,
            C_SSRS,
            ATTENTION_CHECK,
            CONDITIONALTEST_severity,
            PHQ1,
        ]
    } as SurveyConfig
};

/**
 * Saves the survey JSON configuration to a file
 * @returns void
 */
export function saveSurveyJsonToFile(): void {
    const surveyJsonData = JSON.stringify(demographicSurvey.survey_json, null, 2);
    const blob = new Blob([surveyJsonData], { type: 'application/json' });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'demographic_survey.json';
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 0);
}

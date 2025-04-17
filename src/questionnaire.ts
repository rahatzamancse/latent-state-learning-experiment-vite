import jsPsychSurvey from '@jspsych/plugin-survey';


interface Question {
    type: "text" | "radiogroup" | "comment" | "rating" | "dropdown" | "checkbox" | "boolean" | "multipletext" | "matrix"; // The type of question
    title: string; // The question
    name: string; // The name which is saved in the data
    choices?: { value: string, text: string }[]; // The choices of the question
    isRequired?: boolean; // Whether the question is required
    showNoneItem?: boolean; // Whether to show the none item
    showOtherItem?: boolean; // Whether to show the other item
    colCount?: number;
    inputType?: string;
    min?: number;
    max?: number;
    step?: number;
    showSelectAllItem?: boolean;
    rows?: { value: string, text: string }[];
    swapOrder?: boolean;
    columns?: { value: string, text: string }[];
    rowTitleWidth?: string;
    alternateRows?: boolean;
}

const demographicQuestionnaire: { name: string, title?: string, elements: Question[] } = {
    "name": "demographicQuestionnaire",
    "elements": [
        {
            "type": "radiogroup",
            "name": "gender",
            "title": "What gender do you identify as?",
            "isRequired": true,
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
            "name": "age",
            "title": "What is your age?",
            "isRequired": true,
            "inputType": "number",
            "min": 18,
            "max": 100,
            "step": 1
        },
        {
            "type": "radiogroup",
            "name": "sleepQuality",
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
            "name": "sleepDuration",
            "title": "How many hours of sleep did you get last night?",
            "isRequired": true,
            "inputType": "number",
            "min": 0,
            "max": 24
        },
        {
            "type": "dropdown",
            "name": "education",
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
            "name": "sleepDifficulty",
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
            "type": "radiogroup",
            "name": "substanceUse",
            "title": "Have you consumed any of these substances in the last 24 hours?",
            "isRequired": true,
            "choices": [
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
            "name": "caffeineUse",
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
                },
                {
                    "value": "other",
                    "text": "Other"
                }
            ],
            "showSelectAllItem": true
        },
        {
            "type": "radiogroup",
            "name": "alcoholConsumption",
            "title": "How many alcoholic drinks have you consumed in the last 24 hours?",
            "isRequired": true,
            "choices": [
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
            "name": "diagnosis",
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

const ObsessiveCompulsiveInventoryQuestionnaire: { name: string, title?: string, elements: Question[] } = {
    "name": "obsessiveCompulsiveInventoryQuestionnaire",
    "elements": [
        {
            "rowTitleWidth": "40%",
            "alternateRows": true,
            "type": "matrix",
            "name": "obsessiveCompulsiveInventoryQuestionnaire",
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
                    "text": "I collect things I don’t need."
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

const BroaderAutismPhenotypeQuestionnaire: { name: string, title?: string, elements: Question[] } = {
    "name": "BroaderAutismPhenotypeQuestionnaire",
    "elements": [
        {
            "type": "matrix",
            "name": "obsessiveCompulsiveInventoryQuestionnaire",
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
                    "text": "It’s hard for me to avoid getting sidetracked in conversation."
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
                    "text": "I am ‘‘in-tune’’ with the other person during conversation***."
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
                    "text": "I  feel disconnected or ‘‘out of sync’’ in conversations with others***.'"
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
                    "text": "People ask me to repeat things I’ve said because they don’t understand."
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
            "name": "question13",
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

const otherScreenerQuestionnaire: { name: string, title?: string, elements: Question[] }[] = [
    {
        "name": "page3",
        "elements": [
            {
                "type": "matrix",
                "name": "question14",
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
                "name": "question15",
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
    },
    {
        "name": "page4",
        "elements": [
            {
                "type": "matrix",
                "name": "question16",
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
                "name": "question17",
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
                "name": "question18",
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
    },
    {
        "name": "page5",
        "elements": [
            {
                "type": "matrix",
                "name": "question19",
                "title": "questioThe World Health Organization adult ADHD self-report scale (Screener)n19",
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
    },
    {
        "name": "page6",
        "elements": [
            {
                "type": "matrix",
                "name": "question20",
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
                        "text": "When you’re in a conversation, how often do you find yourself finishing the sentences of the people that you are talking to, before they can finish them themselves?"
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
    },
    {
        "name": "page7",
        "elements": [
            {
                "type": "matrix",
                "name": "question21",
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
    },
    {
        "name": "page8",
        "title": "Short scales for measuring schizotypy",
        "elements": [
            {
                "type": "boolean",
                "name": "question22",
                "title": "When in the dark do you often see shapes and forms even though there is nothing there?",
                "swapOrder": true
            },
            {
                "type": "boolean",
                "name": "question25",
                "title": "Are your thoughts sometimes so strong that you can almost hear them?",
                "swapOrder": true
            },
            {
                "type": "boolean",
                "name": "question24",
                "title": "Have you ever thought that you had special, almost magical powers?",
                "swapOrder": true
            },
            {
                "type": "boolean",
                "name": "question23",
                "title": "Have you sometimes sensed an evil presence around you, even though you could not see it?",
                "swapOrder": true
            },
            {
                "type": "boolean",
                "name": "question26",
                "title": "Do you think that you could learn to read other’s minds if you wanted to?"
            },
            {
                "type": "boolean",
                "name": "question27",
                "title": "When you look in the mirror does your face sometimes seem quite different from usual?",
                "swapOrder": true
            },
            {
                "type": "boolean",
                "name": "question28",
                "title": "Do ideas and insights sometimes come to you so fast that you cannot express them all?",
                "swapOrder": true
            },
            {
                "type": "boolean",
                "name": "question29",
                "title": "Can some people make you aware of them just by thinking about you?",
                "swapOrder": true
            },
            {
                "type": "boolean",
                "name": "question32",
                "title": "Does a passing thought ever seem so real it frightens you?",
                "swapOrder": true
            },
            {
                "type": "boolean",
                "name": "question31",
                "title": "Do you feel that your accidents are caused by mysterious forces?",
                "swapOrder": true
            },
            {
                "type": "boolean",
                "name": "question30",
                "title": "Do you ever have a sense of vague danger or sudden dread for reasons that you do not understand?",
                "swapOrder": true
            },
            {
                "type": "boolean",
                "name": "question37",
                "title": "Does your sense of smell sometimes become unusually strong?",
                "swapOrder": true
            },
            {
                "type": "boolean",
                "name": "question33",
                "title": "Are you easily confused if too much happens at the same time?",
                "swapOrder": true
            },
            {
                "type": "boolean",
                "name": "question40",
                "title": "Do you frequently have difficulty in starting to do things?",
                "swapOrder": true
            },
            {
                "type": "boolean",
                "name": "question39",
                "title": "Are you a person whose mood goes up and down easily?",
                "swapOrder": true
            },
            {
                "type": "boolean",
                "name": "question38",
                "title": "Do you dread going into a room by yourself where other people have already gathered and are talking?\n",
                "swapOrder": true
            },
            {
                "type": "boolean",
                "name": "question36",
                "title": "Do you find it difficult to keep interested in the same thing for a long time?",
                "swapOrder": true
            },
            {
                "type": "boolean",
                "name": "question35",
                "title": "Do you often have difficulties in controlling your thoughts?",
                "swapOrder": true
            },
            {
                "type": "boolean",
                "name": "question34",
                "title": "Are you easily distracted from work by daydreams?",
                "swapOrder": true
            },
            {
                "type": "boolean",
                "name": "question46",
                "title": "Do you ever feel that your speech is difficult to understand because the words are all mixed up and don’t make sense?\n",
                "swapOrder": true
            },
            {
                "type": "boolean",
                "name": "question45",
                "title": "Are you easily distracted when you read or talk to someone?",
                "swapOrder": true
            },
            {
                "type": "boolean",
                "name": "question44",
                "title": "Is it hard for you to make decisions?",
                "swapOrder": true
            },
            {
                "type": "boolean",
                "name": "question43",
                "title": "When in a crowded room, do you often have difficulty in following a conversation?",
                "swapOrder": true
            },
            {
                "type": "boolean",
                "name": "question42",
                "title": "Are there very few things that you have ever enjoyed doing?'",
                "swapOrder": true
            },
            {
                "type": "boolean",
                "name": "question41",
                "title": "Are you much too independent to get involved with other people?",
                "swapOrder": true
            },
            {
                "type": "boolean",
                "name": "question47",
                "title": "Do you love having your back massaged?",
                "swapOrder": true
            },
            {
                "type": "boolean",
                "name": "question48",
                "title": "Do you find the bright lights of a city exciting to look at?",
                "swapOrder": true
            },
            {
                "type": "boolean",
                "name": "question49",
                "title": "Do you feel very close to your friends?",
                "swapOrder": true
            },
            {
                "type": "boolean",
                "name": "question50",
                "title": "Has dancing or the idea of it always seemed dull to you?",
                "isRequired": true,
                "swapOrder": true
            },
            {
                "type": "boolean",
                "name": "question59Do you like mixing with people?'",
                "title": "Do you like mixing with people?",
                "isRequired": true,
                "swapOrder": true
            },
            {
                "type": "boolean",
                "name": "question58",
                "title": "Is trying new foods something you have always enjoyed?",
                "isRequired": true,
                "swapOrder": true
            },
            {
                "type": "boolean",
                "name": "question57",
                "title": "Have you often felt uncomfortable when your friends touch you?",
                "isRequired": true,
                "swapOrder": true
            },
            {
                "type": "boolean",
                "name": "question56",
                "title": "Do you prefer watching television to going out with people?",
                "isRequired": true,
                "swapOrder": true
            },
            {
                "type": "boolean",
                "name": "question55",
                "title": "Do you consider yourself to be pretty much an average sort of person?",
                "isRequired": true,
                "swapOrder": true
            },
            {
                "type": "boolean",
                "name": "question54",
                "title": "Would you like other people to be afraid of you?",
                "isRequired": true,
                "swapOrder": true
            },
            {
                "type": "boolean",
                "name": "question53",
                "title": "Do you often feel the impulse to spend money which you know you can’t afford?",
                "isRequired": true,
                "swapOrder": true
            },
            {
                "type": "boolean",
                "name": "question52",
                "title": "Are you usually in an average kind of mood, not too high and not too low?\n",
                "isRequired": true,
                "swapOrder": true
            },
            {
                "type": "boolean",
                "name": "question51",
                "title": "Do you at times have an urge to do something harmful or shocking?",
                "isRequired": true,
                "swapOrder": true
            },
            {
                "type": "boolean",
                "name": "question62",
                "title": "Do you stop to think things over before doing anything?",
                "isRequired": true,
                "swapOrder": true
            },
            {
                "type": "boolean",
                "name": "question61",
                "title": "Do you often overindulge in alcohol or food?",
                "isRequired": true,
                "swapOrder": true
            },
            {
                "type": "boolean",
                "name": "question60",
                "title": "Do you ever have the urge to break or smash things?",
                "isRequired": true,
                "swapOrder": true
            },
            {
                "type": "boolean",
                "name": "question59",
                "title": "Have you ever felt the urge to injure yourself?",
                "isRequired": true,
                "swapOrder": true
            },
            {
                "type": "boolean",
                "name": "question63",
                "title": "Do you often feel like doing the opposite of what other people suggest even though you know they are right?\n",
                "isRequired": true,
                "swapOrder": true
            }
        ]
    },
]


export const demographicSurvey = {
    type: jsPsychSurvey,
    survey_json: {
        showQuestionNumbers: true,
        title: 'Before the game starts, we need to collect some information about you',
        completeText: 'Done!',
        pageNextText: 'Continue',
        pagePrevText: 'Previous',
        showPreviewBeforeComplete: false,
        // previewMode: "answeredQuestions",
        // previewText: "Preview",
        pages: [
            demographicQuestionnaire,
            ObsessiveCompulsiveInventoryQuestionnaire
        ]
    }
};

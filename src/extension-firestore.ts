import { JsPsych, JsPsychExtension, JsPsychExtensionInfo } from "jspsych";

import { initializeApp } from "firebase/app";
import { DocumentReference, Firestore, getFirestore, updateDoc, collection, doc, setDoc, arrayUnion } from "firebase/firestore";

interface InitializeParameters {
  firebaseConfig: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  }
}

interface OnStartParameters {}

interface OnLoadParameters {}

interface OnFinishParameters {}

/**
 * **firestore**
 *
 * This extension allows you to store data in a Firestore database at the end of each trial.
 *
 * @author Rahat Zaman
 * @see {@link https://github.com/jspsych/jspsych-contrib/packages/extension-play-audio/README.md}}
 */
class PlayAudioExtension implements JsPsychExtension {
  static info: JsPsychExtensionInfo = {
    name: "play-audio",
  };
  
  db: Firestore | null;
  docRef: DocumentReference | null;
  
  constructor(private jsPsych: JsPsych) {
    this.db = null;
    this.docRef = null;
  }

  initialize = ({firebaseConfig}: InitializeParameters): Promise<void> => {
    return new Promise((resolve, reject) => {
      this.db = getFirestore(initializeApp(firebaseConfig));
      this.docRef = doc(collection(this.db!, "experiments"));
      
      setDoc(this.docRef, {
        trials: [],
      }).catch(e => { console.error("Error creating document: ", e); reject("Error creating document.") })
      .then(() => {
        console.log("Document successfully created!");
        resolve();
      })
    });
  };
  

  on_start = (_: OnStartParameters): void => {};

  on_load = (_: OnLoadParameters): void => {};

  on_finish = (_: OnFinishParameters): { [key: string]: any } => {
    const trialData = JSON.parse(this.jsPsych.data.getDataByTimelineNode(this.jsPsych.getCurrentTimelineNodeID()).json())[0];

    // const trialData = JSON.parse(this.jsPsych.data.getLastTimelineData().json())[0];
    console.log("Trial Data: ", trialData);
    // recursively convert any nested array to object of arrays where each key is the index
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
    console.log("Uploading: ", trialData);
    updateDoc(this.docRef!, {
        trials: arrayUnion(trialData),
    }).catch(e => { console.error("Error storing Data: ", e) }
    ).then(() => { console.log("Added trial data: ", trialData); });
    return {};
  };
}

export default PlayAudioExtension;

import { JsPsych, JsPsychPlugin, ParameterType, TrialType } from "jspsych";

// import { version } from "../package.json";
const version = "2.0.0";

const info = <const>{
  name: "save-prolific-data",
  version: version,
  parameters: {},
  data: {
    subject_id: {
      type: ParameterType.STRING,
    },
    study_id: {
      type: ParameterType.INT,
    },
    session_id: {
      type: ParameterType.HTML_STRING,
    },
    study_time: {
      type: ParameterType.INT,
    },
  },
};

type Info = typeof info;

/**
 * **save-prolific-data**
 * jsPsych plugin for saving data of Prolific
 *
 * @author Rahat Zaman
 */
class ProlificData implements JsPsychPlugin<Info> {
  static info = info;

  constructor(private jsPsych: JsPsych) {}

  trial(display_element: HTMLElement, trial: TrialType<Info>) {
    const subject_id = this.jsPsych.data.getURLVariable('PROLIFIC_PID');
    const study_id = this.jsPsych.data.getURLVariable('STUDY_ID');
    const session_id = this.jsPsych.data.getURLVariable('SESSION_ID');
    // get current date and time
    const study_time = Date.now();

    this.jsPsych.finishTrial({
      subject_id,
      study_id,
      session_id,
      study_time,
    });
  }

  simulate(
    trial: TrialType<Info>,
    simulation_mode: 'data-only',
    simulation_options: any,
    load_callback: () => void
  ) {
    if (simulation_mode == "data-only") {
      load_callback();
      this.jsPsych.finishTrial({
        subject_id: "PROLIFIC_PID",
        study_id: "STUDY_ID",
        session_id: "SESSION_ID",
        study_time: Date.now(),
      });
    }
  }
}

export default ProlificData;

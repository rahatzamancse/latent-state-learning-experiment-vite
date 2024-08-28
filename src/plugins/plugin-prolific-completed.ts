import { JsPsych, JsPsychPlugin, ParameterType, TrialType } from "jspsych";

// import { version } from "../package.json";
const version = "2.0.0";

const info = <const>{
  name: "prolific-completed",
  version: version,
  parameters: {
    code: {
      type: ParameterType.STRING,
      pretty_name: "Completion code",
      default: undefined,
      description: "The completion code provided by Prolific.",
    }
  },
  data: {},
};

type Info = typeof info;

/**
 * **prolific-finish**
 * Redirects to Prolific with the completion code.
 *
 * @author Rahat Zaman
 */
class ProlificFinish implements JsPsychPlugin<Info> {
  static info = info;

  constructor(private jsPsych: JsPsych) {}

  trial(display_element: HTMLElement, trial: TrialType<Info>) {
    // Redirect to Prolific with the completion code
    // https://app.prolific.com/submissions/complete?cc={code}
    const code = trial.code;
    window.location.href = `https://app.prolific.com/submissions/complete?cc=${code}`;
  }

  simulate(
    trial: TrialType<Info>,
    simulation_mode: 'data-only',
    simulation_options: any,
    load_callback: () => void
  ) {
    if (simulation_mode == "data-only") {
      load_callback();
      this.jsPsych.finishTrial();
    }
  }
}

export default ProlificFinish;

import { JsPsych, JsPsychExtension, JsPsychExtensionInfo } from "jspsych";

interface InitializeParameters {}

interface OnStartParameters {}

interface OnLoadParameters {
  audio_path: string;
}

interface OnFinishParameters {}

/**
 * **play-audio**
 *
 * Plays a audio at the beginning of each trial. This can be helpful for screen reading or in trials where participants should not read text on the screen, but need to hear instructions.
 *
 * @author Rahat Zaman
 * @see {@link https://github.com/jspsych/jspsych-contrib/packages/extension-play-audio/README.md}}
 */
class PlayAudioExtension implements JsPsychExtension {
  static info: JsPsychExtensionInfo = {
    name: "play-audio",
  };
  
  audio: any;
  constructor(private jsPsych: JsPsych) {}

  initialize = ({}: InitializeParameters): Promise<void> => {
    return new Promise((resolve, reject) => {
      resolve();
    });
  };
  

  on_start = ({ }: OnStartParameters): void => {};

  on_load = ({audio_path}: OnLoadParameters): void => {
    console.log("on_load")
    const context = this.jsPsych.pluginAPI.audioContext();

    // record webaudio context start time
    var startTime;

    // load audio file
    this.jsPsych.pluginAPI
      .getAudioBuffer(audio_path)
      .then((buffer) => {
        this.audio = context.createBufferSource();
        this.audio.buffer = buffer;
        this.audio.connect(context.destination);
        this.audio.start(context.currentTime);
      })
      .catch((err) => {
        console.error(
          `Failed to load audio file "${audio_path}". Try checking the file path. We recommend using the preload plugin to load audio files.`
        );
        console.error(err);
      });

  };

  on_finish = ({}: OnFinishParameters): { [key: string]: any } => {
    this.audio.stop();
    return {};
  };
}

export default PlayAudioExtension;

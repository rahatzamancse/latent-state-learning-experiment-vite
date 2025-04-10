import { JsPsych, JsPsychExtension, JsPsychExtensionInfo, ParameterType } from "jspsych";

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
    version: "1.0.0",
    data: {
      audio_path: {
        type: ParameterType.STRING,
      },
    },
  };
  
  player: any;
  constructor(private jsPsych: JsPsych) {}

  initialize = (_: InitializeParameters): Promise<void> => {
    return new Promise((resolve, reject) => {
      resolve();
    });
  };
  

  on_start = (_: OnStartParameters): void => {};

  on_load = async ({audio_path}: OnLoadParameters) => {
    this.player = await this.jsPsych.pluginAPI.getAudioPlayer(audio_path);
    this.player.play();
  };

  on_finish = (_: OnFinishParameters): { [key: string]: any } => {
    this.player.stop();
    return {};
  };
}

export default PlayAudioExtension;

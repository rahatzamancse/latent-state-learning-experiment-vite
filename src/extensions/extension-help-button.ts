import { JsPsych, JsPsychExtension, JsPsychExtensionInfo } from "jspsych";
import './extension-help-button.css'

interface InitializeParameters { }

interface OnStartParameters { }

interface OnLoadParameters {
    header: string | null,
    content: string,
    footer: string | null,
    button: string | null,
    onModalStateChange: ((thisJsPsych: JsPsych, state: boolean, elapsedTime: number) => void) | null,
}

interface OnFinishParameters { }

/**
 * **help-button**
 *
 * Plays a audio at the beginning of each trial. This can be helpful for screen reading or in trials where participants should not read text on the screen, but need to hear instructions.
 *
 * @author Rahat Zaman
 * @see {@link https://github.com/jspsych/jspsych-contrib/packages/extension-help-button/README.md}}
 */
class HelpButtonExtension implements JsPsychExtension {
    static info: JsPsychExtensionInfo = {
        name: "help-button",
    };

    modal_interaction_data: { event: "opened" | "closed", time: number }[] = [];
    constructor(private jsPsych: JsPsych) { }

    initialize = (_: InitializeParameters): Promise<void> => {
        return new Promise((resolve, reject) => {
            resolve();
        });
    };

    on_start = (_: OnStartParameters): void => { };
    
    on_load = ({ header, content, footer, onModalStateChange, button }: OnLoadParameters): void => {

        if (button == null) {
            console.log("Button is null");
            button = `<button
            id="help-button"
            style="position: absolute;
                top: 10px;
                right: 10px;
                z-index: 1000;
                font-size: 1.5em;
                background-color: white;
                border: none;
                border-radius: 10%;
                padding: 0.5em;
                cursor: pointer"
        >?</button>`;
        }
        document.body.insertAdjacentHTML('beforeend', button);
        
        let modal_content = `<div id="myModal" class="modal" style="display: none"><div class="modal-content">`
        if (header != null) {
            modal_content += `<div class="modal-header"> <span class="close">&times;</span> <h2>${header}</h2> </div>`
        }
        else {
            modal_content += `<div class="modal-header"> <span class="close">&times;</span> </div>`
        }
        modal_content += `<div class="modal-body"> ${content} </div>`
        if (footer != null) {
            modal_content += `<div class="modal-footer"> <h3>${footer}</h3> </div>`
        }
        modal_content += `</div></div>`
        document.body.insertAdjacentHTML('beforeend', modal_content);
        
        const closeSpan = document.querySelector(".close");
        closeSpan!.addEventListener("click", () => {
            const modal = document.getElementById("myModal");
            modal!.style.display = "none";
            const elapsedTime = this.jsPsych.getTotalTime() - startTime;
            onModalStateChange ? onModalStateChange(this.jsPsych, false, elapsedTime): null;
            this.modal_interaction_data.push({ event: "closed", time: elapsedTime });
        })

        window.addEventListener("click", (event) => {
            const modal = document.getElementById("myModal");
            if (event.target === modal) {
                modal!.style.display = "none";
                const elapsedTime = this.jsPsych.getTotalTime() - startTime;
                onModalStateChange ? onModalStateChange(this.jsPsych, false, elapsedTime): null;
                this.modal_interaction_data.push({ event: "closed", time: elapsedTime });
            }
        })
        
        const btn = document.querySelector("#help-button");
        btn!.addEventListener("click", () => {
            const modal = document.getElementById("myModal");
            modal!.style.display = "block";
            const elapsedTime = this.jsPsych.getTotalTime() - startTime;
            onModalStateChange ? onModalStateChange(this.jsPsych, true, elapsedTime): null;
            this.modal_interaction_data.push({ event: "opened", time: elapsedTime });
        })
        
        // start a timer
        const startTime = this.jsPsych.getTotalTime();
    };

    on_finish = (_: OnFinishParameters): { [key: string]: any } => {
        const modal = document.getElementById("myModal");
        modal?.remove();
        const btn = document.querySelector("#help-button");
        btn?.remove();
        return {
            modal_interaction_data: this.modal_interaction_data,
        };
    };
}

export default HelpButtonExtension;

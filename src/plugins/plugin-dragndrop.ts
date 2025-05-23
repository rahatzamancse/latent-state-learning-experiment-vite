import { JsPsych, JsPsychPlugin, ParameterType, TrialType } from "jspsych";

const info = <const>{
  name: "dragndrop",
  version: "1.0.0",
  data: {
    drag_data: {
      type: ParameterType.COMPLEX,
      default: undefined,
    },
    buckets: {
      type: ParameterType.COMPLEX,
      default: undefined,
    },
    drop_bucket: {
      type: ParameterType.INT,
      default: undefined,
    },
    stimuli: {
      type: ParameterType.COMPLEX,
      default: undefined,
    },
    rt: {
      type: ParameterType.INT,
      default: undefined,
    },
  },
  parameters: {
    // types: BOOL, STRING, INT, FLOAT, FUNCTION, KEY, KEYS, SELECT, HTML_STRING, IMAGE, AUDIO, VIDEO, OBJECT, COMPLEX
    element: {
      type: ParameterType.IMAGE, 
      default: undefined,
    },
    show_element_label: {
      type: ParameterType.BOOL,
      default: false,
    },
    element_label: {
      type: ParameterType.STRING,
      default: "",
    },
    buckets: {
      type: ParameterType.COMPLEX,
      default: undefined,
    },
    show_labels: {
      type: ParameterType.BOOL,
      default: false,
    },
    bucket_labels: {
      type: ParameterType.COMPLEX,
      default: undefined,
    },
    text_prompt: {
      type: ParameterType.STRING,
      default: "",
    },
    track_dragging: {
      type: ParameterType.BOOL,
      default: false,
    },
    randomize_bucket_order: {
      type: ParameterType.BOOL,
      default: false,
    },
    bucket_start_angle: {
      type: ParameterType.INT,
      default: 0,
    },
  },
};

type Info = typeof info;
type DragDataType = { x: number, y: number, time: number }[];

/**
 * **dragndrop**
 *
 * This plugin allows participants to drag an object on the screen to any other object.
 *
 * @author Rahat Zaman
 * @see {@link https://github.com/jspsych/jspsych-contrib/packages/plugin-dragndrop/README.md}}
 */
class DragndropPlugin implements JsPsychPlugin<Info> {
  static info = info;

  constructor(private jsPsych: JsPsych) {}

  trial(display_element: HTMLElement, trial: TrialType<Info>) {
    const jsPsych = this.jsPsych;
    display_element.innerHTML = "";
    const container = document.createElement("div");
    const allDragData: DragDataType[] = [];
    for (let i = 0; i < trial.buckets.length; i++) {
      container.innerHTML += `<div id="jspsych-dragndrop-bucket-${i}" class="jspsych-dragndrop-bucket">
        <img src="${trial.buckets[i]}" class="jspsych-dragndrop-bucket-img" />
        ${trial.show_labels ? '<p>'+trial.bucket_labels[i]+'</p>' : ''}
      </div>`;
    }
    // create the draggable element
    container.innerHTML += `<div class="wrapper" style="display: inline-grid; grid-template-rows: 1fr; grid-template-columns: 1fr; background-color: white;">
      <div id="jspsych-dragndrop-element" class="jspsych-dragndrop-element" style="transform: scale(1); transform-origin: 0 0;">
        <img src="${trial.element}" width="100%"/>
        ${trial.show_element_label ? '<p>'+trial.element_label+'</p>' : ''}
      </div>
    </div>
    `;
    
    // calculate the screen
    const BOTTOM_MARGIN = 120;
    const center_x = window.innerWidth / 2;
    const center_y = window.innerHeight / 2 - BOTTOM_MARGIN;
    const DRAGGABLE_SIZE_RATIO = 0.16;
    const DROPPABLE_SIZE_RATIO = 0.16;
    const box_size = Math.min(
      window.innerWidth - window.innerWidth*DROPPABLE_SIZE_RATIO,
      window.innerHeight - BOTTOM_MARGIN - (window.innerHeight-BOTTOM_MARGIN)*DROPPABLE_SIZE_RATIO
    );
    const draggable_size = box_size * DRAGGABLE_SIZE_RATIO;
    const droppable_size = box_size * DROPPABLE_SIZE_RATIO;
    
    // calculate the position for each draggable element with radius, angle, and center. The first bucket is at 0 degrees, the second at 360/num_buckets degrees, and so on.
    const num_buckets = trial.buckets.length;
    const angle = 360 / num_buckets;
    // const radius = trial.radius!;
    const radius = box_size / 2 - droppable_size/2;
    const droppable_xs: number[] = [];
    const droppable_ys: number[] = [];
    for (let i = 0; i < num_buckets; i++) {
      droppable_xs.push(
        center_x 
        + radius * Math.cos(((angle * i + trial.bucket_start_angle!) * Math.PI) / 180)
        - droppable_size/2
      );
      droppable_ys.push(
        center_y + 
        radius * Math.sin(((angle * i + trial.bucket_start_angle!) * Math.PI) / 180)
        - droppable_size/2
      );
    }
    // set text prompt at the bottom
    container.innerHTML += `
      <div id="jspsych-dragndrop-text-prompt" style="width: 100%; margin=100px; position: absolute; bottom: 10px; left: 0">
        <p>
          ${trial.text_prompt}
        </p>
      </div>
    `;
    
    
    container.innerHTML += `
      <style>
        .jspsych-dragndrop-bucket {
          width: ${droppable_size}px;
          height: ${droppable_size}px;
          display: block;
          margin: 10px;
          border: 1px solid #aaa;
          position: absolute;
        }
        .jspsych-dragndrop-bucket-img {
          width: 100%;
          height: 100%;
        }
        .jspsych-dragndrop-element {
          width: ${draggable_size}px;
          height: ${draggable_size}px;
          position: absolute;
          z-index: 2;
          cursor: pointer;
          user-select: none;
        }
        .jspsych-dragndrop-element-img {
          width: 100%;
          height: 100%;
        }
      </style>
    `;
    
    // position the buckets
    const randomBucketIdxs = trial.randomize_bucket_order ? jsPsych.randomization.shuffle(Array.from(Array(trial.buckets.length).keys())) : Array.from(Array(trial.buckets.length).keys());
    for (let i = 0; i < num_buckets; i++) {
      const randomIdx = randomBucketIdxs[i];
      const bucket = container.querySelector(`#jspsych-dragndrop-bucket-${randomIdx}`) as HTMLElement;
      bucket.style.left = droppable_xs[i] + "px";
      bucket.style.top = droppable_ys[i] + "px";
    }
    
    // make the element draggable
    const element = container.querySelector("#jspsych-dragndrop-element") as HTMLElement;
    element.style.left = center_x - draggable_size/2 + "px";
    element.style.top = center_y - draggable_size/2 + "px";
    
    // make element draggable to each bucket
    element.addEventListener("mousedown", (e) => {
      e.preventDefault();
      const dx = e.clientX - element.getBoundingClientRect().left;
      const dy = e.clientY - element.getBoundingClientRect().top;
      
      let currentDragData: DragDataType = [];
      
      // tracking
      const trackingInterval = setInterval(() => {
        currentDragData.push({
          x: element.getBoundingClientRect().left + 100, // Correcting to get the center of the element
          y: element.getBoundingClientRect().top + 100,
          time: jsPsych.getTotalTime(),
        });
      }, 10); // Record position every millisecond


      function move(e: MouseEvent) {
        element.style.left = e.clientX - dx + "px";
        element.style.top = e.clientY - dy + "px";
      }
      document.addEventListener("mousemove", move);
      function mouseup() {
        clearInterval(trackingInterval); // Stop tracking when the mouse is released
        document.removeEventListener("mousemove", move);
        allDragData.push(currentDragData);
        // check if the element is inside a bucket
        let droppedInBucketIndex = null;
        for (let i = 0; i < num_buckets; i++) {
          const bucket = container.querySelector(`#jspsych-dragndrop-bucket-${i}`) as HTMLElement;
          const rect = bucket.getBoundingClientRect();
          if (
            // check if any corner of the element is inside the bucket
            (element.getBoundingClientRect().left > rect.left && element.getBoundingClientRect().left < rect.right && element.getBoundingClientRect().top > rect.top && element.getBoundingClientRect().top < rect.bottom) ||
            (element.getBoundingClientRect().right > rect.left && element.getBoundingClientRect().right < rect.right && element.getBoundingClientRect().top > rect.top && element.getBoundingClientRect().top < rect.bottom) ||
            (element.getBoundingClientRect().left > rect.left && element.getBoundingClientRect().left < rect.right && element.getBoundingClientRect().bottom > rect.top && element.getBoundingClientRect().bottom < rect.bottom) ||
            (element.getBoundingClientRect().right > rect.left && element.getBoundingClientRect().right < rect.right && element.getBoundingClientRect().bottom > rect.top && element.getBoundingClientRect().bottom < rect.bottom)
          ) {
            droppedInBucketIndex = i;
            break;
          }
        }
        
        // reset the position of the element with smooth transition
        if(droppedInBucketIndex === null) {
          element.style.transition = "left 0.5s, top 0.5s";
          element.style.left = center_x - draggable_size/2 + "px";
          element.style.top = center_y - draggable_size/2 + "px";
          setTimeout(() => {
            element.style.transition = "";
          }, 500);
        }
        else {
          element.remove();
          const rt = performance.now() - startTime;
          const trial_data = {
            drag_data: allDragData,
            buckets: Array.from(Array(trial.buckets.length).keys()).map((i) => (
              {
                name: [trial.buckets[i]],
                position: randomBucketIdxs[i],
                x: droppable_xs[i],
                y: droppable_ys[i],
                dropped: droppedInBucketIndex === i,
              }
            )),
            drop_bucket: droppedInBucketIndex,
            stimuli: [trial.element],
            rt: rt,
          };
          jsPsych.finishTrial(trial_data);
        }
        document.removeEventListener("mouseup", mouseup);
      }

      document.addEventListener("mouseup", mouseup);
    });
    
    display_element.appendChild(container);
    const startTime = performance.now();
  }
}

export default DragndropPlugin;

(() => {
      "use strict";
      const STORE_KEY = "circuitforge-progress-v1";
      const emptyProgress = () => ({ modules: [], challenges: [], attempts: 0, best: null, recent: [], daily: {} });
      let progress;
      try { progress = { ...emptyProgress(), ...JSON.parse(localStorage.getItem(STORE_KEY) || "{}") }; }
      catch { progress = emptyProgress(); }
      const save = () => { try { localStorage.setItem(STORE_KEY, JSON.stringify(progress)); } catch { toast("Progress could not be saved in this browser."); } };
      const toastEl = document.getElementById("toast");
      let toastTimer;
      function toast(message) {
        toastEl.textContent = message; toastEl.classList.add("show");
        clearTimeout(toastTimer); toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2600);
      }
      const modules = [
        { id:"digital", glyph:"01", title:"Digital Electronics", desc:"Trace how voltage levels become dependable binary information, from number systems to registers and timing.", topics:["Number systems","Combinational logic","Flip-flops"], time:"25 min", next:"logic" },
        { id:"logic", glyph:"∧", title:"Logic Gates & Boolean Algebra", desc:"Build Boolean expressions from gates, simplify them, and compare truth tables with real input combinations.", topics:["Boolean laws","Gate families","Truth tables"], time:"20 min", next:"logic" },
        { id:"sensors", glyph:"⌁", title:"Sensors & Microcontrollers", desc:"Connect physical quantities to electrical signals, then follow a microcontroller's sample–decide–act loop.", topics:["ADC basics","Ultrasonic ranging","GPIO"], time:"30 min", next:"sensors" },
        { id:"comms", glyph:"∿", title:"Communication Systems", desc:"Follow information from a source through modulation, a noisy channel, and a receiver that recovers the message.", topics:["AM / FM","Bandwidth","Noise"], time:"28 min", next:"quiz" },
        { id:"signal", glyph:"≈", title:"Signal Processing", desc:"Explore sampling, frequency content, and filtering—the tools that make sensor and communication signals useful.", topics:["Sampling","Nyquist idea","Filters"], time:"32 min", next:"quiz" }
      ];
      const moduleLessons = {
        digital: {
          intro:"Digital electronics represents information with discrete states instead of a continuously varying value. Circuits interpret voltage ranges as logic LOW and logic HIGH, making data easier to store and process reliably.",
          objectives:["Relate binary digits to two logic states.","Convert a small binary word into its number of possible patterns.","Distinguish combinational logic from state-holding circuits."],
          concept:"A 0 or 1 is a logical label, not one exact voltage. A real device defines LOW and HIGH input ranges with a margin between them for noise tolerance. Combinational circuits depend on current inputs; flip-flops can retain a state.",
          exampleTitle:"Practical example · push-button input",
          example:"A microcontroller can read a button as LOW or HIGH. A pull-up or pull-down resistor gives the unpressed input a defined state, while the button changes that voltage when pressed.",
          question:"How many distinct patterns can a 4-bit binary word represent?",
          answers:["4 patterns","8 patterns","16 patterns","32 patterns"], correct:2,
          explanation:"Each bit has two possible states, so 4 bits represent 2⁴ = 16 distinct patterns."
        },
        logic: {
          intro:"Logic gates combine binary inputs to make a binary output. Boolean algebra gives a compact language for describing those relationships and reducing unnecessary hardware.",
          objectives:["Describe AND, OR, and NOT using input/output behavior.","Read a truth table row by row.","Recognize XOR as a detector for unequal inputs."],
          concept:"A truth table lists every possible input combination. For a two-input gate there are four rows. Boolean expressions summarize the same behavior: AND is written A · B, OR as A + B, and XOR as A ⊕ B.",
          exampleTitle:"Practical example · parity bit",
          example:"XOR can combine data bits to calculate even/odd parity. If the inputs differ, the XOR output is HIGH; this gives a simple check for some single-bit transmission errors.",
          question:"For a two-input XOR gate, when is the output HIGH?",
          answers:["Only when both inputs are LOW","Only when both inputs are HIGH","When the inputs differ","When the inputs are equal"], correct:2,
          explanation:"XOR outputs 1 for 01 and 10—exactly when one input is HIGH and the other is LOW."
        },
        sensors: {
          intro:"A sensor turns a physical quantity—such as temperature, light, or distance—into a signal a circuit can observe. A microcontroller samples that signal, makes a decision, and can control an output.",
          objectives:["Explain the role of a sensor as a transducer.","Describe what an ADC does to an analog voltage.","Trace a sample–decide–act control loop."],
          concept:"An analog-to-digital converter (ADC) maps an input voltage range to discrete codes. Resolution sets the number of possible codes, while the reference voltage and sensor circuit determine what each code means in physical units.",
          exampleTitle:"Practical example · automatic night light",
          example:"A photoresistor and fixed resistor form a voltage divider. The controller samples the divider voltage, compares it with a chosen threshold, then switches an LED output. The divider orientation determines whether the ADC reading rises or falls with light.",
          question:"How many output codes does an ideal 10-bit ADC have?",
          answers:["10","100","512","1024"], correct:3,
          explanation:"An n-bit converter has 2ⁿ codes, so a 10-bit ADC has 1024 possible codes (usually numbered 0 through 1023)."
        },
        comms: {
          intro:"A communication system carries information from a source to a destination through a physical channel. Modulation adapts a signal for transmission, while a receiver detects and recovers the message in the presence of noise.",
          objectives:["Identify the source, transmitter, channel, and receiver.","Explain why a carrier can be modulated.","Distinguish amplitude modulation from frequency modulation."],
          concept:"In amplitude modulation (AM), the message changes the carrier's amplitude. In frequency modulation (FM), it changes the carrier's instantaneous frequency. Real channels add attenuation, noise, and interference that constrain reliable reception.",
          exampleTitle:"Practical example · radio broadcast",
          example:"A microphone produces an audio message signal. A transmitter uses that information to modulate a radio-frequency carrier; an antenna radiates it, and a tuned receiver demodulates the signal to recover audio.",
          question:"In conventional AM, which carrier property follows the message signal?",
          answers:["Amplitude","Propagation speed","Antenna length","ADC resolution"], correct:0,
          explanation:"AM varies the carrier amplitude in proportion to the message. Its nominal carrier frequency remains fixed."
        },
        signal: {
          intro:"Signal processing extracts useful information from measurements and waveforms. Sampling converts a continuous-time signal into discrete-time data, while filters shape which frequencies are preserved.",
          objectives:["Relate sample rate to the highest signal frequency.","Describe aliasing in plain language.","Explain what a low-pass filter preserves."],
          concept:"If a band-limited signal contains frequencies up to fmax, ideal reconstruction requires a sampling rate greater than twice fmax. Sampling too slowly can make high-frequency content appear as a false lower frequency; an analog anti-alias filter helps limit that content first.",
          exampleTitle:"Practical example · smoothing a sensor",
          example:"A low-pass filter can reduce rapid noise on a sensor reading while preserving slower changes. Smoothing adds response delay, so the cutoff must balance noise reduction with how quickly the system needs to react.",
          question:"A band-limited signal has a highest frequency of 2 kHz. What is the ideal minimum Nyquist sample rate?",
          answers:["1 kHz","2 kHz","4 kHz","20 kHz"], correct:2,
          explanation:"The Nyquist rate is twice the highest frequency: 2 × 2 kHz = 4 kHz. Practical systems usually include margin and an anti-alias filter."
        }
      };
      const moduleDialog = document.getElementById("module-dialog");
      const moduleDialogContent = document.getElementById("module-dialog-content");
      let currentLessonId = null, lessonAnswered = false;
      function localDayKey(date = new Date()) {
        return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
      }
      const navLabels = { home:"Overview", modules:"Learning modules", logic:"Logic playground", sensors:"Sensor lab", quiz:"Knowledge check", code:"Code practice", mentor:"Circuit Mentor", settings:"Local preferences" };
      function go(view, track = true) {
        const target = document.getElementById("view-" + view);
        if (!target) return;
        document.querySelectorAll(".view").forEach(el => el.classList.toggle("active", el === target));
        document.querySelectorAll(".nav-item").forEach(el => el.classList.toggle("active", el.dataset.view === view));
        document.getElementById("crumb").textContent = navLabels[view] || "Learning lab";
        if (track && !["home","settings"].includes(view)) {
          progress.recent = [{ id:view, label:navLabels[view], time:Date.now() }, ...progress.recent.filter(item => item.id !== view)].slice(0,4);
          save(); renderRecent();
        }
        window.scrollTo({ top:0, behavior:matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
      }
      document.getElementById("navigation").addEventListener("click", e => { const btn = e.target.closest("[data-view]"); if (btn) go(btn.dataset.view); });
      document.getElementById("open-settings").addEventListener("click", () => go("settings"));
      document.addEventListener("click", e => {
        const goBtn = e.target.closest("[data-go]");
        if (goBtn) go(goBtn.dataset.go);
        const completeBtn = e.target.closest("[data-complete-module]");
        if (completeBtn) completeModule(completeBtn.dataset.completeModule);
      });
      document.getElementById("date-display").textContent = new Intl.DateTimeFormat(undefined, { weekday:"short", month:"short", day:"numeric" }).format(new Date()).toUpperCase();

      function renderModules() {
        const mini = document.getElementById("home-modules");
        mini.innerHTML = modules.slice(0,3).map(m => `<div class="module-row"><div class="module-glyph" aria-hidden="true">${m.glyph}</div><div><h3>${m.title}</h3><small>${m.time} · ${m.topics[0]}</small></div><button class="text-action" data-open-module="${m.id}" aria-label="Open ${m.title}">Open →</button></div>`).join("");
        document.getElementById("module-grid").innerHTML = modules.map(m => {
          const done = progress.modules.includes(m.id);
          return `<article class="panel module-card"><div class="module-card-top"><div><div class="module-glyph" aria-hidden="true">${m.glyph}</div><div class="eyebrow">${m.time} guided study</div><h2 style="font-size:19px;margin:6px 0 7px">${m.title}</h2></div><span class="badge ${done ? "done" : ""}">${done ? "COMPLETED" : "READY"}</span></div><p>${m.desc}</p><div class="module-topics">${m.topics.map(topic => `<span class="topic-tag">${topic}</span>`).join("")}</div><div class="toolbar"><button class="button primary small" data-module-start="${m.id}">${done ? "Revisit module" : "Start exploring"} <span aria-hidden="true">→</span></button><button class="button secondary small" data-module-done="${m.id}">${done ? "Completed ✓" : "Mark complete"}</button></div></article>`;
        }).join("");
      }
      function completeModule(id) {
        if (!progress.modules.includes(id)) {
          progress.modules.push(id); save(); renderAll(); toast("Module milestone saved locally.");
        } else toast("This module is already marked complete.");
        if (moduleDialog.open && currentLessonId===id) {
          const button=moduleDialogContent.querySelector("[data-complete-module]");
          if(button)button.textContent="Module completed ✓";
        }
      }
      function openModule(id) {
        const module = modules.find(item => item.id === id), lesson = moduleLessons[id];
        if (!module || !lesson) return;
        currentLessonId = id; lessonAnswered = false;
        progress.recent = [{ id:`module-${id}`, label:module.title, time:Date.now() }, ...progress.recent.filter(item=>item.id!==`module-${id}`)].slice(0,4);
        save(); renderRecent();
        moduleDialogContent.innerHTML = `<div class="lesson-header"><div><div class="eyebrow">${module.time} guided study · ${progress.modules.includes(id) ? "completed" : "in progress"}</div><h2 id="module-dialog-title">${module.title}</h2><p>${lesson.intro}</p></div><button class="button quiet small" id="module-close" aria-label="Close module lesson">Close ×</button></div><section class="lesson-section"><h3>Learning objectives</h3><ul class="lesson-objectives">${lesson.objectives.map(item=>`<li>${item}</li>`).join("")}</ul></section><section class="lesson-section"><h3>Core idea</h3><p>${lesson.concept}</p></section><section class="lesson-section"><div class="lesson-example"><strong>${lesson.exampleTitle}</strong><p>${lesson.example}</p></div></section><section class="lesson-section"><div class="lesson-activity"><div class="eyebrow">Quick activity</div><h3>${lesson.question}</h3><div class="lesson-answers">${lesson.answers.map((answer,index)=>`<button class="lesson-answer" data-lesson-answer="${index}">${answer}</button>`).join("")}</div><p class="lesson-feedback" id="lesson-feedback" aria-live="polite">Choose one answer to check your understanding.</p></div></section><div class="lesson-footer"><span class="switch-label">Progress is saved in this browser only.</span><button class="button primary" data-complete-module="${id}">${progress.modules.includes(id) ? "Module completed ✓" : "Mark module complete"}</button></div>`;
        moduleDialog.showModal();
        moduleDialogContent.querySelector("#module-close").addEventListener("click",()=>moduleDialog.close());
      }
      moduleDialog.addEventListener("click",e=>{if(e.target===moduleDialog)moduleDialog.close();});
      moduleDialogContent.addEventListener("click",e=>{
        const answerButton=e.target.closest("[data-lesson-answer]");
        if(!answerButton||lessonAnswered||!currentLessonId)return;
        lessonAnswered=true;
        const lesson=moduleLessons[currentLessonId], choice=Number(answerButton.dataset.lessonAnswer), correct=choice===lesson.correct;
        moduleDialogContent.querySelectorAll("[data-lesson-answer]").forEach((button,index)=>{button.disabled=true;if(index===lesson.correct)button.classList.add("correct");else if(index===choice)button.classList.add("wrong");});
        moduleDialogContent.querySelector("#lesson-feedback").textContent=`${correct?"Correct.":"Not quite."} ${lesson.explanation}`;
      });
      document.addEventListener("click", e => {
        const open = e.target.closest("[data-open-module]");
        const start = e.target.closest("[data-module-start]");
        const done = e.target.closest("[data-module-done]");
        if (open) openModule(open.dataset.openModule);
        if (start) openModule(start.dataset.moduleStart);
        if (done) completeModule(done.dataset.moduleDone);
      });
      function renderRecent() {
        const el = document.getElementById("recent-list");
        if (!progress.recent.length) { el.innerHTML = '<div class="empty-note">No activity yet. Start a module or open a lab to create your first bench record.</div>'; return; }
        el.innerHTML = progress.recent.map(item => `<div class="recent-item"><span>${item.label}</span><span>${new Intl.DateTimeFormat(undefined,{hour:"2-digit",minute:"2-digit"}).format(new Date(item.time))}</span></div>`).join("");
      }
      function renderStats() {
        const completed = progress.modules.length + progress.challenges.length + (progress.attempts ? 1 : 0);
        const total = modules.length + 3 + 1;
        document.getElementById("stat-progress").innerHTML = `${Math.round(completed / total * 100)}<small>%</small>`;
        document.getElementById("stat-modules").innerHTML = `${progress.modules.length}<small>/ 5</small>`;
        document.getElementById("stat-score").innerHTML = `${progress.best == null ? "—" : progress.best}<small>/ 12</small>`;
        document.getElementById("stat-code").innerHTML = `${progress.challenges.length}<small>/ 3</small>`;
        const dayKey = localDayKey();
        const done = !!progress.daily[dayKey];
        document.getElementById("daily-state").textContent = done ? "COMPLETED TODAY" : "READY TO TRY";
        document.getElementById("daily-fill").style.width = done ? "100%" : "0%";
        document.getElementById("daily-copy").textContent = done ? `Today's answer is saved on this device. Come back tomorrow for the next deterministic prompt.` : `A deterministic local question based on today's date. One focused concept, immediate explanation.`;
        document.getElementById("daily-start").textContent = done ? "Review today's check →" : "Take today's check →";
      }
      function renderAll() { renderStats(); renderRecent(); renderModules(); }

      // Logic gate bench
      const gateInfo = {
        AND:{ expr:"Y = A · B", explanation:"An AND gate outputs 1 only when both inputs are 1. Think of two series switches: both must close to complete the path.", fn:(a,b)=>a&&b },
        OR:{ expr:"Y = A + B", explanation:"An OR gate outputs 1 when at least one input is 1. Either input can provide the condition for a HIGH output.", fn:(a,b)=>a||b },
        NOT:{ expr:"Y = Ā", explanation:"A NOT gate, or inverter, produces the complement of its single input: HIGH becomes LOW, and LOW becomes HIGH. Input B is not used.", fn:(a)=>!a },
        NAND:{ expr:"Y = ¬(A · B)", explanation:"NAND is the inverse of AND. Its output is LOW only when both inputs are HIGH. NAND is a universal gate: any Boolean function can be built from NAND gates alone.", fn:(a,b)=>!(a&&b) },
        NOR:{ expr:"Y = ¬(A + B)", explanation:"NOR is the inverse of OR. It is HIGH only when both inputs are LOW. Like NAND, NOR is a universal gate.", fn:(a,b)=>!(a||b) },
        XOR:{ expr:"Y = A ⊕ B", explanation:"XOR (exclusive OR) is HIGH when the inputs differ—exactly one input is HIGH. It is useful in parity checks and the sum output of a half-adder.", fn:(a,b)=>a!==b },
        XNOR:{ expr:"Y = ¬(A ⊕ B)", explanation:"XNOR is HIGH when the inputs are equal (both LOW or both HIGH). It can act as a one-bit equality comparator.", fn:(a,b)=>a===b }
      };
      let inputA = false, inputB = false;
      const gateSelect = document.getElementById("gate-select");
      function gateOutput(name,a,b) { return !!gateInfo[name].fn(a,b); }
      function renderLogic() {
        const name = gateSelect.value, info = gateInfo[name], notGate = name === "NOT";
        const out = gateOutput(name,inputA,inputB);
        document.getElementById("input-b-group").style.opacity = notGate ? ".35" : "1";
        document.getElementById("input-b").disabled = notGate;
        document.getElementById("input-b").setAttribute("aria-disabled", String(notGate));
        document.getElementById("svg-b-label").style.opacity = notGate ? ".25" : "1";
        document.getElementById("wire-b").style.opacity = notGate ? ".2" : "1";
        document.getElementById("input-a").setAttribute("aria-checked", String(inputA));
        document.getElementById("input-b").setAttribute("aria-checked", String(inputB));
        document.getElementById("input-a").setAttribute("aria-label", `Input A, currently ${inputA ? "high" : "low"}`);
        document.getElementById("input-b").setAttribute("aria-label", `Input B, currently ${inputB ? "high" : "low"}`);
        document.getElementById("a-readout").textContent = `${inputA ? "HIGH" : "LOW"} · ${Number(inputA)}`;
        document.getElementById("b-readout").textContent = `${inputB ? "HIGH" : "LOW"} · ${Number(inputB)}`;
        document.getElementById("logic-output").textContent = `${out ? "HIGH" : "LOW"} · ${Number(out)}`;
        document.getElementById("logic-expression").textContent = info.expr;
        document.getElementById("gate-explain-title").textContent = `${name} gate`;
        document.getElementById("gate-explain").textContent = info.explanation;
        document.getElementById("svg-gate-name").textContent = name;
        document.getElementById("wire-a").setAttribute("class", `wire ${inputA ? "live" : "off"}`);
        document.getElementById("wire-b").setAttribute("class", `wire ${inputB ? "live" : "off"}`);
        document.getElementById("wire-out").setAttribute("class", `wire ${out ? "live" : "off"}`);
        document.getElementById("output-light").setAttribute("class", `output-light ${out ? "on" : ""}`);
        document.getElementById("svg-out-value").textContent = Number(out);
        const shape = document.getElementById("gate-shape");
        shape.setAttribute("d", notGate ? "M185 64 L285 111 L185 158 Z" : "M185 55 H238 Q305 55 305 111 Q305 167 238 167 H185 Z");
        const inv = document.getElementById("inversion-bubble");
        inv.style.display = ["NAND","NOR","XNOR","NOT"].includes(name) ? "" : "none";
        inv.setAttribute("cx", name === "NOT" ? "296" : "316");
        document.getElementById("wire-out").setAttribute("x1", ["NAND","NOR","XNOR"].includes(name) ? "325" : "305");
        if (name === "NOT") { document.getElementById("wire-b").style.opacity=".15"; document.getElementById("svg-b-label").style.opacity=".15"; }
        document.getElementById("truth-b-head").textContent = notGate ? "—" : "Input B";
        const rows = notGate ? [[0,0],[1,0]] : [[0,0],[0,1],[1,0],[1,1]];
        document.getElementById("truth-body").innerHTML = rows.map(([a,b]) => {
          const y = Number(gateOutput(name,!!a,!!b));
          const current = a === Number(inputA) && (notGate || b === Number(inputB));
          return `<tr class="${current ? "current" : ""}"><td>${a}</td><td>${notGate ? "—" : b}</td><td>${y}</td></tr>`;
        }).join("");
        document.getElementById("gate-svg-desc").textContent = `${name} gate with input A ${inputA?1:0}${notGate?"":` and input B ${inputB?1:0}`}; output is ${Number(out)}.`;
      }
      document.getElementById("input-a").addEventListener("click", () => { inputA=!inputA; renderLogic(); });
      document.getElementById("input-b").addEventListener("click", () => { inputB=!inputB; renderLogic(); });
      gateSelect.addEventListener("change", renderLogic);
      document.getElementById("logic-reset").addEventListener("click", () => { inputA=false; inputB=false; gateSelect.value="AND"; renderLogic(); toast("Logic inputs reset to LOW."); });
      renderLogic();

      // Simulated environment sensors
      const eventHistory = [];
      const sensors = [
        { id:"temp", label:"Temperature", slider:"temp-slider", value:"temp-value", gauge:"temp-gauge", status:"temp-status", fmt:v=>`${Number(v).toFixed(1)} °C`, getStatus:v=>v>32?["HIGH TEMP","alert"]:v<18?["COOL","warn"]:["WITHIN RANGE",""], max:70 },
        { id:"distance", label:"Distance", slider:"distance-slider", value:"distance-value", gauge:"distance-gauge", status:"distance-status", fmt:v=>`${v} cm`, getStatus:v=>v<=20?["NEAR OBJECT","warn"]:["CLEAR",""], max:198 },
        { id:"light", label:"Light", slider:"light-slider", value:"light-value", gauge:"light-gauge", status:"light-status", fmt:v=>`${v} %`, getStatus:v=>v<25?["LOW LIGHT","warn"]:["BRIGHT",""], max:100 }
      ];
      const currentSensors = {};
      function clock() { return new Intl.DateTimeFormat(undefined,{hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(new Date()); }
      function logEvent(message) { eventHistory.unshift({time:clock(),message}); eventHistory.splice(8); renderEvents(); }
      function renderEvents() {
        document.getElementById("event-list").innerHTML = eventHistory.length ? eventHistory.map(e=>`<div class="event-row"><time>${e.time}</time><span>${e.message}</span></div>`).join("") : '<div class="empty-note">No events yet. Adjust a sensor to add a reading.</div>';
      }
      function renderSensors(changed) {
        sensors.forEach(s => {
          const val = Number(document.getElementById(s.slider).value);
          currentSensors[s.id] = val;
          document.getElementById(s.value).textContent = s.fmt(val);
          document.getElementById(s.gauge).style.width = `${Math.max(1,Math.min(100,(val-(s.id==="temp"?-10: s.id==="distance"?2:0))/(s.id==="temp"?70:s.max)*100))}%`;
          const [label,cls] = s.getStatus(val);
          const status = document.getElementById(s.status);
          status.textContent = label; status.className = `status ${cls}`;
        });
        const t=currentSensors.temp, d=currentSensors.distance, l=currentSensors.light;
        document.getElementById("monitor-screen").innerHTML =
          `<div><span class="muted-line"># SIMULATED TELEMETRY · ${clock()}</span></div><div>temperature = ${t.toFixed(1)} °C</div><div>distance    = ${d} cm ${d<=20?"// proximity alert":""}</div><div>light       = ${l}% ${l<25?"// low-light condition":""}</div><div>decision    = ${d<=20?"LED: ON (near object)":l<25?"LED: ON (low light)":"LED: OFF (nominal)"}</div>`;
        if (changed) {
          const s=sensors.find(item=>item.id===changed);
          logEvent(`${s.label} updated to ${s.fmt(currentSensors[changed])} · ${document.getElementById(s.status).textContent}`);
        }
      }
      sensors.forEach(s => document.getElementById(s.slider).addEventListener("input", () => renderSensors(s.id)));
      document.getElementById("sensor-reset").addEventListener("click", () => { document.getElementById("temp-slider").value=24; document.getElementById("distance-slider").value=42; document.getElementById("light-slider").value=68; eventHistory.length=0; renderSensors(); logEvent("Environment reset to nominal values."); });
      document.getElementById("clear-events").addEventListener("click", () => { eventHistory.length=0; renderEvents(); toast("Event log cleared."); });
      renderSensors(); renderEvents();

      // Quiz bank; each question includes a concise explanation.
      const questions = [
        {q:"Which Boolean expression describes a two-input AND gate?",a:["Y = A + B","Y = A · B","Y = Ā","Y = A ⊕ B"],c:1,e:"AND is true only if both operands are true, so its Boolean product is A · B."},
        {q:"What output does a NOT gate produce when its input is logic 0?",a:["0","1","High impedance only","It depends on a clock"],c:1,e:"An inverter complements the input: NOT 0 = 1."},
        {q:"For which input combination does an XOR gate output logic 1?",a:["A=0, B=0 only","A=1, B=1 only","Inputs are different","Inputs are equal"],c:2,e:"XOR is true when exactly one input is true; its output is 1 for 01 and 10."},
        {q:"A NAND gate is LOW when…",a:["both inputs are LOW","either input is LOW","both inputs are HIGH","inputs are different"],c:2,e:"NAND is the complement of AND. It is 0 only when AND would be 1: A=B=1."},
        {q:"What is the main purpose of a pull-up resistor on a digital input?",a:["Increase the processor clock","Keep the input at a defined HIGH when a switch is open","Convert analog to digital","Limit a motor's current"],c:1,e:"The pull-up provides a known logic HIGH instead of a floating input. A switch can then pull the node LOW."},
        {q:"An ADC with an ideal 10-bit resolution represents how many distinct codes?",a:["10","100","512","1024"],c:3,e:"An n-bit converter has 2ⁿ codes. For 10 bits, 2¹⁰ = 1024 (codes 0–1023)."},
        {q:"An ultrasonic distance sensor estimates range primarily by measuring…",a:["echo travel time","light intensity","coil resistance","the speed of sound in a wire"],c:0,e:"It measures the elapsed time for a sound pulse to travel to an object and return. Distance is approximately speed × time ÷ 2."},
        {q:"What does PWM vary to control average power to a load?",a:["Carrier frequency only","Duty cycle","Supply polarity","ADC bit depth"],c:1,e:"Pulse-width modulation changes the fraction of each period that the output is HIGH (duty cycle), changing average delivered power."},
        {q:"What does the Nyquist sampling criterion say for a band-limited signal with maximum frequency fmax?",a:["Sample below fmax","Sample at least 2 fmax","Use exactly 8 bits","Never use a low-pass filter"],c:1,e:"To avoid aliasing in ideal conditions, the sample rate must be at least twice the highest signal frequency. Practical systems also use an anti-alias filter."},
        {q:"In amplitude modulation (AM), which carrier property follows the message signal?",a:["Amplitude","Propagation speed","Antenna length","Phase only"],c:0,e:"AM varies the carrier amplitude in proportion to the message; the carrier frequency stays nominally fixed."},
        {q:"A low-pass filter is designed to…",a:["Pass lower frequencies and attenuate higher frequencies","Pass only DC and block every AC signal","Amplify every frequency equally","Convert digital data to analog"],c:0,e:"A low-pass filter passes frequencies below its cutoff region and increasingly attenuates higher-frequency components."},
        {q:"What does a microcontroller GPIO pin do when configured as an input?",a:["Reads a voltage level at the pin","Generates a Wi-Fi connection automatically","Measures every signal's frequency","Stores the whole program"],c:0,e:"A GPIO input samples the logic level present at the pin. It needs a valid voltage and should not be left floating."}
      ];
      let quizIndex=0, quizScore=0, quizAnswered=false, quizFinished=false, quizMode="full", dailyQuestionIndex=0;
      function hashDate(dateText) { let h=2166136261; for (const ch of dateText) { h ^= ch.charCodeAt(0); h = Math.imul(h,16777619); } return (h>>>0)%questions.length; }
      const todayKey = localDayKey();
      dailyQuestionIndex = hashDate(todayKey);
      function activeQuestion() { return quizMode==="daily" ? questions[dailyQuestionIndex] : questions[quizIndex]; }
      function quizLength() { return quizMode==="daily" ? 1 : questions.length; }
      function renderQuiz() {
        const main=document.getElementById("quiz-main"), total=quizLength();
        document.getElementById("quiz-score").innerHTML=quizScore < 0 ? `✓<small> done</small>` : `${quizScore}<small> pts</small>`;
        document.getElementById("quiz-progress").style.width=`${(quizFinished?total:quizIndex)/total*100}%`;
        if (quizFinished) {
          if (quizMode==="daily" && progress.daily[todayKey] && quizScore < 0) {
            main.innerHTML=`<div class="quiz-complete"><div class="score-orbit"><strong>✓</strong></div><div class="eyebrow">Daily signal · already complete</div><h2 style="margin:7px 0 8px">Today's answer is locked in.</h2><p class="subhead" style="margin:0 auto 19px">The question of the day can only be answered once per day. Your completion is saved locally; the next prompt is selected tomorrow.</p><button class="button secondary" data-go="home">Back to overview</button></div>`;
            return;
          }
          if (quizMode==="full") {
            progress.attempts++; progress.best=progress.best==null?quizScore:Math.max(progress.best,quizScore); save(); renderAll();
          } else if (quizMode==="daily") { progress.daily[todayKey]=true; save(); renderStats(); }
          const percentage=Math.round(quizScore/total*100);
          main.innerHTML=`<div class="quiz-complete"><div class="score-orbit"><strong>${quizScore}/${total}</strong></div><div class="eyebrow">${quizMode==="daily"?"Daily signal complete":"Run complete"}</div><h2 style="margin:7px 0 8px">${percentage>=75?"Strong signal.":"Good data to build on."}</h2><p class="subhead" style="margin:0 auto 19px">${quizMode==="daily"?"Today's question is complete; this answer is saved locally until tomorrow.":"Best score and attempt count update in local storage on this device."}</p><div class="toolbar" style="justify-content:center"><button class="button primary" id="quiz-again">${quizMode==="daily"?"Retry today's question":"Run it again"} →</button><button class="button secondary" data-go="modules">Return to modules</button></div></div>`;
          document.getElementById("quiz-again").addEventListener("click",()=>startQuiz(quizMode));
          return;
        }
        const q=activeQuestion();
        main.innerHTML=`<div class="quiz-top"><span class="badge">${quizMode==="daily"?"QUESTION OF THE DAY":"CORE CONCEPTS"}</span><span class="quiz-progress">QUESTION ${String(quizIndex+1).padStart(2,"0")} / ${String(total).padStart(2,"0")}</span></div><h2 class="quiz-question">${q.q}</h2><div class="answers">${q.a.map((answer,i)=>`<button class="answer-option" data-answer="${i}"><span class="answer-key">${String.fromCharCode(65+i)}</span><span>${answer}</span></button>`).join("")}</div><div class="answer-feedback" id="answer-feedback" aria-live="polite">Choose the best answer. You can only answer this question once per run.</div><div class="toolbar" style="justify-content:flex-end;margin-top:13px"><button class="button primary" id="quiz-next" disabled>${quizIndex===total-1?"See result":"Next question"} →</button></div>`;
        main.querySelectorAll("[data-answer]").forEach(btn=>btn.addEventListener("click",()=>answerQuiz(Number(btn.dataset.answer))));
        document.getElementById("quiz-next").addEventListener("click",()=>{ if(!quizAnswered)return; quizIndex++; quizAnswered=false; if(quizIndex>=total) quizFinished=true; renderQuiz(); });
      }
      function answerQuiz(choice) {
        if (quizAnswered || quizFinished) return;
        quizAnswered=true; const q=activeQuestion(), good=choice===q.c;
        if(good)quizScore++;
        document.querySelectorAll(".answer-option").forEach((btn,i)=>{btn.disabled=true;if(i===q.c)btn.classList.add("correct");else if(i===choice)btn.classList.add("wrong");});
        const feedback=document.getElementById("answer-feedback");
        feedback.className=`answer-feedback ${good?"good":"bad"}`;
        feedback.textContent=`${good?"Correct.":"Not quite."} ${q.e}`;
        document.getElementById("quiz-next").disabled=false;
        document.getElementById("quiz-score").innerHTML=`${quizScore}<small> pts</small>`;
      }
      function startQuiz(mode="full") { quizMode=mode;quizIndex=0;quizScore=0;quizAnswered=false;quizFinished=false;if(mode==="daily"&&progress.daily[todayKey]){quizScore=-1;quizFinished=true;}go("quiz");renderQuiz(); }
      document.getElementById("daily-start").addEventListener("click",()=>startQuiz("daily"));
      document.getElementById("quiz-daily-mode").addEventListener("click",()=>startQuiz("daily"));
      document.getElementById("quiz-restart-top").addEventListener("click",()=>startQuiz("full"));
      renderQuiz();

      // Guided code challenges, with explicit local-only pattern validation.
      const challenges = [
        {id:"blink",name:"LED blink",level:"Output · timing",hint:"Use pinMode in setup, then alternate digitalWrite HIGH and LOW with a delay between states.",starter:`const int ledPin = 13;\n\nvoid setup() {\n  pinMode(ledPin, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(ledPin, HIGH);\n  delay(500);\n  digitalWrite(ledPin, LOW);\n  delay(500);\n}`,solution:`const int ledPin = 13;\n\nvoid setup() {\n  pinMode(ledPin, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(ledPin, HIGH); // LED on\n  delay(500);                // wait 500 ms\n  digitalWrite(ledPin, LOW); // LED off\n  delay(500);\n}`,explain:"Configure the LED pin as OUTPUT once in setup(). In loop(), write HIGH, wait, write LOW, and wait again. The repeated loop creates a blink cycle. A real LED requires an appropriate series current-limiting resistor.",check(code){return /pinMode\s*\([^,]+,\s*OUTPUT\s*\)/i.test(code)&&/digitalWrite\s*\([^,]+,\s*HIGH\s*\)/i.test(code)&&/digitalWrite\s*\([^,]+,\s*LOW\s*\)/i.test(code)&&/delay\s*\(\s*\d+\s*\)/i.test(code);}},
        {id:"sensor-read",name:"Read a sensor",level:"Input · serial",hint:"Read an analog input with analogRead, then send the variable to Serial.println. Start serial in setup.",starter:`const int sensorPin = A0;\nint sensorValue = 0;\n\nvoid setup() {\n  Serial.begin(9600);\n}\n\nvoid loop() {\n  sensorValue = analogRead(sensorPin);\n  Serial.println(sensorValue);\n  delay(250);\n}`,solution:`const int sensorPin = A0;\nint sensorValue = 0;\n\nvoid setup() {\n  Serial.begin(9600);\n}\n\nvoid loop() {\n  sensorValue = analogRead(sensorPin);\n  Serial.println(sensorValue);\n  delay(250);\n}`,explain:"analogRead() samples an analog input and returns a digital code (commonly 0–1023 on a 10-bit ADC, board-dependent). Serial.begin() configures the serial link; Serial.println() reports a readable value. A sensor must be wired within the board's input-voltage limits.",check(code){return /analogRead\s*\(/i.test(code)&&/Serial\.begin\s*\(/i.test(code)&&/Serial\.println\s*\(/i.test(code);}},
        {id:"threshold",name:"Threshold alert",level:"Condition · output",hint:"Read the input, compare it with a threshold using if, and drive an output pin HIGH inside the condition; use else for the other state.",starter:`const int sensorPin = A0;\nconst int alertPin = 8;\nconst int threshold = 600;\n\nvoid setup() {\n  pinMode(alertPin, OUTPUT);\n}\n\nvoid loop() {\n  int reading = analogRead(sensorPin);\n\n  if (reading > threshold) {\n    digitalWrite(alertPin, HIGH);\n  } else {\n    digitalWrite(alertPin, LOW);\n  }\n}`,solution:`const int sensorPin = A0;\nconst int alertPin = 8;\nconst int threshold = 600;\n\nvoid setup() {\n  pinMode(alertPin, OUTPUT);\n}\n\nvoid loop() {\n  int reading = analogRead(sensorPin);\n  if (reading > threshold) {\n    digitalWrite(alertPin, HIGH);\n  } else {\n    digitalWrite(alertPin, LOW);\n  }\n}`,explain:"The sensor reading is compared with a chosen threshold. The if/else branches drive the alert output HIGH only when the condition is true. Real thresholds should be calibrated to the sensor, supply, and ADC scale; add hysteresis when noisy readings could make an output chatter.",check(code){return /analogRead\s*\(/i.test(code)&&/if\s*\([^)]*(?:>|<|>=|<=)[^)]*\)/i.test(code)&&/digitalWrite\s*\([^,]+,\s*HIGH\s*\)/i.test(code)&&/digitalWrite\s*\([^,]+,\s*LOW\s*\)/i.test(code);}}
      ];
      let selectedChallenge=challenges[0];
      function renderChallenges() {
        document.getElementById("challenge-list").innerHTML=challenges.map(ch=>`<button class="challenge-option ${ch.id===selectedChallenge.id?"selected":""}" data-challenge="${ch.id}"><strong>${ch.name} ${progress.challenges.includes(ch.id)?"✓":""}</strong><span>${ch.level}${progress.challenges.includes(ch.id)?" · completed":""}</span></button>`).join("");
        document.getElementById("challenge-editor-title").textContent=selectedChallenge.name;
        document.getElementById("challenge-hint").textContent=selectedChallenge.hint;
        document.getElementById("code-editor").value=selectedChallenge.starter;
        document.getElementById("code-feedback").className="feedback-console";
        document.getElementById("code-feedback").textContent=progress.challenges.includes(selectedChallenge.id)?"Milestone already saved. You can still edit and validate your sketch.":"Select a challenge, then modify the sketch or inspect the starter.";
        document.getElementById("solution-box").hidden=true;
      }
      document.getElementById("challenge-list").addEventListener("click",e=>{
        const btn=e.target.closest("[data-challenge]");if(!btn)return;
        selectedChallenge=challenges.find(ch=>ch.id===btn.dataset.challenge);renderChallenges();
      });
      document.getElementById("code-reset").addEventListener("click",()=>{document.getElementById("code-editor").value=selectedChallenge.starter;document.getElementById("code-feedback").textContent="Starter restored. This sketch is an editable example, not a compiled program.";document.getElementById("code-feedback").className="feedback-console";});
      document.getElementById("code-check").addEventListener("click",()=>{
        const code=document.getElementById("code-editor").value, panel=document.getElementById("code-feedback");
        if(selectedChallenge.check(code)){
          panel.className="feedback-console success";panel.textContent=`Pattern check passed for “${selectedChallenge.name}”. Required concepts found; this does not verify syntax, compile, or run hardware code.`;
          if(!progress.challenges.includes(selectedChallenge.id)){progress.challenges.push(selectedChallenge.id);save();renderStats();renderChallenges();panel.className="feedback-console success";panel.textContent=`Pattern check passed and milestone saved locally. This is not compilation or hardware validation.`;toast("Coding challenge milestone saved.");}
        } else { panel.className="feedback-console error";panel.textContent=`Not all expected code patterns were found. Revisit the hint. This simple local check does not parse or compile code.`; }
      });
      document.getElementById("show-solution").addEventListener("click",()=>{
        const box=document.getElementById("solution-box");box.hidden=!box.hidden;
        if(!box.hidden)box.innerHTML=`<strong style="color:#d5caff">Solution notes</strong><br>${selectedChallenge.explain}<br><br><code style="font:10px/1.6 var(--mono);color:#b4f1df;white-space:pre-wrap">${escapeHTML(selectedChallenge.solution)}</code>`;
      });
      function escapeHTML(str){return str.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
      renderChallenges();

      // Curated local mentor, intentionally bounded and transparent.
      const mentorAnswers = [
        {keys:["xor","exclusive or","exclusive-or"],answer:"XOR (exclusive OR) is HIGH when its two inputs differ. Its truth table is 00→0, 01→1, 10→1, 11→0. It is useful in parity logic and as the sum output of a half-adder."},
        {keys:["xnor"],answer:"XNOR is the complement of XOR: it outputs HIGH when both inputs are equal (00 or 11). That makes it useful as a one-bit equality comparator."},
        {keys:["nand"],answer:"NAND means NOT-AND: Y = ¬(A · B). The output is LOW only when both inputs are HIGH. NAND is functionally complete, so a network of NAND gates can implement any Boolean function."},
        {keys:["nor"],answer:"NOR means NOT-OR: Y = ¬(A + B). It outputs HIGH only when both inputs are LOW. NOR is also a universal gate."},
        {keys:["and gate","boolean and","truth table"],answer:"An AND gate outputs 1 only when every input is 1. For two inputs: 00→0, 01→0, 10→0, 11→1. In Boolean algebra, AND is written with multiplication: A · B."},
        {keys:["or gate","boolean or"],answer:"An OR gate outputs 1 when at least one input is 1. For two inputs: 00→0, 01→1, 10→1, 11→1. Boolean OR is commonly written A + B."},
        {keys:["pull-up","pull up","pullup"],answer:"A pull-up resistor connects a digital input weakly to the logic supply. With a switch open, it holds the input at a defined HIGH; closing a switch to ground makes it LOW. This prevents a floating, noise-sensitive input."},
        {keys:["ultrasonic","distance sensor","distance measurement"],answer:"An ultrasonic ranger emits a short sound pulse and measures the echo return time. For a stationary target, distance ≈ speed of sound × round-trip time ÷ 2. Temperature changes the speed of sound slightly, and soft or angled surfaces can weaken the echo."},
        {keys:["temperature","thermistor"],answer:"A thermistor changes resistance with temperature. A common NTC thermistor's resistance decreases as temperature rises. A voltage divider turns that resistance change into a voltage an ADC can sample; calibration is needed for accurate temperature."},
        {keys:["photoresistor","light sensor","ldr"],answer:"A photoresistor (LDR) changes resistance with illumination—typically resistance falls as light increases. In a voltage divider, the measured voltage depends on which side holds the LDR, so check the circuit before interpreting rising ADC values."},
        {keys:["adc","analog to digital","analog-to-digital"],answer:"An ADC samples an analog voltage and quantizes it into a finite digital code. An ideal n-bit converter has 2ⁿ levels; a 10-bit ADC has 1024 codes. Reference voltage, resolution, noise, and input range determine how useful the result is."},
        {keys:["pwm","pulse width","duty cycle"],answer:"PWM rapidly switches a digital output between LOW and HIGH. Duty cycle is the fraction of each period spent HIGH. With a suitable load, changing duty cycle changes average power; PWM is not a true analog voltage, and the load or filter matters."},
        {keys:["sampling","nyquist","alias"],answer:"Sampling measures a continuous signal at discrete time intervals. To represent a band-limited signal without aliasing, the ideal sample rate must be at least twice its highest frequency (Nyquist criterion). Real systems use an anti-alias low-pass filter and practical margin."},
        {keys:["low-pass","low pass","filter"],answer:"A low-pass filter passes lower-frequency components and attenuates frequencies above its cutoff region. It can smooth sensor noise, but filtering also changes response time. A simple RC low-pass has cutoff approximately 1/(2πRC)."},
        {keys:["am","amplitude modulation","modulation"],answer:"In amplitude modulation (AM), the message changes the carrier's amplitude. In frequency modulation (FM), the message changes instantaneous frequency. Modulation shifts a signal into a band suitable for transmission; bandwidth and noise behavior depend on the scheme."},
        {keys:["microcontroller","gpio","arduino"],answer:"A microcontroller combines a processor, memory, and peripherals. A typical program configures pins in setup(), then repeats sensing, decision-making, and output actions in loop(). GPIO pins have voltage/current limits; never assume a pin can directly drive a motor."},
        {keys:["blink","digitalwrite","pinmode"],answer:"A basic Arduino-style blink uses pinMode(pin, OUTPUT) in setup(), then digitalWrite(HIGH), delay(), digitalWrite(LOW), delay() in loop(). Use a suitable current-limiting resistor with a bare LED, and check the board's pin limits."},
        {keys:["communication","bandwidth","channel"],answer:"A communication system maps information onto a signal, sends it through a channel, then detects and recovers the message. Bandwidth describes the frequency range occupied or available. Noise and interference reduce how reliably a receiver can distinguish the signal."}
      ];
      const chatMessages=document.getElementById("chat-messages");
      function appendMessage(text,who="bot",typing=false) {
        const row=document.createElement("div");row.className=`message ${who}`;
        const bubble=document.createElement("div");bubble.className=`message-bubble${typing?" typing":""}`;bubble.textContent=text;
        const meta=document.createElement("span");meta.className="message-meta";meta.textContent=who==="user"?"YOU":"CIRCUIT MENTOR · LOCAL";
        row.append(bubble,meta);chatMessages.append(row);chatMessages.scrollTop=chatMessages.scrollHeight;return row;
      }
      function initChat() {
        chatMessages.innerHTML="";
        appendMessage("Welcome to the bench. Ask about logic gates, sensors, microcontrollers, communication systems, sampling, or filters. I use a small set of curated local explanations; if a topic falls outside them, I’ll say so.");
      }
      function mentorReply(question) {
        const normalized=question.toLowerCase();
        const answer=mentorAnswers.find(entry=>entry.keys.some(key=>normalized.includes(key)));
        return answer ? answer.answer : "I don't have a vetted answer for that topic in this local mentor. Try asking about logic gates, Boolean algebra, pull-ups, ADCs, ultrasonic or light sensors, PWM, sampling, filters, modulation, or microcontrollers. For a specific device, check its datasheet or ask your instructor.";
      }
      function submitMentor(text) {
        const trimmed=text.trim();if(!trimmed)return;
        appendMessage(trimmed,"user");
        const typing=appendMessage("Checking the local topic guide…","bot",true);
        setTimeout(()=>{typing.remove();appendMessage(mentorReply(trimmed));},420);
      }
      document.getElementById("chat-form").addEventListener("submit",e=>{e.preventDefault();const input=document.getElementById("chat-input");submitMentor(input.value);input.value="";});
      document.getElementById("mentor-suggestions").addEventListener("click",e=>{const btn=e.target.closest(".suggestion");if(btn)submitMentor(btn.textContent);});
      document.getElementById("clear-chat").addEventListener("click",()=>{initChat();toast("Local conversation cleared.");});
      initChat();

      document.getElementById("reset-progress").addEventListener("click",()=>{
        if(!window.confirm("Reset all CircuitForge learning progress saved in this browser? This cannot be undone."))return;
        progress=emptyProgress();save();renderAll();renderChallenges();toast("Local learning record reset.");
      });
      renderAll();
    })();

<script setup>
import { ref } from "vue";

const codeLine1 = "function Arkan(FSMS , TSMS) { ";
const codeLine2 = "  console.log('Version 2.0!!!')";
const codeLine3 = "  Developed by => `LazySoftware`...";
const codeLine4 = "  const Team = Amir & El Gamal";
const codeLine5 = "Made with ❤ ";
const codeLine6 = "  We love you tommy ❤";
const codeLine7 = "}";

const typeLine1 = ref("");
const typeLine2 = ref({ text: "", state: false });
const typeLine3 = ref({ text: "", state: false });
const typeLine4 = ref({ text: "", state: false });
const typeLine5 = ref({ text: "", state: false });
const typeLine6 = ref({ text: "", state: false });
const typeLine7 = ref({ text: "", state: false });

const typeEffect7 = () => {
  typeLine7.value.text += codeLine7.charAt(typeLine7.value.text.length);
};

const typeEffect6 = () => {
  if (typeLine6.value.text.length < codeLine6.length) {
    typeLine6.value.text += codeLine6.charAt(typeLine6.value.text.length);
    setTimeout(typeEffect6, 60);
  }
  if (
    typeLine6.value.text.length === codeLine6.length &&
    !typeLine7.value.state
  ) {
    setTimeout(typeEffect7, 500);
    typeLine7.value.state = true;
  }
};

const typeEffect5 = () => {
  if (typeLine5.value.text.length < codeLine5.length) {
    typeLine5.value.text += codeLine5.charAt(typeLine5.value.text.length);
    setTimeout(typeEffect5, 60);
  }
  if (
    typeLine5.value.text.length === codeLine5.length &&
    !typeLine6.value.state
  ) {
    setTimeout(typeEffect6, 500);
    typeLine6.value.state = true;
  }
};

const typeEffect4 = () => {
  if (typeLine4.value.text.length < codeLine4.length) {
    typeLine4.value.text += codeLine4.charAt(typeLine4.value.text.length);
    setTimeout(typeEffect4, 60);
  }
  if (
    typeLine4.value.text.length === codeLine4.length &&
    !typeLine5.value.state
  ) {
    setTimeout(typeEffect5, 500);
    typeLine5.value.state = true;
  }
};

const typeEffect3 = () => {
  if (typeLine3.value.text.length < codeLine3.length) {
    typeLine3.value.text += codeLine3.charAt(typeLine3.value.text.length);
    setTimeout(typeEffect3, 60);
  }
  if (
    typeLine3.value.text.length === codeLine3.length &&
    !typeLine4.value.state
  ) {
    setTimeout(typeEffect4, 500);
    typeLine4.value.state = true;
  }
};

const typeEffect2 = () => {
  if (typeLine2.value.text.length < codeLine2.length) {
    typeLine2.value.text += codeLine2.charAt(typeLine2.value.text.length);
    setTimeout(typeEffect2, 60);
  }
  if (
    typeLine2.value.text.length === codeLine2.length &&
    !typeLine3.value.state
  ) {
    setTimeout(typeEffect3, 500);
    typeLine3.value.state = true;
  }
};

const typeEffect1 = () => {
  if (typeLine1.value.length < codeLine1.length) {
    typeLine1.value += codeLine1.charAt(typeLine1.value.length);
    setTimeout(typeEffect1, 60);
  }
  if (typeLine1.value.length === codeLine1.length && !typeLine2.value.state) {
    setTimeout(typeEffect2, 800);
    typeLine2.value.state = true;
  }
};

typeEffect1();
</script>

<template>
  <code class="typingEffect">
    <div v-highlightjs="typeLine1">
      <code class="typingEffect__line1 javascript"></code>
    </div>
    <div v-highlightjs="typeLine2.text">
      <code class="typingEffect__line2 javascript"></code>
    </div>
    <div v-highlightjs="typeLine3.text">
      <code class="typingEffect__line3 javascript"></code>
    </div>
    <div v-highlightjs="typeLine4.text">
      <code class="typingEffect__line4 javascript"></code>
    </div>
    <div v-highlightjs="typeLine5.text">
      <code class="typingEffect__line5 javascript"></code>
    </div>
    <div v-highlightjs="typeLine6.text">
      <code class="typingEffect__line6 javascript"></code>
    </div>
    <div v-highlightjs="typeLine7.text">
      <code class="typingEffect__line7 javascript"></code>
    </div>
  </code>
</template>

<style scoped>
.typingEffect {
  color: white;
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: #202129;
  margin: 20% auto;
  width: 600px;
  height: 400px;
}

.typingEffect__line2,
.typingEffect__line3,
.typingEffect__line4,
.typingEffect__line5,
.typingEffect__line6,
.typingEffect__line7 {
  margin-left: 24px;
}

.typingEffect > div {
  padding: 10px;
}

.typingEffect code {
  padding: 0;
  background-color: inherit;
}

.typingEffect code {
  width: fit-content;
  height: fit-content;
  border-right: 2px solid transparent;
}

.typingEffect__line1 {
  animation: blink 1s 2;
}

.typingEffect__line2 {
  animation: blink 1s 2s 2;
}

.typingEffect__line3 {
  animation: blink 1s 4s 2;
}

.typingEffect__line4 {
  animation: blink 1s 6s 2;
}

.typingEffect__line5 {
  animation: blink 1s 8s 2;
}

.typingEffect__line6 {
  animation: blink 1s 10s 2;
}

.typingEffect__line7 {
  animation: blink 1s 12s 2;
}

@keyframes blink {
  0%,
  45% {
    border-color: transparent;
  }
  50%,
  100% {
    border-color: white;
  }
}

#app {
  color: #353c4e;
  background: #f0f2f4;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  font-family: "Roboto", Arial, sans-serif;
  font-size: 1.2rem;
}

html,
body {
  height: 100%;
  margin: 0;
}
</style>

<template>
  <v-container fluid>
    <!-- Background Overlay -->
    <div class="background-overlay" />
    <div class="content-box">
      <p class="subtitle">
        Transform Your Data into Machine-Understandable Knowledge with Manuscript-AI Ontology
      </p>
      <p class="intro-text">
        Hereunder, we have prepared several options for you to create Linked Open Data (LOD) using Manuscript-AI Ontology, allowing you to explore and determine what works best for your needs. Each option is designed to help you structure your data in a machine-understandable format, making it ready to be seamlessly linked with other collections of data.
      </p>
      <div class="boxes-wrapper">
        <div class="box">
          <h3>Create LOD</h3>
          <p>
            Use this path if you want to structure data using Manuscript-AI Ontology from scratch (or explore the full expressiveness of the ontology) and see your knowledge graph grow.
            <br>

            <strong class="level-title">Level of Automation:</strong>
            <span class="robot-icons"><span class="robot-icon">🤖</span>
            </span>
          </p>
          <v-btn
            color="mainBg"
            class="primary-btn"
            rounded="small"
            @click="goToStructure"
          >
            Start
          </v-btn>
        </div>

        <div class="box">
          <h3>Manuscript Annotation Desk</h3>
          <p>
            Use this path to identify the right information in your data that need to be sent to the agent framework to convert your data into LOD using Manuscript-AI Ontology.
            <br>
            <strong class="level-title">Level of Automation:</strong>
            <span class="robot-icons">
              <span class="robot-icon">🤖</span>
              <span class="robot-icon">🤖</span>
            </span>
          </p>
          <v-btn
            color="mainBg"
            class="primary-btn"
            rounded="small"
            @click="goToConvertLOD"
          >
            Start
          </v-btn>
        </div>

        <!-- Row 2 -->
        <div class="box">
          <h3>Select and Convert</h3>
          <p>
            Use this method if you wish to automate the extraction of key values from specific data segments and convert them into LOD using the Manuscript-AI ontology.
            <br>
            <strong class="level-title">Level of Automation:</strong>
            <span class="robot-icons">
              <span class="robot-icon">🤖</span>
              <span class="robot-icon">🤖</span>
              <span class="robot-icon">🤖</span>
            </span>
          </p>
          <v-btn
            color="mainBg"
            rounded="small"
            class="primary-btn"
            @click="goToStepper"
          >
            Start
          </v-btn>
        </div>

        <div class="box">
          <h3>Drop & Classify</h3>
          <p>
            Use this method if you wish to just drop your data and let agents take care
            of classifying them under the Manuscript-AI ontology.
            <br>
            <strong class="level-title">Level of Automation:</strong>
          </p><div class="robot-icons">
            <span class="robot-icon">🤖</span>
            <span class="robot-icon">🤖</span>
            <span class="robot-icon">🤖</span>
            <span class="robot-icon">🤖</span>
          </div>

          <v-btn
            color="mainBg"
            class="primary-btn"
            rounded="small"
            @click="goToDropClassify"
          >
            Start
          </v-btn>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()


const goToStepper = () => {
  router.push({name: 'stepper'})
}

const goToStructure = () => {
  router.push({name:'structure'})
}

const goToConvertLOD = () => {
  router.push('/convert-lod')
}

const goToDropClassify = () => {
  router.push('/auto-classify')
}


</script>

<style scoped>




.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.1);
  z-index: 1;
}


.content-box {
  position: relative;
  z-index: 2;
  text-align: center;
  width: 90%;

  margin: 40px auto;
  padding: 50px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(12px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  animation: fadeIn 1.5s ease-in-out;
}


.subtitle {
  font-size: 1.3rem;
  color: #1B1E35;
  font-weight: 500;
  margin-bottom: 25px;
}


.intro-text {
  font-size: 1rem;
  margin-bottom: 30px;
  color: #1B1E35;
}


.boxes-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;
}


.box {
  background-color: rgba(255, 255, 255, 0.15);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid grey;
  //box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}


.box h3 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #1B1E35;
}

.box p {
  margin-bottom: 10px;
}


.action-btn {
  font-size: 1rem;
  font-weight: bold;
  padding: 12px 24px;
  border-radius: 50px;
  border: none;
  transition: all 0.3s ease-in-out;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1B1E35, #23263C);
  color: white;
  box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.5);
  margin-top: 10px;
}


.action-btn:hover {
  box-shadow: 0px 8px 20px rgba(255, 255, 255, 0.2);
  transform: scale(1.06);
}

.robot-icons {
  display: flex;
  gap: 5px;
  justify-content: center;

  //margin-bottom: 20px;
  //margin-top: 10px;
}

.robot-icon {
  font-size: 30px;
  text-align: center;
  align-self: baseline;
}

.level-title {
  display: inline-block;
  margin-top: 25px;
  margin-right: 10px;
  //margin-bottom: 10px; /* Ensure consistent spacing */
}


@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

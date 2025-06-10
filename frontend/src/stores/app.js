// Utilities
import { defineStore } from 'pinia'
import {getNextTitle} from "@/tools/index.js";

export const useAppStore = defineStore('app', {
  state: () => ({
    fileContent: {
      content: null,
      extension: null,
      name: null,
    }, // the content of the file, which has been selected by the user
    notificationInfo: {
      color: 'success',
      showNot: false,
      text: '',
      time: -1,
    },
    structuredData: {
      "manuscripts": [],
      "number_of_manuscripts": 0
    },
    selectedManuscript: null, // feedback view
    selCreatedManuscript: [], // inspection view
    rdfOutput: "",
    listOfCreatedManuscripts: [],
  }),
  getters: {
    recentFileContent: (state)=> state.fileContent,
    getNotificationInfo: (state)=> state.notificationInfo,
    getStructuredData: (state)=> state.structuredData,
    getSelectedManuscript: (state)=> state.selectedManuscript,
    getSelCreatedManuscript: (state)=> state.selCreatedManuscript,
    getRdfOutput: (state)=> state.rdfOutput,
    getListOfCreatedManuscripts: (state)=> state.listOfCreatedManuscripts
  },
  actions: {
    setFileContent(content){
      this.fileContent.content = content.content
      this.fileContent.extension = content.extension
      this.fileContent.name = content.name
      console.log("this.fileContent in pinia:", this.fileContent)
    },
    setNotification(content){
      this.notificationInfo.color = content.color
      this.notificationInfo.showNot = content.showNot
      this.notificationInfo.text = content.text
      this.notificationInfo.time = content?.time ? content.time : -1
      console.log('this.notificationInfo in pinia:', this.notificationInfo)
    },
    setStructuredData(content){
      this.structuredData.manuscripts = content.manuscripts
      this.structuredData.number_of_manuscripts = content.number_of_manuscripts
    },
    setSelectedManuscript(content){
      this.selectedManuscript = content
      console.log("selected Manuscriont in vuex:", this.selectedManuscript)
    },
    setSelCreatedManuscript(content){
      this.selCreatedManuscript = content
      console.log("selected created Manuscriont in vuex:", this.selCreatedManuscript)
    },
    setRdfOutput(turtle) {
      this.rdfOutput = turtle;
      console.log("this.rdfOutput in pinia:", this.rdfOutput);
    },
    addManToListOfCreatedManuscripts(manData){
      console.log("updating list of created manuscripts:", manData)
      let id = 0
      if (this.listOfCreatedManuscripts.length === 0){
        id = 1
      }else {
        id = getNextTitle(this.listOfCreatedManuscripts)
      }
      const content = {title: `Manuscript ${id}`, id: id,content: manData.content}
      this.listOfCreatedManuscripts.push(content)
      return content
    },
    removeManFromListOfCreatedManuscripts(index){
        this.listOfCreatedManuscripts.splice(index,1)

    }
  }
})

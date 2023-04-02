import { LangLi } from "@/utils/constants"


export class LangListRes {
  constructor() {
    LangLi.forEach(l => {
      this[l] = ''
    })
  }
}
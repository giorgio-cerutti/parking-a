import { Injectable } from '@angular/core';
import { Directory, Encoding, Filesystem, ReadFileResult } from '@capacitor/filesystem';
// import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor() {
    this.loadData()
  }

  async loadData(){
      const contents = await Filesystem.readFile({
        path: 'secrets/config.json',
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      }).catch((error) => {
        console.log(error);
        this.saveData([])
      });
      console.log('secrets:', contents);
      const data = (contents as ReadFileResult).data
      return JSON.parse(`${data}`)
  };

  async saveData(content: any){
    await Filesystem.writeFile({
      path: 'secrets/config.json',
      data: JSON.stringify(content),
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
    });
  };



  // getAllFlows(){
  //   return this.config.flows.sort((a,b) => a.createdAt - b.createdAt)
  // }

  // findFlowById(id: string){
  //   return this.config.flows.find(flow => flow.id === id)
  // }

  // addFlow(flow: Flow){
  //   this.config.flows.push(flow)
  //   this.saveConfig(this.config)
  // }

  // deleteFlowById(id: string){
  //   this.config.flows = this.config.flows.filter(flow => flow.id !== id)
  //   this.saveConfig(this.config)
  // }
}
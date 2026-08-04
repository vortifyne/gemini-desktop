export namespace database {
	
	export class Chat {
	    ID: number;
	    Title: string;
	    SystemPrompt: string;
	    ModelName: string;
	    Temperature: number;
	    TopP: number;
	    TopK: number;
	    MaxOutputTokens: number;
	    SafetyHateSpeech: string;
	    SafetyHarassment: string;
	    SafetyDangerousContent: string;
	    SafetySexuallyExplicit: string;
	    // Go type: time
	    CreatedAt: any;
	
	    static createFrom(source: any = {}) {
	        return new Chat(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.Title = source["Title"];
	        this.SystemPrompt = source["SystemPrompt"];
	        this.ModelName = source["ModelName"];
	        this.Temperature = source["Temperature"];
	        this.TopP = source["TopP"];
	        this.TopK = source["TopK"];
	        this.MaxOutputTokens = source["MaxOutputTokens"];
	        this.SafetyHateSpeech = source["SafetyHateSpeech"];
	        this.SafetyHarassment = source["SafetyHarassment"];
	        this.SafetyDangerousContent = source["SafetyDangerousContent"];
	        this.SafetySexuallyExplicit = source["SafetySexuallyExplicit"];
	        this.CreatedAt = this.convertValues(source["CreatedAt"], null);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class ChatConfig {
	    Temperature: number;
	    TopP: number;
	    TopK: number;
	    MaxOutputTokens: number;
	    SafetyHateSpeech: string;
	    SafetyHarassment: string;
	    SafetyDangerousContent: string;
	    SafetySexuallyExplicit: string;
	
	    static createFrom(source: any = {}) {
	        return new ChatConfig(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Temperature = source["Temperature"];
	        this.TopP = source["TopP"];
	        this.TopK = source["TopK"];
	        this.MaxOutputTokens = source["MaxOutputTokens"];
	        this.SafetyHateSpeech = source["SafetyHateSpeech"];
	        this.SafetyHarassment = source["SafetyHarassment"];
	        this.SafetyDangerousContent = source["SafetyDangerousContent"];
	        this.SafetySexuallyExplicit = source["SafetySexuallyExplicit"];
	    }
	}
	export class Message {
	    ID: number;
	    ChatID: number;
	    Role: string;
	    Content: string;
	    // Go type: time
	    CreatedAt: any;
	
	    static createFrom(source: any = {}) {
	        return new Message(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.ChatID = source["ChatID"];
	        this.Role = source["Role"];
	        this.Content = source["Content"];
	        this.CreatedAt = this.convertValues(source["CreatedAt"], null);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}


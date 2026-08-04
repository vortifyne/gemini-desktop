export namespace domain {
	
	export class ChatConfig {
	    temperature: number;
	    top_p: number;
	    top_k: number;
	    max_output_tokens: number;
	    safety_hate_speech: string;
	    safety_harassment: string;
	    safety_dangerous_content: string;
	    safety_sexually_explicit: string;
	
	    static createFrom(source: any = {}) {
	        return new ChatConfig(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.temperature = source["temperature"];
	        this.top_p = source["top_p"];
	        this.top_k = source["top_k"];
	        this.max_output_tokens = source["max_output_tokens"];
	        this.safety_hate_speech = source["safety_hate_speech"];
	        this.safety_harassment = source["safety_harassment"];
	        this.safety_dangerous_content = source["safety_dangerous_content"];
	        this.safety_sexually_explicit = source["safety_sexually_explicit"];
	    }
	}
	export class AIParameter {
	    prompt: string;
	    system_prompt: string;
	    model_name: string;
	    cfg: ChatConfig;
	
	    static createFrom(source: any = {}) {
	        return new AIParameter(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.prompt = source["prompt"];
	        this.system_prompt = source["system_prompt"];
	        this.model_name = source["model_name"];
	        this.cfg = this.convertValues(source["cfg"], ChatConfig);
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
	export class Attachment {
	    FileName: string;
	    MimeType: string;
	    Data: number[];
	
	    static createFrom(source: any = {}) {
	        return new Attachment(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.FileName = source["FileName"];
	        this.MimeType = source["MimeType"];
	        this.Data = source["Data"];
	    }
	}
	export class Chat {
	    id: number;
	    title: string;
	    system_prompt: string;
	    model_name: string;
	    temperature: number;
	    top_p: number;
	    top_k: number;
	    max_output_tokens: number;
	    safety_hate_speech: string;
	    safety_harassment: string;
	    safety_dangerous_content: string;
	    safety_sexually_explicit: string;
	    // Go type: time
	    created_at: any;
	
	    static createFrom(source: any = {}) {
	        return new Chat(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.title = source["title"];
	        this.system_prompt = source["system_prompt"];
	        this.model_name = source["model_name"];
	        this.temperature = source["temperature"];
	        this.top_p = source["top_p"];
	        this.top_k = source["top_k"];
	        this.max_output_tokens = source["max_output_tokens"];
	        this.safety_hate_speech = source["safety_hate_speech"];
	        this.safety_harassment = source["safety_harassment"];
	        this.safety_dangerous_content = source["safety_dangerous_content"];
	        this.safety_sexually_explicit = source["safety_sexually_explicit"];
	        this.created_at = this.convertValues(source["created_at"], null);
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


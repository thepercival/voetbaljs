/**
 * Created by coen on 10-10-17.
 */

import { Headers } from '@angular/http';
import { VoetbalConfig } from './config';

export class VoetbalRepository {

    constructor() {

    }

    getApiUrl(): string {
        return VoetbalConfig.apiurl;
    }
    getHeaders(): Headers
    {
        let headers = new Headers({'Content-Type': 'application/json; charset=utf-8'});
        const token = VoetbalConfig.getToken();
        if ( token != null ) {
            headers.append( 'Authorization', 'Bearer ' + token );
        }
        return headers;
    }

}

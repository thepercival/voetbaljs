/**
 * Created by coen on 10-10-17.
 */

import { HttpHeaders } from '@angular/common/http';
import { VoetbalConfig } from './config';

export class VoetbalRepository {

    constructor() {

    }

    getApiUrl(): string {
        return VoetbalConfig.apiurl;
    }
    getHeaders(): HttpHeaders
    {
        let headers = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
        const token = VoetbalConfig.getToken();
        if ( token != null ) {
            headers.append( 'Authorization', 'Bearer ' + token );
        }
        return headers;
    }

}

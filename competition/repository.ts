/**
 * Created by coen on 10-2-17.
 */

import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Competition } from '../competition';
import { VoetbalRepository } from '../repository';

@Injectable()
export class CompetitionRepository extends VoetbalRepository{

    private url : string;
    private http: Http;
    private objects: Competition[];

    constructor( http: Http )
    {
        super();
        this.http = http;
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
    }

    getUrlpostfix(): string
    {
        return 'competitions';
    }

    getObjects(): Observable<Competition[]>
    {
        if ( this.objects != null ){
            return Observable.create(observer => {
                observer.next(this.objects);
                observer.complete();
            });
        }

        return this.http.get(this.url, new RequestOptions({ headers: super.getHeaders() }) )
            .map((res) => {
                let objects = this.jsonArrayToObject(res.json());
                this.objects = objects;
                return this.objects;
            })
            .catch( this.handleError );
    }

    jsonArrayToObject( jsonArray : any ): Competition[]
    {
        let objects: Competition[] = [];
        for (let json of jsonArray) {
            let object = this.jsonToObjectHelper(json);
            objects.push( object );
        }
        return objects;
    }

    getObject( id: number): Observable<Competition>
    {
        let url = this.url + '/'+id;
        return this.http.get(url)
        // ...and calling .json() on the response to return data
            .map((res) => this.jsonToObjectHelper(res.json()))
            //...errors if any
            .catch((error:any) => Observable.throw(error.message || 'Server error' ));
    }

    jsonToObjectHelper( json : any ): Competition
    {
        if ( this.objects != null ){
            let foundObjects = this.objects.filter(
                objectIt => objectIt.getId() == json.id
            );
            if ( foundObjects.length == 1) {
                return foundObjects.shift();
            }
        }

        let competition = new Competition(json.name);
        competition.setId(json.id);
        competition.setAbbreviation(json.abbreviation);
        return competition;
    }

    objectToJsonHelper( object : Competition ): any
    {
        let json = {
            "id":object.getId(),
            "name":object.getName(),
            "abbreviation":object.getAbbreviation()
        };
        return json;
    }

    createObject( jsonObject: any ): Observable<Competition>
    {
        return this.http
            .post(this.url, jsonObject, new RequestOptions({ headers: super.getHeaders() }))
            // ...and calling .json() on the response to return data
            .map((res) => this.jsonToObjectHelper(res.json()))
            //...errors if any
            .catch(this.handleError);
    }

    editObject( object: Competition ): Observable<Competition>
    {
        let url = this.url + '/'+object.getId();

        return this.http
            .put(url, JSON.stringify( object ), { headers: super.getHeaders() })
            // ...and calling .json() on the response to return data
            .map((res) => { console.log(res.json()); return this.jsonToObjectHelper(res.json()); })
            //...errors if any
            .catch(this.handleError);
    }

    removeObject( object: Competition): Observable<void>
    {
        let url = this.url + '/'+object.getId();
        return this.http
            .delete(url, new RequestOptions({ headers: super.getHeaders() }))
            // ...and calling .json() on the response to return data
            .map((res:Response) => res)
            //...errors if any
            .catch(this.handleError);
    }

    // this could also be a private method of the component class
    handleError(res: Response): Observable<any> {
        console.error( res );
        // throw an application level error
        return Observable.throw( res.statusText );
    }
}

/**
 * Created by coen on 10-2-17.
 */

import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Season } from '../season';
import { VoetbalRepository } from '../repository';

@Injectable()
export class SeasonRepository extends VoetbalRepository {

    private url: string;
    private objects: Season[];

    constructor(private http: HttpClient) {
        super();
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'seasons';
    }

    getObjects(): Observable<Season[]> {
        if (this.objects != null) {
            return Observable.create(observer => {
                observer.next(this.objects);
                observer.complete();
            });
        }

        return this.http.get(this.url, { headers: super.getHeaders() })
            .map((res) => {
                let objects = this.jsonArrayToObject(res);
                this.objects = objects;
                return this.objects;
            })
            .catch(this.handleError);
    }

    jsonArrayToObject(jsonArray: any): Season[] {
        let seasons: Season[] = [];
        for (let json of jsonArray) {
            let object = this.jsonToObjectHelper(json);
            seasons.push(object);
        }
        return seasons;
    }

    getObject(id: number): Observable<Season> {
        let url = this.url + '/' + id;
        return this.http.get(url)
            // ...and calling .json() on the response to return data
            .map((res) => this.jsonToObjectHelper(res))
            //...errors if any
            .catch((error: any) => Observable.throw(error.message || 'Server error'));
    }

    jsonToObjectHelper(json: any): Season {
        if (this.objects != null) {
            let foundObjects = this.objects.filter(
                objectIt => objectIt.getId() == json.id
            );
            if (foundObjects.length == 1) {
                return foundObjects.shift();
            }
        }

        let season = new Season(json.name);
        season.setId(json.id);
        // season.setStartdate(new Date(json.startdate.timestamp*1000));
        season.setStartdate(new Date(json.startdate));
        season.setEnddate(new Date(json.enddate));
        return season;
    }

    createObject(jsonObject: any): Observable<Season> {
        return this.http
            .post(this.url, jsonObject, { headers: super.getHeaders() })
            // ...and calling .json() on the response to return data
            .map((res) => this.jsonToObjectHelper(res))
            //...errors if any
            .catch(this.handleError);
    }

    editObject(object: Season): Observable<Season> {
        let url = this.url + '/' + object.getId();
        return this.http
            .put(url, JSON.stringify(this.objectToJsonHelper(object)), { headers: super.getHeaders() })
            // ...and calling .json() on the response to return data
            .map((res) => { return this.jsonToObjectHelper(res); })
            //...errors if any
            .catch(this.handleError);
    }

    removeObject(object: Season): Observable<void> {
        let url = this.url + '/' + object.getId();
        return this.http
            .delete(url, { headers: super.getHeaders() })
            // ...and calling .json() on the response to return data
            .map((res: Response) => res)
            //...errors if any
            .catch(this.handleError);
    }

    objectToJsonHelper(object: Season): any {
        let json = {
            "id": object.getId(),
            "name": object.getName(),
            "startdate": object.getStartdate().toISOString(),
            "enddate": object.getEnddate().toISOString()
        };
        return json;
    }

    // this could also be a private method of the component class
    handleError(res: Response): Observable<any> {
        console.error(res);
        // throw an application level error
        return Observable.throw(res.statusText);
    }
}

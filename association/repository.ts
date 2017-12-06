/**
 * Created by coen on 30-1-17.
 */

import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Association } from '../association';
import { VoetbalRepository } from '../repository';

@Injectable()
export class AssociationRepository extends VoetbalRepository {

    private url: string;
    private objects: Association[];

    constructor(private http: HttpClient) {
        super();
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'associations';
    }

    getObjects(): Observable<Association[]> {
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

    jsonArrayToObject(jsonArray: any): Association[] {
        let objects: Association[] = [];
        for (let json of jsonArray) {
            let object = this.jsonToObjectHelper(json);
            objects.push(object);
        }
        return objects;
    }

    getObject(id: number): Observable<Association> {
        let url = this.url + '/' + id;
        return this.http.get(url)
            // ...and calling .json() on the response to return data
            .map((res) => this.jsonToObjectHelper(res))
            //...errors if any
            .catch((error: any) => Observable.throw(error.message || 'Server error'));
    }

    createObject(jsonObject: any): Observable<Association> {
        return this.http
            .post(this.url, jsonObject, { headers: super.getHeaders() })
            // ...and calling .json() on the response to return data
            .map((res) => this.jsonToObjectHelper(res))
            //...errors if any
            .catch(this.handleError);
    }

    jsonToObjectHelper(json: any): Association {
        if (this.objects != null) {
            let foundObjects = this.objects.filter(
                objectIt => objectIt.getId() == json.id
            );
            if (foundObjects.length == 1) {
                return foundObjects.shift();
            }
        }

        let association = new Association(json.name);
        association.setId(json.id);
        return association;
    }

    objectToJsonHelper(object: Association): any {
        let json = {
            "id": object.getId(),
            "name": object.getName()
        };
        return json;
    }

    editObject(object: Association): Observable<Association> {
        let url = this.url + '/' + object.getId();
        return this.http
            .put(url, JSON.stringify(object), { headers: super.getHeaders() })
            // ...and calling .json() on the response to return data
            .map((res) => this.jsonToObjectHelper(res))
            //...errors if any
            .catch(this.handleError);
    }

    removeObject(object: Association): Observable<void> {
        let url = this.url + '/' + object.getId();
        return this.http
            .delete(url, { headers: super.getHeaders() })
            // ...and calling .json() on the response to return data
            .map((res: Response) => res)
            //...errors if any
            .catch(this.handleError);
    }

    // this could also be a private method of the component class
    handleError(res: Response): Observable<any> {
        console.error(res);
        // throw an application level error
        return Observable.throw(res.statusText);
    }
}

export interface IAssociation {
    id?: number;
    name: string;
}

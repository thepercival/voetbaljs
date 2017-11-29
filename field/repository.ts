import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Observer } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Field } from '../field';
import { Competitionseason } from '../competitionseason';
import { VoetbalRepository } from '../repository';

@Injectable()
export class FieldRepository extends VoetbalRepository {

    private url: string;
    // private cache: Field[] = [];

    constructor(
        private http: HttpClient) {
        super();
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'fields';
    }

    // getObject(id: number): Field {
    //     return this.cache.find(fieldIt => id === fieldIt.getId());
    // }

    createObject(jsonField: IField, competitionseason: Competitionseason): Observable<Field> {

        const options = {
            headers: super.getHeaders(),
            params: new HttpParams().set('competitionseasonid', competitionseason.getId())
        };

        console.log('field posted', jsonField);

        return this.http
            .post(this.url, jsonField, options)
            .map((res: IField) => {
                const fieldRes = this.jsonToObjectHelper(res, competitionseason);
                // this.cache.push(fieldRes);
                return fieldRes;
            })
            .catch(this.handleError);
    }

    editObject(field: Field, competitionseason: Competitionseason): Observable<Field> {

        const options = {
            headers: super.getHeaders(),
            params: new HttpParams().set('competitionseasonid', competitionseason.getId())
        };

        return this.http
            .put(this.url + '/' + field.getId(), this.objectToJsonHelper(field), options)
            .map((res: IField) => {
                return this.jsonToObjectHelper(res, competitionseason, field);
            })
            .catch(this.handleError);
    }

    removeObject(field: Field): Observable<void> {
        const url = this.url + '/' + field.getId();
        return this.http
            .delete(url, { headers: super.getHeaders() })
            .map((res) => {
                // const index = this.cache.indexOf(field);
                // if (index > -1) {
                //     this.cache.splice(index, 1);
                // }
            })
            .catch(this.handleError);
    }

    // this could also be a private method of the component class
    handleError(res: Response): Observable<any> {
        console.error(res);
        // throw an application level error
        return Observable.throw(res.statusText);
    }

    jsonArrayToObject(jsonArray: IField[], competitionseason: Competitionseason): Field[] {
        const objects: Field[] = [];
        for (const json of jsonArray) {
            const object = this.jsonToObjectHelper(json, competitionseason);
            objects.push(object);
        }
        return objects;
    }

    jsonToObjectHelper(json: IField, competitionseason: Competitionseason, field: Field = null): Field {
        if (field == null) {
            field = new Field(competitionseason, json.number);
        }
        field.setId(json.id);
        field.setName(json.name);
        // this.cache.push(field);
        return field;
    }

    objectsToJsonArray(objects: any[]): any[] {
        const jsonArray: any[] = [];
        for (const object of objects) {
            const json = this.objectToJsonHelper(object);
            jsonArray.push(json);
        }
        return jsonArray;
    }

    objectToJsonHelper(object: Field): IField {
        const json: IField = {
            'id': object.getId(),
            'number': object.getNumber(),
            'name': object.getName()
        };
        return json;
    }
}

export interface IField {
    id?: number;
    number: number;
    name: string;
}

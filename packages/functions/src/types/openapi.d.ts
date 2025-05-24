/* eslint-disable */
/**
 * DO NOT MODIFY - GENERATED TYPES FROM OPENAPI
 **/
import type {
  OpenAPIClient,
  Parameters,
  UnknownParamsObject,
  OperationResponse,
  AxiosRequestConfig,
} from 'openapi-client-axios'; 

declare namespace Paths {
    namespace GetPetById {
        namespace Responses {
            export interface $200 {
            }
        }
    }
    namespace GetPets {
        namespace Responses {
            export interface $200 {
            }
        }
    }
    namespace Pets$Id {
        namespace Parameters {
            export type Id = number;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
    }
}

export interface OperationMethods {
  /**
   * getPets
   */
  'getPets'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetPets.Responses.$200>
  /**
   * getPetById
   */
  'getPetById'(
    parameters: Parameters<Paths.Pets$Id.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetPetById.Responses.$200>
}

export interface PathsDictionary {
  ['/pets']: {
    /**
     * getPets
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetPets.Responses.$200>
  }
  ['/pets/{id}']: {
    /**
     * getPetById
     */
    'get'(
      parameters: Parameters<Paths.Pets$Id.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetPetById.Responses.$200>
  }
}

export type Client = OpenAPIClient<OperationMethods, PathsDictionary>

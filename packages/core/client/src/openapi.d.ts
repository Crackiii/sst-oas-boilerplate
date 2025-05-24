/* eslint-disable */
import type {
  OpenAPIClient,
  Parameters,
  UnknownParamsObject,
  OperationResponse,
  AxiosRequestConfig,
} from 'openapi-client-axios'; 

declare namespace Components {
    namespace Schemas {
        export interface Pet {
            id: number; // int64
            name: string;
            tag?: string;
        }
    }
}
declare namespace Paths {
    namespace GetPetById {
        namespace Responses {
            export interface $200 {
            }
        }
    }
    namespace GetPets {
        namespace Responses {
            export type $200 = Components.Schemas.Pet[];
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

import { UUID, ISODateString } from './shared';

//Address entity in Charon
export interface Address {
  //An address with comprehensive international validation
  id: UUID; //Unique identifier for the address
  addressableId: UUID; //ID of the addressable entity
  addressableType: 'account' | 'organization'; //Type of the addressable entity (consider expanding for organization, provider, fund, etc.)
  street: string; //Street address- max length 200 chars
  locality: string; //City or locality- max length 100 chars
  region: string; //State, province, or region- max length 100 chars
  postalCode: string; //Postal or ZIP code- max length 20 chars
  country:
    | 'US'
    | 'CA'
    | 'GB'
    | 'DE'
    | 'FR'
    | 'IT'
    | 'ES'
    | 'AU'
    | 'JP'
    | 'CN'
    | 'IN'
    | 'BR'
    | 'MX'
    | 'AR'
    | 'RU'
    | 'KR'
    | 'TH'
    | 'SG'
    | 'HK'
    | 'TW'
    | 'AT'
    | 'BE'
    | 'CH'
    | 'CZ'
    | 'DK'
    | 'FI'
    | 'GR'
    | 'HU'
    | 'IE'
    | 'NL'
    | 'NO'
    | 'PL'
    | 'PT'
    | 'SE'
    | 'SK'
    | 'SI'
    | 'BG'
    | 'HR'
    | 'CY'
    | 'EE'
    | 'LV'
    | 'LT'
    | 'LU'
    | 'MT'
    | 'RO'
    | 'TR'
    | 'IL'
    | 'AE'
    | 'SA'
    | 'ZA'; //Country code (ISO 3166-1 alpha-2)- max length 2 chars
  createdAt: ISODateString; //Timestamp when the address was created
  updatedAt: ISODateString; //Timestamp when the address was last updated
}
